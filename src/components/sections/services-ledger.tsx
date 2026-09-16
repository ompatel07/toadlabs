import { ArrowUpRight } from "lucide-react";
import type { Service } from "@/config/services";
import { Asterisk } from "@/components/brand/decor";
import { cn } from "@/lib/utils";

/**
 * Services as a ledger rather than a card grid.
 *
 * Ten identically-shaped cards is the least considered layout a services page
 * can have: every entry claims equal weight, so the reader assigns none of them
 * any. As a ledger the page gets a spine — a sticky index column on the left,
 * a wide reading column on the right — and the two featured disciplines invert
 * to dark slabs, which is what stops ten rows reading as one long texture.
 *
 * The left column is sticky on desktop only. On a narrow screen there is no
 * second column to be sticky against, and a sticky element in a single-column
 * flow just eats the viewport.
 *
 * No JS: hover and reveal are CSS, and the anchor targets are plain ids so the
 * jump nav above works with scripting off.
 */
/**
 * Which rows invert.
 *
 * The two featured disciplines sit next to each other in the config, so keying
 * the dark treatment off `featured` alone produced one dark block near the top
 * and then seven unbroken light rows. Closing on a dark row gives the lower
 * half a beat of its own and stops the ledger trailing off.
 */
const DARK_ROWS = new Set(["custom"]);

export function ServicesLedger({ services }: { services: Service[] }) {
  return (
    <ul className="border-t border-[rgba(255,255,255,0.184)]">
      {services.map((service, index) => {
        const dark = Boolean(service.featured) || DARK_ROWS.has(service.id);
        return (
          <li
            key={service.id}
            className={cn(
              "group/row relative border-b border-[rgba(255,255,255,0.184)]",
              dark && "slab-dark border-b-0",
            )}
          >
            {/* Lime wipe on hover. Scales from the left edge, behind the
                content, so nothing reflows and no shadow is needed. */}
            <span
              aria-hidden="true"
              className={cn(
                "pointer-events-none absolute inset-0 origin-left scale-x-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/row:scale-x-100",
                dark ? "bg-white/[0.04]" : "bg-[rgba(60,230,141,0.16)]",
              )}
            />

            <article
              id={service.id}
              className="container-tl relative grid scroll-mt-28 gap-6 py-11 md:py-14 lg:grid-cols-[240px_1fr] lg:gap-14"
            >
              {/* Index column. */}
              <div className="lg:sticky lg:top-28 lg:self-start">
                <div className="flex items-center gap-5 lg:flex-col lg:items-start lg:gap-6">
                  <span
                    className={cn(
                      "numeral numeral-lg leading-none transition-colors duration-400 ease-out",
                      dark
                        ? "text-white/15 group-hover/row:text-[color:var(--lime)]"
                        : "text-ink/12 group-hover/row:text-[color:var(--lime-deep)]",
                    )}
                    aria-hidden="true"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span
                    className={cn(
                      "inline-flex size-13 shrink-0 items-center justify-center rounded-lg transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/row:-rotate-6",
                      dark ? "bg-lime text-canvas" : "bg-ink text-canvas",
                    )}
                  >
                    <service.icon className="size-5.5" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                </div>
              </div>

              {/* Reading column. */}
              <div className="flex flex-col gap-4">
                <h2
                  className={cn(
                    "font-display type-h2 font-bold transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] lg:group-hover/row:translate-x-2",
                    dark ? "text-ink" : "text-ink",
                  )}
                >
                  {service.title}
                </h2>

                <p
                  className={cn(
                    "measure t-lead leading-relaxed",
                    dark ? "text-white/70" : "text-ink-soft",
                  )}
                >
                  {service.description}
                </p>

                <ul
                  className={cn(
                    "mt-3 grid gap-x-8 gap-y-3 border-t pt-6 sm:grid-cols-3",
                    dark ? "border-white/15" : "border-[rgba(255,255,255,0.138)]",
                  )}
                >
                  {service.points.map((point) => (
                    <li key={point} className="flex items-start gap-2.5">
                      <Asterisk
                        className={cn(
                          "mt-1.5 size-2.5 shrink-0",
                          dark ? "text-lime" : "text-lime-ink",
                        )}
                      />
                      <span
                        className={cn(
                          "t-sm leading-snug",
                          dark ? "text-white/72" : "text-ink-soft",
                        )}
                      >
                        {point}
                      </span>
                    </li>
                  ))}
                </ul>

                <a
                  href="/contact"
                  className={cn(
                    "mt-2 inline-flex w-fit cursor-pointer items-center gap-1.5 py-1.5 t-sm font-medium underline-offset-4 transition-colors duration-200 ease-out hover:underline",
                    dark ? "text-lime" : "text-ink",
                  )}
                >
                  Talk about {service.title.toLowerCase()}
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </a>
              </div>
            </article>
          </li>
        );
      })}
    </ul>
  );
}
