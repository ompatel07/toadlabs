import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { siteConfig } from "@/config/site";
import { servicePages, servicePagePath } from "@/config/service-pages";
import { absoluteUrl, pageMetadata } from "@/lib/seo";
import { jsonLd } from "@/lib/json-ld";
import "./globals.css";

/**
 * The three families, self-hosted.
 *
 * WHY NOT next/font/google
 * It downloads from Google at BUILD time, and the deploy host could not do it
 * reliably: the loader took a font URL that did not end in a known extension
 * and threw on a null regex match, failing the build. It failed the same way
 * under both bundlers, so it was never a bundler problem — the build simply
 * depended on a third party answering correctly, and one day it did not.
 *
 * These files are committed, so the build makes no network call for fonts. It
 * is also faster, and one fewer thing that can take the site down.
 *
 * Each is the LATIN subset of the family's VARIABLE font: three files instead
 * of the twenty static ones the old setup emitted, covering every weight
 * rather than only the four that were listed. Inter, Inter Tight and JetBrains
 * Mono are all under the SIL Open Font License, which permits this — see
 * fonts/OFL.txt.
 *
 * fallback and adjustFontFallback keep the metric-matched fallback that
 * next/font/google applied on our behalf, so swapping the font in does not
 * shift the layout.
 */
const inter = localFont({
  src: "./fonts/Inter-latin-variable.woff2",
  variable: "--font-inter",
  display: "swap",
  weight: "100 900",
  style: "normal",
  fallback: ["system-ui", "arial"],
  adjustFontFallback: "Arial",
});

const interTight = localFont({
  src: "./fonts/InterTight-latin-variable.woff2",
  variable: "--font-inter-tight",
  display: "swap",
  weight: "100 900",
  style: "normal",
  fallback: ["system-ui", "arial"],
  adjustFontFallback: "Arial",
});

const jetbrainsMono = localFont({
  src: "./fonts/JetBrainsMono-latin-variable.woff2",
  variable: "--font-jetbrains-mono",
  display: "swap",
  weight: "100 800",
  style: "normal",
  fallback: ["ui-monospace", "monospace"],
  adjustFontFallback: false,
});

const defaults = pageMetadata({
  title: `${siteConfig.name} — ${siteConfig.category}`,
  description: siteConfig.description,
  path: "/",
  absoluteTitle: true,
});

export const metadata: Metadata = {
  ...defaults,
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: `${siteConfig.name} — ${siteConfig.category}`,
    template: `%s — ${siteConfig.name}`,
  },
  // No layout-level canonical: it would be inherited by any page that forgot
  // its own and point that page at the home page.
  alternates: undefined,
  applicationName: siteConfig.name,
  category: "technology",
  creator: siteConfig.name,
  publisher: siteConfig.name,
  formatDetection: { telephone: false, email: false, address: false },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0c11",
  colorScheme: "dark",
};

/**
 * Site-wide entity data, on every page. Search engines use it to understand
 * WHAT OFFSCRIPT is — a digital marketing, software and cybersecurity company
 * and to connect every page's own structured data back to one organisation
 * through its @id.
 */
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": `${siteConfig.siteUrl}/#organization`,
      name: siteConfig.name,
      description: siteConfig.description,
      slogan: siteConfig.tagline,
      url: absoluteUrl("/"),
      logo: `${siteConfig.siteUrl}/icon.png`,
      image: `${siteConfig.siteUrl}/og/default.png`,
      email: siteConfig.email,
      // No `telephone`. It was a personal mobile, and structured data is the
      // first thing a harvester reads. Email is the published channel.
      contactPoint: {
        "@type": "ContactPoint",
        email: siteConfig.email,
        contactType: "sales",
        areaServed: "IN",
        availableLanguage: "English",
      },
      address: {
        "@type": "PostalAddress",
        addressLocality: siteConfig.location.city,
        addressRegion: siteConfig.location.region,
        addressCountry: "IN",
      },
      areaServed: [
        { "@type": "City", name: "Ahmedabad" },
        { "@type": "State", name: "Gujarat" },
        { "@type": "Country", name: "India" },
        "Worldwide",
      ],
      knowsAbout: [
        "Digital marketing",
        "Search engine optimisation",
        "Google Ads",
        "Pay-per-click advertising",
        "Social media marketing",
        "Content marketing",
        "Brand strategy",
        "Conversion rate optimisation",
        "Website development",
        "Web application development",
        "Mobile app development",
        "MVP development",
        "SaaS development",
        "CRM development",
        "AI automation",
        "WhatsApp Business API automation",
        "AI chatbot development",
        "AI voice agents",
        "Custom software development",
        "Cybersecurity",
        "VAPT",
        "Penetration testing",
        "Security audits",
        "Secure code review",
        "Cloud security",
        "ISO 27001 readiness",
        "SOC 2 readiness",
        "Incident response",
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Digital marketing, software and cybersecurity services",
        itemListElement: servicePages.map((page) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: page.name,
            url: absoluteUrl(servicePagePath(page)),
          },
        })),
      },
    },
    {
      "@type": "WebSite",
      "@id": `${siteConfig.siteUrl}/#website`,
      name: siteConfig.name,
      url: absoluteUrl("/"),
      inLanguage: "en-IN",
      publisher: { "@id": `${siteConfig.siteUrl}/#organization` },
    },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-IN"
      className={`${inter.variable} ${interTight.variable} ${jetbrainsMono.variable} h-full`}
    >
      <body className="grain flex min-h-full flex-col overflow-x-hidden">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLd(organizationJsonLd)}
        />
        {children}
      </body>
    </html>
  );
}
