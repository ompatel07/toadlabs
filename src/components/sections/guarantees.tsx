import { guarantees } from "@/config/trust";
import { Section, SectionHeading } from "@/components/layout/section";
import { tones, accentAt } from "@/lib/tones";
import { Stamp } from "@/components/brand/decor";
import { cn } from "@/lib/utils";

/**
 * Engagement commitments, as a colour grid.
 *
 * Each is falsifiable — it either happens on an engagement or it visibly does
 * not. That is what replaces the unverifiable badge wall a security site
 * usually leads with.
 */
export function Guarantees() {
  return (
    <Section className="relative overflow-hidden">
      <div className="blob-accent -right-32 bottom-0 h-[420px] w-[420px]" aria-hidden="true" />

      <div className="relative">
        <div className="flex items-start justify-between gap-8">
          <SectionHeading
            className="kinetic"
            eyebrow="How we engage"
            title="Commitments you can hold us to"
            description="No badges, no logo wall. Six things that either happen on your engagement or visibly do not."
          />
          <Stamp className="hidden shrink-0 lg:flex">
            No
            <br />
            lock-in
          </Stamp>
        </div>

        <ul className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {guarantees.map((item, index) => {
            const tone = tones[accentAt(index, [3])];
            return (
              <li key={item.title} className="rise">
                <div
                  className={cn(
                    "group flex h-full flex-col gap-3.5 rounded-2xl border p-7 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-ink",
                    tone.bg,
                    tone.text,
                    tone.border,
                    tone.dark && "on-dark",
                  )}
                >
                  <span
                    className={cn(
                      "inline-flex size-11 items-center justify-center rounded-2xl transition-transform duration-300 ease-out group-hover:-rotate-6",
                      tone.chip,
                    )}
                  >
                    <item.icon className="size-5" strokeWidth={2} aria-hidden="true" />
                  </span>
                  <h3 className="font-display text-[1.0625rem] font-bold tracking-[-0.02em]">
                    {item.title}
                  </h3>
                  <p className={cn("text-[0.9375rem]", tone.muted)}>
                    {item.description}
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
