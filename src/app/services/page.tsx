import type { Metadata } from "next";
import { jsonLd } from "@/lib/json-ld";
import { ArrowRight } from "lucide-react";
import { services } from "@/config/services";
import { buildPages, servicePagePath } from "@/config/service-pages";
import { absoluteUrl, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/layout/page-header";
import { TickerStrip } from "@/components/brand/decor";
import { ActionLink } from "@/components/ui-brand/action";
import { ServicesLedger } from "@/components/sections/services-ledger";
import { StackGrid } from "@/components/sections/stack-grid";
import { CostDrivers } from "@/components/sections/cost-drivers";
import { FinalCta } from "@/components/sections/final-cta";

export const metadata: Metadata = pageMetadata({
  title: "Software Development Services in Ahmedabad",
  description:
    "Website, mobile app, MVP, SaaS, CRM and custom software development, plus AI automation, WhatsApp automation, chatbots and voice agents from Toad Labs, Ahmedabad.",
  path: "/services",
  image: "services",
});

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ItemList",
      name: "Toad Labs software development services",
      itemListElement: buildPages.map((page, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: absoluteUrl(servicePagePath(page)),
        name: page.name,
      })),
    },
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Services", path: "/services" },
    ]),
  ],
};

export default function ServicesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(structuredData)}
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
        eyebrow="Software development services"
        title="Software development services, held to one standard"
        description="Websites, web and mobile apps, MVPs, SaaS, CRM and AI automation, built in Ahmedabad for businesses across India and beyond. Scoped around the outcome you need, shipped with tests that mean something, and every account in your name."
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

      <section className="section field-top glow-left relative" aria-label="Services in detail">
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
