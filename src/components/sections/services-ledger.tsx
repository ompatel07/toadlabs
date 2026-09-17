import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { Service } from "@/config/services";
import { pageForServiceId, servicePagePath } from "@/config/service-pages";
import { Asterisk } from "@/components/brand/decor";
import { cn } from "@/lib/utils";

/**
 * Services as a ledger.
 *
 * WHY THIS WAS REBUILT
 * The original gave the page its rhythm by inverting three of the ten rows to
 * a dark slab against seven light ones. When the site itself went dark that
 * device silently died: `slab-dark` on a dark page is barely a shade apart, and
 * measuring the rendered grounds confirmed all ten rows were painting the same
 * transparent background. Four thousand pixels of identical rows.
 *
 * Rhythm on a dark ground has to come from elevation and weight instead of
 * from tone, so:
 *
 *  - Featured rows are FEATURE rows: an elevated, accent-washed panel with an
 *    accent bar down its leading edge, a larger heading, and their capability
 *    points in two columns. They read as the headline disciplines because they
 *    occupy more space and sit closer to the reader, not because they are a
 *    different colour.
 *  - Standard rows stay flush to the page and compact, separated by hairlines.
 *  - A spine runs the length of the ledger and fills as it is scrolled, tying
 *    ten separate rows into one sequence — the same device as the process
 *    section, which is the right rhyme for a numbered list of ten.
 *
 * The numeral is the load-bearing element at this scale, so it does the most
 * work on hover: it goes from ghost to accent while the row lifts.
 */

/** Rows that get the feature treatment. Declared, not derived from order. */
const FEATURED = new Set(["mvp", "saas", "custom"]);

export function ServicesLedger({ services }: { services: Service[] }) {
  return (
    <div className="relative">
      {/* Spine. Sits in the page gutter on wide screens, where there is room
          for it outside the reading column. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-[max(1.25rem,calc((100%-1320px)/2+1.25rem))] hidden w-px bg-[rgba(255,255,255,0.1)] xl:block"
      >
        <div className="spine-fill bg-lime absolute inset-x-0 top-0 h-full" />
      </div>

      <ul className="border-t border-[rgba(255,255,255,0.16)]">
        {services.map((service, index) => {
          const feature = FEATURED.has(service.id);
          const detail = pageForServiceId(service.id);
          return (
            <li
              key={service.id}
              className={cn(
                "group/row relative border-b border-[rgba(255,255,255,0.1)]",
                feature && "py-3 md:py-4",
              )}
            >
              <article
                id={service.id}
                className={cn(
                  "container-tl relative scroll-mt-28",
                  !feature && "py-10 md:py-12",
                )}
              >
                <div
                  className={cn(
                    "relative grid gap-6 lg:gap-12",
                    feature
                      ? "panel-feature overflow-hidden p-7 md:p-10 lg:grid-cols-[200px_1fr]"
                      : "lg:grid-cols-[200px_1fr]",
                  )}
                >
                  {/* Accent bar on the leading edge of a feature row. */}
                  {feature ? (
                    <span
                      aria-hidden="true"
                      className="bg-lime absolute inset-y-0 left-0 w-[3px]"
                    />
                  ) : null}

                  {/* Index column. */}
                  <div className="flex items-center gap-5 lg:flex-col lg:items-start lg:gap-5">
                    <span
                      className={cn(
                        "numeral leading-none transition-colors duration-400 ease-out",
                        feature ? "numeral-lg text-lime" : "numeral-lg text-ink-soft/25",
                        !feature && "group-hover/row:text-[color:var(--lime)]",
                      )}
                      aria-hidden="true"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span
                      className={cn(
                        "inline-flex size-12 shrink-0 items-center justify-center rounded-lg transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/row:-rotate-6",
                        feature
                          ? "bg-lime text-canvas"
                          : "bg-[var(--surface-2)] text-lime",
                      )}
                    >
                      <service.icon className="size-5" strokeWidth={1.75} aria-hidden="true" />
                    </span>

                    {feature ? (
                      <span className="label-mono text-lime hidden lg:block">
                        Most asked for
                      </span>
                    ) : null}
                  </div>

                  {/* Reading column. */}
                  <div className="flex flex-col gap-4">
                    <h2
                      className={cn(
                        "font-display text-ink font-bold transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] lg:group-hover/row:translate-x-1.5",
                        feature ? "type-h2" : "type-h3",
                      )}
                    >
                      {service.title}
                    </h2>

                    <p
                      className={cn(
                        "text-ink-soft measure leading-relaxed",
                        feature ? "t-lead" : "t-base",
                      )}
                    >
                      {service.description}
                    </p>

                    <ul
                      className={cn(
                        "mt-2 grid gap-x-8 gap-y-2.5 border-t border-[rgba(255,255,255,0.1)] pt-5",
                        feature ? "sm:grid-cols-2" : "sm:grid-cols-3",
                      )}
                    >
                      {service.points.map((point) => (
                        <li key={point} className="flex items-start gap-2.5">
                          <Asterisk className="text-lime mt-1.5 size-2.5 shrink-0" />
                          <span className="text-ink-soft t-sm leading-snug">
                            {point}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-1">
                      {detail ? (
                        <Link
                          href={servicePagePath(detail)}
                          className="text-lime inline-flex w-fit cursor-pointer items-center gap-1.5 py-1.5 t-sm font-medium underline-offset-4 hover:underline"
                        >
                          {detail.name}: full details
                          <ArrowUpRight className="size-4" aria-hidden="true" />
                        </Link>
                      ) : null}
                      <Link
                        href="/contact"
                        className="text-ink inline-flex w-fit cursor-pointer items-center gap-1.5 py-1.5 t-sm font-medium underline-offset-4 transition-colors duration-200 ease-out hover:text-[color:var(--lime)] hover:underline"
                      >
                        Talk to us about this
                        <ArrowUpRight className="size-4" aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
