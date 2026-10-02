/**
 * Serves out/ the way Netlify does, so the audits test what ships.
 *
 *   npm run build && node scripts/audit/preview-server.mjs
 *
 * What it reproduces, and why each matters:
 *
 *   _headers         Every policy, applied per route. Without this an audit
 *                    passes against a page that has no CSP at all.
 *   pretty URLs      /playbook/ -> out/playbook/index.html
 *   404.html         The real not-found page, with the real status.
 *   functions        Stubs for the Netlify Functions the pages call, so a
 *                    click reaches something answerable.
 *
 * _headers is re-read whenever it changes. A cached copy silently serves the
 * previous build's script hashes, which blocks every inline script and looks
 * exactly like a site-wide hydration bug — it cost an hour once.
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(import.meta.dirname, "..", "..", "out");
const PORT = Number(process.env.PREVIEW_PORT || 3211);

let rules = [];
let headersMtime = 0;

function loadHeaders() {
  const file = path.join(ROOT, "_headers");
  if (!fs.existsSync(file)) return;
  const mtime = fs.statSync(file).mtimeMs;
  if (mtime === headersMtime) return;
  headersMtime = mtime;
  rules = [];
  let current = null;
  for (const raw of fs.readFileSync(file, "utf8").split(String.fromCharCode(10))) {
    const line = raw.replace(String.fromCharCode(13), "");
    if (!line.trim() || line.trim().startsWith("#")) continue;
    if (!/^\s/.test(line)) {
      current = { pattern: line.trim(), headers: [] };
      rules.push(current);
      continue;
    }
    const i = line.indexOf(":");
    current?.headers.push([line.slice(0, i).trim(), line.slice(i + 1).trim()]);
  }
}

const match = (pattern, url) =>
  pattern.endsWith("*") ? url.startsWith(pattern.slice(0, -1)) : pattern === url;

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript",
  ".css": "text/css",
  ".txt": "text/plain",
  ".woff2": "font/woff2",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".xml": "application/xml",
  ".svg": "image/svg+xml",
  ".json": "application/json",
  ".webmanifest": "application/manifest+json",
};

/** Reads .env so the order stub can create real test-mode orders. */
function env() {
  try {
    return Object.fromEntries(
      fs
        .readFileSync(path.join(ROOT, "..", ".env"), "utf8")
        .split(String.fromCharCode(10))
        .map((l) => l.trim())
        .filter((l) => l.includes("=") && !l.startsWith("#"))
        .map((l) => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()]),
    );
  } catch {
    return {};
  }
}

function functions(name, res) {
  const vars = env();
  res.setHeader("Content-Type", "application/json");

  if (name === "create-order") {
    const id = vars.RAZORPAY_KEY_ID;
    const secret = vars.RAZORPAY_KEY_SECRET;
    if (!id || !secret) {
      res.writeHead(200);
      res.end(JSON.stringify({ orderId: "order_PREVIEWSTUB01", amount: 129900, currency: "INR", keyId: "rzp_test_preview" }));
      return;
    }
    // A real test-mode order, so the checkout the browser opens is the one
    // production would open.
    fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + Buffer.from(`${id}:${secret}`).toString("base64"),
      },
      body: JSON.stringify({ amount: 129900, currency: "INR", receipt: "preview-" + Date.now() }),
    })
      .then((r) => r.json())
      .then((order) => {
        res.writeHead(order.id ? 200 : 502);
        res.end(
          JSON.stringify(
            order.id
              ? { orderId: order.id, amount: order.amount, currency: order.currency, keyId: id }
              : { error: "order", detail: order },
          ),
        );
      })
      .catch((e) => {
        res.writeHead(502);
        res.end(JSON.stringify({ error: String(e) }));
      });
    return;
  }

  if (name.startsWith("whatsapp")) {
    res.writeHead(302, { Location: "https://wa.me/000000000000?text=preview" });
    res.end();
    return;
  }

  if (name === "order-status") {
    // Never "paid": the thank-you page must be seen doing the thing it does
    // when it cannot confirm, which is the case that matters.
    res.writeHead(200);
    res.end(JSON.stringify({ paid: false }));
    return;
  }

  if (name === "admin-orders") {
    // Sample rows so the dashboard layout can be looked at without a Supabase
    // project. The real function verifies a token and an email allowlist first.
    const now = Date.now();
    const ago = (h) => new Date(now - h * 3600000).toISOString();
    const rows = [
      ["order_TgohCJyGxOx2bv", "pay_TgohDq1xRk", "paid", "arjun.m@example.com", "sent", 3, 2],
      ["order_ThRRy16pdqvzno", "pay_ThRS0kLmNp", "paid", "meera@example.com", "sent", 1, 9],
      ["order_TiciJTrEDZFObL", "pay_TiciKpQrSt", "paid", "kunal.r@example.com", "failed", 0, 14],
      ["order_Tjd1AbCdEfGh2k", "pay_Tjd1BcDeFg", "paid", "priya.s@example.com", "sent", 2, 27],
      ["order_Tke2MnOpQrSt3l", null, "created", null, "pending", 0, 31],
      ["order_Tlf3UvWxYzAb4m", "pay_Tlf3VwXyZa", "paid", "rohit@example.com", "sent", 1, 48],
    ].map(([order_id, payment_id, status, email, email_status, download_count, h]) => ({
      order_id,
      payment_id,
      status,
      amount_paise: 129900,
      currency: "INR",
      email,
      contact: null,
      email_status,
      email_error: email_status === "failed" ? "Recipient mailbox unavailable" : null,
      email_sent_at: email_status === "sent" ? ago(h) : null,
      download_count,
      last_download_at: download_count ? ago(h - 1) : null,
      refunded_at: null,
      created_at: ago(h + 1),
      paid_at: status === "paid" ? ago(h) : null,
    }));
    const paid = rows.filter((r) => r.status === "paid");
    res.writeHead(200);
    res.end(
      JSON.stringify({
        rows,
        summary: {
          paid_count: paid.length,
          refunded_count: 0,
          gross_paise: paid.length * 129900,
          net_paise: paid.length * 129900,
          undelivered_count: paid.filter((r) => r.email_status !== "sent").length,
          last_paid_at: paid[0].paid_at,
        },
        viewer: "preview@example.com",
      }),
    );
    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: "not found" }));
}

if (!fs.existsSync(ROOT)) {
  throw new Error("preview-server: no out/ — run `npm run build` first.");
}
loadHeaders();

http
  .createServer((req, res) => {
    loadHeaders();
    const url = decodeURIComponent(req.url.split("?")[0]);

    if (url.startsWith("/.netlify/functions/")) {
      functions(url.replace("/.netlify/functions/", ""), res);
      return;
    }

    let file = path.join(ROOT, url);
    let status = 200;
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
    if (!fs.existsSync(file) && fs.existsSync(file + ".html")) file += ".html";
    if (!fs.existsSync(file)) {
      file = path.join(ROOT, "404.html");
      status = 404;
    }

    for (const rule of rules) {
      if (match(rule.pattern, url)) for (const [k, v] of rule.headers) res.setHeader(k, v);
    }
    res.setHeader("Content-Type", TYPES[path.extname(file)] || "application/octet-stream");
    res.writeHead(status);
    fs.createReadStream(file).pipe(res);
  })
  .listen(PORT, () => console.log(`preview: http://127.0.0.1:${PORT} serving out/`));
