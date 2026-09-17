import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { services, homeServiceIds } from "@/config/services";
import { Asterisk } from "@/components/brand/decor";
import { tones, accentAt } from "@/lib/tones";
import { cn } from "@/lib/utils";

/**
 * Services as a horizontal rail.
 *
 * On a large screen with a fine pointer the section pins and the track pans
 * sideways as you scroll through it — vertical scrolling drives horizontal
 * movement. It is the one place on the site where the interaction itself is
 * the surprise.
 *
 * Shows six, not all ten. A pinned rail costs vertical scroll in proportion to
 * its track length, and ten cards spent 2,880px — over three screens — on what
 * is a teaser for a page one click away. `homeServiceIds` already existed for
 * exactly this and was going unused.
 *
 * Everywhere else it degrades to the same rail, scrolled by hand: touch,
 * narrow screens and reduced motion all get a swipeable snap row. Pinning is
 * never forced on someone who asked for less motion, because converting their
 * scroll into sideways travel is exactly what that setting is about — but a row
 * the visitor drags themselves is not motion imposed on them, so they still get
 * the design rather than a fallback.
 *
 * (An earlier fallback wrapped the flex track instead. That left a ragged empty
 * gap at the end of each row and read as broken.)
 *
 * All CSS — a named view-timeline on the section — so there is no scroll
 * listener and nothing to desynchronise.
 */
const railServices = homeServiceIds
  .map((id) => services.find((service) => service.id === id))
  .filter((service): service is (typeof services)[number] => Boolean(service));

export function ServicesRail() {
  return (
    <section className="rail-section tex-circuit relative">
      <div className="rail-sticky">
        <div className="w-full">
          <div className="container-tl mb-10 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="label-mono text-ink-soft flex items-center gap-2">
                <Asterisk className="text-lime-ink size-2.5" />
                Everything we build
              </p>
              <h2 className="type-h2 text-ink mt-5 max-w-xl">
                Six of the ten things we do
              </h2>
            </div>
            <p className="text-ink-soft measure-tight t-base">
              {/* Neutral wording: the rail pans on scroll for most visitors
                  and is dragged by hand under reduced motion or on touch, so
                  the copy must not promise one specific behaviour. */}
              Scoped around the outcome you need rather than a package tier.
              These six are the most asked for — all ten are on the services
              page.
            </p>
          </div>

          <div className="rail-viewport">
            <ul className="rail-track">
              {railServices.map((service, index) => {
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
                        "group relative flex h-full min-h-[320px] cursor-pointer flex-col gap-4 overflow-hidden rounded-xl border p-7 transition-colors duration-300 ease-out hover:border-ink md:p-8",
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
