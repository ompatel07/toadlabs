import type { Metadata } from "next";
import { faqs } from "@/config/home";
import { siteConfig } from "@/config/site";
import { Hero } from "@/components/sections/hero";
import { TrustStrip } from "@/components/sections/trust-strip";
import { StandardsBar } from "@/components/sections/standards-bar";
import { Pillars } from "@/components/sections/pillars";
import { ServicesPreview } from "@/components/sections/services-preview";
import { SecurityPreview } from "@/components/sections/security-preview";
import { Process } from "@/components/sections/process";
import { Guarantees } from "@/components/sections/guarantees";
import { SelectedWork } from "@/components/sections/selected-work";
import { StackMarquee } from "@/components/sections/stack-marquee";
import { Faq } from "@/components/sections/faq";
import { FinalCta } from "@/components/sections/final-cta";

export const metadata: Metadata = {
  // Home uses the layout's default title rather than the "%s — Toad Labs"
  // template, so the brand name is not repeated.
  title: {
    absolute: `${siteConfig.name} — ${siteConfig.tagline}`,
  },
  description: siteConfig.description,
  alternates: { canonical: "/" },
};

/**
 * Organization + FAQPage structured data. The FAQ entries are generated from
 * the same config the accordion renders, so the markup can never drift from
 * what is on the page.
 */
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": `${siteConfig.siteUrl}/#organization`,
      name: siteConfig.name,
      description: siteConfig.description,
      url: siteConfig.siteUrl,
      email: siteConfig.email,
      areaServed: "Worldwide",
      address: {
        "@type": "PostalAddress",
        addressLocality: siteConfig.location.city,
        addressRegion: siteConfig.location.region,
        addressCountry: "IN",
      },
      knowsAbout: [
        "Web application development",
        "Mobile application development",
        "SaaS product development",
        "AI automation",
        "Penetration testing",
        "Vulnerability assessment",
      ],
    },
    {
      "@type": "FAQPage",
      "@id": `${siteConfig.siteUrl}/#faq`,
      mainEntity: faqs.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        // Content is authored by us in typed config, not user input.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {/* Order is a credibility argument: what we claim (trust strip), what
          measures it (standards), what we do (pillars, services), the security
          weight, how we run it (process), what we commit to (guarantees), then
          evidence and objections. */}
      <Hero />
      <TrustStrip />
      <StandardsBar />
      <Pillars />
      <ServicesPreview />
      <SecurityPreview />
      <Process />
      <Guarantees />
      <SelectedWork />
      <StackMarquee />
      <Faq />
      <FinalCta />
    </>
  );
}
