/**
 * Minimal Chrome DevTools Protocol driver.
 *
 * Enough to drive the audits and nothing more: no Puppeteer, no Playwright, no
 * browser download. It talks to a headless Chrome already on the machine over
 * the WebSocket built into Node.
 *
 * Set CHROME_PATH if Chrome lives somewhere other than the default.
 */
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";

const CHROME =
  process.env.CHROME_PATH || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = Number(process.env.CDP_PORT || 9333);

export async function launch({ isolate = true } = {}) {
  const args = [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    `--remote-debugging-port=${PORT}`,
    "--remote-allow-origins=*",
    "--no-first-run",
    "--user-data-dir=" + (process.env.TEMP || "/tmp") + "/cdp-profile-" + Date.now(),
    "about:blank",
  ];
  // Cross-origin iframes (the payment widget) run out of process, and CDP
  // input events never reach them. Tests that drive one need isolation off.
  if (!isolate) {
    args.splice(1, 0, "--disable-site-isolation-trials", "--disable-features=IsolateOrigins,site-per-process");
  }

  const proc = spawn(CHROME, args, { stdio: "ignore" });

  let target = null;
  for (let i = 0; i < 80; i += 1) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/list`);
      target = (await res.json()).find((t) => t.type === "page");
      if (target) break;
    } catch {
      /* not up yet */
    }
    await sleep(250);
  }
  if (!target) throw new Error("Chrome did not expose a debugging target. Is CHROME_PATH right?");

  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = reject;
  });

  let id = 0;
  const pending = new Map();
  const events = new Map();

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) reject(new Error(JSON.stringify(msg.error)));
      else resolve(msg.result);
    } else if (msg.method) {
      (events.get(msg.method) || []).forEach((h) => h(msg.params));
    }
  };

  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const msgId = (id += 1);
      pending.set(msgId, { resolve, reject });
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });

  return {
    send,
    on: (method, handler) => events.set(method, [...(events.get(method) || []), handler]),
    off: (method, handler) =>
      events.set(method, (events.get(method) || []).filter((h) => h !== handler)),
    close: () => {
      try {
        ws.close();
      } catch {
        /* already gone */
      }
      proc.kill();
    },
  };
}

export async function goto(client, url) {
  const done = new Promise((resolve) => {
    const handler = () => resolve();
    client.on("Page.loadEventFired", handler);
  });
  await client.send("Page.enable");
  await client.send("Page.navigate", { url });
  await Promise.race([done, sleep(15000)]);
}

/** Evaluates in the page and returns the value, awaiting a promise if given one. */
export async function evaluate(client, expression) {
  const { result, exceptionDetails } = await client.send("Runtime.evaluate", {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  if (exceptionDetails) {
    throw new Error(exceptionDetails.exception?.description || exceptionDetails.text);
  }
  return result.value;
}

export async function setViewport(client, width, height, mobile = false) {
  await client.send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 1,
    mobile,
    screenWidth: width,
    screenHeight: height,
  });
  // Audits assert on layout and contrast, not on animation, and a reveal
  // mid-flight reports the wrong opacity.
  await client.send("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-motion", value: mobile ? "reduce" : "no-preference" }],
  });
}

export async function screenshot(client, path, fullPage = true) {
  const { data } = await client.send("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: fullPage,
  });
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, Buffer.from(data, "base64"));
}
