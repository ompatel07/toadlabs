import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { marketingServices, journey } from "@/config/marketing";
import { growthPages, servicePagePath } from "@/config/service-pages";
import { absoluteUrl, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { jsonLd } from "@/lib/json-ld";
import { PageHeader } from "@/components/layout/page-header";
import { Section, SectionHeading } from "@/components/layout/section";
import { TickerStrip } from "@/components/brand/decor";
import { ActionLink } from "@/components/ui-brand/action";
import { ServicesLedger } from "@/components/sections/services-ledger";
import { FinalCta } from "@/components/sections/final-cta";

export const metadata: Metadata = pageMetadata({
  title: "Digital Marketing Agency in Ahmedabad",
  description:
    "Digital marketing from OFFSCRIPT, Ahmedabad: SEO, Google Ads, paid social, content, brand strategy and conversion optimisation — all reported on enquiries.",
  path: "/marketing",
  image: "marketing",
});

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ItemList",
      name: "OFFSCRIPT digital marketing services",
      itemListElement: growthPages.map((page, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: absoluteUrl(servicePagePath(page)),
        name: page.name,
      })),
    },
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Marketing", path: "/marketing" },
    ]),
  ],
};

/**
 * Digital marketing overview.
 *
 * Built from the same parts as /services so the three parts of the offer read
 * as one company rather than an agency bolted onto a software team: the same
 * ledger, the same ticker, the same header.
 *
 * The journey section is the argument for buying both here. Marketing hands
 * over to a website, a website hands over to a product, and the handovers are
 * where an agency and a separate development team usually lose things.
 */
export default function MarketingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(structuredData)}
      />

      <TickerStrip
        items={[
          "SEO",
          "Google Ads",
          "Meta ads",
          "Social media",
          "Content",
          "Brand & creative",
          "Conversion optimisation",
          "Analytics",
        ]}
        speed="40s"
      />

      <PageHeader
        eyebrow="Digital marketing"
        title="Marketing that ends in enquiries, not impressions"
        description="SEO, paid ads, social, content and brand — run by the team that also builds the site the traffic lands on. Every report leads with enquiries and cost per enquiry, because that is the number that decides whether marketing paid for itself."
        watermark="Grow"
        aside={
          <div className="panel-feature panel-edge flex flex-col gap-3 p-6 lg:w-[300px]">
            <p className="label-mono text-ink-soft">Not sure where to start?</p>
            <p className="text-ink t-base">
              Tell us what you sell and who buys it. You get an honest read on
              which channel deserves your budget first — including if the answer
              is to fix the website before spending anything.
            </p>
            <ActionLink href="/contact" className="mt-1 w-full">
              Talk to us
              <ArrowRight className="size-4" aria-hidden="true" />
            </ActionLink>
          </div>
        }
      />

      {/* Anchor navigation. Real links, so they work without JS and are
          keyboard reachable in order. */}
      <nav
        aria-label="Jump to a marketing service"
        className="border-y border-[rgba(255,255,255,0.115)] bg-[var(--surface)]/50"
      >
        <div className="container-tl py-5">
          <ul className="flex flex-wrap gap-2">
            {marketingServices.map((service) => (
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

      <section
        className="section field-top glow-left relative"
        aria-label="Marketing services in detail"
      >
        <ServicesLedger services={marketingServices} featured={["seo", "paid-ads"]} />
      </section>

      <Section className="tex-rules glow-right relative border-t border-[rgba(255,255,255,0.115)]">
        <SectionHeading
          eyebrow="Why it connects"
          title="Attention is only the first handover"
          description="A campaign hands over to a page, a page hands over to a product, and a product hands over to the systems that keep a customer. Those handovers are where results are usually lost — and they are the reason this sits in the same company as the build and security teams."
        />
        <ol className="mt-12 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {journey.map((step) => (
            <li
              key={step.stage}
              className="card-solid flex flex-col gap-3 rounded-lg p-6"
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="numeral numeral-md text-ink/20 leading-none" aria-hidden="true">
                  {step.stage}
                </span>
                <span className="label-mono text-lime-ink">{step.label}</span>
              </div>
              <h3 className="font-display text-ink t-lead font-semibold">
                {step.title}
              </h3>
              <p className="text-ink-soft t-sm leading-relaxed">{step.copy}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section dense className="field-base relative">
        <div className="panel-feature panel-edge flex flex-col gap-5 rounded-xl p-8 md:p-10">
          <h2 className="font-display text-ink type-h3 font-bold">
            What we will not do
          </h2>
          <ul className="grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Promise a number one ranking",
                copy: "Nobody controls Google's results. We commit to the work and the reporting, and tell you when a target is not worth chasing.",
              },
              {
                title: "Report on vanity metrics",
                copy: "Impressions and reach are context. Enquiries and cost per enquiry are the measure, and they lead every report.",
              },
              {
                title: "Hold your accounts hostage",
                copy: "Ad accounts, analytics, domains and content are in your name from day one. If we stop, you keep the history.",
              },
            ].map((item) => (
              <li key={item.title} className="flex flex-col gap-2">
                <span className="font-display text-ink t-base font-semibold">
                  {item.title}
                </span>
                <span className="text-ink-soft t-sm leading-relaxed">
                  {item.copy}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <FinalCta
        title="Let's talk about growth"
        description="Tell us what you sell and who buys it. You get a straight answer on which channel is worth your budget first — and an honest no if marketing is not your bottleneck."
      />
    </>
  );
}
