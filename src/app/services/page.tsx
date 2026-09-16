import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { services } from "@/config/services";
import { siteConfig } from "@/config/site";
import { PageHeader } from "@/components/layout/page-header";
import { TickerStrip } from "@/components/brand/decor";
import { Section, SectionHeading } from "@/components/layout/section";
import { ActionLink } from "@/components/ui-brand/action";
import { ServicesLedger } from "@/components/sections/services-ledger";
import { FinalCta } from "@/components/sections/final-cta";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Websites, web and mobile apps, MVPs, SaaS products, CRM, AI automation, WhatsApp automation, chatbots and voice assistants — built by Toad Labs in Ahmedabad.",
  alternates: { canonical: "/services" },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Toad Labs services",
  itemListElement: services.map((service, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "Service",
      name: service.title,
      description: service.description,
      provider: { "@type": "Organization", name: siteConfig.name },
      url: `${siteConfig.siteUrl}/services#${service.id}`,
    },
  })),
};

export default function ServicesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <TickerStrip
        items={[
          "Websites",
          "Web & mobile apps",
          "MVPs",
          "SaaS products",
          "CRM",
          "AI automation",
          "WhatsApp automation",
          "Chatbots",
          "Voice assistants",
          "Custom builds",
        ]}
        speed="42s"
      />

      <PageHeader
        eyebrow="Services"
        title="Ten disciplines, one engineering standard"
        description="Scoped around the outcome you need, not a package tier. Whatever we build, it ships with tests that mean something, a release process your team can run, and everything in your accounts."
        aside={
          <div className="card-solid flex flex-col gap-3 p-6 lg:w-[300px]">
            <p className="label-mono text-ink-soft">Not sure which you need?</p>
            <p className="text-ink t-base">
              Describe the problem rather than the solution — scoping it
              properly is the first thing we do anyway.
            </p>
            <ActionLink href="/contact" className="mt-1 w-full">
              Book a call
              <ArrowRight className="size-4" aria-hidden="true" />
            </ActionLink>
          </div>
        }
      />

      {/* Anchor navigation. Real links, so they work without JS and are
          keyboard reachable in order. */}
      <nav
        aria-label="Jump to a service"
        className="border-y border-[rgba(11,12,10,0.1)] bg-white/50"
      >
        <div className="container-tl py-5">
          <ul className="flex flex-wrap gap-2">
            {services.map((service) => (
              <li key={service.id}>
                <a
                  href={`#${service.id}`}
                  className="text-ink-soft hover:border-ink hover:text-ink inline-flex cursor-pointer rounded-full border border-[rgba(11,12,10,0.14)] px-3.5 py-1.5 t-xs font-medium transition-colors duration-200 ease-out"
                >
                  {service.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <section className="section" aria-label="Services in detail">
        <ServicesLedger services={services} />
      </section>

      <Section surface="white" className="border-y border-[rgba(11,12,10,0.1)]">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <SectionHeading
            eyebrow="Engagements"
            title="How work usually starts"
            description="Three shapes cover almost everything. If yours does not fit one, say so on the call and we will scope it honestly rather than force it into a tier."
          />

          <ul className="flex flex-col gap-4">
            {[
              {
                title: "Fixed-scope phase",
                copy: "A defined piece of work with a written scope and a fixed price. Best when the problem is well understood and the boundary is clear.",
              },
              {
                title: "Ongoing development",
                copy: "A continuing engagement with weekly demos, for products that keep evolving. Cancellable — there is no lock-in that makes leaving expensive.",
              },
              {
                title: "Discovery first",
                copy: "A short paid piece of work that produces a scope, an architecture, and an estimate. Sometimes the honest answer is that you need less than you thought.",
              },
            ].map((item) => (
              <li
                key={item.title}
                className="border-t border-[rgba(11,12,10,0.14)] pt-4"
              >
                <h3 className="font-display text-ink t-lead font-semibold">
                  {item.title}
                </h3>
                <p className="text-ink-soft measure mt-1.5 t-base">
                  {item.copy}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <FinalCta
        title="Tell us what you're building"
        description="A short call, a direct answer on whether we're the right fit, and a written scope if we are."
      />
    </>
  );
}
