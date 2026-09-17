import { Check, ShieldCheck, X } from "lucide-react";
import {
  complianceProgramme,
  compliancePractices,
} from "@/config/proof";
import { Section, SectionHeading } from "@/components/layout/section";
import { Asterisk } from "@/components/brand/decor";

/**
 * Compliance.
 *
 * Two halves, because "we support compliance" is worth nothing on its own and
 * every vendor says it:
 *
 *  1. The readiness programme, stated with its boundary. The "what we do not
 *     do" column is the part that earns trust here — a buyer who has been
 *     through an audit knows a vendor cannot issue a certificate, and a site
 *     that says so plainly is more credible than one that stays vague and
 *     hopes.
 *  2. What makes a build compliance-compatible in the first place, in terms a
 *     practitioner recognises. These are decisions taken at the start, because
 *     retrofitting them is where compliance budgets actually go.
 */
export function Compliance() {
  return (
    <>
      <Section surface="white" className="tex-rules edge-rules relative border-y border-[rgba(255,255,255,0.115)]">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Compliance"
              title="Audit-ready, stated honestly"
              description={complianceProgramme.summary}
            />

            <div className="slab-dark on-dark mt-9 flex items-start gap-4 rounded-lg p-6">
              <ShieldCheck
                className="text-lime mt-0.5 size-6 shrink-0"
                strokeWidth={1.75}
                aria-hidden="true"
              />
              <div>
                <p className="font-display t-lead font-bold text-ink">
                  {complianceProgramme.framework} readiness
                </p>
                <p className="label-mono mt-1 text-white/55">
                  {complianceProgramme.full}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:gap-10">
            <div>
              <h3 className="label-mono text-ink-soft flex items-center gap-2">
                <Asterisk className="text-lime-ink size-2.5" />
                What we do
              </h3>
              <ul className="mt-5 flex flex-col gap-3 border-t-2 border-[rgba(255,255,255,0.22)] pt-5">
                {complianceProgramme.weDo.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <Check
                      className="text-ink mt-0.5 size-3.5 shrink-0"
                      strokeWidth={2.5}
                      aria-hidden="true"
                    />
                    <span className="text-ink-soft t-sm leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* The boundary. Anyone who has been through an audit reads this
                column first, and its presence is the credibility signal. */}
            <div>
              <h3 className="label-mono text-ink-soft flex items-center gap-2">
                <Asterisk className="text-lime-ink size-2.5" />
                What we don&apos;t
              </h3>
              <ul className="mt-5 flex flex-col gap-3 border-t-2 border-[rgba(255,255,255,0.253)] pt-5">
                {complianceProgramme.weDoNot.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <X
                      className="text-ink-soft mt-0.5 size-3.5 shrink-0"
                      strokeWidth={2.5}
                      aria-hidden="true"
                    />
                    <span className="text-ink-soft t-sm leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Section>

      <Section className="tex-rules glow-left relative">
        <SectionHeading
          eyebrow="Built to be auditable"
          title="What makes software straightforward to audit"
          description="Every vendor says they support compliance. These six decisions determine whether your audit is a review or a rewrite — and they get made in the first week of a build, not the last."
        />

        <ul className="mt-12 grid gap-px overflow-hidden rounded-xl bg-[rgba(255,255,255,0.161)] md:grid-cols-2 xl:grid-cols-3">
          {compliancePractices.map((practice, index) => (
            <li
              key={practice.title}
              className="bg-canvas reveal group/prac flex flex-col gap-3 p-7 md:p-8"
              style={{ animationDelay: `${Math.min(index, 5) * 70}ms` }}
            >
              <div className="flex items-start justify-between gap-4">
                <span className="bg-ink inline-flex size-11 items-center justify-center rounded-xl text-canvas transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/prac:-rotate-6">
                  <practice.icon
                    className="size-5"
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                </span>
                <span className="numeral text-ink/15 t-sm leading-none" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="font-display text-ink t-lead font-bold">
                {practice.title}
              </h3>
              <p className="text-ink-soft t-sm leading-relaxed">
                {practice.description}
              </p>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
