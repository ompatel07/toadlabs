"use client";

import { useState } from "react";
import { Pause, Play } from "lucide-react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { buildStack, secureStack } from "@/config/home";
import { cn } from "@/lib/utils";

/**
 * Tech stack band — two lanes running in opposite directions.
 *
 * Opposing lanes at different speeds is what stops a marquee reading as one
 * dumb conveyor: the eye sees relative motion rather than a single slide. The
 * split is meaningful too — build tooling on one lane, security tooling on the
 * other — so it carries information rather than just filling space.
 *
 * The lane edges are masked so items fade in and out instead of popping at a
 * hard boundary, which is the detail that makes it look finished.
 *
 * Accessibility:
 *  - each lane's real list is in the DOM once; the visual duplicate is
 *    aria-hidden, so nothing is announced twice
 *  - CSS pauses on hover and focus-within, and an explicit control satisfies
 *    WCAG 2.2.2 (hover alone does not)
 *  - under reduced motion both lanes render static and complete, still on the
 *    ink band, and the pause control is withdrawn
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
          "bg-ink border-ink relative flex flex-col gap-3 border-y-2 py-5",
          !reduceMotion && "marquee-band",
        )}
      >
        <Lane
          items={buildStack}
          label="Build"
          reversed={false}
          speed="52s"
          paused={paused}
          reduceMotion={reduceMotion}
        />
        <Lane
          items={secureStack}
          label="Secure"
          reversed
          speed="38s"
          paused={paused}
          reduceMotion={reduceMotion}
        />
      </div>
    </section>
  );
}

function Lane({
  items,
  label,
  reversed,
  speed,
  paused,
  reduceMotion,
}: {
  items: readonly string[];
  label: string;
  reversed: boolean;
  speed: string;
  paused: boolean;
  reduceMotion: boolean;
}) {
  if (reduceMotion) {
    return (
      <div className="container-tl">
        <h3 className="sr-only">{label} tooling</h3>
        <ul className="flex flex-wrap items-center gap-x-6 gap-y-1.5">
          {items.map((item) => (
            <Chip key={item} label={item} />
          ))}
        </ul>
      </div>
    );
  }

  return (
    // marquee-edge masks both ends so chips fade out rather than being cut.
    <div className="marquee-viewport marquee-edge relative flex overflow-hidden">
      <h3 className="sr-only">{label} tooling</h3>
      {[0, 1].map((copy) => (
        <ul
          key={copy}
          aria-hidden={copy === 1 ? "true" : undefined}
          className={cn(
            "flex shrink-0 items-center gap-6 pr-6",
            reversed ? "animate-marquee-reverse" : "animate-marquee",
            paused && "[animation-play-state:paused]",
          )}
          style={{ animationDuration: speed }}
        >
          {items.map((item) => (
            <Chip key={`${copy}-${item}`} label={item} />
          ))}
        </ul>
      ))}
    </div>
  );
}

/** Always on the ink band, so white is always correct. */
function Chip({ label }: { label: string }) {
  return (
    <li className="group/chip flex shrink-0 items-center gap-6 whitespace-nowrap">
      <span className="font-display type-h3 hover:text-lime cursor-default font-bold text-white transition-colors duration-200 ease-out">
        {label}
      </span>
      <span
        aria-hidden="true"
        className="bg-lime/60 inline-block size-1.5 shrink-0 rounded-full"
      />
    </li>
  );
}
