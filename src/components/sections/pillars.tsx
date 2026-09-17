import { ArrowUpRight } from "lucide-react";
import { pillars } from "@/config/home";
import { Asterisk } from "@/components/brand/decor";
import { cn } from "@/lib/utils";

/**
 * Build / Secure — as two opposing halves.
 *
 * The section's own copy says "two halves of one studio", and the layout used
 * to say nothing of the kind: a sticky label and two ruled text blocks, all on
 * the same cream, differing only in their numeral. It sat immediately after a
 * hero full of depth and colour and was the exact point where the page went
 * flat.
 *
 * Now the layout argues the same thing the words do. Two panels meeting at a
 * hard seam, one light and one dark, sized equally because neither half of the
 * studio is the junior one. It also gives the page its first real contrast
 * within a screen of the hero rather than five sections later.
 *
 * The panels drift against each other on the section's own view timeline —
 * the same device as the mid-page scene, at a fraction of the distance because
 * this one sits behind body copy. Both stop under reduced motion.
 *
 * overflow-clip, never overflow-hidden: `hidden` would make this a scroll
 * container and the view() timelines inside would measure against it instead of
 * the document, freezing both panels at a constant transform.
 */
export function Pillars() {
  const entries = [
    { ...pillars.build, dark: false },
    { ...pillars.secure, dark: true },
  ];

  return (
    <section className="section bg-dots bg-glow-left relative overflow-clip">
      <div className="container-tl">
        <div className="max-w-3xl">
          <p className="label-mono text-ink-soft flex items-center gap-2">
            <Asterisk className="text-lime-ink size-2.5" />
            Two halves of one studio
          </p>
          <h2 className="type-h2 text-ink mt-5">
            Build it properly.{" "}
            {/* nowrap so the highlighted word and the full stop cannot be
                split across lines, which stranded "it." on its own. */}
            {/* text-canvas explicitly: the span would otherwise inherit text-ink from
                the heading, which is now the light colour, giving light-on-lime. */}
            <span className="bg-lime text-canvas inline-block rounded-[0.06em] px-[0.08em] whitespace-nowrap">
              Then try to break it.
            </span>
          </h2>
          <p className="text-ink-soft measure mt-6 t-lead">
            Most companies buy these from two vendors and let them argue. We do
            both, which means a security finding arrives with an engineer who
            can fix it.
          </p>
        </div>
      </div>

      {/* The seam. gap-px over an ink ground draws the dividing line without a
          border that would double up against the dark panel's own edge. */}
      <div className="mt-14 grid gap-px bg-[rgba(255,255,255,0.22)] lg:mt-20 lg:grid-cols-2">
        {entries.map((entry, index) => (
          <article
            key={entry.label}
            className={cn(
              "relative isolate flex flex-col overflow-clip px-[var(--gutter)] py-14 md:py-20",
              entry.dark ? "slab-dark on-dark" : "bg-[var(--surface)]",
              index === 0 ? "panel-lift" : "panel-sink",
            )}
          >
            {/* Oversized ghost numeral, bled off the panel's outer edge. */}
            <span
              aria-hidden="true"
              className={cn(
                "numeral pointer-events-none absolute -top-6 -z-10 leading-none select-none text-[clamp(8rem,17vw,15rem)]",
                entry.dark
                  ? "right-[-2%] text-white/[0.055]"
                  : "left-[-2%] text-ink/[0.055]",
              )}
            >
              {String(index + 1).padStart(2, "0")}
            </span>

            <div
              className={cn(
                "mx-auto flex w-full max-w-[36rem] flex-col",
                entry.dark ? "lg:mr-auto lg:ml-0 lg:pl-10" : "lg:ml-auto lg:pr-10",
              )}
            >
              <p
                className={cn(
                  "label-mono flex items-center gap-2",
                  entry.dark ? "text-lime" : "text-ink-soft",
                )}
              >
                <Asterisk
                  className={cn(
                    "size-2.5",
                    entry.dark ? "text-lime" : "text-lime-ink",
                  )}
                />
                {entry.label}
              </p>

              <h3
                className={cn(
                  "font-display mt-5 type-h2 leading-[1.08] font-bold",
                  entry.dark ? "text-ink" : "text-ink",
                )}
              >
                {entry.title}
              </h3>

              <p
                className={cn(
                  "mt-6 t-base leading-relaxed",
                  entry.dark ? "text-white/70" : "text-ink-soft",
                )}
              >
                {entry.description}
              </p>

              <ul className="mt-8 flex flex-col">
                {entry.points.map((point) => (
                  <li
                    key={point}
                    className={cn(
                      "flex items-start gap-2.5 border-t py-3 t-base",
                      entry.dark
                        ? "border-white/15 text-white/85"
                        : "border-[rgba(255,255,255,0.138)] text-ink",
                    )}
                  >
                    <Asterisk
                      className={cn(
                        "mt-1.5 size-2 shrink-0",
                        entry.dark ? "text-lime" : "text-lime-ink",
                      )}
                    />
                    {point}
                  </li>
                ))}
              </ul>

              <a
                href={entry.cta.href}
                className={cn(
                  "group/cta mt-9 inline-flex w-fit cursor-pointer items-center gap-2 rounded-full border-2 px-6 py-3 t-base font-medium transition-colors duration-250 ease-out",
                  entry.dark
                    ? "border-lime text-lime hover:bg-lime hover:text-canvas"
                    : "border-ink text-ink hover:bg-ink hover:text-canvas",
                )}
              >
                {entry.cta.label}
                <ArrowUpRight
                  className="size-4 transition-transform duration-300 ease-out group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5"
                  aria-hidden="true"
                />
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
