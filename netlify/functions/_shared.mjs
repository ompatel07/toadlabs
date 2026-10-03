import crypto from "node:crypto";
import { getStore } from "@netlify/blobs";

/**
 * Shared bits of the payment flow.
 *
 * THE ONE RULE: the browser never decides anything that matters. The price
 * lives here, the order record lives in _order-store.mjs, and a download link
 * is only ever minted from a record the verified webhook wrote.
 */

/** Price in paise. Razorpay works in the smallest currency unit. */
export const AMOUNT_PAISE = 149900;
export const CURRENCY = "INR";
export const PRODUCT_ID = "playbook";

/**
 * THE TEST AMOUNT.
 *
 * A live end-to-end test needs a real payment, and a real payment at the full
 * price is an expensive way to find out whether a webhook fires. This is what
 * is charged instead — but only to a caller who presents TEST_CHECKOUT_SECRET.
 *
 * The public price never changes. Nothing on the page reveals the secret, and
 * with TEST_CHECKOUT_SECRET unset this amount is unreachable by any request,
 * which is the state the site is meant to sit in once the test is done.
 *
 * The protection is not the secret alone. Everything downstream validates a
 * captured payment against the amount recorded for THAT order rather than
 * against a global constant, so ten rupees can only ever settle an order that
 * was created for ten rupees.
 */
export const TEST_AMOUNT_PAISE = 1000;

/** A recorded amount this server did not choose is not an amount to trust. */
export const isAllowedAmount = (paise) => paise === AMOUNT_PAISE || paise === TEST_AMOUNT_PAISE;

/**
 * The test amount when the caller proved they hold the secret, the real price
 * otherwise. Compared in constant time, and it fails to the real price on
 * every path: no secret configured, nothing presented, or a wrong value.
 */
export function amountForRequest(providedKey) {
  const secret = process.env.TEST_CHECKOUT_SECRET;
  if (!secret || typeof providedKey !== "string" || providedKey.length === 0) return AMOUNT_PAISE;
  return safeEqual(providedKey, secret) ? TEST_AMOUNT_PAISE : AMOUNT_PAISE;
}

export const json = (statusCode, body, headers = {}) => ({
  statusCode,
  headers: {
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
    ...headers,
  },
  body: JSON.stringify(body),
});

/** Errors are deliberately vague to the client and detailed only in the log. */
export const fail = (statusCode, logLine, publicMessage = "Something went wrong.") => {
  console.error(logLine);
  return json(statusCode, { error: publicMessage });
};

export function env(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

// The order record itself lives in _order-store.mjs, which can speak to
// Supabase as well as Blobs. Blobs alone was not enough: it is unavailable on
// this site, and the whole delivery chain read from it.

/** Caller's IP, as Netlify reports it. */
export function clientIp(event) {
  return (
    event.headers?.["x-nf-client-connection-ip"] ||
    (event.headers?.["x-forwarded-for"] || "").split(",")[0].trim() ||
    "unknown"
  );
}

/**
 * Per-instance fallback counter. A function instance is reused for a short
 * while, so this catches a burst from one caller even when shared storage is
 * unreachable. It is not a substitute for the blob-backed limit — it forgets
 * everything when the instance recycles — but it is strictly better than
 * waving every request through.
 */
const localHits = new Map();

function localRateLimited(key, { limit, windowMs }) {
  const now = Date.now();
  const record = localHits.get(key);
  if (!record || now - record.start > windowMs) {
    localHits.set(key, { start: now, count: 1 });
    // The map only ever holds callers seen by this instance, but an instance
    // that lives a long time should not grow one entry per IP forever.
    if (localHits.size > 5000) localHits.clear();
    return false;
  }
  if (record.count >= limit) return true;
  record.count += 1;
  return false;
}

/**
 * Fixed-window rate limit, backed by the same blob store.
 *
 * Crude on purpose: it exists to stop a script hammering order creation, not
 * to police a distributed attack.
 *
 * It still fails OPEN in the sense that matters — a storage outage must never
 * stop a real buyer from paying — but it no longer fails *wide*. When the blob
 * store is unreachable it falls back to the per-instance counter above, so a
 * burst from one caller is still slowed instead of being let through entirely.
 */
export async function rateLimited(key, { limit, windowMs }) {
  try {
    const store = getStore({ name: "playbook-rate", consistency: "strong" });
    const now = Date.now();
    const record = (await store.get(key, { type: "json" })) || { start: now, count: 0 };
    if (now - record.start > windowMs) {
      await store.setJSON(key, { start: now, count: 1 });
      return false;
    }
    if (record.count >= limit) return true;
    await store.setJSON(key, { start: record.start, count: record.count + 1 });
    return false;
  } catch (error) {
    console.error("rate-limit storage unavailable, falling back to per-instance counter", error);
    return localRateLimited(key, { limit, windowMs });
  }
}

/** Constant-time compare, so a signature cannot be guessed byte by byte. */
export function safeEqual(a, b) {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));
  if (left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
}

/**
 * Verifies the signature Razorpay hands the browser when a payment succeeds.
 *
 * It is HMAC-SHA256 of "<order_id>|<payment_id>" under the key secret, so only
 * Razorpay and this server can produce it. Checking it is what stops an order
 * id on its own from being worth anything: order ids travel in a redirect and
 * end up in history, and without this a leaked one would mint a download link.
 * With it, a caller has to present proof that THIS payment actually happened.
 */
export function verifyPaymentSignature(orderId, paymentId, signature, secret) {
  if (!orderId || !paymentId || !signature) return false;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
  return safeEqual(signature, expected);
}

/**
 * Download tokens: an HMAC over the order id and an expiry. Nothing is stored
 * for the token itself — it verifies on its own, and it stops working when it
 * expires.
 *
 * KEY SEPARATION. These were signed with RAZORPAY_KEY_SECRET directly, which
 * is the credential that authorises live API calls against the merchant
 * account. One key, two jobs, is how a weakness in the lesser job becomes a
 * problem for the greater one. The signing key is now derived from it with a
 * fixed label, so the value that signs links is not the value that talks to
 * Razorpay, and no new environment variable is required for that to be true.
 *
 * Set DOWNLOAD_TOKEN_SECRET to use an independent key instead; the derivation
 * is the fallback, not the preference.
 */
const DERIVATION_LABEL = "offscript/playbook/download-token/v1";

function downloadKey(secret) {
  if (process.env.DOWNLOAD_TOKEN_SECRET) return process.env.DOWNLOAD_TOKEN_SECRET;
  return crypto.createHmac("sha256", secret).update(DERIVATION_LABEL).digest();
}

export function signDownloadToken(orderId, expiresAt, secret) {
  const payload = `${orderId}.${expiresAt}`;
  const mac = crypto.createHmac("sha256", downloadKey(secret)).update(payload).digest("base64url");
  return `${expiresAt}.${mac}`;
}

export function verifyDownloadToken(orderId, token, secret) {
  const [expiresRaw, mac] = String(token).split(".");
  const expiresAt = Number(expiresRaw);
  if (!expiresAt || !mac) return false;
  if (Date.now() > expiresAt) return false;
  const expected = crypto
    .createHmac("sha256", downloadKey(secret))
    .update(`${orderId}.${expiresAt}`)
    .digest("base64url");
  return safeEqual(mac, expected);
}

export const DOWNLOAD_TTL_MS = 24 * 60 * 60 * 1000;
