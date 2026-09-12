import { ArrowRight } from "lucide-react";
import { securityServices } from "@/config/security";
import { ActionLink } from "@/components/ui-brand/action";
import { Reveal } from "@/components/motion/reveal";
import { DecodeText } from "@/components/brand/decode-text";
import { Spotlight } from "@/components/ui-brand/spotlight";

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
          <Spotlight className="slab-dark on-dark slab-bloom relative overflow-hidden p-8 md:p-14 lg:p-16">
            <div className="relative grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
              <div className="flex flex-col gap-5">
                <p className="label-mono text-lime">Cybersecurity</p>
                {/* The heading resolves from scrambled glyphs on scroll — the
                    idea of decoding, without reaching for matrix rain. The
                    accessible copy never scrambles. */}
                <h2 className="type-h2 text-white">
                  <DecodeText text="We break what we build." />
                  <br />
                  <DecodeText text="And what you built." duration={1100} />
                </h2>
                <p className="t-lead text-white/70">
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
                    <h3 className="font-display t-base font-semibold text-white">
                      {service.title}
                    </h3>
                    <p className="t-xs leading-snug text-white/60">
                      {service.standards.join(" · ")}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </Spotlight>
        </Reveal>
      </div>
    </section>
  );
}
