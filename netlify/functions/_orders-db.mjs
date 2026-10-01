import { createClient } from "@supabase/supabase-js";

/**
 * The order record, in Supabase.
 *
 * WHY THIS SITS IN FRONT OF NETLIFY BLOBS RATHER THAN REPLACING IT
 * Blobs is still the thing the payment path depends on: it is same-platform,
 * has no second service to be down, and the download gate reads it. Supabase
 * is where an order goes so it can be *queried* — for the dashboard, and so a
 * buyer who says "nothing arrived" can be answered with a fact.
 *
 * That means a Supabase outage must never fail a payment. Every write here is
 * best-effort: it logs and returns, and the caller carries on. A missing row
 * is a reporting problem; a refused payment is a lost customer.
 */

let client = null;

/** Null when Supabase is not configured, so every call becomes a no-op. */
export function db() {
  if (client) return client;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;

  client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { "x-application-name": "offscript-playbook" } },
  });
  return client;
}

/** True when a dashboard and emailed links are actually available. */
export const dbConfigured = () => Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);

/**
 * Upsert an order. Never throws: a reporting write must not be able to fail a
 * payment.
 */
export async function recordOrder(row) {
  const supabase = db();
  if (!supabase) return { ok: false, reason: "not-configured" };
  try {
    const { error } = await supabase
      .from("orders")
      .upsert(row, { onConflict: "order_id" });
    if (error) {
      console.error("orders-db: upsert failed", error.message);
      return { ok: false, reason: error.message };
    }
    return { ok: true };
  } catch (error) {
    console.error("orders-db: upsert threw", error);
    return { ok: false, reason: String(error) };
  }
}

/** Patch an existing order. Same contract: never throws. */
export async function updateOrder(orderId, patch) {
  const supabase = db();
  if (!supabase) return { ok: false, reason: "not-configured" };
  try {
    const { error } = await supabase.from("orders").update(patch).eq("order_id", orderId);
    if (error) {
      console.error(`orders-db: update failed for ${orderId}`, error.message);
      return { ok: false, reason: error.message };
    }
    return { ok: true };
  } catch (error) {
    console.error(`orders-db: update threw for ${orderId}`, error);
    return { ok: false, reason: String(error) };
  }
}

/** Counts a download without a read-modify-write race between two tabs. */
export async function noteDownload(orderId) {
  const supabase = db();
  if (!supabase) return;
  try {
    await supabase.rpc("increment_download", { p_order_id: orderId });
  } catch {
    // The counter is telemetry. It must never stand between a buyer and the
    // files they paid for.
  }
}
