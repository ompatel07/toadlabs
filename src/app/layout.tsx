import type { Metadata } from "next";
import {
  Inter,
  Inter_Tight,
  JetBrains_Mono,
  Bagel_Fat_One,
} from "next/font/google";
import { siteConfig } from "@/config/site";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { motionInitScript } from "@/components/ui-brand/motion-toggle";
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

/**
 * Bagel Fat One — the hero wordmark face.
 *
 * A single-weight display face with very thick rounded strokes. Paired with the
 * displacement filter on the wordmark it gives the liquid/blobby "wavy ink"
 * look; a normal grotesk under the same filter just reads as a printing fault,
 * because the strokes are too thin to bend visibly.
 *
 * Only used for the hero wordmark — the rest of the site stays on Inter Tight,
 * so the playful face never leaks into body or section headings.
 */
const bagelFatOne = Bagel_Fat_One({
  variable: "--font-wordmark-face",
  subsets: ["latin"],
  display: "swap",
  weight: "400",
  preload: true,
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
      className={`${inter.variable} ${interTight.variable} ${jetbrainsMono.variable} ${bagelFatOne.variable} h-full`}
    >
      <head>
        {/* Applies the stored motion preference before first paint, so the
            page never renders one frame with the wrong setting. */}
        <script dangerouslySetInnerHTML={{ __html: motionInitScript }} />
      </head>
      <body className="grain flex min-h-full flex-col overflow-x-hidden">
        <a
          href="#main"
          className="bg-ink sr-only cursor-pointer rounded-full focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:px-5 focus:py-3 focus:text-sm focus:font-medium focus:text-white"
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
        <div className="aurora" aria-hidden="true">
          <span className="aurora-blob" />
          <span className="aurora-blob" />
          <span className="aurora-blob" />
        </div>

        <div className="relative z-10 flex min-h-full flex-1 flex-col">
          <SiteHeader />
          <main id="main" className="flex-1">
            {children}
          </main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
