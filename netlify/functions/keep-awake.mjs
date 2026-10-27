import { db, dbConfigured } from "./_orders-db.mjs";

/**
 * Keeps the Supabase project from being paused for inactivity.
 *
 * WHY THIS EXISTS
 * The free tier pauses a project after about a week with no activity, and a
 * paused project takes its DNS with it. That happened here: for eighteen days
 * nothing touched the database, and the next signed webhook could not record
 * the order it was carrying. Razorpay retries a failed delivery for roughly
 * twenty-four hours, so a quiet weekend is long enough to turn a sale into a
 * payment with no record of what it bought.
 *
 * One cheap read a day is enough to count as activity, against a threshold
 * measured in days. The schedule lives in netlify.toml, because Netlify reads
 * it from there rather than from this file.
 *
 * WHAT IT DELIBERATELY DOES NOT DO
 * It takes no parameters, writes nothing, and returns no data — so there is
 * nothing to abuse if it is ever reached by something other than the
 * scheduler. The worst an unexpected caller achieves is one more SELECT.
 *
 * It is a mitigation, not a guarantee: the pause policy belongs to Supabase
 * and can change. The way to remove the risk rather than reduce it is a paid
 * plan, which does not pause at all.
 */

export const handler = async () => {
  if (!dbConfigured()) {
    console.warn("keep-awake: Supabase is not configured; nothing to keep awake");
    return { statusCode: 200, body: JSON.stringify({ ok: false, reason: "not-configured" }) };
  }

  const startedAt = Date.now();
  try {
    // head: true asks for the count and no rows, which is the smallest thing
    // that still makes the database do work.
    const { error, count } = await db()
      .from("orders")
      .select("order_id", { count: "exact", head: true });

    if (error) {
      // Loud on purpose. If this line appears, delivery is broken right now
      // and the next buyer is the one who finds out.
      console.error(`keep-awake: SUPABASE UNREACHABLE — ${error.message}`);
      return { statusCode: 200, body: JSON.stringify({ ok: false, error: error.message }) };
    }

    const ms = Date.now() - startedAt;
    console.log(`keep-awake: ok — ${count} order(s), ${ms}ms`);
    return { statusCode: 200, body: JSON.stringify({ ok: true, orders: count, ms }) };
  } catch (error) {
    console.error("keep-awake: SUPABASE UNREACHABLE — threw", error);
    return { statusCode: 200, body: JSON.stringify({ ok: false, error: String(error).slice(0, 200) }) };
  }
};
