import { ArrowUpRight } from "lucide-react";
import { pillars } from "@/config/home";
import { ActionLink } from "@/components/ui-brand/action";
import { Asterisk } from "@/components/brand/decor";

/**
 * Build / Secure — as an editorial split, not a pair of cards.
 *
 * The page had five consecutive "heading + grid of rounded cards" sections,
 * which is what made it read as competent but flat. This one is deliberately a
 * different archetype: a sticky oversized label in the margin, and two ruled
 * text blocks that scroll past it. No cards, no fills, no shadows — the rule
 * lines and the type scale carry it.
 */
export function Pillars() {
  const entries = [pillars.build, pillars.secure];

  return (
    <section className="section relative">
      <div className="container-tl">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.4fr)] lg:gap-20">
          {/* Sticky margin column */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="label-mono text-ink-soft flex items-center gap-2">
              <Asterisk className="text-lime-deep size-2.5" />
              Two halves of one studio
            </p>
            <h2 className="type-h2 text-ink mt-5">
              Build it properly.
              <br />
              Then try to{" "}
              {/* nowrap so the highlighted word and the full stop cannot be
                  split across lines, which stranded "it." on its own. */}
              <span className="relative inline-block whitespace-nowrap">
                break it.
                <span
                  aria-hidden="true"
                  className="bg-lime absolute inset-x-[-0.12em] bottom-[0.06em] -z-10 h-[0.42em]"
                />
              </span>
            </h2>
            <p className="text-ink-soft measure mt-6 text-[1.0625rem]">
              Most companies buy these from two vendors and let them argue. We
              do both, which means a security finding arrives with an engineer
              who can fix it.
            </p>
          </div>

          {/* Ruled entries */}
          <div className="flex flex-col">
            {entries.map((entry, index) => (
              <article
                key={entry.label}
                className="rise border-t-2 border-[rgba(11,12,10,0.85)] py-9 first:border-t-0 first:pt-0 lg:py-12"
              >
                <div className="flex items-baseline gap-4">
                  <span
                    className="numeral text-ink/20 text-[2.5rem] leading-none"
                    aria-hidden="true"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="label-mono text-ink-soft">{entry.label}</p>
                    <h3 className="font-display text-ink mt-2 text-[1.5rem] leading-[1.1] font-bold tracking-[-0.03em] md:text-[2rem]">
                      {entry.title}
                    </h3>
                  </div>
                </div>

                <p className="text-ink-soft measure mt-5 text-[1rem] leading-relaxed">
                  {entry.description}
                </p>

                {/* Points as a hairline table rather than a bullet list. */}
                <ul className="mt-7 grid gap-x-8 sm:grid-cols-2">
                  {entry.points.map((point) => (
                    <li
                      key={point}
                      className="text-ink flex items-start gap-2.5 border-t border-[rgba(11,12,10,0.12)] py-2.5 text-[0.9375rem]"
                    >
                      <Asterisk className="text-lime-deep mt-1.5 size-2 shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>

                <ActionLink
                  href={entry.cta.href}
                  variant="ghost"
                  size="sm"
                  className="mt-7"
                >
                  {entry.cta.label}
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </ActionLink>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
