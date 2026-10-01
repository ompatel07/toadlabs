// Marketing / copywriting audit for the playbook funnel.
import { launch, goto, evaluate, setViewport } from "./cdp.mjs";
import { setTimeout as sleep } from "node:timers/promises";

const PAGES = ["/playbook/", "/playbook/terms/", "/playbook/refund/", "/playbook/privacy/", "/playbook/thank-you/"];
const problems = [];
const c = await launch();
await setViewport(c, 1440, 900, true);

const text = {};
for (const p of PAGES) {
  await goto(c, "http://127.0.0.1:3211" + p);
  await sleep(900);
  text[p] = await evaluate(c, "document.body.innerText");
}

const page = text["/playbook/"];

// 1. Income claims and fabricated urgency.
const BANNED = [
  [/earn (₹|rs\.?|inr)?\s?[0-9]/i, "an earnings figure"],
  [/\b(lakhs?|crores?) (a|per) month\b/i, "a lakhs/crores claim"],
  [/\bincome guarantee/i, "an income guarantee"],
  [/\bget rich\b|\bpassive income\b/i, "get-rich language"],
  [/\bonly \d+ (seats|copies|spots) left\b/i, "fake scarcity"],
  [/\boffer ends\b|\bcountdown\b|\bhurry\b/i, "fabricated urgency"],
  [/\bwas ₹|\bstruck|\b₹\s?\d+\s*\/-\s*₹/i, "a fake discount anchor"],
  [/\b100% (guaranteed|success)\b/i, "an absolute success claim"],
];
for (const [re, label] of BANNED) {
  for (const [p, body] of Object.entries(text)) if (re.test(body)) problems.push(`${p} contains ${label}`);
}

// 2. The price must appear only in the final section.
const priceIdx = page.indexOf("1,299");
const revealIdx = page.indexOf("What it costs");
if (priceIdx !== -1 && revealIdx !== -1 && priceIdx < revealIdx) problems.push("price appears before the reveal");

// 3. The guarantee must say the same thing in all three places.
const TERMS = [
  ["30 days", /30 days/i],
  ["100 businesses", /100 businesses/i],
  ["45 days", /45 days/i],
  ["one claim per buyer", /one claim per buyer/i],
];
for (const [label, re] of TERMS) {
  for (const p of ["/playbook/", "/playbook/terms/", "/playbook/refund/"]) {
    if (!re.test(text[p])) problems.push(`${p} guarantee is missing "${label}"`);
  }
}

// 4. Contact must exist and must not be a phone number.
for (const p of ["/playbook/terms/", "/playbook/refund/", "/playbook/privacy/"]) {
  if (!/@/.test(text[p])) problems.push(`${p} gives no way to contact the seller`);
  if (/\+91|\b[6-9]\d{9}\b/.test(text[p])) problems.push(`${p} still shows a phone number`);
}

// 5. Every number the page claims must match the deliverables table.
const CLAIMS = [["10 modules", /10 modules/i], ["75", /75 (outreach )?scripts/i], ["37", /37 prompts/i],
                ["12 niches", /12 niches/i], ["5 sectors", /5 (ready-made )?(websites|sites|sectors)/i]];
for (const [label, re] of CLAIMS) if (!re.test(page)) problems.push(`sales page never states "${label}"`);

// 6. A refund promise needs the policy linked from the page that makes it.
if (!/refund policy/i.test(page)) problems.push("sales page does not link the refund policy");

console.log("pages checked:", PAGES.length);
console.log("PROBLEMS:", problems.length ? "\n" + [...new Set(problems)].join("\n") : "none");
c.close(); process.exit(0);
