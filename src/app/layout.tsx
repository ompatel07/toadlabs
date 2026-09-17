import type { Metadata, Viewport } from "next";
import {
  Inter,
  Inter_Tight,
  JetBrains_Mono,
} from "next/font/google";
import { siteConfig } from "@/config/site";
import { servicePages, servicePagePath } from "@/config/service-pages";
import { absoluteUrl, pageMetadata } from "@/lib/seo";
import { jsonLd } from "@/lib/json-ld";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { PageTransition } from "@/components/layout/page-transition";
import { Cursor } from "@/components/ui-brand/cursor";
import { IntroReveal } from "@/components/brand/intro-reveal";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
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
 * WHAT Toad Labs is — an IT services and cybersecurity company in Ahmedabad —
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
        name: "IT services and cybersecurity services",
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
        <a
          href="#main"
          className="skip-link cursor-pointer"
        >
          Skip to content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLd(organizationJsonLd)}
        />
        {/* Drifting colour field behind the whole site. Decorative, fixed,
            and pointer-transparent; the grain overlay above it hides the
            banding that large soft gradients cause on 8-bit displays. */}
        <IntroReveal />
        <Cursor />

        <div className="aurora" aria-hidden="true">
          <span className="aurora-blob" />
          <span className="aurora-blob" />
          <span className="aurora-blob" />
        </div>

        <div className="relative z-10 flex min-h-full flex-1 flex-col">
          <SiteHeader />
          <main id="main" className="flex-1">
            <PageTransition>{children}</PageTransition>
          </main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
