import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

// Required by `output: "export"`: generated at build time, never per request.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteConfig.siteUrl}/sitemap.xml`,
  };
}
