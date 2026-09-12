import { ArrowRight } from "lucide-react";
import { securityServices } from "@/config/security";
import { ActionLink } from "@/components/ui-brand/action";
import { Reveal } from "@/components/motion/reveal";

/**
 * Cybersecurity capability band for the home page.
 *
 * The one dark slab in the upper half of the page — security is where the
 * visual weight should land on an IT services site that also does offensive
 * testing, otherwise it reads as an afterthought bolted onto a dev shop.
 */
export function SecurityPreview() {
  return (
    <section className="section">
      <div className="container-tl">
        <Reveal>
          <div className="slab-dark on-dark relative overflow-hidden p-8 md:p-14 lg:p-16">
            {/* Decorative lime bloom. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-40 -left-32 size-[520px] rounded-full opacity-40 blur-3xl"
              style={{
                background:
                  "radial-gradient(circle, rgba(199,242,60,0.5) 0%, rgba(31,107,74,0.28) 45%, rgba(16,23,16,0) 72%)",
              }}
            />

            <div className="relative grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
              <div className="flex flex-col gap-5">
                <p className="label-mono text-lime">Cybersecurity</p>
                <h2 className="text-h2 text-white">
                  We break what we build.
                  <br />
                  And what you built.
                </h2>
                <p className="text-[1.0625rem] text-white/70">
                  Offensive testing run by the same engineers who ship
                  production software — so a finding arrives with a fix that
                  works in your codebase, not a generic recommendation.
                </p>
                <div className="mt-2">
                  <ActionLink href="/cybersecurity" variant="lime" size="lg">
                    Cybersecurity services
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </ActionLink>
                </div>
              </div>

              <ul className="grid gap-px self-start overflow-hidden rounded-2xl bg-white/10 sm:grid-cols-2">
                {securityServices.slice(0, 6).map((service) => (
                  <li
                    key={service.id}
                    className="bg-deep flex flex-col gap-2 p-5"
                  >
                    <service.icon
                      className="text-lime size-5"
                      strokeWidth={1.75}
                      aria-hidden="true"
                    />
                    <h3 className="font-display text-[0.9375rem] font-semibold text-white">
                      {service.title}
                    </h3>
                    <p className="text-[0.8125rem] leading-snug text-white/60">
                      {service.standards.join(" · ")}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
