import type { Metadata } from "next";
import { ArrowRight, Check } from "lucide-react";
import { services } from "@/config/services";
import { siteConfig } from "@/config/site";
import { PageHeader } from "@/components/layout/page-header";
import { Section, SectionHeading } from "@/components/layout/section";
import { ActionLink } from "@/components/ui-brand/action";
import { Reveal } from "@/components/motion/reveal";
import { Process } from "@/components/sections/process";
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

      <PageHeader
        eyebrow="Services"
        title="What we build, and what you end up owning"
        description="Scoped around the outcome you need rather than a package tier. Every engagement leaves you with the repository, the infrastructure, and documentation your team can operate."
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

      <Section>
        <ul className="grid gap-4 lg:grid-cols-2">
          {services.map((service, index) => (
            <Reveal
              as="li"
              key={service.id}
              index={index}
              className={service.featured ? "lg:col-span-2" : undefined}
            >
              {/* scroll-mt clears the sticky header when the anchor is used. */}
              <article
                id={service.id}
                className="card-solid lift flex h-full scroll-mt-28 flex-col gap-4 p-7 md:p-9"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="bg-lime text-ink inline-flex size-12 items-center justify-center rounded-2xl">
                    <service.icon
                      className="size-5"
                      strokeWidth={1.75}
                      aria-hidden="true"
                    />
                  </span>
                  <span
                    className="numeral text-ink/10 numeral-md"
                    aria-hidden="true"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <h2 className="font-display text-ink type-h2 font-bold">
                  {service.title}
                </h2>
                <p className="text-ink-soft measure t-base">
                  {service.description}
                </p>

                <ul
                  className={
                    service.featured
                      ? "mt-2 grid gap-2.5 border-t border-[rgba(11,12,10,0.1)] pt-5 sm:grid-cols-3"
                      : "mt-auto flex flex-col gap-2.5 border-t border-[rgba(11,12,10,0.1)] pt-5"
                  }
                >
                  {service.points.map((point) => (
                    <li key={point} className="flex items-start gap-2.5">
                      <Check
                        className="text-ink mt-0.5 size-3.5 shrink-0"
                        strokeWidth={2}
                        aria-hidden="true"
                      />
                      <span className="text-ink-soft t-sm leading-snug">
                        {point}
                      </span>
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </ul>
      </Section>

      <Process />

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
