import { clientIp, env, fail, orders, rateLimited, verifyDownloadToken } from "./_shared.mjs";
import { db, noteDownload } from "./_orders-db.mjs";

/**
 * Hands over the paid files.
 *
 * WHERE THE FILES LIVE: not in this repo and not in public/, so the paid
 * bundle is never part of a deploy. Two ways to point at it:
 *
 *   PLAYBOOK_BUCKET + PLAYBOOK_OBJECT   Supabase Storage, private bucket.
 *     Preferred. This mints a signed URL per download, valid for minutes, so
 *     a link lifted from someone's history or a shared screenshot is dead
 *     before it is useful.
 *
 *   PLAYBOOK_DOWNLOAD_URL               one static link (Drive, Dropbox, R2).
 *     Simpler, and fine — but it is one URL that works forever for anyone who
 *     ends up holding it. Used only when the bucket variables are absent.
 *
 * Two gates before the redirect: the order must be marked paid by the verified
 * webhook, and the token must carry a valid, unexpired signature for THAT
 * order. A token for one order cannot open another, and a copied link stops
 * working when it expires.
 */

export const handler = async (event) => {
  if (event.httpMethod !== "GET") return fail(405, "download: wrong method", "Method not allowed.");

  const orderId = event.queryStringParameters?.order_id;
  const token = event.queryStringParameters?.t;
  if (!orderId || !token) return fail(400, "download: missing parameters", "Invalid link.");

  const ip = clientIp(event);
  if (await rateLimited(`download:${ip}`, { limit: 40, windowMs: 60 * 60 * 1000 })) {
    return fail(429, `download: rate limited ${ip}`, "Too many downloads. Try again later.");
  }

  let secret;
  try {
    secret = env("RAZORPAY_KEY_SECRET");
  } catch (error) {
    return fail(500, `download: ${error.message}`, "Downloads are not configured yet.");
  }

  const bucket = process.env.PLAYBOOK_BUCKET;
  const object = process.env.PLAYBOOK_OBJECT;
  const staticUrl = process.env.PLAYBOOK_DOWNLOAD_URL;
  if (!bucket && !staticUrl) {
    return fail(500, "download: no storage configured", "Downloads are not configured yet.");
  }

  if (!verifyDownloadToken(orderId, token, secret)) {
    return fail(403, `download: bad or expired token for ${orderId}`, "This link has expired. Open the confirmation page again.");
  }

  const record = await orders().get(orderId, { type: "json" });
  if (!record || record.status !== "paid") {
    return fail(403, `download: order ${orderId} is not paid`, "This order is not confirmed.");
  }

  // Minted here, after the order has been confirmed paid — never earlier, and
  // never handed to a page that has not proved it.
  let target = staticUrl;
  if (bucket && object) {
    const supabase = db();
    if (!supabase) return fail(500, "download: supabase not configured", "Downloads are not configured yet.");
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(object, 300, { download: true });
    if (error || !data?.signedUrl) {
      console.error(`download: could not sign ${bucket}/${object}`, error?.message);
      // Fall back rather than fail: a buyer who has paid should not be told to
      // come back later because object storage had a bad minute.
      if (!staticUrl) return fail(502, "download: signing failed", "Could not prepare your download. Try again.");
    } else {
      target = data.signedUrl;
    }
  }

  console.log(`download: served ${orderId}`);
  await noteDownload(orderId);

  return {
    statusCode: 302,
    headers: {
      Location: target,
      // Never let a proxy or the browser keep a copy of a link to paid files.
      "Cache-Control": "no-store, private",
      "Referrer-Policy": "no-referrer",
    },
    body: "",
  };
};
