"use client";

import { useEffect, useRef, useState } from "react";
import { metrics } from "@/config/proof";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { Asterisk } from "@/components/brand/decor";

/**
 * Track record band.
 *
 * The figures roll like an odometer rather than counting up. A plain count-up
 * reads as a number that happens to change; digit reels read as a mechanism,
 * and on a four-figure band that difference is the whole effect — the previous
 * version animated correctly and still went unnoticed.
 *
 * Each reel is 0-9 printed twice and translated to (10 + target), so every
 * digit makes one full revolution before it lands. Without the doubled strip a
 * digit whose target is 0 would travel nowhere and sit still while its
 * neighbours span, which is exactly the case for two of the three digits in
 * "500".
 *
 * Accessibility:
 *  - the true figure is rendered server-side in a visually-hidden span, so it
 *    is what a screen reader announces and what a no-JS visitor sees; the reels
 *    are aria-hidden and never announce intermediate values
 *  - under reduced motion no reel is built at all — the figure is simply
 *    printed, with no transform to settle
 *  - tabular-nums plus a fixed per-digit width stops the row reflowing as the
 *    digits change
 */
export function MetricsBand() {
  return (
    <section className="slab-dark on-dark relative isolate overflow-clip py-16 md:py-24">
      <div aria-hidden="true" className="bg-grid pointer-events-none absolute inset-0 opacity-[0.07]" />
      {/* Lime wash rising behind the figures, so the row sits in light rather
          than on a flat black field. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -bottom-1/3 -z-10 h-[90%] bg-[radial-gradient(60%_70%_at_50%_100%,rgba(199,242,60,0.22)_0%,rgba(199,242,60,0)_70%)]"
      />

      <div className="container-tl relative">
        <h2 className="label-mono text-lime flex items-center gap-2">
          <Asterisk className="size-3" />
          Track record
        </h2>

        <ul className="mt-10 grid gap-px overflow-hidden rounded-2xl bg-white/12 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric, index) => (
            <li
              key={metric.label}
              className="group/metric bg-deep relative flex flex-col gap-2 p-7 transition-colors duration-500 ease-out hover:bg-[#162116] md:p-8"
            >
              <Odometer
                value={metric.value}
                suffix={metric.suffix}
                delay={index * 140}
              />
              <p className="font-display t-lead font-bold text-white">
                {metric.label}
              </p>
              <p className="t-sm leading-relaxed text-white/60">{metric.detail}</p>

              {/* Lime rule that draws across the cell on hover. */}
              <span
                aria-hidden="true"
                className="bg-lime absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-safe:group-hover/metric:scale-x-100"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

const DIGITS = Array.from({ length: 20 }, (_, i) => i % 10);

function Odometer({
  value,
  suffix,
  delay,
}: {
  value: number;
  suffix?: string;
  delay: number;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const [rolled, setRolled] = useState(false);

  useEffect(() => {
    if (reduced) return;
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        observer.disconnect();
        setRolled(true);
      },
      { threshold: 0.35 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [reduced]);

  const digits = String(value).split("");

  return (
    <span ref={ref} className="numeral numeral-lg text-lime leading-none">
      <span className="sr-only">
        {value}
        {suffix}
      </span>

      <span aria-hidden="true" className="flex items-end tabular-nums">
        {reduced ? (
          <>
            {value}
            {suffix}
          </>
        ) : (
          <>
            {digits.map((digit, index) => (
              <span
                key={index}
                className="relative inline-block h-[1em] overflow-hidden"
                style={{ width: "0.62em" }}
              >
                <span
                  className="absolute inset-x-0 top-0 flex flex-col transition-transform duration-[1600ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{
                    // em, NOT %. A percentage translateY resolves against
                    // the element's OWN height, and this reel is 20 rows tall
                    // — so -1500% travelled 300em and put every digit off
                    // screen. Each row is exactly 1em, so em maps 1:1 to rows.
                    transform: rolled
                      ? `translateY(-${10 + Number(digit)}em)`
                      : "translateY(0)",
                    transitionDelay: `${delay + index * 90}ms`,
                  }}
                >
                  {DIGITS.map((d, i) => (
                    <span key={i} className="block h-[1em] text-center leading-[1em]">
                      {d}
                    </span>
                  ))}
                </span>
              </span>
            ))}
            {suffix}
          </>
        )}
      </span>
    </span>
  );
}
