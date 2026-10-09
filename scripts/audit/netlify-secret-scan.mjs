/**
 * Netlify's secrets scan, run locally.
 *
 * Netlify greps the tracked repo AND the build output for the VALUE of every
 * environment variable set on the site, and fails the deploy on any hit. That
 * check is worth having, but it runs after a build has already been paid for,
 * and three deploys in a row died on things a local pass would have caught.
 *
 * So it runs here instead. Keys named in SECRETS_SCAN_OMIT_KEYS (netlify.toml,
 * where each is justified) are expected to appear and are only reported. Every
 * other key must appear nowhere at all — that set is the real secrets, and a
 * single hit is a leak, not an inconvenience.
 *
 * Needs a build in out/ and a local .env. Values are never printed.
 */
import fs from "node:fs";
import { execSync } from "node:child_process";

const ROOT = "E:/toadlabs/";
const NL = new RegExp(String.fromCharCode(92) + "r?" + String.fromCharCode(92) + "n");

const omit = new Set(
  ((fs.readFileSync(ROOT + "netlify.toml", "utf8").match(/SECRETS_SCAN_OMIT_KEYS\s*=\s*"([^"]*)"/) || [])[1] || "")
    .split(",").map((s) => s.trim()).filter(Boolean),
);

const env = {};
for (const p of [ROOT + ".env", "E:/offscript-secrets/netlify-import.env"]) {
  try {
    for (const l of fs.readFileSync(p, "utf8").split(NL)) {
      const m = l.match(/^([A-Z0-9_]+)=(.*)$/);
      // A short value would match half the repo by accident and prove nothing.
      if (m && m[2].trim().length >= 8) env[m[1]] = m[2].trim();
    }
  } catch { /* a missing file simply contributes no variables */ }
}

const files = [
  ...execSync("git ls-files", { cwd: ROOT, encoding: "utf8" }).split(NL).filter(Boolean).map((f) => ROOT + f),
];
if (fs.existsSync(ROOT + "out")) {
  (function walk(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = d + "/" + e.name;
      if (e.isDirectory()) walk(p); else files.push(p);
    }
  })(ROOT + "out");
}

const problems = [];
console.log("scanning " + files.length + " files for " + Object.keys(env).length + " values\n");

for (const [key, val] of Object.entries(env).sort()) {
  let hits = 0;
  for (const f of files) {
    let text;
    try { text = fs.readFileSync(f, "utf8"); } catch { continue; }
    if (text.includes(val)) hits++;
  }
  const allowed = omit.has(key);
  if (hits && !allowed) {
    problems.push(key + " appears in " + hits + " file(s) and is NOT in SECRETS_SCAN_OMIT_KEYS");
    console.log("FAIL  " + key.padEnd(27) + hits + " file(s) — this will fail the deploy");
  } else if (hits) {
    console.log("omit  " + key.padEnd(27) + hits + " file(s) — expected, justified in netlify.toml");
  } else {
    console.log("PASS  " + key.padEnd(27) + "absent from the repo and the build");
  }
}

console.log("\n" + (problems.length ? "PROBLEMS:\n" + problems.join("\n") : "secrets scan: the deploy will not be blocked"));
process.exitCode = problems.length ? 1 : 0;
