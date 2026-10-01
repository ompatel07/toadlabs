/**
 * Adversarial input tests against the real function handlers. The validation
 * these exercise runs before any storage call, so it works off-platform.
 */
process.env.RAZORPAY_KEY_ID = "rzp_test_dummy";
process.env.RAZORPAY_KEY_SECRET = "dummy_secret";
process.env.RAZORPAY_WEBHOOK_SECRET = "whsec_dummy";
process.env.PLAYBOOK_DOWNLOAD_URL = "https://example.invalid/bundle.zip";

const status = (await import("file:///E:/toadlabs/netlify/functions/order-status.mjs")).handler;
const webhook = (await import("file:///E:/toadlabs/netlify/functions/razorpay-webhook.mjs")).handler;
const create = (await import("file:///E:/toadlabs/netlify/functions/create-order.mjs")).handler;
const download = (await import("file:///E:/toadlabs/netlify/functions/download.mjs")).handler;

const problems = [];
const ok = (c, l) => { if (!c) problems.push(l); console.log((c ? "PASS " : "FAIL ") + l); };
const ev = (o = {}) => ({ httpMethod: "GET", headers: {}, queryStringParameters: {}, ...o });

// Method enforcement.
ok((await status(ev({ httpMethod: "POST" }))).statusCode === 405, "order-status rejects POST");
ok((await webhook(ev({ httpMethod: "GET" }))).statusCode === 405, "webhook rejects GET");
ok((await create(ev({ httpMethod: "GET" }))).statusCode === 405, "create-order rejects GET");
ok((await download(ev({ httpMethod: "POST" }))).statusCode === 405, "download rejects POST");

// order-status input validation, before any storage is touched.
for (const bad of ["", "x", "order_", "order_<script>", "order_" + "A".repeat(64), "../../etc", "order_ABC*123", "'; DROP TABLE--"]) {
  const r = await status(ev({ queryStringParameters: { order_id: bad } }));
  ok(r.statusCode === 400, `order-status rejects ${JSON.stringify(bad).slice(0, 26)}`);
}

// A malformed payment id is refused outright.
ok((await status(ev({ queryStringParameters: { order_id: "order_ABCDEF123456", payment_id: "pay_<script>" } }))).statusCode === 400,
   "order-status rejects a malformed payment id");

// Webhook must refuse anything unsigned or wrongly signed.
ok((await webhook(ev({ httpMethod: "POST", body: "{}" }))).statusCode === 400, "webhook rejects a body with no signature");
ok((await webhook(ev({ httpMethod: "POST", body: "{}", headers: { "x-razorpay-signature": "deadbeef" } }))).statusCode === 401,
   "webhook rejects a bad signature");

// A correctly signed but non-payment event is acknowledged, not acted on.
const crypto = await import("node:crypto");
const body = JSON.stringify({ event: "payment.failed" });
const sig = crypto.createHmac("sha256", "whsec_dummy").update(body).digest("hex");
const r = await webhook(ev({ httpMethod: "POST", body, headers: { "x-razorpay-signature": sig } }));
ok(r.statusCode === 200 && JSON.parse(r.body).received === true, "webhook acknowledges an unrelated signed event without acting");

// Oversized body is refused before any work.
ok((await create(ev({ httpMethod: "POST", body: "x".repeat(5000) }))).statusCode === 413, "create-order refuses an oversized body");

// Download needs both parameters.
ok((await download(ev({ queryStringParameters: { order_id: "order_ABCDEF123456" } }))).statusCode === 400, "download refuses a missing token");
ok((await download(ev({ queryStringParameters: { t: "abc" } }))).statusCode === 400, "download refuses a missing order id");

// No response may echo a secret.
const bodies = [];
for (const h of [status, create, download]) {
  try { bodies.push(JSON.stringify(await h(ev({ httpMethod: "POST", body: "{}" })))); } catch { /* storage unavailable off-platform */ }
}
ok(!bodies.some((b) => /dummy_secret|whsec_dummy|example\.invalid/.test(b)), "no handler echoes a secret or the private download URL");

console.log(problems.length ? "\nPROBLEMS:\n" + problems.join("\n") : "\nhandlers: all adversarial inputs handled");
