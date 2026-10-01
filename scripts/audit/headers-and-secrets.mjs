/**
 * Whole-site header and secret audit, run against a built `out/`.
 *
 * Two questions: does every route carry the policy it should, and did anything
 * that must stay private end up in the deploy?
 *
 *   node scripts/audit/headers-and-secrets.mjs
 */
import fs from "node:fs";
import path from "node:path";

const OUT = "E:/toadlabs/out";
const raw = fs.readFileSync(path.join(OUT, "_headers"), "utf8");
const problems = [];

const REQUIRED_GLOBAL = [
  "Strict-Transport-Security",
  "X-Content-Type-Options",
  "X-Frame-Options",
  "Referrer-Policy",
  "Permissions-Policy",
  "Cross-Origin-Opener-Policy",
  "Cross-Origin-Resource-Policy",
  "Origin-Agent-Cluster",
];
for (const h of REQUIRED_GLOBAL) {
  if (!raw.includes(h + ":")) problems.push("missing global header " + h);
}

/* ── Per-route policies ─────────────────────────────────────────────────── */

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

  // Razorpay is allowed on the payment routes and must not leak past them.
  const isPay = /^\/playbook/.test(route);
  if (isPay) payRoutes++;
  if (!isPay && /razorpay/.test(csp)) problems.push(route + " allows Razorpay outside the payment pages");
  if (isPay && !/razorpay/.test(csp)) problems.push(route + " is a payment route with no Razorpay allowance");
}
console.log("payment routes:", payRoutes);

/* ── Nothing sensitive in the deployed output ───────────────────────────── */

/**
 * Shapes that must never reach the build.
 *
 * The literal values are read from .env at run time rather than written here.
 * An earlier version of this file hardcoded a fragment of the live secret and
 * the phone number as detection patterns — which would have committed, to a
 * public repo, exactly what the check exists to keep out of it.
 */
const SHAPES = [
  { label: "a Razorpay key id", re: /rzp_(test|live)_[A-Za-z0-9]{8,}/ },
  { label: "the name of a secret variable", re: /RAZORPAY_KEY_SECRET|DOWNLOAD_TOKEN_SECRET/ },
  // Phone shapes, not bare digit runs. A loose ten-digit pattern matched an
  // opacity of 0.33999999999999997 and an SVG dash array — a check that cries
  // wolf on a float gets ignored, which is worse than not having it.
  { label: "a phone number in a tel: link", re: /tel:\+?\d/ },
  { label: "a WhatsApp link with a number", re: /wa\.me\/\d/ },
  { label: "an Indian mobile in +91 form", re: /\+91[-\s]?\d{5}[-\s]?\d{5}/ },
];

// Exact values, compared with includes() rather than a RegExp: building a
// pattern out of an arbitrary secret only invites an escaping bug.
const LITERALS = [];
try {
  const env = fs.readFileSync(path.join(OUT, "..", ".env"), "utf8");
  for (const line of env.split(String.fromCharCode(10))) {
    const i = line.indexOf("=");
    if (i < 1 || line.trim().startsWith("#")) continue;
    const value = line.slice(i + 1).trim();
    if (value.length >= 12) {
      LITERALS.push({ label: "the value of " + line.slice(0, i).trim(), value });
    }
  }
  console.log("cross-checking", LITERALS.length, "live values from .env");
} catch {
  console.log("note: no .env to cross-check live values against");
}

const walk = (d) =>
  fs
    .readdirSync(d, { withFileTypes: true })
    .flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));

for (const f of walk(OUT)) {
  if (!/\.(html|js|txt|json|xml|css)$/.test(f)) continue;
  const body = fs.readFileSync(f, "utf8");
  const where = path.relative(OUT, f);
  // Never print the match itself — that would put it straight into a CI log.
  for (const { label, re } of SHAPES) {
    if (re.test(body)) problems.push(`found ${label} in ${where}`);
  }
  for (const { label, value } of LITERALS) {
    if (body.includes(value)) problems.push(`found ${label} in ${where}`);
  }
}

console.log(
  "\nPROBLEMS:",
  problems.length ? "\n" + [...new Set(problems)].slice(0, 25).join("\n") : "none",
);
process.exit(problems.length ? 1 : 0);
