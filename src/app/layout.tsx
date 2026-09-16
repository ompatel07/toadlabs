import type { Metadata } from "next";
import {
  Inter,
  Inter_Tight,
  JetBrains_Mono,
} from "next/font/google";
import { siteConfig } from "@/config/site";
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

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    url: siteConfig.siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  robots: { index: true, follow: true },
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
        {/* Scroll progress. Decorative and CSS-driven, so it is hidden from
            assistive tech and costs no scroll listener. */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px]"
        >
          <div className="scroll-progress bg-lime h-full w-full" />
        </div>

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
