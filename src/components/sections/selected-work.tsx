import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { caseStudies, hasPlaceholderWork } from "@/config/work";
import { Section, SectionHeading } from "@/components/layout/section";
import { ActionLink } from "@/components/ui-brand/action";
import { tones, accentAt } from "@/lib/tones";
import { cn } from "@/lib/utils";

/**
 * Selected work — a sticky stack.
 *
 * Cards pile up as you scroll instead of scrolling past, each sticking a little
 * lower than the last so the earlier ones stay visible as a deck edge. It is
 * the page's one cinematic scroll moment, and it suits three long cards far
 * better than a flat grid did.
 *
 * All of it is `position: sticky` plus a scroll-driven scale — no JS, no
 * measuring, and it degrades to a plain stacked list where unsupported.
 */
export function SelectedWork() {
  return (
    <Section className="relative">
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <SectionHeading
          className="kinetic"
          eyebrow="Selected work"
          title="How we approach a build"
          description="Problem, approach, stack, outcome — written so you can judge the reasoning, not just the result."
        />
        <ActionLink
          href="/work"
          variant="ghost"
          className="shrink-0 self-start md:self-auto"
        >
          All case studies
          <ArrowRight className="size-4" aria-hidden="true" />
        </ActionLink>
      </div>

      {hasPlaceholderWork ? (
        <p className="text-ink-soft mt-10 border-l-2 border-[rgba(255,255,255,0.287)] py-1 pl-4 t-base">
          <strong className="text-ink font-semibold">
            These are placeholders.
          </strong>{" "}
          They illustrate how we scope and write up an engagement. They are not
          delivered client projects, and they contain no outcome metrics.
        </p>
      ) : null}

      {/* pb gives the last card room to sit while the earlier ones stay stuck. */}
      <ul className="mt-10 flex flex-col gap-6 pb-[12vh]">
        {caseStudies.map((study, index) => {
          const tone = tones[accentAt(index, [1])];
          return (
            <li
              key={study.slug}
              className="stack-item"
              style={{ "--i": index } as React.CSSProperties}
            >
              <Link
                href={`/work/${study.slug}`}
                data-cursor="Read case"
                className={cn(
                  "group tilt relative grid cursor-pointer gap-6 overflow-hidden rounded-xl border p-8 transition-colors duration-300 ease-out md:grid-cols-[1.1fr_1fr] md:gap-10 md:p-12",
                  tone.bg,
                  tone.text,
                  tone.border,
                  "hover:border-ink",
                )}
              >
                <span
                  className="numeral pointer-events-none absolute -right-3 -bottom-10 text-[10rem] opacity-[0.07]"
                  aria-hidden="true"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="relative flex flex-col gap-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="label-mono opacity-70">{study.sector}</span>
                    {study.isPlaceholder ? (
                      <span className="label-mono border-ink/30 rounded-full border px-2.5 py-1">
                        Placeholder
                      </span>
                    ) : null}
                  </div>

                  <h3 className="font-display type-h2 flex items-start gap-2 font-bold">
                    <span>{study.title}</span>
                    <ArrowUpRight
                      className="mt-2 size-5 shrink-0 transition-transform duration-300 ease-out group-hover:translate-x-1 group-hover:-translate-y-1"
                      aria-hidden="true"
                    />
                  </h3>

                  <p className={cn("measure t-lead", tone.muted)}>
                    {study.summary}
                  </p>
                </div>

                {/* Approach preview — gives the stacked card enough substance
                    to be worth pausing on. */}
                <div className="relative flex flex-col justify-end gap-4">
                  <ul className="flex flex-col gap-2.5">
                    {study.approach.slice(0, 2).map((line) => (
                      <li
                        key={line}
                        className={cn(
                          "border-t pt-2.5 t-sm leading-snug",
                          tone.rule,
                          tone.muted,
                        )}
                      >
                        {line}
                      </li>
                    ))}
                  </ul>

                  <ul className="flex flex-wrap gap-1.5">
                    {study.stack.slice(0, 5).map((tool) => (
                      <li
                        key={tool}
                        className={cn("label-mono rounded-full px-2.5 py-1", tone.chip)}
                      >
                        {tool}
                      </li>
                    ))}
                  </ul>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
