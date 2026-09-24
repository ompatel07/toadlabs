import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { services } from "@/config/services";
import { securityServices } from "@/config/security";
import { marketingServices } from "@/config/marketing";
import {
  getServicePage,
  servicePagePath,
  type ServicePage,
} from "@/config/service-pages";
import { absoluteUrl, breadcrumbJsonLd, organizationRef } from "@/lib/seo";
import { jsonLd } from "@/lib/json-ld";
import { PageHeader } from "@/components/layout/page-header";
import { Section, SectionHeading } from "@/components/layout/section";
import { Asterisk } from "@/components/brand/decor";
import { ActionLink } from "@/components/ui-brand/action";
import { SecurityFaq } from "@/components/sections/security-faq";
import { FinalCta } from "@/components/sections/final-cta";

/**
 * Template for every dedicated service page.
 *
 * Order follows how a buyer evaluates a provider: is this about my problem
 * (header, "you probably need this if"), what exactly do I get (included),
 * how does it run (process), what worries me (FAQ), what else is related.
 *
 * Structured data on each page: a Service linked to the site-wide
 * Organization, a BreadcrumbList, and a FAQPage built from the same questions
 * the page renders, so the markup always matches the visible content.
 */
export function ServiceDetail({ page }: { page: ServicePage }) {
  const isSecurity = page.category === "security";
  const isGrowth = page.category === "growth";
  const parent = isSecurity
    ? { name: "Cybersecurity", href: "/cybersecurity" }
    : isGrowth
      ? { name: "Marketing", href: "/marketing" }
      : { name: "Services", href: "/services" };
  const path = servicePagePath(page);

  const summary = isSecurity
    ? securityServices.find((service) => service.id === page.serviceId)
    : isGrowth
      ? marketingServices.find((service) => service.id === page.serviceId)
      : services.find((service) => service.id === page.serviceId);
  const capabilities = summary
    ? "scope" in summary
      ? summary.scope
      : summary.points
    : [];
  const standards = summary && "standards" in summary ? summary.standards : [];

  const related = page.related
    .map(
      (slug) =>
        getServicePage("build", slug) ??
        getServicePage("growth", slug) ??
        getServicePage("security", slug),
    )
    .filter((item): item is ServicePage => Boolean(item));

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${absoluteUrl(path)}#service`,
        name: page.name,
        serviceType: page.name,
        description: page.metaDescription,
        url: absoluteUrl(path),
        provider: organizationRef,
        areaServed: [
          { "@type": "City", name: "Ahmedabad" },
          { "@type": "Country", name: "India" },
          "Worldwide",
        ],
        category: isSecurity
          ? "Cybersecurity"
          : isGrowth
            ? "Digital marketing"
            : "Software development",
      },
      breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: parent.name, path: parent.href },
        { name: page.name, path },
      ]),
      {
        "@type": "FAQPage",
        mainEntity: page.faqs.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(structuredData)}
      />

      <PageHeader
        breadcrumbs={[
          { name: "Home", href: "/" },
          parent,
          { name: page.name, href: path },
        ]}
        eyebrow={
          isSecurity
            ? "Cybersecurity service"
            : isGrowth
              ? "Marketing service"
              : "Development service"
        }
        watermark={isSecurity ? "Secure" : isGrowth ? "Grow" : "Build"}
        title={page.h1}
        description={page.intro[0]}
        aside={
          <div className="panel-feature panel-edge flex flex-col gap-4 rounded-xl p-6 lg:w-[300px]">
            <p className="label-mono text-ink-soft">At a glance</p>
            <ul className="flex flex-col gap-2.5">
              {capabilities.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <Check
                    className="text-lime mt-0.5 size-4 shrink-0"
                    strokeWidth={2.5}
                    aria-hidden="true"
                  />
                  <span className="text-ink-soft t-sm">{item}</span>
                </li>
              ))}
            </ul>
            <ActionLink href="/contact" className="mt-1 w-full">
              {isSecurity ? "Scope an engagement" : "Book a call"}
              <ArrowRight className="size-4" aria-hidden="true" />
            </ActionLink>
          </div>
        }
      />

      {/* Overview: the rest of the introduction beside the situations that
          bring people to this page. */}
      <Section className="field-base glow-left relative">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          <div className="flex flex-col gap-5">
            <h2 className="type-h2 text-ink">
              {isSecurity
                ? "Why this testing matters"
                : isGrowth
                  ? "What this actually changes"
                  : "What we build, and why it holds up"}
            </h2>
            {page.intro.slice(1).map((paragraph) => (
              <p key={paragraph} className="text-ink-soft measure t-lead leading-relaxed">
                {paragraph}
              </p>
            ))}
            {standards.length ? (
              <div className="mt-2 flex flex-col gap-3">
                <p className="label-mono text-ink-soft">Measured against</p>
                <ul className="flex flex-wrap gap-2">
                  {standards.map((standard) => (
                    <li
                      key={standard}
                      className="label-mono text-ink rounded-full border border-[rgba(255,255,255,0.18)] px-3 py-1.5"
                    >
                      {standard}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          <div className="card-solid flex h-fit flex-col gap-4 rounded-xl p-7 md:p-8">
            <h2 className="font-display text-ink type-h3 font-bold">
              You probably need this if
            </h2>
            <ul className="flex flex-col gap-3">
              {page.signs.map((sign) => (
                <li key={sign} className="flex items-start gap-3">
                  <Asterisk className="text-lime mt-1.5 size-2.5 shrink-0" />
                  <span className="text-ink-soft t-base leading-snug">{sign}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section className="tex-rules glow-right relative border-t border-[rgba(255,255,255,0.115)]">
        <SectionHeading
          eyebrow="Deliverables"
          title={`${page.name}: what’s included`}
        />
        <ul className="mt-12 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {page.included.map((item, index) => (
            <li
              key={item.title}
              className="card-solid reveal flex flex-col gap-3 rounded-lg p-6"
              style={{ animationDelay: `${Math.min(index, 5) * 60}ms` }}
            >
              <span className="numeral text-lime t-sm leading-none" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="font-display text-ink t-lead font-semibold">
                {item.title}
              </h3>
              <p className="text-ink-soft t-sm leading-relaxed">{item.detail}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section className="field-top relative">
        <SectionHeading
          eyebrow="How it works"
          title={
            isSecurity
              ? "How the engagement runs"
              : isGrowth
                ? "How the work runs"
                : "How the project runs"
          }
        />
        <ol className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {page.process.map((step, index) => (
            <li key={step.title} className="flex flex-col gap-3 border-t border-[rgba(255,255,255,0.16)] pt-5">
              <span className="numeral numeral-lg text-lime leading-none" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="font-display text-ink t-lead font-semibold">
                {step.title}
              </h3>
              <p className="text-ink-soft t-sm leading-relaxed">{step.detail}</p>
            </li>
          ))}
        </ol>
      </Section>

      <SecurityFaq
        items={page.faqs}
        eyebrow="FAQ"
        title={`${page.name}: common questions`}
        description="Straight answers to what people ask us before they start."
      />

      {related.length ? (
        <Section dense className="relative border-t border-[rgba(255,255,255,0.115)]">
          <h2 className="type-h3 text-ink font-display font-bold">Related services</h2>
          <ul className="mt-8 grid gap-3 md:grid-cols-3">
            {related.map((item) => (
              <li key={item.slug}>
                <Link
                  href={servicePagePath(item)}
                  className="card-solid group flex h-full cursor-pointer flex-col gap-2 rounded-lg p-6 transition-transform duration-300 ease-out hover:-translate-y-1"
                >
                  <span className="label-mono text-ink-soft">
                    {item.category === "security" ? "Cybersecurity" : "Development"}
                  </span>
                  <span className="font-display text-ink t-lead flex items-start justify-between gap-3 font-semibold">
                    {item.name}
                    <ArrowUpRight
                      className="mt-1 size-4 shrink-0 transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      <FinalCta
        title={
          isSecurity
            ? "Get it tested properly"
            : isGrowth
              ? "Let's talk about growth"
              : "Tell us what you're building"
        }
        description={
          isSecurity
            ? "Tell us what you have built and who is asking about its security. We will recommend the engagement that actually fits."
            : isGrowth
              ? "Tell us what you sell and who you sell it to. You get an honest read on which channel is worth your budget first — including if the answer is none of them yet."
              : "A short call, a direct answer on whether we're the right fit, and a written scope if we are."
        }
      />
    </>
  );
}
