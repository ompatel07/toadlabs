import type { Metadata } from "next";
import { ArrowRight, Check } from "lucide-react";
import {
  engagementPhases,
  securityFaqs,
  securityServices,
} from "@/config/security";
import { standards } from "@/config/trust";
import { siteConfig } from "@/config/site";
import { PageHeader } from "@/components/layout/page-header";
import { TickerStrip } from "@/components/brand/decor";
import { Section, SectionHeading } from "@/components/layout/section";
import { ActionLink } from "@/components/ui-brand/action";
import { Reveal } from "@/components/motion/reveal";
import { SeverityExplorer } from "@/components/sections/severity-explorer";
import { Deliverables } from "@/components/sections/deliverables";
import { SecurityFaq } from "@/components/sections/security-faq";
import { FinalCta } from "@/components/sections/final-cta";

export const metadata: Metadata = {
  title: "Cybersecurity",
  description:
    "VAPT, web and mobile penetration testing, security audits, secure code review, cloud posture, compliance readiness and incident response readiness — tested against OWASP ASVS, PTES and NIST SP 800-115.",
  alternates: { canonical: "/cybersecurity" },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Cybersecurity testing and assessment",
  provider: { "@type": "Organization", name: siteConfig.name },
  areaServed: "Worldwide",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Cybersecurity services",
    itemListElement: securityServices.map((service) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: service.title },
    })),
  },
};

export default function CybersecurityPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <TickerStrip
        items={[
          "OWASP Top 10",
          "OWASP ASVS",
          "OWASP MASVS",
          "PTES",
          "NIST SP 800-115",
          "CIS Benchmarks",
          "MITRE ATT&CK",
        ]}
        speed="30s"
        reverse
      />

      <PageHeader
        eyebrow="Cybersecurity"
        title="Find it before someone else does"
        description="Offensive testing run by engineers who ship production software. Findings arrive with reproduction steps and a fix that works in your codebase — not a scanner ID and a severity label."
        aside={
          <div className="slab-dark on-dark flex flex-col gap-4 rounded-3xl p-6 lg:w-[320px]">
            <p className="label-mono text-lime">Every engagement includes</p>
            <ul className="flex flex-col gap-2.5">
              {[
                "Critical findings reported same day",
                "Reproduction steps for everything",
                "Retest after you remediate",
                "Report your buyers can read",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <Check
                    className="text-lime mt-0.5 size-4 shrink-0"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                  <span className="t-sm text-white/85">{item}</span>
                </li>
              ))}
            </ul>
            <ActionLink href="/contact" variant="lime" className="mt-1 w-full">
              Scope an engagement
              <ArrowRight className="size-4" aria-hidden="true" />
            </ActionLink>
          </div>
        }
      />

      {/* Services — denser grid and tighter rhythm than /services, which is
          what gives this page its technical weight without a dark theme. */}
      <Section dense className="border-t border-[rgba(11,12,10,0.1)]">
        <SectionHeading
          eyebrow="Capabilities"
          title="Seven ways we test"
          description="Each mapped to the public standard it is measured against, so you can see the coverage rather than take our word for it."
        />

        <ul className="mt-12 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {securityServices.map((service, index) => (
            <Reveal as="li" key={service.id} index={index}>
              <article
                id={service.id}
                className="card-solid lift flex h-full scroll-mt-28 flex-col gap-3.5 rounded-2xl p-6"
              >
                <span className="bg-canvas text-ink inline-flex size-10 items-center justify-center rounded-xl">
                  <service.icon
                    className="size-[18px]"
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                </span>

                <h2 className="font-display text-ink t-lead font-semibold">
                  {service.title}
                </h2>
                <p className="text-ink-soft t-sm leading-relaxed">
                  {service.summary}
                </p>

                <ul className="flex flex-col gap-1.5 border-t border-[rgba(11,12,10,0.1)] pt-3.5">
                  {service.scope.map((item) => (
                    <li
                      key={item}
                      className="text-ink-soft flex items-start gap-2 t-xs leading-snug"
                    >
                      <span
                        aria-hidden="true"
                        className="bg-lime-deep mt-1.5 inline-block size-1 shrink-0 rounded-full"
                      />
                      {item}
                    </li>
                  ))}
                </ul>

                <ul className="mt-auto flex flex-wrap gap-1.5 pt-1">
                  {service.standards.map((standard) => (
                    <li
                      key={standard}
                      className="label-mono text-ink-soft rounded-full border border-[rgba(11,12,10,0.14)] px-2 py-0.5"
                    >
                      {standard}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* Engagement process */}
      <Section
        dense
        surface="white"
        className="border-y border-[rgba(11,12,10,0.1)]"
      >
        <SectionHeading
          eyebrow="Engagement process"
          title="Six phases, agreed before anything is touched"
          description="The rules of engagement exist so that testing never becomes a surprise. You know what we will do, when, and who to call to stop it."
        />

        <ol className="mt-12 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {engagementPhases.map((phase, index) => (
            <Reveal as="li" key={phase.number} index={index}>
              <div className="bg-canvas relative flex h-full flex-col gap-3 overflow-hidden rounded-2xl p-6">
                <span
                  className="numeral text-ink/10 absolute -top-2 right-3 numeral-lg"
                  aria-hidden="true"
                >
                  {phase.number}
                </span>
                <h3 className="font-display text-ink relative t-lead font-semibold">
                  {phase.title}
                </h3>
                <p className="text-ink-soft relative t-sm leading-relaxed">
                  {phase.description}
                </p>
                <ul className="relative mt-auto flex flex-wrap gap-1.5 pt-2">
                  {phase.outputs.map((output) => (
                    <li
                      key={output}
                      className="label-mono text-ink rounded-full bg-white px-2 py-0.5"
                    >
                      {output}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </ol>
      </Section>

      <SeverityExplorer />
      <Deliverables dense />

      {/* Methodology */}
      <Section
        dense
        surface="white"
        className="border-y border-[rgba(11,12,10,0.1)]"
      >
        <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
          <SectionHeading
            eyebrow="Methodology"
            title="Measured against published standards"
            description="Naming a methodology is a statement about process, not accreditation. We hold no certifications we have not earned, and we will not imply otherwise."
          />

          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] border-collapse text-left">
              <caption className="sr-only">
                Standards we test against and their scope
              </caption>
              <thead>
                <tr className="border-b-2 border-[rgba(11,12,10,0.8)]">
                  <th
                    scope="col"
                    className="label-mono text-ink-soft py-3 pr-4"
                  >
                    Standard
                  </th>
                  <th scope="col" className="label-mono text-ink-soft py-3">
                    Applied to
                  </th>
                </tr>
              </thead>
              <tbody>
                {standards.map((standard) => (
                  <tr
                    key={standard.name}
                    className="border-b border-[rgba(11,12,10,0.12)]"
                  >
                    <th scope="row" className="py-3.5 pr-4 align-top">
                      <span className="font-display text-ink block t-base font-semibold">
                        {standard.name}
                      </span>
                      <span className="text-ink-soft block t-xs">
                        {standard.full}
                      </span>
                    </th>
                    <td className="text-ink-soft py-3.5 align-top t-base">
                      {standard.scope}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Section>

      <SecurityFaq />

      <FinalCta
        title="Get it tested properly"
        description="Tell us what you have built and who is asking questions about it. We will tell you what kind of engagement actually fits — including if it is a smaller one than you expected."
        primaryLabel="Scope an engagement"
      />
    </>
  );
}
