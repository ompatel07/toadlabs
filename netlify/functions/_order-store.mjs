import { getStore } from "@netlify/blobs";
import { db, dbConfigured } from "./_orders-db.mjs";

/**
 * The order record — the thing that decides whether a buyer may download.
 *
 * WHY THIS IS NOT JUST NETLIFY BLOBS ANY MORE
 * It was. On the live site every read threw MissingBlobsEnvironmentError:
 * Blobs is not available there, and the whole delivery chain read from it. A
 * payment would succeed and the download would never appear, because
 * order-status could not answer "is this paid".
 *
 * So Supabase is now the store when it is configured, and Blobs is the
 * fallback. Supabase is already required for the dashboard, already verified
 * working, and one less service that has to be alive for a sale to complete.
 *
 * Reads try both and take whichever answers. Writes go to both when both are
 * available, because a record that exists in only one place is a record that
 * disappears the day the other is the one being read.
 */

/** Blobs, or null when it is unavailable — which is not an error here. */
function blobs() {
  try {
    return getStore({ name: "playbook-orders", consistency: "strong" });
  } catch {
    return null;
  }
}

/** Supabase columns -> the shape the functions already pass around. */
function fromRow(row) {
  if (!row) return null;
  return {
    orderId: row.order_id,
    paymentId: row.payment_id,
    status: row.status,
    amount: row.amount_paise,
    currency: row.currency,
    email: row.email,
    contact: row.contact,
    paidAt: row.paid_at,
    createdAt: row.created_at,
  };
}

/** The record, from whichever store has it. Never throws. */
export async function getOrder(orderId) {
  if (dbConfigured()) {
    try {
      const { data, error } = await db()
        .from("orders")
        .select("order_id, payment_id, status, amount_paise, currency, email, contact, paid_at, created_at")
        .eq("order_id", orderId)
        .maybeSingle();
      if (!error && data) return fromRow(data);
    } catch (error) {
      console.error(`order-store: supabase read failed for ${orderId}`, error);
    }
  }

  const store = blobs();
  if (!store) return null;
  try {
    return await store.get(orderId, { type: "json" });
  } catch (error) {
    console.error(`order-store: blob read failed for ${orderId}`, error);
    return null;
  }
}

/**
 * Writes the record everywhere it can. Returns true when at least one store
 * accepted it, so a caller that must know the record survived can check —
 * the webhook does, because an order it cannot record is one a buyer cannot
 * download.
 */
export async function putOrder(orderId, record) {
  let stored = false;

  if (dbConfigured()) {
    try {
      const { error } = await db()
        .from("orders")
        .upsert(
          {
            order_id: orderId,
            payment_id: record.paymentId ?? null,
            status: record.status,
            amount_paise: record.amount,
            currency: record.currency,
            email: record.email ?? null,
            contact: record.contact ?? null,
            paid_at: record.paidAt ?? null,
            created_at: record.createdAt ?? undefined,
          },
          { onConflict: "order_id" },
        );
      if (error) console.error(`order-store: supabase write failed for ${orderId}`, error.message);
      else stored = true;
    } catch (error) {
      console.error(`order-store: supabase write threw for ${orderId}`, error);
    }
  }

  const store = blobs();
  if (store) {
    try {
      await store.setJSON(orderId, record);
      stored = true;
    } catch (error) {
      console.error(`order-store: blob write failed for ${orderId}`, error);
    }
  }

  return stored;
}

/** True when at least one store is usable, for a clear error at the edge. */
export const storeAvailable = () => dbConfigured() || blobs() !== null;
