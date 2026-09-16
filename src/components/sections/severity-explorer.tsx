"use client";

import { useId, useRef, useState } from "react";
import { severityModel } from "@/config/security";
import { Section, SectionHeading } from "@/components/layout/section";
import { cn } from "@/lib/utils";

/**
 * Interactive severity explorer.
 *
 * A real tab pattern, not a hover gimmick: arrow keys move between severities,
 * Home/End jump to the ends, and the panel is wired with the roles that make
 * that legible to a screen reader. Manual activation (arrow to move, Enter or
 * Space to select) rather than follow-focus, so keyboard users are not dragged
 * through five panels on the way to the one they want.
 *
 * The meter is the point: severity is a spectrum and a table of five rows does
 * not convey that. Filling a bar does.
 */
const FILL = [100, 78, 54, 32, 14];

export function SeverityExplorer() {
  const [selected, setSelected] = useState(0);
  const [focused, setFocused] = useState(0);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId();

  const onKeyDown = (event: React.KeyboardEvent) => {
    const last = severityModel.length - 1;
    let next: number | null = null;

    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = focused === last ? 0 : focused + 1;
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = focused === 0 ? last : focused - 1;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = last;

    if (next !== null) {
      event.preventDefault();
      setFocused(next);
      tabsRef.current[next]?.focus();
    }
  };

  const active = severityModel[selected];

  return (
    <Section dense className="bg-rules relative">
      <SectionHeading
        className="kinetic"
        eyebrow="How we rate findings"
        title="We rank findings by what an attacker can actually reach"
        description="A scanner's 'critical' is often unreachable in your setup, and its 'medium' is sometimes the one that gets you. Pick a level to see what it means and how fast you would hear about it."
      />

      <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.3fr)] lg:gap-14">
        {/* Levels */}
        <div
          role="tablist"
          aria-label="Severity levels"
          aria-orientation="vertical"
          onKeyDown={onKeyDown}
          className="flex flex-col"
        >
          {severityModel.map((level, index) => {
            const isSelected = index === selected;
            return (
              <button
                key={level.label}
                ref={(node) => {
                  tabsRef.current[index] = node;
                }}
                role="tab"
                id={`${id}-tab-${index}`}
                aria-selected={isSelected}
                aria-controls={`${id}-panel`}
                tabIndex={index === focused ? 0 : -1}
                onClick={() => {
                  setSelected(index);
                  setFocused(index);
                }}
                onFocus={() => setFocused(index)}
                className={cn(
                  "group grid cursor-pointer grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-[rgba(255,255,255,0.161)] py-4 text-left transition-colors duration-200 ease-out first:border-t",
                  isSelected ? "text-ink" : "text-ink-soft hover:text-ink",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "inline-block size-2.5 shrink-0 rounded-full transition-transform duration-300 ease-out",
                    level.token,
                    isSelected ? "scale-150" : "group-hover:scale-125",
                  )}
                />
                <span className="font-display t-h4 font-bold">{level.label}</span>

                {/* Meter. Severity is a spectrum; five table rows do not say
                    that, a filling bar does. */}
                <span
                  aria-hidden="true"
                  className="bg-ink/10 relative block h-1.5 w-24 overflow-hidden rounded-full sm:w-32"
                >
                  <span
                    className={cn(
                      "absolute inset-y-0 left-0 rounded-full transition-[width] duration-500 ease-out",
                      level.token,
                    )}
                    style={{ width: `${isSelected ? FILL[index] : FILL[index] * 0.35}%` }}
                  />
                </span>
              </button>
            );
          })}
        </div>

        {/* Detail */}
        <div
          role="tabpanel"
          id={`${id}-panel`}
          aria-labelledby={`${id}-tab-${selected}`}
          tabIndex={0}
          // key remounts the panel so its entry animation replays on change.
          key={selected}
          className="page-enter card-solid flex flex-col gap-6 rounded-xl p-7 md:p-9"
        >
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className={cn("inline-block size-3 rounded-full", active.token)}
            />
            <h3 className="font-display type-h3 text-ink font-bold">
              {active.label}
            </h3>
          </div>

          <div>
            <p className="label-mono text-ink-soft">What it means</p>
            <p className="text-ink measure mt-2 t-lead">{active.meaning}</p>
          </div>

          <div className="border-t border-[rgba(255,255,255,0.138)] pt-5">
            <p className="label-mono text-ink-soft">When you hear about it</p>
            <p className="text-ink mt-2 t-lead">{active.response}</p>
          </div>
        </div>
      </div>

      {/* The full scale stays readable without interaction, for anyone
          scanning or printing. */}
      <p className="text-ink-soft mt-8 t-sm">
        Every finding is rated on this scale, and colour is never the only
        signal — each carries its label in text.
      </p>
    </Section>
  );
}
