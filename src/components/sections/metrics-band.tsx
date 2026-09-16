"use client";

import { useEffect, useRef, useState } from "react";
import { metrics } from "@/config/proof";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { Asterisk } from "@/components/brand/decor";

/**
 * Track record band.
 *
 * Numbers at display size on the dark slab, counting up once when the band
 * first enters view. The count-up is not decoration — a number that animates
 * to its value is read, where a number that is simply present is skimmed — but
 * it runs once and never loops, so it is not a persistent distraction.
 *
 * Accessibility:
 *  - the final value is rendered on the server and is what a screen reader
 *    announces; the animation only ever rewrites a visually-hidden-from-AT
 *    span, so assistive tech never hears the intermediate numbers
 *  - under reduced motion the count-up is skipped entirely and the figure is
 *    painted at its final value on first paint
 *  - tabular-nums keeps the digits from reflowing as they change, which is
 *    what makes a counter look engineered rather than jittery
 */
export function MetricsBand() {
  return (
    <section className="slab-dark on-dark relative overflow-hidden py-16 md:py-24">
      {/* Oversized ghost rule behind the figures. */}
      <div aria-hidden="true" className="bg-grid pointer-events-none absolute inset-0 opacity-[0.07]" />

      <div className="container-tl relative">
        <h2 className="label-mono text-lime flex items-center gap-2">
          <Asterisk className="size-3" />
          Track record
        </h2>

        <ul className="mt-10 grid gap-px overflow-hidden rounded-2xl bg-white/12 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric, index) => (
            <li key={metric.label} className="bg-deep flex flex-col gap-2 p-7 md:p-8">
              <Counter
                value={metric.value}
                suffix={metric.suffix}
                delay={index * 110}
              />
              <p className="font-display t-lead font-bold text-white">
                {metric.label}
              </p>
              <p className="t-sm leading-relaxed text-white/60">{metric.detail}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Counter({
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
  const [shown, setShown] = useState(value);
  const hasRun = useRef(false);

  useEffect(() => {
    if (reduced) {
      setShown(value);
      return;
    }

    const node = ref.current;
    if (!node) return;

    // Start from zero only once we know the animation will run, so that a
    // no-JS or no-IntersectionObserver render keeps the real figure.
    setShown(0);

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || hasRun.current) return;
        hasRun.current = true;
        observer.disconnect();

        const DURATION = 1400;
        let frame = 0;
        let start: number | null = null;

        const step = (now: number) => {
          if (start === null) start = now;
          const elapsed = now - start - delay;
          if (elapsed < 0) {
            frame = requestAnimationFrame(step);
            return;
          }
          const t = Math.min(elapsed / DURATION, 1);
          // Ease-out cubic: fast at first, settling into the final figure.
          const eased = 1 - Math.pow(1 - t, 3);
          setShown(Math.round(value * eased));
          if (t < 1) frame = requestAnimationFrame(step);
        };

        frame = requestAnimationFrame(step);
        cleanup = () => cancelAnimationFrame(frame);
      },
      { threshold: 0.4 },
    );

    let cleanup = () => {};
    observer.observe(node);
    return () => {
      observer.disconnect();
      cleanup();
    };
  }, [value, delay, reduced]);

  return (
    <span ref={ref} className="numeral numeral-lg text-lime leading-none">
      {/* The true figure, for assistive tech and for a no-JS render. */}
      <span className="sr-only">
        {value}
        {suffix}
      </span>
      <span aria-hidden="true" className="tabular-nums">
        {shown}
        {suffix}
      </span>
    </span>
  );
}
