import crypto from "node:crypto";
import { getStore } from "@netlify/blobs";
import { clientIp, env, fail, json, verifyDownloadToken } from "./_shared.mjs";
import { db, dbConfigured } from "./_orders-db.mjs";

/**
 * TEMPORARY. Delete this once the Supabase wiring is confirmed working.
 *
 * Three deploys were spent guessing why the functions cannot write to
 * Supabase while the same credentials work from a laptop. Guessing at
 * configuration that cannot be seen is not debugging, so this reports what
 * the function itself sees.
 *
 * WHAT IT WILL NOT DO
 * It never returns a value. For each variable it reports only whether it is
 * set, how long it is, and a truncated SHA-256 of it. A hash is not
 * reversible, but it can be compared against the same hash computed locally,
 * which answers "is Netlify holding the same string I am?" without the string
 * ever travelling.
 *
 * WHO CAN CALL IT
 * Only a caller holding RAZORPAY_KEY_SECRET, proven by the same signed-token
 * scheme the download gate uses. No token, no answer — and the reply to
 * everyone else is the flat 403 any other endpoint gives.
 */

const FINGERPRINT_ID = "order_DIAGNOSTIC01";

/** Set, length, and a hash that can be compared but not reversed. */
function describe(name) {
  const value = process.env[name];
  if (!value) return { set: false };
  return {
    set: true,
    length: value.length,
    fingerprint: crypto.createHash("sha256").update(value).digest("hex").slice(0, 12),
    // Catches the paste that brought quotes or a newline along with it.
    looksQuoted: /^["']|["']$/.test(value),
    hasWhitespace: /\s/.test(value),
  };
}

export const handler = async (event) => {
  if (event.httpMethod !== "GET") return fail(405, "diag: wrong method", "Method not allowed.");

  let secret;
  try {
    secret = env("RAZORPAY_KEY_SECRET");
  } catch (error) {
    return fail(500, `diag: ${error.message}`, "Not configured.");
  }

  const token = event.queryStringParameters?.t || "";
  if (!verifyDownloadToken(FINGERPRINT_ID, token, secret)) {
    return fail(403, `diag: refused ${clientIp(event)}`, "Forbidden.");
  }

  const vars = {};
  for (const name of [
    "SUPABASE_URL",
    "SUPABASE_SERVICE_ROLE_KEY",
    "SUPABASE_ANON_KEY",
    "SITE_URL",
    "ADMIN_EMAILS",
    "PLAYBOOK_BUCKET",
    "PLAYBOOK_OBJECT",
    "RAZORPAY_KEY_ID",
    "RAZORPAY_WEBHOOK_SECRET",
    "WHATSAPP_NUMBER",
  ]) {
    vars[name] = describe(name);
  }

  // What the order store would actually decide, and why.
  const result = { dbConfigured: dbConfigured(), supabase: null, blobs: null };

  if (dbConfigured()) {
    try {
      const probe = `order_DIAGPROBE${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
      const client = db();
      const { error: writeError } = await client
        .from("orders")
        .insert({ order_id: probe, status: "created", amount_paise: 149900, currency: "INR" });
      if (writeError) {
        result.supabase = { ok: false, stage: "write", message: writeError.message, code: writeError.code || null };
      } else {
        await client.from("orders").delete().eq("order_id", probe);
        result.supabase = { ok: true };
      }
    } catch (error) {
      result.supabase = { ok: false, stage: "threw", message: String(error).slice(0, 200) };
    }
  } else {
    result.supabase = { ok: false, stage: "not-configured", message: "SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is absent at runtime" };
  }

  try {
    const store = getStore({ name: "playbook-orders", consistency: "strong" });
    await store.setJSON("diag-probe", { at: Date.now() });
    result.blobs = { ok: true };
  } catch (error) {
    result.blobs = { ok: false, message: String(error).slice(0, 120) };
  }

  return json(200, { vars, result, node: process.version });
};
