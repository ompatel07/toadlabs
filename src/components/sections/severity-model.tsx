import { severityModel } from "@/config/security";
import { Section, SectionHeading } from "@/components/layout/section";
import { cn } from "@/lib/utils";

/**
 * Severity scale.
 *
 * Colour never carries meaning alone — every row states its label in text and
 * the swatch only sits alongside it. Marked up as a real <table> because it is
 * tabular data, which also gives screen readers row/column context for free.
 */
export function SeverityModel({ dense = false }: { dense?: boolean }) {
  return (
    <Section dense={dense} className="relative overflow-hidden">
      <div
        className="blob-accent -left-40 top-10 h-96 w-96"
        aria-hidden="true"
      />

      <div className="relative">
        <SectionHeading
          eyebrow="How we rate findings"
          title="Severity means exploitability here, not scanner output"
          description="A scanner's 'critical' is often unreachable in your deployment, and its 'medium' is sometimes the one that gets you. We rate what an attacker could actually do."
        />

        {/* Horizontal scroll is confined to the table itself so the page body
            never scrolls sideways on a phone. */}
        <div className="mt-12 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <caption className="sr-only">
              Severity levels, their meaning, and our response time
            </caption>
            <thead>
              <tr className="border-b-2 border-[rgba(11,12,10,0.8)]">
                <th scope="col" className="label-mono text-ink-soft py-3 pr-4">
                  Severity
                </th>
                <th scope="col" className="label-mono text-ink-soft py-3 pr-4">
                  What it means
                </th>
                <th scope="col" className="label-mono text-ink-soft py-3">
                  When you hear about it
                </th>
              </tr>
            </thead>
            <tbody>
              {severityModel.map((level) => (
                <tr
                  key={level.label}
                  className="border-b border-[rgba(11,12,10,0.12)]"
                >
                  <th scope="row" className="py-4 pr-4 align-top">
                    <span className="inline-flex items-center gap-2.5">
                      <span
                        aria-hidden="true"
                        className={cn(
                          "inline-block size-2.5 shrink-0 rounded-full",
                          level.token,
                        )}
                      />
                      <span className="font-display text-ink text-[0.9375rem] font-semibold whitespace-nowrap">
                        {level.label}
                      </span>
                    </span>
                  </th>
                  <td className="text-ink-soft py-4 pr-4 align-top text-[0.9375rem]">
                    {level.meaning}
                  </td>
                  <td className="text-ink-soft py-4 align-top text-[0.9375rem]">
                    {level.response}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Section>
  );
}
