import type { Metadata } from "next";
import { jsonLd } from "@/lib/json-ld";
import { ArrowRight, Check } from "lucide-react";
import { securityFaqs, securityServices } from "@/config/security";
import { standards } from "@/config/trust";
import { securityPages, servicePagePath } from "@/config/service-pages";
import { absoluteUrl, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
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

export const metadata: Metadata = pageMetadata({
  title: "Cybersecurity & VAPT Company in Ahmedabad",
  description:
    "VAPT, web and mobile penetration testing, security audits, code review, cloud security and ISO 27001 readiness from Toad Labs, a cybersecurity company in Ahmedabad.",
  path: "/cybersecurity",
  image: "cybersecurity",
});

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ItemList",
      name: "Toad Labs cybersecurity services",
      itemListElement: securityPages.map((page, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: absoluteUrl(servicePagePath(page)),
        name: page.name,
      })),
    },
    {
      "@type": "FAQPage",
      mainEntity: securityFaqs.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Cybersecurity", path: "/cybersecurity" },
    ]),
  ],
};

export default function CybersecurityPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(structuredData)}
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
        eyebrow="Cybersecurity services · VAPT · Pentesting"
        title="VAPT and penetration testing that ends in a fix"
        description="VAPT and penetration testing from Ahmedabad, run by engineers who ship production software. Every finding arrives with steps to reproduce it, its real-world impact, and a fix that compiles in your codebase — never just a scanner ID and a severity label."
        aside={
          <div className="panel-feature panel-edge flex flex-col gap-4 rounded-xl p-6 lg:w-[320px]">
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
      <Section dense className="field-base glow-left relative border-t border-[rgba(255,255,255,0.115)]">
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

      {/* Methodology, set apart on a slab: it is reference material, and
          setting it apart is how a reader knows to stop skimming.
          A plain <section>, not <Section>: Section always emits a surface
          utility, which is defined later than .slab-dark and would paint over
          it. */}
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
                      <span className="font-display block t-base font-semibold text-ink">
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
