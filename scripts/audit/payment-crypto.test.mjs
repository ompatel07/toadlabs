/**
 * Adversarial tests against the payment functions' own logic, run directly
 * rather than through the network, so the assertions are about the code.
 */
import crypto from "node:crypto";
process.env.RAZORPAY_KEY_SECRET = "test_secret_value";
const m = await import("file:///E:/toadlabs/netlify/functions/_shared.mjs");
const problems = [];
const ok = (cond, label) => { if (!cond) problems.push(label); console.log((cond ? "PASS " : "FAIL ") + label); };

const SECRET = "test_secret_value";
const order = "order_AbCdEf123456";
const exp = Date.now() + 60_000;
const token = m.signDownloadToken(order, exp, SECRET);

ok(m.verifyDownloadToken(order, token, SECRET), "a valid token verifies");
ok(!m.verifyDownloadToken("order_OTHER0000001", token, SECRET), "a token for one order does not open another");
ok(!m.verifyDownloadToken(order, m.signDownloadToken(order, Date.now() - 1000, SECRET), SECRET), "an expired token is rejected");
ok(!m.verifyDownloadToken(order, token, "wrong_secret"), "a token does not verify under a different secret");
ok(!m.verifyDownloadToken(order, token.replace(/.$/, "A"), SECRET), "a tampered MAC is rejected");
ok(!m.verifyDownloadToken(order, `${Number.MAX_SAFE_INTEGER}.${token.split(".")[1]}`, SECRET), "expiry cannot be extended by editing the token");
ok(!m.verifyDownloadToken(order, "", SECRET), "an empty token is rejected");
ok(!m.verifyDownloadToken(order, "abc", SECRET), "a malformed token is rejected");
ok(!m.verifyDownloadToken(order, "0.x", SECRET), "a zero expiry is rejected");

// Key separation: the signing key must not be the Razorpay secret itself.
const naive = crypto.createHmac("sha256", SECRET).update(`${order}.${exp}`).digest("base64url");
ok(token.split(".")[1] !== naive, "download tokens are not signed with the Razorpay secret directly");

// Razorpay's payment signature: the gate that stops a bare order id being
// worth anything.
const pay = "pay_XyZ987654321";
const goodSig = crypto.createHmac("sha256", SECRET).update(`${order}|${pay}`).digest("hex");
ok(m.verifyPaymentSignature(order, pay, goodSig, SECRET), "a genuine payment signature verifies");
ok(!m.verifyPaymentSignature(order, pay, goodSig, "other_secret"), "it does not verify under another secret");
ok(!m.verifyPaymentSignature("order_OTHER0000001", pay, goodSig, SECRET), "a signature does not transfer to another order");
ok(!m.verifyPaymentSignature(order, "pay_OTHER00000001", goodSig, SECRET), "a signature does not transfer to another payment");
ok(!m.verifyPaymentSignature(order, pay, goodSig.replace(/.$/, "0"), SECRET), "a tampered signature is rejected");
ok(!m.verifyPaymentSignature(order, pay, "", SECRET), "an empty signature is rejected");
ok(!m.verifyPaymentSignature(order, "", goodSig, SECRET), "a missing payment id is rejected");
ok(!m.verifyPaymentSignature("", pay, goodSig, SECRET), "a missing order id is rejected");

// Constant-time compare must not throw on mismatched lengths.
ok(m.safeEqual("abc", "abc") === true, "safeEqual matches equal strings");
ok(m.safeEqual("abc", "abcd") === false, "safeEqual handles different lengths without throwing");
ok(m.safeEqual("", "x") === false, "safeEqual handles empty input");

// Amount is a server constant, not a parameter.
ok(m.AMOUNT_PAISE === 149900 && m.CURRENCY === "INR", "price and currency are server-side constants");

/* ── THE TEST-CHECKOUT GATE ──────────────────────────────────────────────────
   A code path that lowers the price is the one piece of this system that could
   quietly cost real money, so it is checked harder than anything else here.
   Every path that is not "the caller presented the exact secret" must come back
   at the full price. */

// With no secret configured — the state the site sits in normally — the test
// amount is unreachable, whatever anyone sends.
delete process.env.TEST_CHECKOUT_SECRET;
ok(m.amountForRequest("") === m.AMOUNT_PAISE, "unconfigured: empty key is full price");
ok(m.amountForRequest("anything") === m.AMOUNT_PAISE, "unconfigured: any key is full price");
ok(m.amountForRequest("1000") === m.AMOUNT_PAISE, "unconfigured: a key naming the amount is full price");

process.env.TEST_CHECKOUT_SECRET = "s3cret_test_key_value";
ok(m.amountForRequest("s3cret_test_key_value") === m.TEST_AMOUNT_PAISE, "the exact secret gets the test amount");
ok(m.amountForRequest("") === m.AMOUNT_PAISE, "no key is full price");
ok(m.amountForRequest("wrong") === m.AMOUNT_PAISE, "a wrong key is full price");
ok(m.amountForRequest("s3cret_test_key_valu") === m.AMOUNT_PAISE, "a truncated secret is full price");
ok(m.amountForRequest("s3cret_test_key_value ") === m.AMOUNT_PAISE, "a secret with trailing space is full price");
ok(m.amountForRequest("S3CRET_TEST_KEY_VALUE") === m.AMOUNT_PAISE, "the secret is case-sensitive");
ok(m.amountForRequest(null) === m.AMOUNT_PAISE, "a null key is full price");
ok(m.amountForRequest(undefined) === m.AMOUNT_PAISE, "an absent key is full price");
ok(m.amountForRequest(1000) === m.AMOUNT_PAISE, "a non-string key is full price");
ok(m.amountForRequest({}) === m.AMOUNT_PAISE, "an object key is full price");
ok(m.amountForRequest(["s3cret_test_key_value"]) === m.AMOUNT_PAISE, "an array key is full price");
delete process.env.TEST_CHECKOUT_SECRET;

// The webhook holds a captured payment to the amount recorded for that order.
// Only the two amounts this server can itself choose are honoured, so a
// tampered or corrupt record cannot nominate its own price.
ok(m.isAllowedAmount(m.AMOUNT_PAISE) === true, "the full price is an allowed amount");
ok(m.isAllowedAmount(m.TEST_AMOUNT_PAISE) === true, "the test amount is an allowed amount");
for (const bad of [1, 100, 129900, 149899, 0, -149900, null, undefined, "149900", NaN, Infinity]) {
  ok(m.isAllowedAmount(bad) === false, "an amount of " + String(bad) + " is not allowed");
}

// Webhook signature check, replicated exactly as the function does it.
const raw = JSON.stringify({ event: "payment.captured" });
const sig = crypto.createHmac("sha256", "whsec").update(raw).digest("hex");
ok(m.safeEqual(sig, crypto.createHmac("sha256", "whsec").update(raw).digest("hex")), "webhook signature verifies over the raw body");
ok(!m.safeEqual(sig, crypto.createHmac("sha256", "whsec").update(raw + " ").digest("hex")), "a modified body fails the signature");

console.log(problems.length ? "\nPROBLEMS:\n" + problems.join("\n") : "\nfunction logic: all checks passed");
