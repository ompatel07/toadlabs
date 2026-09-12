"use client";

import { useState } from "react";
import { Pause, Play } from "lucide-react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { techStack } from "@/config/home";
import { cn } from "@/lib/utils";

/**
 * Tech stack marquee.
 *
 *  - the real list is in the DOM once and read normally; the visual duplicate
 *    is aria-hidden so nothing is announced twice
 *  - CSS pauses the loop on hover and focus-within
 *  - an explicit control satisfies WCAG 2.2.2 — hover alone does not
 *  - under reduced motion it renders static and the control is withdrawn
 */
export function StackMarquee() {
  const reduceMotion = useReducedMotion();
  const [paused, setPaused] = useState(false);

  const isAnimated = !reduceMotion;
  const isRunning = isAnimated && !paused;

  return (
    <section
      aria-labelledby="stack-heading"
      className="section-dense overflow-hidden"
    >
      <div className="container-tl mb-7 flex items-center justify-between gap-4">
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
        <div className="marquee-viewport relative flex overflow-hidden">
          <ul
            className={cn(
              "animate-marquee flex shrink-0 gap-2 pr-2",
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
              "animate-marquee flex shrink-0 gap-2 pr-2",
              paused && "[animation-play-state:paused]",
            )}
          >
            {techStack.map((item) => (
              <StackChip key={`${item}-duplicate`} label={item} />
            ))}
          </ul>
        </div>
      )}

      <span className="sr-only" role="status">
        {isRunning ? "Stack list scrolling" : "Stack list paused"}
      </span>
    </section>
  );
}

function StackChip({ label }: { label: string }) {
  return (
    <li className="text-ink label-mono shrink-0 rounded-full border border-[rgba(11,12,10,0.12)] bg-white/60 px-4 py-2.5 whitespace-nowrap">
      {label}
    </li>
  );
}
