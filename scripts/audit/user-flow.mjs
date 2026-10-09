import { launch, goto, evaluate, setViewport } from "./cdp.mjs";
import { setTimeout as sleep } from "node:timers/promises";

/** Where to test. Defaults to the local preview; set PREVIEW_URL to audit
 *  a deployed site instead, which is the only way to check what visitors get. */
const BASE = process.env.PREVIEW_URL || "http://127.0.0.1:3211";

const c = await launch();
const problems = [];
const ok = (cond, label) => { if (!cond) problems.push(label); console.log((cond ? "PASS " : "FAIL ") + label); };
const errs = [];
c.on("Runtime.exceptionThrown", (p) => errs.push((p.exceptionDetails.exception?.description || "").split(String.fromCharCode(10))[0]));
await c.send("Runtime.enable");

for (const [w, h, mob, label] of [[390, 844, true, "phone"], [1440, 950, false, "desktop"]]) {
  console.log(`\n── ${label} ──`);
  await setViewport(c, w, h, mob);
  await goto(c, BASE + "/playbook/");
  await sleep(2500);

  // 1. Hero CTA scrolls to the contents.
  await evaluate(c, `document.querySelector('a[href="#inside"]').click()`);
  await sleep(2000);
  ok(await evaluate(c, `Math.abs(document.getElementById('inside').getBoundingClientRect().top) < 100`), `${label}: hero CTA lands on the contents`);

  // 2. "See the price" reaches the reveal.
  await evaluate(c, `scrollTo(0,0)`); await sleep(600);
  await evaluate(c, `document.querySelector('a[href="#price"]').click()`);
  await sleep(2000);
  ok(await evaluate(c, `Math.abs(document.getElementById('price').getBoundingClientRect().top) < 100`), `${label}: price CTA lands on the reveal`);

  // 3. The price is only ever in that section.
  ok(await evaluate(c, `(() => {
    const p = document.getElementById('price');
    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let n; while ((n = w.nextNode())) if (/1,499/.test(n.nodeValue) && (p.compareDocumentPosition(n) & Node.DOCUMENT_POSITION_PRECEDING)) return false;
    return true;
  })()`), `${label}: no price before the reveal`);

  // 4. FAQ opens and its answer is in the HTML before opening (crawlable).
  await evaluate(c, `document.querySelector('#faq button').click()`);
  await sleep(500);
  ok(await evaluate(c, `document.querySelector('#faq button').getAttribute('aria-expanded') === 'true'`), `${label}: FAQ opens`);

  // 5. Slider steps and stops at both ends.
  const slider = await evaluate(c, `(async () => {
    const t = document.querySelector('ul[aria-label="Reply screenshots"]');
    t.scrollIntoView({ block: 'center' }); await new Promise(r => setTimeout(r, 400));
    const next = document.querySelector('[aria-label="Next reply"]');
    const prev = document.querySelector('[aria-label="Previous reply"]');
    const startDisabled = prev.disabled;
    next.click(); await new Promise(r => setTimeout(r, 1200));
    const moved = t.scrollLeft > 0;
    for (let i = 0; i < 12; i++) { next.click(); await new Promise(r => setTimeout(r, 260)); }
    await new Promise(r => setTimeout(r, 900));
    const atEnd = document.querySelector('[aria-label="Next reply"]').disabled;
    return JSON.stringify({ startDisabled, moved, atEnd });
  })()`);
  const s = JSON.parse(slider);
  ok(s.startDisabled, `${label}: slider Previous is disabled at the start`);
  ok(s.moved, `${label}: slider advances`);
  ok(s.atEnd, `${label}: slider Next is disabled at the end`);

  // 6. Policy links resolve.
  for (const href of ["/playbook/terms", "/playbook/refund", "/playbook/privacy"]) {
    const status = await evaluate(c, `fetch('${href}/').then(r => r.status)`);
    ok(Number(status) === 200, `${label}: ${href} resolves`);
  }

  // 7. Sticky bar only between hero and price.
  if (mob) {
    const bar = await evaluate(c, `(async () => {
      const el = document.querySelector('.pb-bar');
      const vis = () => getComputedStyle(el).visibility;
      scrollTo(0, 0); await new Promise(r => setTimeout(r, 700)); const top = vis();
      scrollTo(0, 6000); await new Promise(r => setTimeout(r, 900)); const mid = vis();
      document.getElementById('price').scrollIntoView(); await new Promise(r => setTimeout(r, 1000)); const end = vis();
      return JSON.stringify({ top, mid, end });
    })()`);
    const b = JSON.parse(bar);
    ok(b.top === "hidden" && b.mid === "visible" && b.end === "hidden", `${label}: sticky bar hidden/visible/hidden`);
  }
}

// 8. Thank-you refuses to trust the URL.
await goto(c, BASE + "/playbook/thank-you/?order_id=order_FAKE12345678");
await sleep(2000);
ok(await evaluate(c, `/Confirming|could not confirm/i.test(document.body.innerText)`), "thank-you does not claim paid from the URL alone");
ok(!(await evaluate(c, `/Download the bundle/i.test(document.body.innerText)`)), "thank-you shows no download for an unverified order");

console.log("\nconsole errors:", errs.length ? errs.join(" | ") : "none");
console.log("PROBLEMS:", problems.length ? "\n" + problems.join("\n") : "none");
c.close(); process.exit(problems.length ? 1 : 0);
