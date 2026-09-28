import type { Metadata } from "next";
import { faqs, product } from "@/config/playbook";
import { siteConfig } from "@/config/site";
import { absoluteUrl, pageMetadata } from "@/lib/seo";
import { jsonLd } from "@/lib/json-ld";
import {
  PlaybookFit,
  PlaybookHero,
  PlaybookDeliverables,
  PlaybookInside,
  PlaybookLibrary,
  PlaybookPlan,
  PlaybookProblem,
  PlaybookReplies,
  PlaybookResearch,
  PlaybookRewrite,
  PlaybookSystem,
  PlaybookTicker,
  PlaybookTracker,
  PlaybookWebsites,
} from "@/components/playbook/sections";
import { PlaybookFaq } from "@/components/playbook/faq";
import { PlaybookCheckoutSection } from "@/components/playbook/checkout";
import { PlaybookStickyBar } from "@/components/playbook/sticky-bar";

export const metadata: Metadata = pageMetadata({
  title: `${product.name} — outreach system for freelance devs`,
  description: product.summary,
  path: "/playbook",
  absoluteTitle: true,
  // Stays out of search until launch. It is also left out of sitemap.ts.
  noindex: true,
});

/**
 * Product + Offer and FAQPage markup. The price here is the same constant the
 * Netlify Function charges, so the marked-up price cannot drift from the real
 * one. Written through the site's jsonLd() escaper.
 */
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Product",
      "@id": `${absoluteUrl("/playbook")}#product`,
      name: product.name,
      description: product.summary,
      brand: { "@type": "Brand", name: siteConfig.name },
      category: "Digital course material",
      offers: {
        "@type": "Offer",
        price: String(product.price),
        priceCurrency: product.currency,
        availability: "https://schema.org/InStock",
        url: absoluteUrl("/playbook"),
        seller: { "@type": "Organization", name: siteConfig.name },
      },
    },
    {
      "@type": "FAQPage",
      "@id": `${absoluteUrl("/playbook")}#faq`,
      mainEntity: faqs.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
  ],
};

export default function PlaybookPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(structuredData)} />

      <PlaybookHero />
      <PlaybookTicker />
      <PlaybookReplies />
      <PlaybookProblem />
      <PlaybookRewrite />
      <PlaybookSystem />
      <PlaybookInside />
      <PlaybookDeliverables />
      <PlaybookTracker />
      <PlaybookLibrary />
      <PlaybookPlan />
      <PlaybookResearch />
      <PlaybookWebsites />
      <PlaybookFit />
      <PlaybookFaq />
      <PlaybookCheckoutSection />
      <PlaybookStickyBar />
    </>
  );
}
