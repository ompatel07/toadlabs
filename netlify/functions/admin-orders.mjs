import { createClient } from "@supabase/supabase-js";
import { DOWNLOAD_TTL_MS, clientIp, fail, json, rateLimited, signDownloadToken } from "./_shared.mjs";
import { db } from "./_orders-db.mjs";
import { deliverDownload } from "./_deliver.mjs";

/**
 * The dashboard's only data source.
 *
 * WHO IS ALLOWED IN
 * The caller sends a Supabase Auth access token. This verifies it against
 * Supabase — so the token must be real, unexpired and issued by this project —
 * and then checks the verified email against ADMIN_EMAILS. Two gates, and the
 * second is the one that matters: anybody can sign up for a Supabase project
 * if sign-ups are open, so "has a valid token" is not "is the owner".
 *
 * The buyer table is never exposed to the browser directly. The anon key can
 * read nothing (RLS is on with no policy), and the service_role key stays
 * here. The browser gets rows this function chose to return, and nothing else.
 */

const MAX_ROWS = 200;

function admins() {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

/** Verifies the bearer token and returns the caller's email, or null. */
async function callerEmail(event) {
  const header = event.headers?.authorization || event.headers?.Authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  if (!token) return null;

  const url = process.env.SUPABASE_URL;
  const anon = process.env.SUPABASE_ANON_KEY;
  if (!url || !anon) return null;

  try {
    // Asked of Supabase rather than decoded here: a JWT this function parses
    // itself is a JWT this function has to validate itself, and that is a
    // worse place to make a mistake.
    const probe = createClient(url, anon, { auth: { persistSession: false } });
    const { data, error } = await probe.auth.getUser(token);
    if (error || !data?.user?.email) return null;
    return data.user.email.toLowerCase();
  } catch (error) {
    console.error("admin-orders: token check failed", error);
    return null;
  }
}

export const handler = async (event) => {
  const method = event.httpMethod;
  if (method !== "GET" && method !== "POST") {
    return fail(405, "admin-orders: wrong method", "Method not allowed.");
  }

  const ip = clientIp(event);
  if (await rateLimited(`admin:${ip}`, { limit: 120, windowMs: 10 * 60 * 1000 })) {
    return fail(429, `admin-orders: rate limited ${ip}`, "Too many requests.");
  }

  const allowed = admins();
  if (allowed.length === 0) {
    return fail(500, "admin-orders: ADMIN_EMAILS is not set", "Dashboard is not configured.");
  }

  const email = await callerEmail(event);
  // One message for "no token", "bad token" and "not an admin". Telling them
  // which one they got is telling them how close they are.
  if (!email || !allowed.includes(email)) {
    return fail(401, `admin-orders: refused ${email || "anonymous"} from ${ip}`, "Not authorised.");
  }

  const supabase = db();
  if (!supabase) return fail(500, "admin-orders: supabase not configured", "Not configured.");

  /* ── Resend a buyer's link ─────────────────────────────────────────────── */

  if (method === "POST") {
    let body = {};
    try {
      body = JSON.parse(event.body || "{}");
    } catch {
      return fail(400, "admin-orders: unparseable body", "Bad request.");
    }
    const orderId = String(body.orderId || "");
    if (!/^order_[A-Za-z0-9]{6,32}$/.test(orderId)) {
      return fail(400, "admin-orders: bad order id", "Unknown order.");
    }

    const { data: row, error } = await supabase
      .from("orders")
      .select("order_id, status, email, email_attempts")
      .eq("order_id", orderId)
      .maybeSingle();
    if (error || !row) return fail(404, `admin-orders: ${orderId} not found`, "Unknown order.");
    if (row.status !== "paid") {
      return fail(409, `admin-orders: ${orderId} is not paid`, "That order is not paid.");
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) return fail(500, "admin-orders: missing key secret", "Not configured.");

    /* A link to hand over by whatever channel you like.
       Email is optional in this setup — the buyer normally downloads straight
       from the thank-you page. What they cannot do is get back in after
       closing that tab, so this mints the same signed, expiring link for the
       owner to send over WhatsApp. It is the recovery path that email would
       otherwise be, without requiring email. */
    if (body.action === "link") {
      const base = (process.env.SITE_URL || "").replace(/\/+$/, "");
      if (!base) return fail(500, "admin-orders: SITE_URL not set", "SITE_URL is not configured.");
      const expiresAt = Date.now() + DOWNLOAD_TTL_MS;
      const token = signDownloadToken(orderId, expiresAt, secret);
      const url = `${base}/.netlify/functions/download?order_id=${encodeURIComponent(orderId)}&t=${token}`;
      console.log(`admin-orders: ${email} minted a link for ${orderId}`);
      return json(200, { orderId, url, expiresAt, hours: Math.round(DOWNLOAD_TTL_MS / 3600000) });
    }

    const result = await deliverDownload({ orderId, email: row.email, secret });
    await supabase
      .from("orders")
      .update({ email_attempts: (row.email_attempts || 0) + 1 })
      .eq("order_id", orderId);

    console.log(`admin-orders: ${email} resent ${orderId} -> ${result.status}`);
    return json(200, { orderId, status: result.status, error: result.error || null });
  }

  /* ── List ──────────────────────────────────────────────────────────────── */

  const limit = Math.min(MAX_ROWS, Math.max(1, Number(event.queryStringParameters?.limit) || 50));
  const onlyPaid = event.queryStringParameters?.paid === "1";

  let query = supabase
    .from("orders")
    .select(
      "order_id, payment_id, status, amount_paise, currency, email, contact, email_status, email_error, email_sent_at, download_count, last_download_at, refunded_at, created_at, paid_at",
    )
    .order("created_at", { ascending: false })
    .limit(limit);
  if (onlyPaid) query = query.eq("status", "paid");

  const [{ data: rows, error: rowsError }, { data: summary, error: summaryError }] = await Promise.all([
    query,
    supabase.rpc("orders_summary"),
  ]);

  if (rowsError) return fail(502, `admin-orders: list failed ${rowsError.message}`, "Could not load orders.");
  if (summaryError) console.error("admin-orders: summary failed", summaryError.message);

  return json(200, {
    rows: rows || [],
    summary: (Array.isArray(summary) ? summary[0] : summary) || null,
    viewer: email,
  });
};
