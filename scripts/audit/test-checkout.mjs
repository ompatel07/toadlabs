import { launch, goto, evaluate } from "./cdp.mjs";

/**
 * The live-test checkout gate, from the browser's side.
 *
 * The sales page reads a secret from ?t= and forwards it to create-order, which
 * is the only way to be quoted the test amount instead of the full price. A
 * value read from the URL is a value an attacker controls, so the one thing
 * that must never happen is it reaching the DOM. It is sent in a fetch body and
 * nowhere else; these payloads prove it.
 *
 * Needs the preview server on :3211.
 */
const c = await launch();
const problems = [];
const ok = (cond, label, d = "") => { if (!cond) problems.push(label + " " + d); console.log((cond ? "PASS  " : "FAIL  ") + label + (d ? "  " + d : "")); };

const payloads = [
  "<script>window.__pwn=1</script>",
  "\"><img src=x onerror=window.__pwn=1>",
  "javascript:window.__pwn=1",
  "'-alert(1)-'",
  "<svg/onload=window.__pwn=1>",
  "MARKER_CANARY_8841",
];

for (const p of payloads) {
  await goto(c, "http://localhost:3211/playbook/?t=" + encodeURIComponent(p));
  const r = await evaluate(c, `(() => ({
    pwned: Boolean(window.__pwn),
    inHtml: document.documentElement.innerHTML.includes(${JSON.stringify(p)}),
    inText: document.body.innerText.includes(${JSON.stringify(p)}),
    canary: document.documentElement.innerHTML.includes("MARKER_CANARY_8841"),
  }))()`);
  ok(!r.pwned, "no script executed for " + p.slice(0, 28));
  ok(!r.inHtml && !r.inText, "the key is not reflected into the page for " + p.slice(0, 28),
     r.inHtml ? "FOUND IN HTML" : r.inText ? "FOUND IN TEXT" : "");
  await evaluate(c, "window.__pwn = undefined");
}

// And the page still works normally with the param present.
await goto(c, "http://localhost:3211/playbook/?t=whatever");
const normal = await evaluate(c, `(() => ({
  price: document.body.innerText.includes("1,499"),
  banner: document.body.innerText.includes("Test checkout"),
}))()`);
ok(normal.price, "the listed price is still shown with the param present");
ok(!normal.banner, "no test banner appears before the server quotes an amount");

console.log("\n" + (problems.length ? "PROBLEMS:\n" + problems.join("\n") : "test key: never reflected, never executed"));
c.close(); process.exit(0);
