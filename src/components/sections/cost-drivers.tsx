import { TrendingDown, TrendingUp } from "lucide-react";
import { costDrivers } from "@/config/engagement";
import { Section, SectionHeading } from "@/components/layout/section";
import { cn } from "@/lib/utils";

/**
 * What drives the cost.
 *
 * Neither of the studios this was modelled on explains cost anywhere — every
 * route ends at "request an estimate". That silence is the opening: a buyer
 * who can work out roughly what moves the number arrives at the call able to
 * have a real conversation, and a studio willing to say "this decision makes it
 * cheaper" reads as a practitioner rather than a salesperson.
 *
 * No figures. Rate cards are commercial terms for the owner to set, and
 * inferring them from a form's budget dropdown would be inventing them. The
 * factors are honest and useful on their own.
 *
 * The two that lower the cost are the point of the section. A list that only
 * ever goes up is a sales document; including "deciding what not to build" —
 * which shrinks our own engagement — is what makes the other four credible.
 */
export function CostDrivers() {
  return (
    <Section>
      <div className="grid gap-10 lg:grid-cols-[1fr_1.45fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            eyebrow="What it costs"
            title="What actually moves the number"
            description="We do not publish a rate card, because a number without a scope attached is worthless to both of us. What we can tell you is exactly what makes an estimate go up or down — including the two that bring it down."
          />
        </div>

        <ul className="border-t-2 border-[rgba(11,12,10,0.85)]">
          {costDrivers.map((driver, index) => {
            const down = driver.direction === "down";
            return (
              <li
                key={driver.title}
                className="group/cost reveal flex items-start gap-5 border-b border-[rgba(11,12,10,0.16)] py-6 md:gap-7"
                style={{ animationDelay: `${Math.min(index, 5) * 60}ms` }}
              >
                {/* Direction is carried by the icon AND by the label text, never
                    by colour alone. */}
                <span
                  className={cn(
                    "inline-flex size-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] motion-safe:group-hover/cost:-rotate-6",
                    down ? "bg-lime text-ink" : "bg-ink text-white",
                  )}
                >
                  {down ? (
                    <TrendingDown className="size-5" strokeWidth={1.75} aria-hidden="true" />
                  ) : (
                    <TrendingUp className="size-5" strokeWidth={1.75} aria-hidden="true" />
                  )}
                </span>

                <div className="flex flex-col gap-1.5">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h3 className="font-display text-ink t-lead font-bold transition-transform duration-300 ease-out motion-safe:md:group-hover/cost:translate-x-1.5">
                      {driver.title}
                    </h3>
                    <span className="label-mono text-ink-soft">
                      {down ? "Lowers it" : "Raises it"}
                    </span>
                  </div>
                  <p className="text-ink-soft t-sm leading-relaxed">
                    {driver.detail}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </Section>
  );
}
