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

// Constant-time compare must not throw on mismatched lengths.
ok(m.safeEqual("abc", "abc") === true, "safeEqual matches equal strings");
ok(m.safeEqual("abc", "abcd") === false, "safeEqual handles different lengths without throwing");
ok(m.safeEqual("", "x") === false, "safeEqual handles empty input");

// Amount is a server constant, not a parameter.
ok(m.AMOUNT_PAISE === 129900 && m.CURRENCY === "INR", "price and currency are server-side constants");

// Webhook signature check, replicated exactly as the function does it.
const raw = JSON.stringify({ event: "payment.captured" });
const sig = crypto.createHmac("sha256", "whsec").update(raw).digest("hex");
ok(m.safeEqual(sig, crypto.createHmac("sha256", "whsec").update(raw).digest("hex")), "webhook signature verifies over the raw body");
ok(!m.safeEqual(sig, crypto.createHmac("sha256", "whsec").update(raw + " ").digest("hex")), "a modified body fails the signature");

console.log(problems.length ? "\nPROBLEMS:\n" + problems.join("\n") : "\nfunction logic: all checks passed");
