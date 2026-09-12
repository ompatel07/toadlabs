import { guarantees } from "@/config/trust";
import { Section, SectionHeading } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";

/**
 * Engagement commitments.
 *
 * Each one is falsifiable — it either happens on an engagement or it does not.
 * That is the whole point: these replace the unverifiable badges a security
 * site usually leads with.
 */
export function Guarantees() {
  return (
    <Section className="relative overflow-hidden">
      <div
        className="blob-accent -right-32 bottom-0 h-[420px] w-[420px]"
        aria-hidden="true"
      />

      <div className="relative">
        <SectionHeading
          eyebrow="How we engage"
          title="Commitments you can hold us to"
          description="No badges, no logo wall. Six things that either happen on your engagement or visibly do not."
        />

        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {guarantees.map((item, index) => (
            <Reveal as="li" key={item.title} index={index}>
              <div className="card-solid lift flex h-full flex-col gap-3.5 p-7">
                <span className="bg-lime text-ink inline-flex size-11 items-center justify-center rounded-2xl">
                  <item.icon className="size-5" strokeWidth={2} aria-hidden="true" />
                </span>
                <h3 className="font-display text-ink text-[1.0625rem] font-semibold tracking-[-0.02em]">
                  {item.title}
                </h3>
                <p className="text-ink-soft text-[0.9375rem]">
                  {item.description}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </Section>
  );
}
