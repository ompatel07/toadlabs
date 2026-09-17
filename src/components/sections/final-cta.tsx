import { ArrowRight, MessageCircle } from "lucide-react";
import { siteConfig, whatsappUrl } from "@/config/site";
import { ActionLink } from "@/components/ui-brand/action";
import { Reveal } from "@/components/motion/reveal";
import { Magnetic } from "@/components/ui-brand/magnetic";
import { Spotlight } from "@/components/ui-brand/spotlight";
import { BrandObject } from "@/components/brand/hero-object";
import { InteractiveToad } from "@/components/brand/interactive-toad";

interface FinalCtaProps {
  title?: string;
  description?: string;
  primaryLabel?: string;
}

/**
 * Closing CTA. Reused on every page except /contact, which is itself the CTA.
 * `on-dark` flips the focus ring to lime so it stays visible on the slab.
 *
 * Carries the brand object, bled off the right edge and behind the content, so
 * it reads as part of the slab rather than an illustration parked beside the
 * text. This closes every page on it.
 *
 * Hidden below lg, where the slab narrows and the object would crowd the
 * buttons rather than sit behind them.
 */
export function FinalCta({
  title = "Tell us what you're building",
  description = "A short call, a direct answer on whether we're the right fit, and a written scope if we are. No pitch deck.",
  primaryLabel = "Book a call",
}: FinalCtaProps) {
  return (
    <section className="section glow-left relative">
      <div className="container-tl">
        <Reveal>
          <Spotlight className="slab-dark on-dark slab-bloom relative overflow-hidden p-10 md:p-16 lg:p-20">
            {/* Interactive, so not aria-hidden: the heading and buttons still
                carry the meaning, the toad is just something to poke. */}
            <div className="absolute -right-16 -bottom-24 hidden w-[380px] lg:block xl:-right-6 xl:w-[440px]">
              <div aria-hidden="true" className="scene-bloom pointer-events-none absolute inset-[-18%] -z-10" />
              <InteractiveToad motionClassName="animate-hero-float">
                <BrandObject
                  className="w-full drop-shadow-[0_30px_70px_rgba(0,0,0,0.55)]"
                  sizes="440px"
                />
              </InteractiveToad>
            </div>

            <div className="relative flex max-w-[min(100%,660px)] flex-col gap-8 lg:max-w-[62%]">
              <div className="flex flex-col gap-5">
                <h2 className="type-display max-w-3xl text-ink">{title}</h2>
                <p className="measure t-lead text-white/70">
                  {description}
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Magnetic>
                  <ActionLink href="/contact" variant="lime" size="lg" data-cursor="Let's talk">
                    {primaryLabel}
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </ActionLink>
                </Magnetic>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-13 cursor-pointer items-center justify-center gap-2 rounded-full border border-white/30 px-7 text-base font-medium text-ink transition-colors duration-250 ease-out hover:border-white/60 hover:bg-white/10"
                >
                  <MessageCircle className="size-4" aria-hidden="true" />
                  WhatsApp us
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </div>

              <p className="label-mono text-white/50">
                {siteConfig.location.full}
              </p>
            </div>
          </Spotlight>
        </Reveal>
      </div>
    </section>
  );
}
