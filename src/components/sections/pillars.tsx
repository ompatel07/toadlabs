import { ArrowRight, Check } from "lucide-react";
import { pillars } from "@/config/home";
import { Section, SectionHeading } from "@/components/layout/section";
import { ActionLink } from "@/components/ui-brand/action";
import { Reveal } from "@/components/motion/reveal";

/**
 * Build / Secure split. Build is a white card, Secure is the dark slab — the
 * page's one heavy block, so the contrast lands as a deliberate shift rather
 * than as decoration.
 */
export function Pillars() {
  return (
    <Section>
      <SectionHeading
        eyebrow="Two halves of one studio"
        title={
          <>
            Build it properly.
            <br />
            Then try to break it.
          </>
        }
        description="Most companies buy these from two vendors and let them argue. We do both, which means a security finding arrives with an engineer who can fix it."
      />

      <div className="mt-14 grid gap-5 lg:grid-cols-2">
        <Reveal index={0}>
          <article className="card-solid lift flex h-full flex-col gap-6 p-8 md:p-10">
            <span className="label-mono text-ink-soft">
              {pillars.build.label}
            </span>
            <h3 className="type-h3 text-ink">{pillars.build.title}</h3>
            <p className="text-ink-soft text-[0.9375rem]">
              {pillars.build.description}
            </p>
            <ul className="flex flex-col gap-2.5">
              {pillars.build.points.map((point) => (
                <li key={point} className="flex items-start gap-2.5">
                  <Check
                    className="text-ink mt-0.5 size-4 shrink-0"
                    strokeWidth={2.25}
                    aria-hidden="true"
                  />
                  <span className="text-[0.9375rem]">{point}</span>
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-2">
              <ActionLink href={pillars.build.cta.href} variant="ghost">
                {pillars.build.cta.label}
                <ArrowRight className="size-4" aria-hidden="true" />
              </ActionLink>
            </div>
          </article>
        </Reveal>

        <Reveal index={1}>
          {/* `on-dark` switches the focus ring to lime so it stays visible. */}
          <article className="slab-dark on-dark flex h-full flex-col gap-6 p-8 md:p-10">
            <span className="label-mono text-lime">{pillars.secure.label}</span>
            <h3 className="type-h3 text-white">{pillars.secure.title}</h3>
            <p className="text-[0.9375rem] text-white/70">
              {pillars.secure.description}
            </p>
            <ul className="flex flex-col gap-2.5">
              {pillars.secure.points.map((point) => (
                <li key={point} className="flex items-start gap-2.5">
                  <Check
                    className="text-lime mt-0.5 size-4 shrink-0"
                    strokeWidth={2.25}
                    aria-hidden="true"
                  />
                  <span className="text-[0.9375rem] text-white/85">
                    {point}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-2">
              <ActionLink href={pillars.secure.cta.href} variant="lime">
                {pillars.secure.cta.label}
                <ArrowRight className="size-4" aria-hidden="true" />
              </ActionLink>
            </div>
          </article>
        </Reveal>
      </div>
    </Section>
  );
}
