"use client";

import { useState } from "react";
import { Pause, Play } from "lucide-react";
import { useScrollVelocity } from "@/hooks/use-scroll-velocity";
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
  const [paused, setPaused] = useState(false);
  // The band leans into the direction of scroll, which makes it feel attached
  // to the page rather than playing independently of it.
  const bandRef = useScrollVelocity();

  return (
    // overflow-x-clip is load-bearing: the animated band is rotated and
    // over-scaled, so its bounding box is wider than the viewport.
    <section
      aria-labelledby="stack-heading"
      className="field-base relative overflow-x-clip py-16 md:py-24"
    >
      <div className="container-tl mb-6 flex items-center justify-between gap-4">
        <h2 id="stack-heading" className="label-mono text-ink-soft">
          What we build with
        </h2>

        <button
          type="button"
          onClick={() => setPaused((value) => !value)}
          aria-pressed={paused}
          className="text-ink-soft hover:text-ink inline-flex h-9 cursor-pointer items-center gap-2 rounded-full px-3 text-sm transition-colors duration-200 ease-out hover:bg-[rgba(255,255,255,0.057)]"
        >
          {paused ? (
            <Play className="size-3.5" aria-hidden="true" />
          ) : (
            <Pause className="size-3.5" aria-hidden="true" />
          )}
          {paused ? "Play" : "Pause"}
          <span className="sr-only">stack animation</span>
        </button>
      </div>

      <div
        ref={bandRef}
        className={cn(
          "bg-ink border-ink relative flex flex-col gap-3 border-y-2 py-5",
          "marquee-band velocity-skew",
        )}
      >
        <Lane
          items={buildStack}
          label="Build"
          reversed={false}
          speed="52s"
          paused={paused}
        />
        <Lane
          items={secureStack}
          label="Secure"
          reversed
          speed="38s"
          paused={paused}
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
}: {
  items: readonly string[];
  label: string;
  reversed: boolean;
  speed: string;
  paused: boolean;
}) {
  // Coverage is decided by ONE copy of the list: the wrapper translates a full
  // copy-width per cycle, so a copy narrower than the viewport leaves bare band
  // behind it. Chips average ~120px, and the widest viewport we support is
  // 1920, so a copy needs ~16 entries.
  const repeats = Math.max(1, Math.ceil(16 / Math.max(items.length, 1)));
  const filled = Array.from({ length: repeats }, () => items).flat();

  return (
    // marquee-edge masks both ends so chips fade out rather than being cut.
    <div className="marquee-viewport marquee-edge relative flex overflow-hidden">
      <h3 className="sr-only">{label} tooling</h3>
      {/* One animated wrapper holding both copies, translating -50% — which is
          exactly one copy — so the second lands where the first began and the
          reset is invisible. Animating the two lists separately moves them only
          half a copy, and the lane snaps back once per cycle. */}
      <div
        className={cn(
          "flex w-max shrink-0 items-center",
          reversed ? "animate-marquee-reverse" : "animate-marquee",
          paused && "[animation-play-state:paused]",
        )}
        style={{ animationDuration: speed }}
      >
        {[0, 1].map((copy) => (
          <ul
            key={copy}
            aria-hidden={copy === 1 ? "true" : undefined}
            className="flex shrink-0 items-center gap-6 pr-6"
          >
            {filled.map((item, index) => (
              <Chip key={`${copy}-${item}-${index}`} label={item} />
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

/** Always on the ink band, which is the light surface — so chips take dark text. */
function Chip({ label }: { label: string }) {
  return (
    <li className="group/chip flex shrink-0 items-center gap-6 whitespace-nowrap">
      {/* The band is `bg-ink`, which is now the LIGHT colour — so it reads as a
          bright strip cutting across the dark page. Its chips therefore take the
          page ground as their text colour, and hover to deep emerald, which
          holds 7:1 on that fill. White chips here were 1.17:1. */}
      <span className="font-display type-h3 text-canvas cursor-default font-bold transition-colors duration-200 ease-out hover:text-[color:var(--emerald)]">
        {label}
      </span>
      <span
        aria-hidden="true"
        className="bg-lime/60 inline-block size-1.5 shrink-0 rounded-full"
      />
    </li>
  );
}
