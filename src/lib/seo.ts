import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

/**
 * Shared SEO helpers.
 *
 * Every page builds its metadata through `pageMetadata`, so titles, canonical
 * URLs, link previews and Twitter cards are always complete and consistent.
 * This matters because Next.js REPLACES rather than merges nested objects: a
 * page that set only `openGraph.title` would silently lose the preview image
 * and description inherited from the layout.
 */

export type OgImage = "default" | "services" | "marketing" | "cybersecurity";

const OG_IMAGES: Record<OgImage, { url: string; alt: string }> = {
  default: {
    url: "/og/default.png",
    alt: "OFFSCRIPT — digital marketing, software and cybersecurity company in Ahmedabad",
  },
  services: {
    url: "/og/services.png",
    alt: "OFFSCRIPT software development services: websites, apps, SaaS and AI automation",
  },
  marketing: {
    url: "/og/marketing.png",
    alt: "OFFSCRIPT digital marketing services: SEO, paid ads, social media and brand",
  },
  cybersecurity: {
    url: "/og/cybersecurity.png",
    alt: "OFFSCRIPT cybersecurity services: VAPT, penetration testing and security audits",
  },
};

/**
 * Absolute URL for a site path, with the trailing slash the static export
 * serves (`trailingSlash: true`). Canonicals, sitemap entries and structured
 * data must all agree on the exact same URL, or crawlers see duplicates.
 */
export function absoluteUrl(path = "/"): string {
  const clean = path === "/" ? "/" : `/${path.replace(/^\/+|\/+$/g, "")}/`;
  return `${siteConfig.siteUrl}${clean}`;
}

interface PageMetadataInput {
  /** Page title, before the " — OFFSCRIPT" suffix. */
  title: string;
  description: string;
  path: string;
  image?: OgImage;
  /** Use the title exactly as given, without the brand suffix. */
  absoluteTitle?: boolean;
  noindex?: boolean;
}

export function pageMetadata({
  title,
  description,
  path,
  image = "default",
  absoluteTitle = false,
  noindex = false,
}: PageMetadataInput): Metadata {
  const fullTitle = absoluteTitle ? title : `${title} — ${siteConfig.name}`;
  const og = OG_IMAGES[image];
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: absoluteUrl(path) },
    openGraph: {
      type: "website",
      locale: "en_IN",
      siteName: siteConfig.name,
      url: absoluteUrl(path),
      title: fullTitle,
      description,
      images: [{ url: og.url, width: 1200, height: 630, alt: og.alt }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [og.url],
    },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}

/** schema.org BreadcrumbList from ordered [name, path] pairs. */
export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/** Reference to the Organization node emitted site-wide by the layout. */
export const organizationRef = { "@id": `${siteConfig.siteUrl}/#organization` };
