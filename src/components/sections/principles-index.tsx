"use client";

import { useState } from "react";
import { Asterisk } from "@/components/brand/decor";
import { cn } from "@/lib/utils";

export interface Principle {
  title: string;
  copy: string;
}

/**
 * Principles as an expanding index.
 *
 * Six paragraphs of equal weight is a wall — the reader skims it and takes
 * nothing. As an index they can read the six claims in a glance and open the
 * one they doubt, which is the actual reading behaviour on a page like this.
 *
 * Built on native <button> + hidden panel rather than <details>, because the
 * open row needs to drive sibling state (the numeral and rule restyle) and
 * <details> gives no hook for that. Semantics are supplied by aria-expanded and
 * aria-controls, and every panel stays in the DOM so the text is findable with
 * browser search even while collapsed.
 */
export function PrinciplesIndex({ principles }: { principles: Principle[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <ul className="border-t-2 border-[rgba(255,255,255,0.22)]">
      {principles.map((item, index) => {
        const isOpen = open === index;
        return (
          <li key={item.title} className="border-b border-[rgba(255,255,255,0.184)]">
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={`principle-${index}`}
              onClick={() => setOpen(isOpen ? null : index)}
              className="group grid w-full cursor-pointer grid-cols-[auto_1fr_auto] items-center gap-5 py-6 text-left md:gap-8"
            >
              <span
                className={cn(
                  "numeral leading-none transition-colors duration-300 ease-out",
                  "numeral-md",
                  isOpen ? "text-[color:var(--lime-deep)]" : "text-ink/20",
                )}
                aria-hidden="true"
              >
                {String(index + 1).padStart(2, "0")}
              </span>

              <span
                className={cn(
                  "font-display text-ink type-h3 font-bold transition-transform duration-300 ease-out",
                  "md:group-hover:translate-x-2",
                )}
              >
                {item.title}
              </span>

              {/* Plus that rotates to a minus. Two rules, one rotating — a
                  glyph swap would jump. */}
              <span
                aria-hidden="true"
                className="relative inline-block size-5 shrink-0"
              >
                <span className="bg-ink absolute top-1/2 left-0 h-[2px] w-5 -translate-y-1/2" />
                <span
                  className={cn(
                    "bg-ink absolute top-1/2 left-0 h-[2px] w-5 -translate-y-1/2 transition-transform duration-300 ease-out",
                    isOpen ? "rotate-0" : "rotate-90",
                  )}
                />
              </span>
            </button>

            {/* Kept in the DOM when collapsed so browser find still hits it. */}
            <div
              id={`principle-${index}`}
              hidden={!isOpen}
              className="grid grid-cols-[auto_1fr] gap-5 pb-7 md:gap-8"
            >
              <span aria-hidden="true" className="numeral-md invisible leading-none">
                00
              </span>
              <p className="text-ink-soft measure flex items-start gap-3 t-lead leading-relaxed">
                <Asterisk className="text-lime-ink mt-2 size-2.5 shrink-0" />
                {item.copy}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
