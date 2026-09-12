import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  /**
   * Fully static export.
   *
   * Every route on this site is prerendered — there are no server components
   * reading request data, no route handlers, and no ISR. Exporting to plain
   * HTML gives the best possible Lighthouse performance and lets the site be
   * hosted anywhere with no Node runtime.
   *
   * Consequence to know about: Next.js API routes are unavailable. The contact
   * form is a client-side stub by design (src/lib/contact.ts); when it is wired
   * up, point it at a hosted endpoint — a Netlify Function, or whatever service
   * you choose — rather than adding an app/api route.
   */
  output: "export",

  // Required by `output: "export"` — there is no server to optimise images.
  images: { unoptimized: true },

  // Emit /services/index.html rather than /services.html, so static hosts
  // resolve clean URLs consistently.
  trailingSlash: true,
};

export default nextConfig;
