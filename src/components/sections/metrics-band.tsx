"use client";

import { useEffect, useRef, useState } from "react";
import { metrics } from "@/config/proof";
import { Asterisk } from "@/components/brand/decor";

/**
 * Track record.
 *
 * Was four equal cells in a row: every figure claiming the same weight, so the
 * eye assigned none of them any, and the number that actually matters — how
 * much work has shipped — read as one item in a list.
 *
 * Now the lead figure dominates at display scale with a ghost copy of itself
 * outlined behind it, and the other three sit as a hairline index beside it.
 * A hierarchy is a design decision; a 4-up grid is the absence of one.
 *
 * MOTION POLICY
 * The reels run for everyone. prefers-reduced-motion is for large, fast,
 * directional movement that can trigger a vestibular response — a digit
 * turning over inside its own em box is none of those, and gating it meant
 * anyone with the OS setting on saw a static site with no indication anything
 * was ever meant to move. Parallax and page-scale drift stay gated; this does
 * not. (Tier definitions are in globals.css.)
 *
 * Each reel is 0-9 printed twice and translated to (10 + target), so every
 * digit makes a full revolution before it lands. Without the doubled strip a
 * digit whose target is 0 travels nowhere and sits still while its neighbours
 * spin — which is two of the three digits in "500".
 *
 * The true figure stays in a visually-hidden span, so assistive tech and a
 * no-JS render get the number and never the intermediate digits.
 */
export function MetricsBand() {
  const [lead, ...rest] = metrics;

  return (
    <section className="slab-dark on-dark vignette relative isolate overflow-clip py-16 md:py-24">
      <div aria-hidden="true" className="tex-circuit pointer-events-none absolute inset-0 opacity-[0.07]" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-1/4 left-0 -z-10 h-[85%] w-[70%] bg-[radial-gradient(60%_70%_at_30%_100%,rgba(60,230,141,0.26)_0%,rgba(60,230,141,0)_70%)]"
      />

      <div className="container-tl relative">
        <h2 className="label-mono text-lime flex items-center gap-2">
          <Asterisk className="size-3" />
          Track record
        </h2>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-16">
          {/* Lead figure. */}
          <div className="relative">
            {/* Outlined ghost of the same number, bled off the left edge. */}
            <span
              aria-hidden="true"
              className="numeral pointer-events-none absolute -top-6 -left-[6%] -z-10 text-[clamp(9rem,20vw,17rem)] leading-none whitespace-nowrap select-none"
              style={{ WebkitTextStroke: "1.5px rgba(60, 230, 141,0.16)", color: "transparent" }}
            >
              {lead.value}
            </span>

            <Odometer
              value={lead.value}
              suffix={lead.suffix}
              delay={0}
              className="text-[clamp(5rem,13vw,11rem)]"
            />

            <p className="font-display mt-4 type-h3 font-bold text-ink">
              {lead.label}
            </p>
            <p className="measure mt-3 t-base leading-relaxed text-white/60">
              {lead.detail}
            </p>
          </div>

          {/* Supporting figures as a hairline index. */}
          <ul className="border-t border-white/15">
            {rest.map((metric, index) => (
              <li
                key={metric.label}
                className="group/row grid grid-cols-[auto_1fr] items-baseline gap-5 border-b border-white/15 py-6 transition-colors duration-400 ease-out hover:bg-white/[0.04] md:gap-8"
              >
                <Odometer
                  value={metric.value}
                  suffix={metric.suffix}
                  delay={240 + index * 160}
                  className="text-[clamp(2.75rem,6vw,4.25rem)]"
                />
                <div>
                  <p className="font-display t-lead font-bold text-ink transition-transform duration-400 ease-out md:group-hover/row:translate-x-1.5">
                    {metric.label}
                  </p>
                  <p className="mt-1.5 t-sm leading-relaxed text-white/55">
                    {metric.detail}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

const DIGITS = Array.from({ length: 20 }, (_, i) => i % 10);

function Odometer({
  value,
  suffix,
  delay,
  className,
}: {
  value: number;
  suffix?: string;
  delay: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [rolled, setRolled] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        observer.disconnect();
        setRolled(true);
      },
      { threshold: 0.3 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const digits = String(value).split("");

  return (
    <span
      ref={ref}
      className={`numeral text-lime block leading-none ${className ?? ""}`}
    >
      <span className="sr-only">
        {value}
        {suffix}
      </span>

      <span aria-hidden="true" className="flex items-end tabular-nums">
        {digits.map((digit, index) => (
          <span
            key={index}
            className="relative inline-block h-[1em] overflow-hidden"
            style={{ width: "0.62em" }}
          >
            <span
              className="absolute inset-x-0 top-0 flex flex-col transition-transform duration-[1700ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                // em, NOT %. A percentage translateY resolves against the
                // element's OWN height, and this reel is 20 rows tall — so
                // -1500% travelled 300em and put every digit off screen. Each
                // row is exactly 1em, so em maps 1:1 to rows.
                transform: rolled
                  ? `translateY(-${10 + Number(digit)}em)`
                  : "translateY(0)",
                transitionDelay: `${delay + index * 100}ms`,
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
      </span>
    </span>
  );
}
