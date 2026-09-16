import type { Metadata } from "next";
import { ArrowRight, Check } from "lucide-react";
import {
  securityFaqs,
  securityServices,
} from "@/config/security";
import { standards } from "@/config/trust";
import { siteConfig } from "@/config/site";
import { PageHeader } from "@/components/layout/page-header";
import { TickerStrip } from "@/components/brand/decor";
import { Section, SectionHeading } from "@/components/layout/section";
import { ActionLink } from "@/components/ui-brand/action";
import { SecurityCapabilities } from "@/components/sections/security-capabilities";
import { EngagementPhases } from "@/components/sections/engagement-phases";
import { SeverityExplorer } from "@/components/sections/severity-explorer";
import { Compliance } from "@/components/sections/compliance";
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
        title="We attack your software, then hand you the fix"
        description="Security testing run by engineers who ship production software. Every finding arrives with steps to reproduce it, its real-world impact, and a fix that compiles in your codebase — never just a scanner ID and a severity label."
        aside={
          <div className="card-solid flex flex-col gap-4 rounded-3xl p-6 lg:w-[320px]">
            <p className="label-mono text-ink-soft">Every engagement includes</p>
            <ul className="flex flex-col gap-2.5">
              {[
                "Critical findings reported same day",
                "Reproduction steps for everything",
                "Retest after you remediate",
                "Report your buyers can read",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <Check
                    className="text-ink mt-0.5 size-4 shrink-0"
                    strokeWidth={2.5}
                    aria-hidden="true"
                  />
                  <span className="text-ink-soft t-sm">{item}</span>
                </li>
              ))}
            </ul>
            <ActionLink href="/contact" className="mt-1 w-full">
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
          title="Seven ways we test your systems"
          description="Each mapped to the public standard it is measured against, so you can see the coverage rather than take our word for it."
        />

        <SecurityCapabilities services={securityServices} />
      </Section>

      <EngagementPhases />

      <SeverityExplorer />
      <Deliverables dense />

      {/* Methodology. Dark: this page previously ran nine consecutive light
          sections below the header, and a standards table is the natural second
          anchor — it is reference material, and setting it apart is how a
          reader knows to stop skimming. */}
      {/* A plain <section>, not <Section surface=...>. Section always emits a
          surface utility (bg-canvas by default) and that utility is defined
          later in the stylesheet than the .slab-dark component class, so it
          painted cream straight over the dark ground and left white text on
          cream at 1.16:1. */}
      <section className="section-dense slab-dark on-dark relative overflow-clip">
        <div className="container-tl grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
          <SectionHeading
            eyebrow="Methodology"
            onDark
            title="Measured against published standards"
            description="Naming a methodology is a statement about process, not accreditation. We hold no certifications we have not earned, and we will not imply otherwise."
          />

          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] border-collapse text-left">
              <caption className="sr-only">
                Standards we test against and their scope
              </caption>
              <thead>
                <tr className="border-b-2 border-white/40">
                  <th scope="col" className="label-mono py-3 pr-4 text-lime">
                    Standard
                  </th>
                  <th scope="col" className="label-mono py-3 text-lime">
                    Applied to
                  </th>
                </tr>
              </thead>
              <tbody>
                {standards.map((standard) => (
                  <tr
                    key={standard.name}
                    className="border-b border-white/12 transition-colors duration-300 ease-out hover:bg-white/[0.04]"
                  >
                    <th scope="row" className="py-3.5 pr-4 align-top">
                      <span className="font-display block t-base font-semibold text-white">
                        {standard.name}
                      </span>
                      <span className="block t-xs text-white/50">
                        {standard.full}
                      </span>
                    </th>
                    <td className="py-3.5 align-top t-base text-white/70">
                      {standard.scope}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <Compliance />

      <SecurityFaq />

      <FinalCta
        title="Get it tested properly"
        description="Tell us what you have built and who is asking questions about it. We will tell you what kind of engagement actually fits — including if it is a smaller one than you expected."
        primaryLabel="Scope an engagement"
      />
    </>
  );
}
