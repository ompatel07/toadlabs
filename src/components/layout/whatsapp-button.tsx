"use client";

import { useEffect, useState } from "react";
import { MessageCircle, X } from "lucide-react";

/**
 * Floating WhatsApp button.
 *
 * It links to /.netlify/functions/whatsapp rather than to wa.me directly. A
 * wa.me href would put the number back into the markup of every page, which is
 * the whole thing we took it out of — the redirect keeps it in an environment
 * variable until somebody clicks.
 *
 * It is a real link, not a button that calls window.open: middle-click and
 * "open in new tab" work, and it survives the JavaScript failing to load.
 *
 * The prompt beside it appears once per session and only after the reader has
 * been on the page a while. A bubble that arrives the moment a page loads is
 * an interruption; one that waits until somebody has read a screen or two is
 * an offer.
 */

const KEY = "offscript:wa-prompt-seen";
const DELAY_MS = 12_000;

export function WhatsAppButton({ topic = "default" }: { topic?: string }) {
  const [prompting, setPrompting] = useState(false);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(KEY) === "1";
    } catch {
      // Private mode: treat as unseen. Worst case it offers once more.
    }
    if (seen) return;

    const timer = window.setTimeout(() => {
      setPrompting(true);
      try {
        sessionStorage.setItem(KEY, "1");
      } catch {
        /* nothing to do: the prompt simply reappears next session */
      }
    }, DELAY_MS);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="wa-dock pointer-events-none fixed z-40 flex flex-col items-end gap-2.5">
      {prompting ? (
        <div className="wa-prompt pointer-events-auto flex max-w-[16rem] items-start gap-3 rounded-2xl rounded-br-sm px-4 py-3">
          <p className="t-sm leading-snug font-medium">
            Questions before you buy? Message us — we reply to every one.
          </p>
          <button
            type="button"
            onClick={() => setPrompting(false)}
            aria-label="Dismiss"
            className="-mt-1 -mr-1 inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full opacity-60 transition-opacity hover:opacity-100"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
      ) : null}

      <a
        href={`/.netlify/functions/whatsapp?topic=${encodeURIComponent(topic)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="wa-fab pointer-events-auto inline-flex size-14 cursor-pointer items-center justify-center rounded-full transition-transform duration-200 ease-out hover:-translate-y-0.5"
      >
        <MessageCircle className="size-6" strokeWidth={2.2} aria-hidden="true" />
        <span className="sr-only">Message us on WhatsApp (opens in a new tab)</span>
      </a>
    </div>
  );
}
