/**
 * What the browser reports about the shipped pages.
 *
 *   npm run build && node scripts/audit/preview-server.mjs
 *   node scripts/audit/page-security.mjs
 *
 * headers-and-secrets.mjs reads the policy. This one runs it:
 *
 *   CSP violations     a policy only works if the page it governs obeys it.
 *                      A hash that drifted from its script blocks every inline
 *                      bootstrap and kills hydration site-wide — which looks
 *                      like a React bug, not a header bug.
 *   inline handlers    an onclick= attribute is the shape injected markup
 *                      takes; there should be none anywhere.
 *   reflected input    the thank-you page reads order_id from the URL, which
 *                      makes it the one page a stranger can put text into.
 */
import fs from "node:fs";
import path from "node:path";
import { launch, goto, evaluate, setViewport } from "./cdp.mjs";
import { setTimeout as sleep } from "node:timers/promises";

const BASE = process.env.PREVIEW_URL || "http://127.0.0.1:3211";
const OUT = path.join(import.meta.dirname, "..", "..", "out");

function pages(dir = OUT, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) pages(full, acc);
    else if (entry.name === "index.html") {
      const rel = "/" + path.relative(OUT, full).split(path.sep).join("/").replace(/index\.html$/, "");
      if (!/^\/(404|_not-found)\//.test(rel)) acc.push(rel);
    }
  }
  return acc;
}

const problems = [];
const c = await launch();
await c.send("Page.enable");
await c.send("Page.addScriptToEvaluateOnNewDocument", {
  source:
    "window.__v=[];document.addEventListener('securitypolicyviolation'," +
    "e=>window.__v.push(e.violatedDirective+' '+(e.blockedURI||'inline')));" +
    "window.__alerts=0;window.alert=()=>{window.__alerts++};",
});
await setViewport(c, 1440, 900, true);

/* ── Every page: policy obeyed, no inline handlers ──────────────────────── */

const list = pages();
for (const page of list) {
  await goto(c, BASE + page);
  await sleep(400);
  const violations = await evaluate(c, "JSON.stringify(window.__v || [])");
  const parsed = JSON.parse(violations);
  if (parsed.length) problems.push(`${page} CSP VIOLATION: ${[...new Set(parsed)].join(" | ")}`);

  const inline = await evaluate(
    c,
    `(document.documentElement.outerHTML.match(/\\son(click|error|load|mouseover|focus)=/gi) || []).length`,
  );
  if (inline) problems.push(`${page} has ${inline} inline event handler attribute(s)`);
}

/* ── The one page that reflects a stranger's input ──────────────────────── */

const S = String.fromCharCode(60);
const payloads = [
  S + "img src=x onerror=alert(1)>",
  S + "script>alert(1)" + S + "/script>",
  "javascript:alert(1)",
  "order_" + "A".repeat(200),
  "../../../etc/passwd",
  "%3Cimg%20src%3Dx%20onerror%3Dalert(1)%3E",
  "' OR 1=1--",
];
for (const payload of payloads) {
  await goto(c, `${BASE}/playbook/thank-you/?order_id=${encodeURIComponent(payload)}`);
  await sleep(1200);
  const r = JSON.parse(
    await evaluate(
      c,
      `JSON.stringify({
        alerts: window.__alerts || 0,
        injected: document.querySelectorAll('img[src="x"], [onerror], [onload], [onclick]').length,
        jsHrefs: [...document.querySelectorAll('a')].filter(a => (a.getAttribute('href')||'').startsWith('javascript')).length,
        alertScripts: [...document.querySelectorAll('script')].filter(s => (s.textContent||'').includes('alert(1)')).length,
      })`,
    ),
  );
  if (r.alerts || r.injected || r.jsHrefs || r.alertScripts) {
    problems.push(`thank-you executed or rendered ${JSON.stringify(payload).slice(0, 36)}: ${JSON.stringify(r)}`);
  }
}

console.log(`${list.length} pages checked for CSP and inline handlers, ${payloads.length} reflected payloads`);
console.log("PROBLEMS:", problems.length ? "\n" + [...new Set(problems)].slice(0, 20).join("\n") : "none");
c.close();
process.exit(problems.length ? 1 : 0);
