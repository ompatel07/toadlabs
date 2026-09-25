import crypto from "node:crypto";
import { AMOUNT_PAISE, CURRENCY, env, fail, json, orders, safeEqual } from "./_shared.mjs";

/**
 * Razorpay webhook — the only thing on this site allowed to mark an order paid.
 *
 * ORDER OF OPERATIONS MATTERS. The signature is checked against the RAW body
 * before the body is parsed, because parsing something you have not verified
 * is how you end up trusting it. Only then is the payload read, and even then
 * the amount and currency are compared against this server's own constants —
 * a genuine-looking event for ₹1 is still not a sale.
 */

export const handler = async (event) => {
  if (event.httpMethod !== "POST") return fail(405, "webhook: wrong method", "Method not allowed.");

  let secret;
  try {
    secret = env("RAZORPAY_WEBHOOK_SECRET");
  } catch (error) {
    return fail(500, `webhook: ${error.message}`, "Not configured.");
  }

  const raw = event.isBase64Encoded
    ? Buffer.from(event.body || "", "base64").toString("utf8")
    : event.body || "";
  const signature = event.headers?.["x-razorpay-signature"];
  if (!signature) return fail(400, "webhook: missing signature", "Bad request.");

  const expected = crypto.createHmac("sha256", secret).update(raw).digest("hex");
  if (!safeEqual(signature, expected)) {
    return fail(401, "webhook: signature mismatch", "Bad request.");
  }

  let payload;
  try {
    payload = JSON.parse(raw);
  } catch {
    return fail(400, "webhook: unparseable body", "Bad request.");
  }

  const eventName = payload?.event;
  const payment = payload?.payload?.payment?.entity;
  const orderId = payment?.order_id;

  // Acknowledge everything else with 200: Razorpay retries non-2xx, and there
  // is nothing to retry for an event this endpoint does not act on.
  if (eventName !== "payment.captured" || !orderId) {
    return json(200, { received: true });
  }

  if (payment.amount !== AMOUNT_PAISE || payment.currency !== CURRENCY) {
    console.error(
      `webhook: amount mismatch for ${orderId} — got ${payment.amount} ${payment.currency}, expected ${AMOUNT_PAISE} ${CURRENCY}`,
    );
    return json(200, { received: true });
  }

  const store = orders();
  const existing = (await store.get(orderId, { type: "json" })) || {};

  // Idempotent: Razorpay may deliver the same event more than once, and a
  // second delivery must not overwrite the first paid record.
  if (existing.status === "paid") return json(200, { received: true, duplicate: true });

  await store.setJSON(orderId, {
    ...existing,
    orderId,
    status: "paid",
    paymentId: payment.id,
    amount: payment.amount,
    currency: payment.currency,
    email: payment.email || existing.email || null,
    contact: payment.contact || existing.contact || null,
    paidAt: new Date().toISOString(),
  });

  console.log(`webhook: order ${orderId} marked paid (payment ${payment.id})`);
  return json(200, { received: true });
};
