import { ArrowUpRight } from "lucide-react";
import { engagementModels, engagementRows } from "@/config/engagement";
import { Section, SectionHeading } from "@/components/layout/section";
import { cn } from "@/lib/utils";

/**
 * Engagement models as a comparison matrix.
 *
 * Every comparable studio publishes cooperation models; the ones that leave
 * them out send the buyer into a call unable to picture what they are actually
 * buying. The previous version of this was three sentences at the bottom of
 * /services, which is not enough to choose from.
 *
 * A table, and a real <table>, because this is genuinely tabular: five options
 * against the same four attributes. It is also the one visual form the site
 * did not already use — after a rail, a bento, a ledger and three indexes,
 * another card grid would have added nothing.
 *
 * Responsive approach: the table scrolls horizontally inside its own container
 * rather than collapsing into repeated cards. Duplicating the content for a
 * mobile layout means two copies to keep in sync and twice the DOM for screen
 * readers; a scroll container keeps one semantic table, and the row headers
 * stay pinned so a column never loses its label. The same pattern is already
 * used by the standards table on /cybersecurity.
 */
export function EngagementModels() {
  return (
    <Section surface="white" className="border-y border-[rgba(11,12,10,0.1)]">
      <SectionHeading
        eyebrow="Engagement models"
        title="Five ways this usually works"
        description="Pick the shape that matches what you actually know. If none of them fit, say so on the call — we would rather scope something honest than push you into a tier."
      />

      <div className="mt-12 -mx-[var(--gutter)] overflow-x-auto px-[var(--gutter)] pb-2">
        <table className="w-full min-w-[820px] border-collapse text-left">
          <caption className="sr-only">
            Engagement models compared by what they suit, team shape,
            commitment and billing
          </caption>

          <thead>
            <tr>
              {/* Empty corner cell above the row labels. */}
              <td className="w-[128px]" />
              {engagementModels.map((model) => (
                <th
                  key={model.id}
                  scope="col"
                  className={cn(
                    "w-1/5 border-b-2 p-4 align-bottom",
                    model.common
                      ? "border-[color:var(--lime-deep)] bg-[rgba(199,242,60,0.18)]"
                      : "border-[rgba(11,12,10,0.85)]",
                  )}
                >
                  <span className="font-display text-ink block t-lead font-bold">
                    {model.name}
                  </span>
                  <span className="text-ink-soft mt-1.5 block t-xs leading-snug font-normal">
                    {model.tagline}
                  </span>
                  {model.common ? (
                    <span className="bg-ink mt-3 inline-block rounded-full px-2.5 py-1 label-mono text-white">
                      Most common
                    </span>
                  ) : null}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {engagementRows.map((row) => (
              <tr key={row.key} className="border-b border-[rgba(11,12,10,0.12)]">
                <th
                  scope="row"
                  className="label-mono text-ink-soft py-4 pr-4 align-top"
                >
                  {row.label}
                </th>
                {engagementModels.map((model) => (
                  <td
                    key={model.id}
                    className={cn(
                      "p-4 align-top t-sm leading-snug",
                      model.common
                        ? "bg-[rgba(199,242,60,0.09)] text-ink"
                        : "text-ink-soft",
                    )}
                  >
                    {model[row.key]}
                  </td>
                ))}
              </tr>
            ))}

            {/* "Pick this when" is prose rather than a comparable attribute, so
                it sits below the compared rows instead of among them. */}
            <tr>
              <th
                scope="row"
                className="label-mono text-ink-soft py-4 pr-4 align-top"
              >
                Pick it when
              </th>
              {engagementModels.map((model) => (
                <td
                  key={model.id}
                  className={cn(
                    "p-4 align-top t-sm leading-relaxed",
                    model.common
                      ? "bg-[rgba(199,242,60,0.09)] text-ink"
                      : "text-ink-soft",
                  )}
                >
                  {model.pickWhen}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <p className="text-ink-soft mt-6 flex items-center gap-2 t-sm">
        Not sure which applies?
        <a
          href="/contact"
          className="text-ink inline-flex cursor-pointer items-center gap-1 font-medium underline-offset-4 hover:underline"
        >
          Describe the problem and we will tell you
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </a>
      </p>
    </Section>
  );
}
