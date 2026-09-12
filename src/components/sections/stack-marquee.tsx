"use client";

import { useState } from "react";
import { Pause, Play } from "lucide-react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { techStack } from "@/config/home";
import { cn } from "@/lib/utils";

/**
 * Tech stack band.
 *
 * The ink band renders in BOTH states. An earlier version fell back to a plain
 * wrapped list under reduced motion, which put white chip text straight onto
 * the light canvas — invisible. Keeping the band means the reduced-motion view
 * is the same design, just not moving, rather than a degraded one.
 *
 * Accessibility:
 *  - the real list is in the DOM once; the visual duplicate is aria-hidden
 *  - CSS pauses on hover and focus-within
 *  - an explicit control satisfies WCAG 2.2.2; hover alone does not
 *  - under reduced motion the band wraps to show every item, with no rotation
 *    (a rotated multi-line band reads as broken) and no pause control, since
 *    there is nothing to pause
 */
export function StackMarquee() {
  const reduceMotion = useReducedMotion();
  const [paused, setPaused] = useState(false);

  return (
    // overflow-x-clip is load-bearing: the animated band is rotated and
    // over-scaled, so its bounding box is wider than the viewport.
    <section
      aria-labelledby="stack-heading"
      className="relative overflow-x-clip py-16 md:py-24"
    >
      <div className="container-tl mb-6 flex items-center justify-between gap-4">
        <h2 id="stack-heading" className="label-mono text-ink-soft">
          What we build with
        </h2>

        {!reduceMotion ? (
          <button
            type="button"
            onClick={() => setPaused((value) => !value)}
            aria-pressed={paused}
            className="text-ink-soft hover:text-ink inline-flex h-9 cursor-pointer items-center gap-2 rounded-full px-3 text-sm transition-colors duration-200 ease-out hover:bg-[rgba(11,12,10,0.05)]"
          >
            {paused ? (
              <Play className="size-3.5" aria-hidden="true" />
            ) : (
              <Pause className="size-3.5" aria-hidden="true" />
            )}
            {paused ? "Play" : "Pause"}
            <span className="sr-only">stack animation</span>
          </button>
        ) : null}
      </div>

      <div
        className={cn(
          "bg-ink border-ink border-y-2 py-4",
          !reduceMotion && "marquee-band",
        )}
      >
        {reduceMotion ? (
          <div className="container-tl">
            <ul className="flex flex-wrap items-center gap-x-7 gap-y-2">
              {techStack.map((item) => (
                <StackChip key={item} label={item} />
              ))}
            </ul>
          </div>
        ) : (
          <div className="marquee-viewport relative flex overflow-hidden">
            <ul
              className={cn(
                "animate-marquee flex shrink-0 items-center gap-8 pr-8",
                paused && "[animation-play-state:paused]",
              )}
            >
              {techStack.map((item) => (
                <StackChip key={item} label={item} />
              ))}
            </ul>
            <ul
              aria-hidden="true"
              className={cn(
                "animate-marquee flex shrink-0 items-center gap-8 pr-8",
                paused && "[animation-play-state:paused]",
              )}
            >
              {techStack.map((item) => (
                <StackChip key={`${item}-duplicate`} label={item} />
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

/** Always sits on the ink band, so white is always the correct colour. */
function StackChip({ label }: { label: string }) {
  return (
    <li className="font-display type-h3 flex shrink-0 items-center gap-7 font-bold whitespace-nowrap text-white">
      {label}
      <span
        aria-hidden="true"
        className="bg-lime inline-block size-1.5 shrink-0 rounded-full"
      />
    </li>
  );
}
