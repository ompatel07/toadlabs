import { Section, SectionHeading } from "@/components/layout/section";
import { cn } from "@/lib/utils";

/**
 * Anatomy of a write-up.
 *
 * /work is the thinnest page on the site and, with the case studies still
 * placeholders, the one with least to show. Its own title already states the
 * thesis — "the reasoning, not the screenshot" — and the page then made that
 * argument entirely in prose, with no image on it anywhere.
 *
 * So this section IS the argument: an abstract rendering of one of our
 * write-ups, drawn in CSS rather than photographed, annotated with the four
 * parts every one of them carries. It turns the page's weakness into its point,
 * and gives a portfolio page the one thing it completely lacked — something to
 * look at.
 *
 * Drawn rather than screenshotted on purpose: a real screenshot would either
 * expose a client's system or be a fake of one, and both are off the table. An
 * abstract is honest about being an abstract.
 *
 * The whole mock is aria-hidden. It carries no information that the annotated
 * list beside it does not state in words.
 */

const parts = [
  {
    n: "01",
    title: "Problem",
    copy: "What was actually going wrong, in the client's terms, before anyone proposed a solution. If this section is vague the rest is decoration.",
  },
  {
    n: "02",
    title: "Approach",
    copy: "The route we took and, more usefully, the routes we rejected and why. Trade-offs are the part you can actually learn something from.",
  },
  {
    n: "03",
    title: "Stack",
    copy: "What it was built with and what that choice cost. Named, so an engineer on your side can judge whether it suits your team.",
  },
  {
    n: "04",
    title: "Outcome",
    copy: "What changed. Written qualitatively unless there is a measurement we can stand behind — an invented percentage is worse than no number.",
  },
];

export function WriteupAnatomy() {
  return (
    <Section surface="white" className="tex-rules edge-rules relative overflow-clip border-y border-[rgba(255,255,255,0.115)]">
      <SectionHeading
        eyebrow="Anatomy"
        title="What a write-up contains"
        description="Every case study on this site follows the same four-part structure, because those are the four things that let you judge a company you have not worked with yet."
      />

      <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-16">
        {/* The abstract document. */}
        <div aria-hidden="true" className="relative">
          <div className="absolute -inset-6 -z-10 bg-[radial-gradient(60%_60%_at_50%_45%,rgba(60,230,141,0.22)_0%,rgba(60,230,141,0)_70%)]" />

          {/* A second sheet behind, to read as a document rather than a card. */}
          <div className="absolute inset-x-6 top-4 -z-10 h-full rounded-lg border border-[rgba(255,255,255,0.09)] bg-[var(--surface-2)]" />

          <div className="panel-feature corner-marks relative flex flex-col gap-5 rounded-lg p-6 shadow-[0_24px_60px_-28px_rgba(0,0,0,0.8)] md:p-8">
            <div className="flex items-center justify-between gap-4">
              <span className="label-mono text-ink-soft">Case study</span>
              <span className="bg-lime text-canvas rounded-full px-2.5 py-1 label-mono">
                Write-up
              </span>
            </div>

            <Bar className="h-5 w-4/5" />
            <Bar className="h-5 w-3/5" />

            {[
              { label: "01 Problem", lines: ["w-full", "w-11/12", "w-2/3"] },
              { label: "02 Approach", lines: ["w-full", "w-10/12"] },
              { label: "03 Stack", chips: ["TypeScript", "Postgres", "AWS"] },
              { label: "04 Outcome", lines: ["w-11/12", "w-1/2"] },
            ].map((block) => (
              <div key={block.label} className="flex flex-col gap-2 border-t border-[rgba(255,255,255,0.115)] pt-4">
                <span className="label-mono text-lime-ink">{block.label}</span>
                {block.chips ? (
                  <div className="flex flex-wrap gap-1.5">
                    {block.chips.map((chip) => (
                      <span
                        key={chip}
                        className="text-ink-soft rounded-full border border-[rgba(255,255,255,0.184)] px-2.5 py-1 t-xs"
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                ) : (
                  block.lines?.map((w, i) => <Bar key={i} className={cn("h-2.5", w)} />)
                )}
              </div>
            ))}
          </div>
        </div>

        {/* The parts, stated in words. */}
        <ol className="border-t-2 border-[rgba(255,255,255,0.22)]">
          {parts.map((part) => (
            <li
              key={part.n}
              className="group/part grid grid-cols-[auto_1fr] items-start gap-5 border-b border-[rgba(255,255,255,0.184)] py-6 md:gap-8"
            >
              <span className="numeral numeral-md text-ink/15 leading-none transition-colors duration-400 ease-out group-hover/part:text-[color:var(--lime-deep)]">
                {part.n}
              </span>
              <div className="flex flex-col gap-1.5">
                <h3 className="font-display text-ink type-h3 font-bold transition-transform duration-400 ease-out md:group-hover/part:translate-x-1.5">
                  {part.title}
                </h3>
                <p className="text-ink-soft t-base leading-relaxed">{part.copy}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}

/** One abstract line of "text" in the mock. */
function Bar({ className }: { className?: string }) {
  return (
    <span
      className={cn("block rounded-full bg-[rgba(255,255,255,0.127)]", className)}
    />
  );
}
