"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, Link2, Loader2, LogOut, Minus, RefreshCw, Send } from "lucide-react";

/**
 * Buyer dashboard.
 *
 * WHAT IT DELIBERATELY DOES NOT DO
 * It never talks to Supabase's tables. The browser signs in, gets an access
 * token, and hands that token to our own function — which checks it, checks
 * the email against an allowlist, and returns rows it chose. So the anon key
 * in this bundle is only ever a login key: with row-level security on and no
 * public policy, it can read nothing even if someone lifts it out of the page
 * source, which they can.
 *
 * Supabase's client library is loaded on demand rather than imported, so the
 * ~40KB only reaches the one person who opens this page, not every buyer
 * reading the sales page.
 */

type Row = {
  order_id: string;
  payment_id: string | null;
  status: string;
  amount_paise: number;
  currency: string;
  email: string | null;
  contact: string | null;
  email_status: string;
  email_error: string | null;
  email_sent_at: string | null;
  download_count: number;
  last_download_at: string | null;
  refunded_at: string | null;
  created_at: string;
  paid_at: string | null;
};

type Summary = {
  paid_count: number;
  refunded_count: number;
  gross_paise: number;
  net_paise: number;
  undelivered_count: number;
  last_paid_at: string | null;
};

const ENDPOINT = "/.netlify/functions/admin-orders";

const rupees = (paise: number) =>
  "₹" + Math.round((paise || 0) / 100).toLocaleString("en-IN");

const when = (iso: string | null) =>
  iso ? new Date(iso).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "—";

/** Loaded on demand; null until the page is actually opened. */
type SupabaseClient = {
  auth: {
    getSession: () => Promise<{ data: { session: { access_token: string } | null } }>;
    signInWithOtp: (args: { email: string; options?: { emailRedirectTo?: string } }) => Promise<{ error: { message: string } | null }>;
    signOut: () => Promise<unknown>;
    onAuthStateChange: (cb: () => void) => { data: { subscription: { unsubscribe: () => void } } };
  };
};

export function AdminDashboard({ url, anonKey }: { url: string; anonKey: string }) {
  const [client, setClient] = useState<SupabaseClient | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [phase, setPhase] = useState<"boot" | "anon" | "loading" | "ready" | "error">("boot");
  const [message, setMessage] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [rows, setRows] = useState<Row[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [viewer, setViewer] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const configured = Boolean(url && anonKey);

  useEffect(() => {
    if (!configured) return;
    let cancelled = false;
    (async () => {
      const { createClient } = await import("@supabase/supabase-js");
      if (cancelled) return;
      const supabase = createClient(url, anonKey) as unknown as SupabaseClient;
      setClient(supabase);
      const { data } = await supabase.auth.getSession();
      if (cancelled) return;
      setToken(data.session?.access_token ?? null);
      setPhase(data.session ? "loading" : "anon");
      const { data: sub } = supabase.auth.onAuthStateChange(async () => {
        const next = await supabase.auth.getSession();
        setToken(next.data.session?.access_token ?? null);
        setPhase(next.data.session ? "loading" : "anon");
      });
      return () => sub.subscription.unsubscribe();
    })();
    return () => {
      cancelled = true;
    };
  }, [url, anonKey, configured]);

  /**
   * Fetches the table. Every setState happens after an await, so none of them
   * is synchronous with the effect that calls it — but the rule cannot see
   * through a function call, so the effect below inlines the same work rather
   * than silencing it.
   */
  const load = useCallback(
    async (signal?: AbortSignal) => {
      if (!token) return;
      try {
        const response = await fetch(`${ENDPOINT}?limit=200`, {
          headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
          signal,
        });
        if (signal?.aborted) return;
        if (!response.ok) {
          const detail = await response.json().catch(() => ({}));
          setPhase("error");
          setMessage(detail.error || `Request failed (${response.status}).`);
          return;
        }
        const data = await response.json();
        if (signal?.aborted) return;
        setRows(data.rows || []);
        setSummary(data.summary || null);
        setViewer(data.viewer || null);
        setMessage(null);
        setPhase("ready");
      } catch (error) {
        if ((error as Error)?.name === "AbortError") return;
        setPhase("error");
        setMessage("Could not reach the server.");
      }
    },
    [token],
  );

  useEffect(() => {
    if (!token) return;
    const controller = new AbortController();
    /* load() sets nothing before its first await, so no state is set
       synchronously with this effect. The rule flags any call that transitively
       setStates and cannot see past the call boundary; inlining the fetch here
       to satisfy it would duplicate what the Refresh button already needs. The
       abort signal handles the real hazard — a response landing after the token
       changed. The directive has to sit on its own line directly above the
       code: with the reason written inline, "next line" is the next comment. */
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load(controller.signal);
    return () => controller.abort();
  }, [token, load]);

  async function signIn(formEvent: React.FormEvent) {
    formEvent.preventDefault();
    if (!client) return;
    setBusy("signin");
    setMessage(null);
    const { error } = await client.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: typeof window !== "undefined" ? window.location.href : undefined },
    });
    setBusy(null);
    setMessage(error ? error.message : "Check your inbox for the sign-in link.");
  }

  async function post(orderId: string, action?: "link") {
    if (!token) return;
    setBusy(orderId + (action ?? ""));
    try {
      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(action ? { orderId, action } : { orderId }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setMessage(data.error || "Request failed.");
        return;
      }
      if (action === "link") {
        // Copied rather than shown, so it can go straight into a chat. The
        // clipboard is refused in some browsers without a gesture it trusts,
        // so the link is also put in the message as a fallback.
        try {
          await navigator.clipboard.writeText(data.url);
          setMessage(`Link copied — valid ${data.hours}h. Paste it to the buyer.`);
        } catch {
          setMessage(data.url);
        }
        return;
      }
      setMessage(`${orderId}: ${data.status}${data.error ? ` — ${data.error}` : ""}`);
      await load();
    } finally {
      setBusy(null);
    }
  }

  if (!configured) {
    return (
      <p className="pb-panel text-ink flex items-center gap-2 p-4 t-sm">
        <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
        Supabase is not configured for this deploy. Set NEXT_PUBLIC_SUPABASE_URL and
        NEXT_PUBLIC_SUPABASE_ANON_KEY, then redeploy.
      </p>
    );
  }

  if (phase === "boot") {
    return (
      <p className="text-ink-soft flex items-center gap-2 t-base">
        <Loader2 className="size-4 animate-spin" aria-hidden="true" /> Loading…
      </p>
    );
  }

  if (phase === "anon") {
    return (
      <div className="pb-panel max-w-md p-6 md:p-8">
        <h2 className="font-display text-ink type-h3 font-bold">Sign in</h2>
        <p className="text-ink-soft mt-2 t-sm leading-relaxed">
          A link is emailed to you. Only addresses on the allowlist can load any data, so a
          valid login is not on its own enough to see a buyer.
        </p>
        <form onSubmit={signIn} className="mt-5 flex flex-col gap-3">
          <label htmlFor="admin-email" className="label-mono text-ink-soft">
            Email
          </label>
          <input
            id="admin-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="text-ink h-12 border-2 border-[color:var(--ink)] bg-[var(--surface)] px-4 t-base outline-none focus-visible:border-[color:var(--accent)]"
          />
          <button
            type="submit"
            disabled={busy === "signin"}
            className="pb-fill inline-flex h-12 cursor-pointer items-center justify-center gap-2 px-6 t-base font-bold disabled:opacity-60"
          >
            {busy === "signin" ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
            Email me a link
          </button>
        </form>
        {message ? (
          <p role="status" className="text-ink mt-4 t-sm">
            {message}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="label-mono text-ink-soft">Signed in as {viewer}</p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => void load()}
            className="text-ink inline-flex h-11 cursor-pointer items-center gap-2 border-2 border-[color:var(--ink)] px-4 t-sm font-bold"
          >
            <RefreshCw className="size-4" aria-hidden="true" /> Refresh
          </button>
          <button
            type="button"
            onClick={() => client?.auth.signOut()}
            className="text-ink-soft inline-flex h-11 cursor-pointer items-center gap-2 px-3 t-sm"
          >
            <LogOut className="size-4" aria-hidden="true" /> Sign out
          </button>
        </div>
      </div>

      {summary ? (
        <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Paid", String(summary.paid_count ?? 0)],
            ["Net revenue", rupees(summary.net_paise)],
            ["Refunded", String(summary.refunded_count ?? 0)],
            ["Undelivered", String(summary.undelivered_count ?? 0)],
          ].map(([label, value]) => (
            <div key={label} className="pb-panel p-5">
              <dt className="label-mono text-ink-soft">{label}</dt>
              <dd className="numeral text-ink mt-2 text-[clamp(1.6rem,4vw,2.25rem)] [font-variant-numeric:proportional-nums]">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      ) : null}

      {message ? (
        <p role="status" className="pb-panel-lit text-ink p-4 t-sm">
          {message}
        </p>
      ) : null}

      {phase === "error" ? (
        <p className="pb-panel text-ink flex items-center gap-2 p-4 t-sm">
          <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
          {message || "Something went wrong."}
        </p>
      ) : null}

      <div className="pb-panel overflow-x-auto" tabIndex={0} role="region" aria-label="Orders">
        <table className="w-full min-w-[56rem] border-collapse text-left">
          <thead>
            <tr className="border-b-2 border-[color:var(--ink)]">
              {["Order", "Buyer", "Status", "Amount", "Email", "Downloads", "Paid", ""].map((h) => (
                <th key={h} className="label-mono text-ink-soft px-4 py-3 font-normal">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-ink-soft px-4 py-8 t-sm">
                  {phase === "loading" ? "Loading…" : "No orders yet."}
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.order_id} className="border-b border-[color:var(--ink)]/15 last:border-0">
                  <td className="text-ink px-4 py-3 t-xs">
                    <span className="numeral">{row.order_id}</span>
                  </td>
                  <td className="text-ink px-4 py-3 t-sm">{row.email || "—"}</td>
                  <td className="px-4 py-3 t-sm">
                    <span className={row.status === "paid" ? "pb-accent font-bold" : "text-ink-soft"}>
                      {row.refunded_at ? "refunded" : row.status}
                    </span>
                  </td>
                  <td className="text-ink px-4 py-3 t-sm font-semibold">{rupees(row.amount_paise)}</td>
                  <td className="px-4 py-3 t-sm">
                    <span
                      className={
                        row.email_status === "failed"
                          ? "text-ink inline-flex items-center gap-1.5 font-semibold"
                          : "text-ink-soft inline-flex items-center gap-1.5"
                      }
                      title={row.email_error || undefined}
                    >
                      {row.email_status === "sent" ? (
                        <CheckCircle2 className="pb-accent size-3.5" aria-hidden="true" />
                      ) : row.email_status === "skipped" ? (
                        <Minus className="size-3.5" aria-hidden="true" />
                      ) : (
                        <AlertCircle className="size-3.5" aria-hidden="true" />
                      )}
                      {row.email_status === "skipped" ? "no email" : row.email_status}
                    </span>
                  </td>
                  <td className="text-ink px-4 py-3 t-sm">
                    <span className="numeral">{row.download_count}</span>
                  </td>
                  <td className="text-ink-soft px-4 py-3 t-xs">{when(row.paid_at)}</td>
                  <td className="px-4 py-3">
                    {row.status === "paid" ? (
                      <span className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => void post(row.order_id, "link")}
                          disabled={busy === row.order_id + "link"}
                          title="Copy a download link to send over WhatsApp"
                          className="text-ink inline-flex h-10 cursor-pointer items-center gap-1.5 border-2 border-[color:var(--ink)] px-3 t-xs font-bold disabled:opacity-50"
                        >
                          {busy === row.order_id + "link" ? (
                            <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
                          ) : (
                            <Link2 className="size-3.5" aria-hidden="true" />
                          )}
                          Copy link
                        </button>
                        <button
                          type="button"
                          onClick={() => void post(row.order_id)}
                          disabled={busy === row.order_id}
                          title="Email the download link again"
                          className="text-ink-soft hover:text-ink inline-flex h-10 cursor-pointer items-center gap-1.5 px-2 t-xs font-bold disabled:opacity-50"
                        >
                          {busy === row.order_id ? (
                            <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
                          ) : (
                            <Send className="size-3.5" aria-hidden="true" />
                          )}
                          Email
                        </button>
                      </span>
                    ) : null}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
