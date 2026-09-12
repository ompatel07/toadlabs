import { process } from "@/config/home";
import { Section, SectionHeading } from "@/components/layout/section";
import { tones, accentAt } from "@/lib/tones";
import { OutlineType } from "@/components/brand/decor";
import { cn } from "@/lib/utils";

/**
 * Four-step process.
 *
 * Each step is a stepped colour block — the numerals are set in the wordmark
 * face, which is what carries the hero's type voice down the page without
 * repeating the wave effect.
 */
export function Process() {
  return (
    <Section className="relative overflow-hidden">
      <OutlineType className="absolute -top-2 right-0 text-[clamp(4rem,13vw,10rem)]">
        PROCESS
      </OutlineType>

      <div className="relative">
        <SectionHeading
          className="kinetic"
          eyebrow="How we work"
          title="Four steps, and you see working software in every one"
          description="No discovery phase that produces a slide deck. Each step ends with something you can look at and disagree with."
        />

        <ol className="mt-14 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {process.map((step, index) => {
            const tone = tones[accentAt(index, [1])];
            return (
              <li
                key={step.number}
                className={cn(
                  "rise",
                  // Staircase: each card sits slightly lower than the last, so
                  // the row reads as a sequence rather than four equal boxes.
                  index === 1 && "lg:mt-8",
                  index === 2 && "lg:mt-16",
                  index === 3 && "lg:mt-24",
                )}
              >
                <div
                  className={cn(
                    "relative flex h-full flex-col gap-3 overflow-hidden rounded-2xl border p-7 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-ink",
                    tone.bg,
                    tone.text,
                    tone.border,
                    tone.dark && "on-dark",
                  )}
                >
                  <span
                    className="numeral pointer-events-none absolute -top-3 right-3 text-[6rem] opacity-15"
                    aria-hidden="true"
                  >
                    {step.number}
                  </span>
                  <span
                    className={cn(
                      "label-mono relative w-fit rounded-full px-2.5 py-1",
                      tone.chip,
                    )}
                  >
                    Step {step.number}
                  </span>
                  <h3 className="font-display relative text-[1.125rem] font-bold tracking-[-0.02em]">
                    {step.title}
                  </h3>
                  <p className={cn("relative text-[0.9375rem]", tone.muted)}>
                    {step.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </Section>
  );
}
