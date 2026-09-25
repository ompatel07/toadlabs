"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Download, Loader2, MessageCircle } from "lucide-react";
import { thankYou } from "@/config/playbook";
import { siteConfig, whatsappUrl } from "@/config/site";

/**
 * Order confirmation.
 *
 * The browser being redirected here proves nothing — anyone can open this URL
 * with any order id. So the page asks the server, which only answers "paid"
 * for an order the verified webhook has marked paid, and only then hands back
 * a signed, expiring download link.
 *
 * It polls briefly because the webhook and the redirect race: the buyer is
 * often here a second before Razorpay's call lands.
 */

type State =
  | { phase: "checking" }
  | { phase: "paid"; url: string }
  | { phase: "unconfirmed" };

const ATTEMPTS = 10;
const GAP_MS = 2000;

export function OrderStatus() {
  const [state, setState] = useState<State>({ phase: "checking" });

  useEffect(() => {
    const orderId = new URLSearchParams(window.location.search).get("order_id");
    let stop = false;
    let timer = 0;

    const ask = async (attempt: number) => {
      // No order id means this page was opened directly rather than after a
      // payment: there is nothing to confirm.
      if (!orderId) {
        if (!stop) setState({ phase: "unconfirmed" });
        return;
      }
      try {
        const response = await fetch(
          `/.netlify/functions/order-status?order_id=${encodeURIComponent(orderId)}`,
          { headers: { Accept: "application/json" } },
        );
        if (response.ok) {
          const data = (await response.json()) as { paid?: boolean; downloadUrl?: string };
          if (data.paid && data.downloadUrl) {
            if (!stop) setState({ phase: "paid", url: data.downloadUrl });
            return;
          }
        }
      } catch {
        /* keep trying: a dropped request is not a failed payment */
      }
      if (stop) return;
      if (attempt >= ATTEMPTS) {
        setState({ phase: "unconfirmed" });
        return;
      }
      timer = window.setTimeout(() => ask(attempt + 1), GAP_MS);
    };

    ask(1);
    return () => {
      stop = true;
      window.clearTimeout(timer);
    };
  }, []);

  if (state.phase === "checking") {
    return (
      <div className="pb-panel flex flex-col gap-4 p-8" role="status" aria-live="polite">
        <Loader2 className="pb-accent size-7 animate-spin" aria-hidden="true" />
        <h1 className="font-display text-ink type-h2 font-bold">{thankYou.pending}</h1>
        <p className="text-ink-soft measure t-base">{thankYou.pendingNote}</p>
      </div>
    );
  }

  if (state.phase === "paid") {
    return (
      <div className="pb-panel-lit flex flex-col items-start gap-5 p-8" role="status">
        <span className="pb-fill inline-flex size-14 items-center justify-center rounded-lg">
          <CheckCircle2 className="size-7" strokeWidth={2} aria-hidden="true" />
        </span>
        <h1 className="font-display text-ink type-h2 font-bold">{thankYou.headline}</h1>
        <p className="text-ink-soft measure t-lead">{thankYou.sub}</p>

        <a
          href={state.url}
          className="pb-fill inline-flex h-14 cursor-pointer items-center justify-center gap-2 rounded-full px-8 text-base font-bold"
        >
          <Download className="size-4" aria-hidden="true" />
          {thankYou.downloadCta}
        </a>
        <p className="text-ink-soft t-xs">{thankYou.linkNote}</p>
      </div>
    );
  }

  return (
    <div className="pb-panel flex flex-col items-start gap-5 p-8" role="status">
      <h1 className="font-display text-ink type-h2 font-bold">{thankYou.failed}</h1>
      <p className="text-ink-soft measure t-base">{thankYou.failedNote}</p>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-ink inline-flex h-12 cursor-pointer items-center gap-2 rounded-full border border-[rgba(255,255,255,0.2)] px-6 t-base font-medium transition-colors duration-200 ease-out hover:border-[rgba(255,255,255,0.4)]"
      >
        <MessageCircle className="size-4" aria-hidden="true" />
        WhatsApp {siteConfig.phoneDisplay}
        <span className="sr-only">(opens in a new tab)</span>
      </a>
    </div>
  );
}
