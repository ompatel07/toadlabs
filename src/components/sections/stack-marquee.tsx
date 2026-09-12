"use client";

import { useState } from "react";
import { Pause, Play } from "lucide-react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { techStack } from "@/config/home";
import { cn } from "@/lib/utils";

/**
 * Tech stack marquee — an angled lime band across the page.
 *
 * Accessibility, unchanged from the plainer version:
 *  - the real list is in the DOM once; the visual duplicate is aria-hidden
 *  - CSS pauses on hover and focus-within
 *  - an explicit control satisfies WCAG 2.2.2; hover alone does not
 *  - under reduced motion it renders static and the control is withdrawn
 */
export function StackMarquee() {
  const reduceMotion = useReducedMotion();
  const [paused, setPaused] = useState(false);

  const isAnimated = !reduceMotion;

  return (
    // overflow-x-clip is load-bearing: the band is rotated and over-scaled, so
    // its bounding box is wider than the viewport even though it looks correct.
    <section
      aria-labelledby="stack-heading"
      className="relative overflow-x-clip py-16 md:py-24"
    >
      <div className="container-tl mb-6 flex items-center justify-between gap-4">
        <h2 id="stack-heading" className="label-mono text-ink-soft">
          What we build with
        </h2>

        {isAnimated ? (
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

      {reduceMotion ? (
        <div className="container-tl">
          <ul className="flex flex-wrap gap-2">
            {techStack.map((item) => (
              <StackChip key={item} label={item} />
            ))}
          </ul>
        </div>
      ) : (
        // The band is rotated and over-scaled so its edges run off screen
        // rather than showing a cut corner.
        <div className="marquee-band bg-ink border-y-2 border-ink py-4">
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
        </div>
      )}
    </section>
  );
}

function StackChip({ label }: { label: string }) {
  return (
    <li className="font-display flex shrink-0 items-center gap-8 text-[1.125rem] font-bold tracking-[-0.02em] whitespace-nowrap text-white md:text-[1.375rem]">
      {label}
      <span aria-hidden="true" className="bg-lime inline-block size-1.5 rounded-full" />
    </li>
  );
}
