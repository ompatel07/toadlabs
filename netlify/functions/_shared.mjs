import crypto from "node:crypto";
import { getStore } from "@netlify/blobs";

/**
 * Shared bits of the payment flow.
 *
 * THE ONE RULE: the browser never decides anything that matters. The price
 * lives here, the order record lives in Netlify Blobs, and a download link is
 * only ever minted from a record the verified webhook wrote.
 */

/** Price in paise. Razorpay works in the smallest currency unit. */
export const AMOUNT_PAISE = 129900;
export const CURRENCY = "INR";
export const PRODUCT_ID = "playbook";

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

export const orders = () => getStore({ name: "playbook-orders", consistency: "strong" });

/** Caller's IP, as Netlify reports it. */
export function clientIp(event) {
  return (
    event.headers?.["x-nf-client-connection-ip"] ||
    (event.headers?.["x-forwarded-for"] || "").split(",")[0].trim() ||
    "unknown"
  );
}

/**
 * Fixed-window rate limit, backed by the same blob store.
 *
 * Crude on purpose: it exists to stop a script hammering order creation, not
 * to police a distributed attack, and it fails OPEN — a storage blip must
 * never stop a real buyer from paying.
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
    console.error("rate-limit unavailable, allowing request", error);
    return false;
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
