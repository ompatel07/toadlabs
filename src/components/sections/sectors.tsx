import { sectors } from "@/config/proof";
import { Section, SectionHeading } from "@/components/layout/section";

/**
 * Sectors served.
 *
 * This is the slot where a logo wall would normally go. We do not have signed
 * permission from clients to put their marks on a marketing site, and a wall of
 * logos assembled without it is both a legal problem and the exact thing a
 * technical buyer reverse-image-searches. Naming the industries says the useful
 * part — that we have met these domains' constraints before — and stays true.
 *
 * Laid out as a hairline index rather than cards: six equal cards would read as
 * padding, whereas an index reads as a list of facts.
 */
export function Sectors() {
  return (
    <Section dense>
      <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
        <SectionHeading
          eyebrow="Domains"
          title="Where the work has been"
          description="Industry matters less than most agencies claim and more than none at all. What carries over is knowing which constraints are real in a domain before someone has to explain them."
        />

        <ul className="border-t-2 border-[rgba(11,12,10,0.85)]">
          {sectors.map((sector) => (
            <li
              key={sector.name}
              className="group/sec flex items-start gap-5 border-b border-[rgba(11,12,10,0.16)] py-5 md:gap-7"
            >
              <span className="bg-canvas text-ink inline-flex size-11 shrink-0 items-center justify-center rounded-xl border border-[rgba(11,12,10,0.14)] transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/sec:-rotate-6">
                <sector.icon className="size-5" strokeWidth={1.75} aria-hidden="true" />
              </span>
              <div className="flex flex-col gap-1">
                <h3 className="font-display text-ink t-lead font-bold transition-transform duration-300 ease-out md:group-hover/sec:translate-x-1.5">
                  {sector.name}
                </h3>
                <p className="text-ink-soft t-sm leading-relaxed">{sector.note}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
