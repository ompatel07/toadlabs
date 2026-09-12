import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { caseStudies } from "@/config/work";

// Required by `output: "export"`: generated at build time, never per request.
export const dynamic = "force-static";

/**
 * Placeholder case studies are excluded — they carry `noindex`, so listing them
 * here would send mixed signals.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = ["", "/services", "/cybersecurity", "/work", "/about", "/contact", "/security"];

  const pages = routes.map((route) => ({
    url: `${siteConfig.siteUrl}${route}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  const studies = caseStudies
    .filter((study) => !study.isPlaceholder)
    .map((study) => ({
      url: `${siteConfig.siteUrl}/work/${study.slug}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    }));

  return [...pages, ...studies];
}
