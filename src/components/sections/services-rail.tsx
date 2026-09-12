import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { services } from "@/config/services";
import { Asterisk } from "@/components/brand/decor";
import { tones, accentAt } from "@/lib/tones";
import { cn } from "@/lib/utils";

/**
 * Services as a horizontal rail.
 *
 * On a large screen with a fine pointer the section pins and the track pans
 * sideways as you scroll through it — vertical scrolling drives horizontal
 * movement. It is the one place on the site where the interaction itself is
 * the surprise, and it suits a list of ten services far better than a grid,
 * which would either truncate them or turn into a wall.
 *
 * Everywhere else it degrades honestly: touch and narrow screens get a normal
 * swipeable row with snap points, and reduced motion gets a plain wrapped
 * grid. Pinning is never forced on someone who asked for less motion, because
 * converting their scroll into sideways travel is exactly what that setting is
 * about.
 *
 * All CSS — `animation-timeline: scroll()` — so there is no scroll listener
 * and nothing to desynchronise.
 */
export function ServicesRail() {
  return (
    <section className="rail-section relative">
      <div className="rail-sticky">
        <div className="w-full">
          <div className="container-tl mb-10 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="label-mono text-ink-soft flex items-center gap-2">
                <Asterisk className="text-lime-deep size-2.5" />
                Everything we build
              </p>
              <h2 className="type-h2 text-ink mt-5 max-w-xl">
                Ten things we do, end to end
              </h2>
            </div>
            <p className="text-ink-soft measure-tight t-base">
              Scoped around the outcome you need rather than a package tier.
              Keep scrolling — the rail moves with you.
            </p>
          </div>

          <div className="rail-viewport">
            <ul className="rail-track">
              {services.map((service, index) => {
                const tone = tones[accentAt(index, [0, 4, 8])];
                return (
                  <li
                    key={service.id}
                    className="rail-card w-[78vw] shrink-0 sm:w-[380px]"
                  >
                    <Link
                      href={`/services#${service.id}`}
                      data-cursor="Explore"
                      className={cn(
                        "group relative flex h-full min-h-[320px] cursor-pointer flex-col gap-4 overflow-hidden rounded-3xl border p-7 transition-colors duration-300 ease-out hover:border-ink md:p-8",
                        tone.bg,
                        tone.text,
                        tone.border,
                      )}
                    >
                      <span
                        className="numeral pointer-events-none absolute -right-2 -bottom-8 numeral-lg opacity-[0.08]"
                        aria-hidden="true"
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <span
                        className={cn(
                          "relative inline-flex size-12 items-center justify-center rounded-full border transition-transform duration-300 ease-out group-hover:rotate-12",
                          tone.chip,
                          tone.border,
                        )}
                      >
                        <service.icon
                          className="size-5"
                          strokeWidth={1.75}
                          aria-hidden="true"
                        />
                      </span>

                      <h3 className="font-display type-h3 relative flex items-start gap-1.5 font-bold">
                        {service.title}
                        <ArrowUpRight
                          className="mt-1 size-4 shrink-0 transition-transform duration-300 ease-out group-hover:translate-x-1 group-hover:-translate-y-1"
                          aria-hidden="true"
                        />
                      </h3>

                      <p className={cn("relative t-base", tone.muted)}>
                        {service.description}
                      </p>

                      <ul
                        className={cn(
                          "relative mt-auto flex flex-col gap-1.5 border-t pt-4",
                          tone.rule,
                        )}
                      >
                        {service.points.slice(0, 2).map((point) => (
                          <li
                            key={point}
                            className={cn("t-sm leading-snug", tone.muted)}
                          >
                            {point}
                          </li>
                        ))}
                      </ul>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
