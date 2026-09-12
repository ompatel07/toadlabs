import { standards } from "@/config/trust";
import { Reveal } from "@/components/motion/reveal";

/**
 * The standards our work is measured against.
 *
 * This is the honest substitute for a client-logo wall. Every entry is a public
 * methodology anyone can look up, and the framing is "we test against", never
 * "accredited by" — naming a standard describes our process; showing its logo
 * would imply an endorsement we do not have.
 */
export function StandardsBar() {
  return (
    <section className="relative overflow-hidden border-y border-[rgba(11,12,10,0.1)] bg-white/50">
      <div className="blob-accent -top-40 left-[8%] h-80 w-80" aria-hidden="true" />

      <div className="container-tl relative py-14">
        <div className="flex flex-col gap-3 md:flex-row md:items-baseline md:justify-between">
          <h2 className="font-display text-ink text-[1.375rem] font-bold tracking-[-0.03em] md:text-[1.75rem]">
            We test against published standards
          </h2>
          <p className="text-ink-soft max-w-md text-[0.9375rem]">
            So coverage is something you can check, not something you have to
            take on trust.
          </p>
        </div>

        <ul className="mt-8 grid gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
          {standards.map((standard, index) => (
            <Reveal as="li" key={standard.name} index={index}>
              <div className="border-t border-[rgba(11,12,10,0.14)] pt-3">
                <p className="font-display text-ink text-[0.9375rem] font-bold tracking-[-0.02em]">
                  {standard.name}
                </p>
                <p className="text-ink-soft mt-1 text-[0.8125rem] leading-snug">
                  {standard.scope}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>

        <p className="text-ink-soft mt-8 text-[0.8125rem]">
          Named methodologies describe how we work. They are not certifications,
          and we do not claim accreditation we do not hold.
        </p>
      </div>
    </section>
  );
}
