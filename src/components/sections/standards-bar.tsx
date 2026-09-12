import { standards } from "@/config/trust";

/**
 * The standards our work is measured against — as a deep teal band.
 *
 * This is the honest substitute for a client-logo wall. Every entry is a public
 * methodology anyone can look up, and the framing is "we test against", never
 * "accredited by": naming a standard describes our process, whereas showing its
 * logo would imply an endorsement we do not have.
 *
 * White on deep is 18.2:1; lime on deep is well clear.
 */
export function StandardsBar() {
  return (
    <section className="section-dense relative">
      <div className="container-tl">
        <div className="bg-deep on-dark relative overflow-hidden rounded-[2rem] border border-ink p-8 text-white md:p-12 lg:p-14">
          {/* Bioluminescent bloom. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-32 -bottom-40 size-[460px] rounded-full opacity-50 blur-3xl"
            style={{
              background:
                "radial-gradient(circle, rgba(199,242,60,0.30) 0%, rgba(168,213,32,0.12) 45%, rgba(16,23,16,0) 72%)",
            }}
          />

          <div className="relative flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="label-mono text-lime">Methodology</p>
              <h2 className="font-display mt-3 max-w-xl text-[1.625rem] font-bold tracking-[-0.03em] md:text-[2.25rem]">
                We test against published standards
              </h2>
            </div>
            <p className="max-w-sm text-[0.9375rem] text-white/70">
              So coverage is something you can check, rather than something you
              have to take on trust.
            </p>
          </div>

          <ul className="relative mt-10 grid gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
            {standards.map((standard) => (
              <li
                key={standard.name}
                className="border-t border-white/25 pt-3.5"
              >
                <p className="font-display text-lime text-[0.9375rem] font-bold tracking-[-0.02em]">
                  {standard.name}
                </p>
                <p className="mt-1 text-[0.8125rem] leading-snug text-white/65">
                  {standard.scope}
                </p>
              </li>
            ))}
          </ul>

          <p className="relative mt-9 text-[0.8125rem] text-white/55">
            Named methodologies describe how we work. They are not
            certifications, and we do not claim accreditation we do not hold.
          </p>
        </div>
      </div>
    </section>
  );
}
