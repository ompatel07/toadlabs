import { process } from "@/config/home";
import { Section, SectionHeading } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";

/**
 * Four-step process.
 *
 * The oversized numerals are set in the wordmark face, which is what carries
 * the hero's type voice down the page without repeating the wave effect.
 */
export function Process() {
  return (
    <Section className="relative overflow-hidden">
      <div
        className="blob-accent -top-20 right-[6%] h-[360px] w-[360px]"
        aria-hidden="true"
      />

      <div className="relative">
        <SectionHeading
          eyebrow="How we work"
          title="Four steps, and you see working software in every one"
          description="No discovery phase that produces a slide deck. Each step ends with something you can look at and disagree with."
        />

        <ol className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {process.map((step, index) => (
            <Reveal as="li" key={step.number} index={index}>
              <div className="card-solid lift relative flex h-full flex-col gap-3 overflow-hidden p-7">
                <span
                  className="numeral text-ink/10 absolute -top-1 right-4 text-[5rem]"
                  aria-hidden="true"
                >
                  {step.number}
                </span>
                <span className="bg-lime text-ink label-mono relative w-fit rounded-full px-2.5 py-1">
                  Step {step.number}
                </span>
                <h3 className="font-display text-ink relative text-[1.0625rem] font-semibold tracking-[-0.02em]">
                  {step.title}
                </h3>
                <p className="text-ink-soft relative text-[0.9375rem]">
                  {step.description}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </Section>
  );
}
