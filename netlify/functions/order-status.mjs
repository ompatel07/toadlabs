import {
  AMOUNT_PAISE,
  CURRENCY,
  DOWNLOAD_TTL_MS,
  clientIp,
  env,
  fail,
  json,
  rateLimited,
  signDownloadToken,
  verifyPaymentSignature,
} from "./_shared.mjs";
import { getOrder, putOrder } from "./_order-store.mjs";

/**
 * Tells the thank-you page whether an order is actually paid, and only then
 * mints a short-lived download link.
 *
 * The order id in the URL is not a secret — it travels in a redirect — so this
 * answers nothing but "paid or not" plus a link that expires. Knowing someone
 * else's order id gets an attacker a link to the same product they would have
 * had to pay for; knowing nothing gets them nothing. The webhook is the only
 * writer of "paid".
 */

export const handler = async (event) => {
  if (event.httpMethod !== "GET") return fail(405, "order-status: wrong method", "Method not allowed.");

  const orderId = event.queryStringParameters?.order_id;
  if (!orderId || !/^order_[A-Za-z0-9]{6,32}$/.test(orderId)) {
    return fail(400, "order-status: bad order id", "Unknown order.");
  }
  const paymentId = event.queryStringParameters?.payment_id || "";
  const signature = event.queryStringParameters?.signature || "";
  if (paymentId && !/^pay_[A-Za-z0-9]{6,32}$/.test(paymentId)) {
    return fail(400, "order-status: bad payment id", "Unknown order.");
  }

  const ip = clientIp(event);
  if (await rateLimited(`status:${ip}`, { limit: 90, windowMs: 10 * 60 * 1000 })) {
    return fail(429, `order-status: rate limited ${ip}`, "Too many requests.");
  }

  let secret;
  try {
    secret = env("RAZORPAY_KEY_SECRET");
  } catch (error) {
    return fail(500, `order-status: ${error.message}`, "Not configured.");
  }

  let paid = false;
  // getOrder never throws, whatever the storage layer is doing. It used to,
  // and an unavailable store turned this endpoint into a raw provider error
  // in the buyer's face. "Could not read" now reads as "not paid yet", which
  // is the one safe way to be wrong here.
  const record = await getOrder(orderId);
  if (record?.status === "paid") {
    paid = true;
  } else {
    // The buyer often lands here a second before Razorpay's webhook does.
    // Rather than make them wait on a race, ask Razorpay itself — server to
    // server, with the merchant credentials. Still never the browser's word.
    try {
      const response = await fetch(`https://api.razorpay.com/v1/orders/${encodeURIComponent(orderId)}`, {
        headers: {
          Authorization: `Basic ${Buffer.from(`${env("RAZORPAY_KEY_ID")}:${secret}`).toString("base64")}`,
        },
      });
      if (response.ok) {
        const order = await response.json();
        if (order.status === "paid" && order.amount_paid >= AMOUNT_PAISE && order.currency === CURRENCY) {
          paid = true;
          await putOrder(orderId, {
            ...(record || {}),
            orderId,
            status: "paid",
            amount: order.amount_paid,
            currency: order.currency,
            paidAt: new Date().toISOString(),
            confirmedBy: "orders-api",
          });
        }
      }
    } catch (error) {
      console.error(`order-status: lookup failed for ${orderId}`, error);
    }
  }

  if (!paid) {
    // Deliberately the same shape for "not paid yet" and "never existed".
    return json(200, { paid: false });
  }

  // Paid is one thing; being the person who paid is another. The download link
  // is only minted for a caller who can present Razorpay's signature over this
  // exact order and payment. An order id alone — guessed, shoulder-read, or
  // recovered from someone's history — now confirms the payment and nothing
  // more.
  if (!verifyPaymentSignature(orderId, paymentId, signature, secret)) {
    console.warn(`order-status: ${orderId} is paid but presented no valid signature`);
    return json(200, { paid: true, verified: false });
  }

  const expiresAt = Date.now() + DOWNLOAD_TTL_MS;
  const token = signDownloadToken(orderId, expiresAt, secret);

  return json(200, {
    paid: true,
    verified: true,
    downloadUrl: `/.netlify/functions/download?order_id=${encodeURIComponent(orderId)}&t=${token}`,
  });
};
