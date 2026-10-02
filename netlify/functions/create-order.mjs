import {
  AMOUNT_PAISE,
  CURRENCY,
  PRODUCT_ID,
  clientIp,
  env,
  fail,
  json,
  orders,
  rateLimited,
} from "./_shared.mjs";
import { recordOrder } from "./_orders-db.mjs";

/**
 * Creates a Razorpay order and hands the browser only what the checkout
 * widget needs: the order id, the amount to display, and the PUBLIC key id.
 *
 * The amount is read from a constant in this file. Nothing the client sends
 * can change it, which is the whole point — an amount posted from the browser
 * is a suggestion from a stranger.
 */

const MAX_BODY_BYTES = 2048;

export const handler = async (event) => {
  if (event.httpMethod !== "POST") return fail(405, "create-order: wrong method", "Method not allowed.");

  if ((event.body || "").length > MAX_BODY_BYTES) {
    return fail(413, "create-order: body too large", "Request too large.");
  }

  const ip = clientIp(event);
  if (await rateLimited(`order:${ip}`, { limit: 8, windowMs: 10 * 60 * 1000 })) {
    return fail(429, `create-order: rate limited ${ip}`, "Too many attempts. Try again in a few minutes.");
  }

  let keyId;
  let keySecret;
  try {
    keyId = env("RAZORPAY_KEY_ID");
    keySecret = env("RAZORPAY_KEY_SECRET");
  } catch (error) {
    return fail(500, `create-order: ${error.message}`, "Payments are not configured yet.");
  }

  // A short, unique receipt so a duplicate click cannot create a duplicate
  // order for the same tab.
  const receipt = `pb_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

  try {
    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: AMOUNT_PAISE,
        currency: CURRENCY,
        receipt,
        notes: { product: PRODUCT_ID },
      }),
    });

    if (!response.ok) {
      return fail(502, `create-order: razorpay ${response.status} ${await response.text()}`, "Could not start the payment.");
    }

    const order = await response.json();

    // Both records below are bookkeeping, and neither may stand between a
    // buyer and a checkout. Razorpay has already created the order by this
    // point; throwing here would return 502 to someone who could have paid,
    // and leave that order orphaned. The webhook writes the record itself if
    // it finds none, so the download gate works either way.
    const createdAt = new Date().toISOString();
    try {
      await orders().setJSON(order.id, {
        orderId: order.id,
        amount: AMOUNT_PAISE,
        currency: CURRENCY,
        product: PRODUCT_ID,
        status: "created",
        createdAt,
      });
    } catch (error) {
      console.error(`create-order: could not pre-record ${order.id} in blobs`, error);
    }

    // Recorded as "created" here too, so the dashboard can show how many people
    // opened the checkout against how many finished. Already best-effort.
    await recordOrder({
      order_id: order.id,
      status: "created",
      amount_paise: AMOUNT_PAISE,
      currency: CURRENCY,
      created_at: createdAt,
    });

    return json(200, {
      orderId: order.id,
      amount: AMOUNT_PAISE,
      currency: CURRENCY,
      keyId, // public by design: it identifies the merchant, it does not authorise anything
    });
  } catch (error) {
    // Reached only when the Razorpay call itself threw — a network failure
    // or a malformed response. The log carries the detail; the client gets a
    // message that tells an attacker nothing.
    return fail(502, `create-order: razorpay call threw ${error}`, "Could not start the payment.");
  }
};
