/**
 * The deployed site, checked over the wire.
 *
 * Everything else in this folder audits a local build. This audits what is
 * actually being served: the headers the CDN adds, the redirects the host
 * performs, the certificate, and whether the pages the sitemap promises exist.
 * A build can be perfect and the deploy still wrong.
 *
 *   PREVIEW_URL=https://your-site node scripts/audit/live-site.mjs
 */
const SITE = (process.env.PREVIEW_URL || "https://offscriptlabs.online").replace(/\/+$/, "");
const problems = [];
const ok = (cond, label, detail = "") => {
  if (!cond) problems.push(label + (detail ? "  -> " + detail : ""));
  console.log((cond ? "PASS  " : "FAIL  ") + label + (detail ? "  " + detail : ""));
};

const sitemap = await (await fetch(SITE + "/sitemap.xml")).text();
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
console.log("sitemap lists " + urls.length + " URLs\n");
ok(urls.length > 20, "sitemap is populated", urls.length + " URLs");
ok(urls.some((u) => /\/playbook\/?$/.test(u)), "the product is in the sitemap");
ok(!urls.some((u) => u.includes("/admin")), "the dashboard is NOT in the sitemap");
ok(!urls.some((u) => u.includes("/thank-you")), "thank-you is NOT in the sitemap");

const REQUIRED = ["content-security-policy", "x-content-type-options", "referrer-policy", "strict-transport-security"];
const badStatus = [], missing = [], noindexLeak = [];
for (const url of urls) {
  const res = await fetch(url, { redirect: "follow" });
  if (res.status !== 200) badStatus.push(url + " -> " + res.status);
  for (const h of REQUIRED) if (!res.headers.get(h)) missing.push(url + " missing " + h);
  const html = await res.text();
  if (/noindex/i.test(res.headers.get("x-robots-tag") || "") || /<meta name="robots"[^>]*noindex/i.test(html)) {
    noindexLeak.push(url);
  }
}
ok(badStatus.length === 0, urls.length + " public pages return 200", badStatus.slice(0, 3).join(", "));
ok(missing.length === 0, "every public page carries the security headers", missing.slice(0, 3).join(", "));
ok(noindexLeak.length === 0, "no public page is accidentally noindexed", noindexLeak.join(", "));

// The two that must stay out of search.
for (const p of ["/playbook/admin/", "/playbook/thank-you/"]) {
  const r = await fetch(SITE + p);
  const h = await r.text();
  ok(/noindex/i.test(r.headers.get("x-robots-tag") || "") || /<meta name="robots"[^>]*noindex/i.test(h), "noindex on " + p);
}

const robots = await (await fetch(SITE + "/robots.txt")).text();
ok(!/Disallow:\s*\/\s*$/m.test(robots), "robots.txt does not block the whole site");
ok(/Sitemap:/i.test(robots), "robots.txt points at the sitemap");

const insecure = await fetch(SITE.replace("https://", "http://") + "/playbook/", { redirect: "manual" });
ok(insecure.status >= 300 && insecure.status < 400 && (insecure.headers.get("location") || "").startsWith("https://"),
   "http redirects to https", "http " + insecure.status);

const pb = await fetch(SITE + "/playbook/");
const home = await fetch(SITE + "/");
ok((pb.headers.get("content-security-policy") || "").includes("razorpay"), "Razorpay allowed on the checkout page");
ok(!(home.headers.get("content-security-policy") || "").includes("razorpay"), "Razorpay NOT allowed on the home page");
for (const [name, res] of [["home", home], ["playbook", pb]]) {
  const csp = res.headers.get("content-security-policy") || "";
  ok(!/script-src[^;]*'unsafe-(inline|eval)'/.test(csp), "no unsafe-inline/eval in script-src on " + name);
  ok(!/script-src[^;]*\*/.test(csp), "no wildcard in script-src on " + name);
}

console.log("\n" + (problems.length ? "PROBLEMS:\n" + problems.join("\n") : "live site: all checks passed"));
process.exitCode = problems.length ? 1 : 0;
