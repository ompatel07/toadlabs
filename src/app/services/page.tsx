import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { services } from "@/config/services";
import { siteConfig } from "@/config/site";
import { PageHeader } from "@/components/layout/page-header";
import { TickerStrip } from "@/components/brand/decor";
import { ActionLink } from "@/components/ui-brand/action";
import { ServicesLedger } from "@/components/sections/services-ledger";
import { StackGrid } from "@/components/sections/stack-grid";
import { CostDrivers } from "@/components/sections/cost-drivers";
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
        title="Ten things we build, held to one standard"
        description="We scope around the outcome you need, not a package tier. Whatever we build ships with tests that mean something, a release process your team can run, and every account in your name."
        aside={
          <div className="panel-feature panel-edge flex flex-col gap-3 p-6 lg:w-[300px]">
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
        className="border-y border-[rgba(255,255,255,0.115)] bg-[var(--surface)]/50"
      >
        <div className="container-tl py-5">
          <ul className="flex flex-wrap gap-2">
            {services.map((service) => (
              <li key={service.id}>
                <a
                  href={`#${service.id}`}
                  className="text-ink-soft hover:border-ink hover:text-ink inline-flex cursor-pointer rounded-full border border-[rgba(255,255,255,0.161)] px-3.5 py-1.5 t-xs font-medium transition-colors duration-200 ease-out"
                >
                  {service.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <section className="section tex-circuit glow-left relative" aria-label="Services in detail">
        <ServicesLedger services={services} />
      </section>

      <StackGrid />

      <CostDrivers />

      <FinalCta
        title="Tell us what you're building"
        description="A short call, a direct answer on whether we're the right fit, and a written scope if we are."
      />
    </>
  );
}
