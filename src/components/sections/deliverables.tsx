import { Check } from "lucide-react";
import { deliverables } from "@/config/trust";
import { Section, SectionHeading } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";

/** What actually lands at the end of a security engagement. */
export function Deliverables({ dense = false }: { dense?: boolean }) {
  return (
    <Section dense={dense} className="field-base glow-left relative">
      <SectionHeading
        eyebrow="What you get"
        title="What lands at the end — including the retest"
        description="A security engagement should end with something your engineers can act on and something your buyers can read. Not a scanner export with a logo on it."
      />

      <ul className="mt-14 grid gap-4 lg:grid-cols-3">
        {deliverables.map((item, index) => (
          <Reveal as="li" key={item.title} index={index}>
            <div className="card-solid lift flex h-full flex-col gap-4 p-7 md:p-8">
              <div className="flex items-center justify-between gap-3">
                <span className="bg-[var(--surface-2)] text-lime inline-flex size-11 items-center justify-center rounded-lg">
                  <item.icon className="size-5" strokeWidth={1.75} aria-hidden="true" />
                </span>
                <span
                  className="numeral text-ink/12 numeral-md"
                  aria-hidden="true"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <h3 className="font-display text-ink t-h4 font-semibold">
                {item.title}
              </h3>
              <p className="text-ink-soft t-base">{item.description}</p>

              <ul className="mt-auto flex flex-col gap-2.5 border-t border-[rgba(255,255,255,0.115)] pt-4">
                {item.detail.map((line) => (
                  <li key={line} className="flex items-start gap-2.5">
                    <Check
                      className="text-ink mt-0.5 size-3.5 shrink-0"
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                    <span className="text-ink-soft t-sm leading-snug">
                      {line}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
