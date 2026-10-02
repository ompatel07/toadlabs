/**
 * Writes out/_headers: the site's HTTP security headers, including a strict,
 * hash-based Content-Security-Policy.
 *
 * Runs automatically after `npm run build` (the `postbuild` script), so the
 * policy is always computed from the HTML that is actually being deployed.
 *
 * WHY HASHES
 * Next.js bootstraps every page with inline <script> tags. The usual way to
 * allow them is a per-request nonce, which needs a server; this site is a
 * static export with no server. The alternative, `'unsafe-inline'`, allows ANY
 * inline script — including one an attacker managed to inject — and makes the
 * CSP close to decorative. So instead every inline script in the build is
 * hashed and only those exact scripts may run. Anything else inline is blocked.
 *
 * `'unsafe-inline'` IS kept for styles: React renders `style` attributes for
 * animation delays and positions, and CSS injection is a far smaller risk than
 * script injection.
 *
 * WIRING UP THE CONTACT FORM
 * If submitContact() posts to another origin (Formspree, Resend, ...), add that
 * origin to CONNECT_SRC below or the browser will refuse the request. A
 * same-origin Netlify Function needs no change.
 *
 * Netlify reads `_headers` from the publish directory and merges it with any
 * [[headers]] in netlify.toml. Keep every header in exactly one of the two:
 * Netlify joins duplicate header names, and two CSPs are both enforced.
 */
import { createHash } from "node:crypto";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "out");

/** Extra origins the contact form may post to. Empty while it is a stub. */
const CONNECT_SRC = [];

/**
 * Razorpay checkout, allowed ONLY on the pages that can start a payment.
 *
 * The rest of the site keeps the tighter policy: no third-party script may
 * run, nothing may be framed. Widening the whole site for one product page
 * would hand every other page an attack surface it has no use for.
 *
 * script-src  checkout + cdn.razorpay.com    the widget, and the risk-detection
 *                                            bundle it pulls in at runtime
 *                                            (caught by testing, not guessed)
 * frame-src   api.razorpay.com + checkout    the payment iframe and bank pages
 * connect-src api + lumberjack               order calls and the SDK's telemetry
 * img-src     razorpay CDNs                  method logos inside the widget
 * form-action api.razorpay.com               bank redirects post through here
 * Permissions-Policy payment=(self ...)      the Payment Request API the
 *                                            widget uses for saved cards
 */
const RAZORPAY = {
  // Every /playbook route EXCEPT the dashboard, which takes no payments and
  // has no reason to reach a payment host. Written as a predicate: the regex
  // that tried to express "starts with /playbook but not /playbook/admin" in
  // one pattern let the admin route through an alternation branch, and a
  // security rule that is hard to read is a security rule that is hard to
  // check.
  matches: (route) => route.startsWith("/playbook") && !/^\/playbook\/admin(\/|$)/.test(route),
  script: ["https://checkout.razorpay.com", "https://cdn.razorpay.com"],
  frame: ["https://api.razorpay.com", "https://checkout.razorpay.com"],
  connect: ["https://api.razorpay.com", "https://lumberjack.razorpay.com", "https://lumberjack-cx.razorpay.com"],
  img: ["https://cdn.razorpay.com", "https://badges.razorpay.com"],
  form: ["https://api.razorpay.com"],
};

/**
 * The dashboard, and only the dashboard, talks to Supabase.
 *
 * Scoped the same way Razorpay is: the sales page has no business connecting
 * to a database, and a policy that lets it is a policy that would not notice
 * if it started. SUPABASE_URL is read at build time so the host is pinned
 * exactly rather than allowed by wildcard.
 */
const SUPABASE = {
  routes: /^\/playbook\/admin(\/|$)/,
  connect: (() => {
    const url = process.env.SUPABASE_URL || "";
    try {
      return url ? [new URL(url).origin] : [];
    } catch {
      return [];
    }
  })(),
};

function htmlFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return htmlFiles(path);
    return entry.name.endsWith(".html") ? [path] : [];
  });
}

// Inline, executable scripts only. External scripts are covered by 'self',
// and JSON-LD blocks are data — CSP does not apply to them.
const INLINE_SCRIPT = /<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/g;

const NL = String.fromCharCode(10);

const pages = htmlFiles(OUT);
if (pages.length === 0) {
  throw new Error("security-headers: no HTML found in out/ — did the build run?");
}

function scriptHashes(file) {
  const hashes = new Set();
  const html = readFileSync(file, "utf8");
  for (const [, attributes, body] of html.matchAll(INLINE_SCRIPT)) {
    if (/type=["']?application\/(ld\+)?json/.test(attributes)) continue;
    hashes.add(`'sha256-${createHash("sha256").update(body, "utf8").digest("base64")}'`);
  }
  return [...hashes].sort();
}

function csp(hashes, route) {
  const pay = RAZORPAY.matches(route);
  const admin = SUPABASE.routes.test(route);
  const list = (base, extra) => [base, ...(pay ? extra : [])].join(" ");

  return [
    "default-src 'self'",
    `script-src 'self' ${hashes.join(" ")}${pay ? " " + RAZORPAY.script.join(" ") : ""}`,
    // 'unsafe-inline' here covers the `style` ATTRIBUTES React writes for
    // animation delays, tilts and positions.
    //
    // style-src-elem is tightened to 'self' so an injected <style> BLOCK is
    // refused while those attributes keep working — our own build contains no
    // inline <style> element at all. Browsers without style-src-elem (Safari)
    // ignore it and fall back to style-src, which is today's behaviour, so
    // nothing breaks there either.
    //
    // The payment routes are the exception. Razorpay's widget injects a
    // <style> element at runtime, which 'self' refuses — caught by driving the
    // real checkout, not by scanning the build, because nothing in the build
    // shows it. A blocked stylesheet there means a broken checkout, so those
    // ten routes keep the looser value and every other route gets the tighter
    // one.
    "style-src 'self' 'unsafe-inline'",
    `style-src-elem 'self'${pay ? " 'unsafe-inline'" : ""}`,
    list("img-src 'self' data:", RAZORPAY.img),
    "font-src 'self'",
    `connect-src ${[
      "'self'",
      ...CONNECT_SRC,
      ...(pay ? RAZORPAY.connect : []),
      ...(admin ? SUPABASE.connect : []),
    ].join(" ")}`,
    "media-src 'self'",
    "manifest-src 'self'",
    "worker-src 'none'",
    pay ? `frame-src ${RAZORPAY.frame.join(" ")}` : "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'none'",
    // The contact form's no-JavaScript fallback submits to a mailto:, which
    // form-action does not govern; nothing posts cross-origin any more, so the
    // WhatsApp hosts are gone from here.
    list("form-action 'self'", RAZORPAY.form),
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join("; ");
}

/**
 * PER-PAGE POLICIES
 * One site-wide policy listing every page's hashes grew by ~250 bytes per
 * page (7.5 KB at 30 pages) — heading for proxy header limits, and it let any
 * page run any other page's bootstrap scripts. Each page now gets only its own
 * hashes, on its exact path.
 *
 * The CSP is deliberately NOT on `/*`: Netlify combines every matching rule,
 * and two Content-Security-Policy headers are both enforced, so a wildcard
 * policy would block every page's scripts. Paths with no page of their own
 * (served the 404 page) get the other security headers but no CSP.
 */
function routesFor(file) {
  const rel = relative(OUT, file).split(sep).join("/");
  if (rel === "index.html") return ["/"];
  if (!rel.endsWith("/index.html")) return []; // 404.html and other flat files
  const dir = rel.slice(0, -"/index.html".length);
  if (dir === "404" || dir === "_not-found") return [];
  return [`/${dir}/`, `/${dir}`];
}

const pageRules = pages
  .flatMap((file) => {
    const routes = routesFor(file);
    if (routes.length === 0) return [];
    const hashes = scriptHashes(file);
    return routes.map((route) =>
      [
        route,
        `  Content-Security-Policy: ${csp(hashes, route)}`,
        // The site-wide Permissions-Policy denies payment; the checkout needs
        // it. A per-route header overrides the wildcard one for these paths.
        ...(RAZORPAY.matches(route)
          ? [
              `  Permissions-Policy: accelerometer=(), camera=(), display-capture=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(self "https://api.razorpay.com" "https://checkout.razorpay.com"), usb=()`,
              // Some bank and UPI flows hand off through a popup and then talk
              // back to the opener. Site-wide COOP is same-origin, which severs
              // that and can strand a buyer on a blank window mid-payment.
              // Relaxed to allow-popups on the payment routes ONLY: this page
              // still cannot be reached by a cross-origin opener, and every
              // other route keeps the stricter value.
              `  Cross-Origin-Opener-Policy: same-origin-allow-popups`,
            ]
          : []),
      ].join(NL),
    );
  })
  .sort();

const largest = Math.max(...pageRules.map((rule) => rule.length));

const headers = `# GENERATED by scripts/security-headers.mjs on every build — do not edit.

/*
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: accelerometer=(), camera=(), display-capture=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()
  Cross-Origin-Opener-Policy: same-origin
  Cross-Origin-Resource-Policy: same-origin
  Origin-Agent-Cluster: ?1

# Content-hashed build output never changes under the same URL.
/_next/static/*
  Cache-Control: public, max-age=31536000, immutable

# Per-page Content-Security-Policy.
${pageRules.join(NL + NL)}
`;

writeFileSync(join(OUT, "_headers"), headers);
console.log(
  `security-headers: ${pageRules.length} page policies from ${pages.length} HTML files -> out/_headers (largest policy ${largest} bytes)`,
);
