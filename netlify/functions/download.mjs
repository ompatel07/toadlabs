import { clientIp, env, fail, orders, rateLimited, verifyDownloadToken } from "./_shared.mjs";
import { noteDownload } from "./_orders-db.mjs";

/**
 * Hands over the paid files.
 *
 * WHERE THE FILES LIVE: not in this repo and not in public/. The function
 * redirects to PLAYBOOK_DOWNLOAD_URL, a private link held only as an
 * environment variable (a Drive/S3/R2 link, or a pre-signed URL). That keeps
 * the paid bundle out of the deploy entirely, and it means changing where the
 * files live is a dashboard edit, not a release.
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
  let target;
  try {
    secret = env("RAZORPAY_KEY_SECRET");
    target = env("PLAYBOOK_DOWNLOAD_URL");
  } catch (error) {
    return fail(500, `download: ${error.message}`, "Downloads are not configured yet.");
  }

  if (!verifyDownloadToken(orderId, token, secret)) {
    return fail(403, `download: bad or expired token for ${orderId}`, "This link has expired. Open the confirmation page again.");
  }

  const record = await orders().get(orderId, { type: "json" });
  if (!record || record.status !== "paid") {
    return fail(403, `download: order ${orderId} is not paid`, "This order is not confirmed.");
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
