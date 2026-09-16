"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { CaseStudy } from "@/config/work";
import { cn } from "@/lib/utils";

/**
 * Work index — an editorial list with a cursor-following preview.
 *
 * Rows rather than cards: three cards in a grid say "we have three things",
 * while a ruled index says "here is the catalogue" and leaves room for the
 * titles to be read as writing. Hovering a row lifts its number and slides the
 * title, and a preview panel tracks the pointer.
 *
 * The preview is decorative and aria-hidden — every row is already a real link
 * carrying the same information, so nothing is lost without it. It is only
 * built for fine pointers; on touch the rows are simply tappable.
 *
 * The panel is positioned by writing CSS custom properties from a rAF loop
 * rather than by setting React state per pointer event, which would re-render
 * the whole list at pointer frequency.
 */
export function WorkIndex({ studies }: { studies: CaseStudy[] }) {
  const [active, setActive] = useState<number | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const target = useRef({ x: 0, y: 0 });

  const onPointerMove = (event: React.PointerEvent) => {
    target.current = { x: event.clientX, y: event.clientY };
    if (frame.current) return;
    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      const node = previewRef.current;
      if (!node) return;
      node.style.setProperty("--px", `${target.current.x}px`);
      node.style.setProperty("--py", `${target.current.y}px`);
    });
  };

  const TONES = ["bg-lime", "bg-sand", "bg-cyan"];

  return (
    <div
      className="relative"
      onPointerMove={onPointerMove}
      onPointerLeave={() => setActive(null)}
    >
      <ul className="border-t-2 border-[rgba(255, 255, 255, 0.95)]">
        {studies.map((study, index) => (
          <li key={study.slug}>
            <Link
              href={`/work/${study.slug}`}
              data-cursor="Read case"
              onPointerEnter={() => setActive(index)}
              onFocus={() => setActive(index)}
              onBlur={() => setActive(null)}
              className="group grid cursor-pointer grid-cols-[auto_1fr_auto] items-center gap-5 border-b border-[rgba(255, 255, 255, 0.184)] py-7 transition-colors duration-300 ease-out md:gap-10 md:py-10"
            >
              <span
                className="numeral text-ink/20 numeral-md leading-none transition-all duration-300 ease-out group-hover:text-[color:var(--lime-deep)]"
                aria-hidden="true"
              >
                {String(index + 1).padStart(2, "0")}
              </span>

              <span className="min-w-0">
                <span className="label-mono text-ink-soft flex flex-wrap items-center gap-3">
                  {study.sector}
                  {study.isPlaceholder ? (
                    <span className="border-ink/30 rounded-full border px-2 py-0.5">
                      Placeholder
                    </span>
                  ) : null}
                </span>
                <span className="font-display text-ink type-h2 mt-2 block font-bold transition-transform duration-300 ease-out md:group-hover:translate-x-3">
                  {study.title}
                </span>
                <span className="text-ink-soft measure mt-2 block t-base">
                  {study.summary}
                </span>
              </span>

              <ArrowUpRight
                className="text-ink size-6 shrink-0 transition-transform duration-300 ease-out group-hover:translate-x-1 group-hover:-translate-y-1"
                aria-hidden="true"
              />
            </Link>
          </li>
        ))}
      </ul>

      {/* Cursor-following preview. Decorative: the rows carry everything. */}
      <div
        ref={previewRef}
        aria-hidden="true"
        className={cn(
          "work-preview pointer-events-none fixed z-40 hidden w-[260px] rounded-lg border border-[rgba(255, 255, 255, 0.23)] p-5 shadow-[0_24px_60px_-20px_rgba(12,14,10,0.35)] lg:block",
          active === null ? "opacity-0" : "opacity-100",
          active === null ? "" : TONES[active % TONES.length],
        )}
      >
        {active !== null ? (
          <>
            <p className="label-mono text-ink/70">
              {studies[active].tags.join(" · ")}
            </p>
            <ul className="mt-3 flex flex-col gap-1.5">
              {studies[active].stack.slice(0, 5).map((tool) => (
                <li key={tool} className="text-ink t-sm font-medium">
                  {tool}
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </div>
    </div>
  );
}
