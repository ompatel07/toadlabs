import { launch, goto, evaluate, setViewport } from "./cdp.mjs";
import { setTimeout as sleep } from "node:timers/promises";

const PAGES = ["/", "/playbook/", "/playbook/terms/", "/contact/"];
const c = await launch();
const problems = [];

// Budgets for a sales page opened from a Reel on Indian mobile data.
// Over the wire, as Netlify serves it.
const BUDGET = { html: 40, js: 220, img: 1200, total: 1500, requests: 60, lcp: 2500, cls: 0.1 };

for (const page of PAGES) {
  const seen = new Map();
  const onResp = (p) => seen.set(p.requestId, { url: p.response.url, type: p.type, status: p.response.status });
  const onDone = (p) => { const r = seen.get(p.requestId); if (r) r.bytes = p.encodedDataLength; };
  c.on("Network.responseReceived", onResp);
  c.on("Network.loadingFinished", onDone);
  await c.send("Network.enable");
  await c.send("Network.clearBrowserCache");

  // Throttled to something like a mid-range phone on 4G.
  await c.send("Network.emulateNetworkConditions", {
    offline: false, latency: 150, downloadThroughput: (4 * 1024 * 1024) / 8, uploadThroughput: (1024 * 1024) / 8,
  });
  await c.send("Emulation.setCPUThrottlingRate", { rate: 4 });

  await c.send("Page.enable");
  await c.send("Page.addScriptToEvaluateOnNewDocument", {
    source: `
      window.__lcp = 0; window.__cls = 0;
      try {
        new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__lcp = Math.round(e.startTime); })
          .observe({ type: 'largest-contentful-paint', buffered: true });
        new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; })
          .observe({ type: 'layout-shift', buffered: true });
      } catch {}
    `,
  });
  await setViewport(c, 390, 844, true);
  await goto(c, "http://127.0.0.1:3211" + page);
  await sleep(4500);

  const vitals = JSON.parse(await evaluate(c, `(() => {
    const nav = performance.getEntriesByType('navigation')[0] || {};

    const fcp = performance.getEntriesByName('first-contentful-paint')[0];

    return JSON.stringify({
      ttfb: Math.round(nav.responseStart || 0),
      fcp: Math.round(fcp ? fcp.startTime : 0),
      lcp: window.__lcp || 0,
      domInteractive: Math.round(nav.domInteractive || 0),
      cls: Number((window.__cls || 0).toFixed(4)),
      imgs: document.querySelectorAll('img').length,
      lazyImgs: document.querySelectorAll('img[loading=lazy]').length,
      noDims: [...document.querySelectorAll('img')].filter(i => !i.getAttribute('width') || !i.getAttribute('height')).length,
    });
  })()`));

  const rows = [...seen.values()];
  // The preview server sends no compression, so encodedDataLength here is raw
  // bytes. Netlify serves brotli. Measuring raw against a wire budget reports
  // a problem that does not exist in production, so text assets are compressed
  // locally to get the number a buyer would actually download.
  const zlib = await import("node:zlib");
  const fsp = await import("node:fs/promises");
  const COMPRESSIBLE = new Set(["Document", "Script", "Stylesheet"]);
  for (const r of rows) {
    if (!COMPRESSIBLE.has(r.type)) continue;
    try {
      const rel = new URL(r.url).pathname;
      const file = "E:/toadlabs/out" + (rel.endsWith("/") ? rel + "index.html" : rel);
      r.bytes = zlib.brotliCompressSync(await fsp.readFile(file)).length;
    } catch {
      /* served from a stub or not on disk: keep the measured size */
    }
  }
  const kb = (t) => Math.round(rows.filter((r) => t.includes(r.type)).reduce((a, r) => a + (r.bytes || 0), 0) / 1024);
  const size = { html: kb(["Document"]), js: kb(["Script"]), css: kb(["Stylesheet"]), img: kb(["Image"]), font: kb(["Font"]) };
  const total = Math.round(rows.reduce((a, r) => a + (r.bytes || 0), 0) / 1024);

  console.log(`\n${page}`);
  console.log(`  requests ${rows.length}  total ${total}KB  (html ${size.html} · js ${size.js} · css ${size.css} · img ${size.img} · font ${size.font})`);
  console.log(`  ttfb ${vitals.ttfb}ms  fcp ${vitals.fcp}ms  lcp ${vitals.lcp}ms  cls ${vitals.cls}`);
  console.log(`  images ${vitals.imgs} (lazy ${vitals.lazyImgs}, missing dimensions ${vitals.noDims})`);

  if (size.js > BUDGET.js) problems.push(`${page} JS ${size.js}KB over ${BUDGET.js}KB`);
  if (total > BUDGET.total) problems.push(`${page} total ${total}KB over ${BUDGET.total}KB`);
  if (rows.length > BUDGET.requests) problems.push(`${page} ${rows.length} requests over ${BUDGET.requests}`);
  if (vitals.lcp > BUDGET.lcp) problems.push(`${page} LCP ${vitals.lcp}ms over ${BUDGET.lcp}ms`);
  if (vitals.cls > BUDGET.cls) problems.push(`${page} CLS ${vitals.cls} over ${BUDGET.cls}`);
  if (vitals.noDims > 0) problems.push(`${page} has ${vitals.noDims} image(s) with no width/height`);
  const failed = rows.filter((r) => r.status >= 400);
  if (failed.length) problems.push(`${page} ${failed.length} failed request(s): ${failed.slice(0,2).map(f=>f.status+' '+f.url.slice(-40)).join(', ')}`);

  c.off?.("Network.responseReceived", onResp);
  c.off?.("Network.loadingFinished", onDone);
}

await c.send("Emulation.setCPUThrottlingRate", { rate: 1 });
console.log("\nPROBLEMS:", problems.length ? "\n" + problems.join("\n") : "none");
c.close(); process.exit(0);
