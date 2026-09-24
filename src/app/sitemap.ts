import type { MetadataRoute } from "next";
import { caseStudies } from "@/config/work";
import { servicePages, servicePagePath } from "@/config/service-pages";
import { absoluteUrl } from "@/lib/seo";

// Required by `output: "export"`: generated at build time, never per request.
export const dynamic = "force-static";

/**
 * Every indexable URL, written exactly as the canonical tags write it
 * (absoluteUrl adds the trailing slash the static export serves). A sitemap
 * that lists /services while the page declares /services/ as canonical sends
 * crawlers two URLs for one page.
 *
 * Placeholder case studies, and /work while any exist, carry `noindex`, so
 * they are left out rather than sending mixed signals.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const hasPlaceholders = caseStudies.some((study) => study.isPlaceholder);

  const core: { path: string; priority: number }[] = [
    { path: "/", priority: 1 },
    { path: "/services", priority: 0.9 },
    { path: "/marketing", priority: 0.9 },
    { path: "/cybersecurity", priority: 0.9 },
    { path: "/about", priority: 0.6 },
    { path: "/contact", priority: 0.7 },
    { path: "/security", priority: 0.4 },
    ...(hasPlaceholders ? [] : [{ path: "/work", priority: 0.6 }]),
  ];

  return [
    ...core.map(({ path, priority }) => ({
      url: absoluteUrl(path),
      lastModified,
      changeFrequency: "monthly" as const,
      priority,
    })),
    ...servicePages.map((page) => ({
      url: absoluteUrl(servicePagePath(page)),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...caseStudies
      .filter((study) => !study.isPlaceholder)
      .map((study) => ({
        url: absoluteUrl(`/work/${study.slug}`),
        lastModified,
        changeFrequency: "yearly" as const,
        priority: 0.5,
      })),
  ];
}
