// Whole-site header + policy audit: every page's CSP and security headers.
import fs from "node:fs";
import path from "node:path";
const OUT = "E:/toadlabs/out";
const raw = fs.readFileSync(path.join(OUT, "_headers"), "utf8");
const problems = [];

const REQUIRED_GLOBAL = [
  "Strict-Transport-Security", "X-Content-Type-Options", "X-Frame-Options",
  "Referrer-Policy", "Permissions-Policy", "Cross-Origin-Opener-Policy",
  "Cross-Origin-Resource-Policy", "Origin-Agent-Cluster",
];
for (const h of REQUIRED_GLOBAL) if (!raw.includes(h + ":")) problems.push("missing global header " + h);

// Parse per-route policies.
const blocks = raw.split(/\n(?=\/)/).filter((b) => b.includes("Content-Security-Policy:"));
console.log("routes with a CSP:", blocks.length);

let payRoutes = 0;
for (const b of blocks) {
  const route = b.split("\n")[0].trim();
  const csp = (b.match(/Content-Security-Policy: (.*)/) || [])[1] || "";
  const script = (csp.match(/script-src ([^;]*)/) || [])[1] || "";
  if (script.includes("'unsafe-inline'")) problems.push(route + " script-src allows unsafe-inline");
  if (script.includes("'unsafe-eval'")) problems.push(route + " script-src allows unsafe-eval");
  if (/script-src[^;]*\s\*/.test(csp)) problems.push(route + " script-src has a wildcard");
  if (!/object-src 'none'/.test(csp)) problems.push(route + " missing object-src 'none'");
  if (!/base-uri 'none'/.test(csp)) problems.push(route + " missing base-uri 'none'");
  if (!/frame-ancestors 'none'/.test(csp)) problems.push(route + " missing frame-ancestors 'none'");
  if (/wa\.me|whatsapp/.test(csp)) problems.push(route + " still allows WhatsApp in form-action");
  const isPay = /^\/playbook/.test(route);
  if (isPay) payRoutes++;
  if (!isPay && /razorpay/.test(csp)) problems.push(route + " allows Razorpay outside the payment pages");
  if (isPay && !/razorpay/.test(csp)) problems.push(route + " is a payment route with no Razorpay allowance");
}
console.log("payment routes:", payRoutes);

// Nothing sensitive should be in the deployed output.
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) =>
  e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
const SECRETS = [/rzp_test_[A-Za-z0-9]+/, /rzp_live_[A-Za-z0-9]+/, /RAZORPAY_KEY_SECRET/, /REDACTED/, /zoheRN|vAQ1fuFt/];
for (const f of walk(OUT)) {
  if (!/\.(html|js|txt|json|xml|css)$/.test(f)) continue;
  const body = fs.readFileSync(f, "utf8");
  for (const re of SECRETS) {
    const m = body.match(re);
    if (m) problems.push("SECRET/PII in build: " + path.relative(OUT, f) + " -> " + m[0].slice(0, 24));
  }
}

console.log("\nPROBLEMS:", problems.length ? "\n" + [...new Set(problems)].slice(0, 25).join("\n") : "none");
