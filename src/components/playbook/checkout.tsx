"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Lock, ShieldCheck } from "lucide-react";
import { assets, checkout, guarantee, priceReveal, product } from "@/config/playbook";

/**
 * Razorpay checkout.
 *
 * WHAT THIS FILE IS NOT ALLOWED TO DO
 * It never holds a key secret and it never decides the price. The browser
 * sends nothing but an intent to buy; the Netlify Function reads the amount
 * from its own constant, creates the order with Razorpay, and returns only the
 * order id and the public key id. A tampered client can change nothing that
 * matters — an order created for a different amount would not match the one
 * the webhook later verifies.
 *
 * The success handler here is a convenience redirect, not proof of payment.
 * The webhook is the only thing that marks an order paid, and the thank-you
 * page asks the server, never the URL.
 */

const SDK = "https://checkout.razorpay.com/v1/checkout.js";

/** The listed price in paise, to compare against what the server quoted. */
const PRICE_PAISE = product.price * 100;

type Status = "idle" | "loading" | "open" | "error";

interface RazorpayOptions {
  key: string;
  order_id: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image?: string;
  theme?: { color?: string };
  prefill?: { email?: string; contact?: string };
  notes?: Record<string, string>;
  handler: (response: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => void;
  modal?: { ondismiss?: () => void };
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => { open: () => void };
  }
}

/**
 * One shared attempt at loading the SDK.
 *
 * The obvious version — look for an existing <script> and wait for its load
 * event — hangs on the second click: the tag is already loaded, the event
 * fired long ago, and a listener added now never hears it. So the promise is
 * remembered instead of the element, and a timeout turns a dead network into
 * a visible error rather than a button that spins forever.
 */
let sdkPromise: Promise<void> | null = null;

function loadSdk(): Promise<void> {
  if (window.Razorpay) return Promise.resolve();

  if (!sdkPromise) {
    sdkPromise = new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = SDK;
      script.async = true;
      script.onload = () =>
        window.Razorpay ? resolve() : reject(new Error("sdk-loaded-but-absent"));
      script.onerror = () => {
        sdkPromise = null; // let a later click try again
        script.remove();
        reject(new Error("sdk-network"));
      };
      document.head.appendChild(script);
    });
  }

  return Promise.race([
    sdkPromise,
    new Promise<void>((_, reject) =>
      setTimeout(() => reject(new Error("sdk-timeout")), 12000),
    ),
  ]);
}

export function PlaybookCheckout() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [testAmount, setTestAmount] = useState<number | null>(null);
  const alive = useRef(true);

  useEffect(() => () => { alive.current = false; }, []);

  /* THE LIVE TEST KEY.
     Read from the URL rather than built in, so an ordinary visitor's page has
     no trace of it: no param, no key sent, full price. It is passed straight
     to the function and never rendered, logged or stored — the only thing that
     reaches the screen is the amount the server came back with.

     Read in an effect because this page is statically exported: the markup is
     identical for everyone, and the URL is only consulted in the browser. */
  const testKey = useRef("");
  useEffect(() => {
    testKey.current = new URLSearchParams(window.location.search).get("t") || "";
  }, []);

  const pay = useCallback(async () => {
    if (status === "loading" || status === "open") return;
    setStatus("loading");
    setMessage(null);

    try {
      await loadSdk();

      const response = await fetch("/.netlify/functions/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // The amount, currency and product are decided by the function;
        // anything sent from here would have to be ignored. The one exception
        // is the test key, which does not set a price — it only proves the
        // caller holds a secret the server already knows, and the server picks
        // the amount either way.
        body: JSON.stringify(testKey.current ? { testKey: testKey.current } : {}),
      });
      if (!response.ok) throw new Error("order");
      const order = (await response.json()) as {
        orderId: string;
        amount: number;
        currency: string;
        keyId: string;
      };
      if (!order.orderId || !order.keyId) throw new Error("order");
      if (!alive.current) return;
      // Show what is actually about to be charged whenever it is not the
      // listed price. A test that silently charges a different number is a
      // test you cannot trust the result of.
      setTestAmount(order.amount === PRICE_PAISE ? null : order.amount);
      // Never leave the button mid-spin: if the SDK is somehow not here, that
      // is an error the buyer should see, not a silent no-op.
      if (!window.Razorpay) throw new Error("sdk-absent");

      const checkoutInstance = new window.Razorpay({
        key: order.keyId,
        order_id: order.orderId,
        amount: order.amount,
        currency: order.currency,
        name: "OFFSCRIPT",
        description: product.name,
        // Built from the live origin rather than a configured domain, so it
        // resolves on a Netlify preview as well as on the real site.
        image: `${window.location.origin}/icon.png`,
        theme: { color: "#3fd9e8" },
        notes: { product: "playbook" },
        handler: (result) => {
          // Still not proof of payment — the server decides that. But carrying
          // Razorpay's signature means the thank-you page can prove it is the
          // buyer rather than merely someone holding an order id, which is what
          // the server now requires before it will hand over a download link.
          const query = new URLSearchParams({
            order_id: result.razorpay_order_id,
            payment_id: result.razorpay_payment_id,
            signature: result.razorpay_signature,
          });
          router.push(`/playbook/thank-you/?${query.toString()}`);
        },
        modal: {
          ondismiss: () => {
            if (alive.current) setStatus("idle");
          },
        },
      });

      setStatus("open");
      checkoutInstance.open();
    } catch {
      if (!alive.current) return;
      setStatus("error");
      setMessage(checkout.errors.start);
    }
  }, [router, status]);

  const busy = status === "loading" || status === "open";

  return (
    <div className="pb-panel-lit flex flex-col gap-5 p-6 md:p-8">
      {testAmount !== null && (
        <p className="label-mono rounded-lg border-2 border-[color:var(--accent)] px-3 py-2 text-[color:var(--accent)]">
          Test checkout — you will be charged ₹{(testAmount / 100).toLocaleString("en-IN")}, not {product.priceLabel}
        </p>
      )}

      <div className="flex items-baseline gap-3">
        <span className="numeral text-ink text-[clamp(2.2rem,8vw,3rem)] leading-none font-bold [font-variant-numeric:proportional-nums]">
          {product.priceLabel}
        </span>
        <span className="text-ink-soft t-sm">{product.priceNote}</span>
      </div>

      <ul className="flex flex-wrap gap-x-4 gap-y-1">
        {product.terms.map((term) => (
          <li key={term} className="label-mono pb-accent">
            {term}
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={pay}
        aria-busy={busy}
        className="pb-fill inline-flex h-14 w-full cursor-pointer items-center justify-center gap-2 rounded-full px-8 text-base font-bold transition-transform duration-200 ease-out hover:-translate-y-0.5 aria-busy:opacity-80"
      >
        {busy ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            {checkout.processing}
          </>
        ) : (
          <>
            <Lock className="size-4" aria-hidden="true" />
            {checkout.button}
          </>
        )}
      </button>

      <p role="status" aria-live="polite" className="text-ink-soft t-xs">
        {message ?? checkout.secure}
      </p>

      <ul className="flex flex-col gap-3 border-t border-[color:var(--ink)]/20 pt-5">
        {checkout.trust.map((item) => (
          <li key={item.title} className="flex items-start gap-3">
            <ShieldCheck className="pb-accent mt-0.5 size-4 shrink-0" strokeWidth={2.2} aria-hidden="true" />
            <span className="t-sm">
              <span className="text-ink font-semibold">{item.title}. </span>
              <span className="text-ink-soft">{item.copy}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * The price reveal.
 *
 * This is the first and only place on the page where the number appears. The
 * page above it has to do the selling; this section just recaps what is in the
 * box, gives the number some context, and takes the payment.
 */
export function PlaybookCheckoutSection() {
  return (
    <section
      id="price"
      aria-label="What it costs"
      className="pb-grain scroll-mt-16 border-t-2 border-[color:var(--ink)] py-14 md:py-20"
    >
      <div className="mx-auto w-full max-w-[72rem] px-5 md:px-8">
        <p className="label-mono pb-accent flex items-center gap-2.5">
          <span aria-hidden="true" className="inline-block h-px w-6 bg-[color:var(--accent)]" />
          {priceReveal.eyebrow}
        </p>
        <h2 className="font-display text-ink mt-5 text-[clamp(2rem,7vw,3.5rem)] leading-[1.02] font-extrabold tracking-[-0.03em] text-balance">
          {priceReveal.headline}
        </h2>
        <p className="text-ink-soft measure mt-5 t-lead leading-relaxed">{priceReveal.lead}</p>

        <div className="mt-10 grid gap-3 lg:grid-cols-[1.1fr_1fr] lg:gap-8 lg:items-start">
          <div className="flex flex-col gap-3">
            <div className="pb-seal p-6 md:p-8">
              <p className="label-mono pb-accent flex items-center gap-2.5">
                <ShieldCheck className="size-4" strokeWidth={2.4} aria-hidden="true" />
                {guarantee.badge}
              </p>
              <h3 className="font-display text-ink mt-4 text-[clamp(1.6rem,4.5vw,2.25rem)] leading-[1.05] font-extrabold tracking-[-0.02em] text-balance">
                {guarantee.headline}
              </h3>
              <p className="text-ink-soft mt-4 t-base leading-relaxed">{guarantee.copy}</p>

              {/* The condition sits with the claim, not below a fold. It is what
                  makes the guarantee a guarantee rather than a slogan. */}
              <div className="mt-6 rounded-xl border border-[color:var(--ink)] bg-[var(--surface-2)] p-5">
                <p className="label-mono text-ink-soft">{guarantee.proofTitle}</p>
                <ul className="mt-3 flex flex-col gap-2.5">
                  {guarantee.proof.map((item) => (
                    <li key={item} className="text-ink flex items-start gap-3 t-sm">
                      <Check className="pb-accent mt-0.5 size-4 shrink-0" strokeWidth={3} aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <ul className="mt-5 flex flex-col gap-2 border-t border-[color:var(--ink)]/20 pt-5">
                {guarantee.conditions.map((condition) => (
                  <li key={condition} className="text-ink-soft flex items-start gap-3 t-sm">
                    <span
                      aria-hidden="true"
                      className="mt-[0.55em] inline-block size-1.5 shrink-0 rounded-full bg-[color:var(--accent)]"
                    />
                    {condition}
                  </li>
                ))}
              </ul>

              <p className="text-ink-soft mt-5 border-t border-[color:var(--ink)]/20 pt-5 t-xs leading-relaxed">
                {guarantee.honest}
              </p>
            </div>

            <div className="pb-panel p-6 md:p-8">
              <h3 className="font-display text-ink t-lead font-bold">{priceReveal.recapTitle}</h3>
              <ul className="mt-5 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-1">
                {assets.map((asset) => (
                  <li key={asset.id} className="text-ink-soft flex items-baseline gap-3 t-sm">
                    <span aria-hidden="true" className="pb-accent">
                      —
                    </span>
                    <span>
                      <span className="text-ink font-medium">{asset.name}</span> · {asset.format}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="text-ink-soft mt-6 border-t-2 border-[color:var(--ink)] pt-5 t-xs">
                {checkout.afterNote}
              </p>
            </div>

          </div>

          <div className="lg:sticky lg:top-12">
            <PlaybookCheckout />
          </div>
        </div>
      </div>
    </section>
  );
}
