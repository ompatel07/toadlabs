import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { PageTransition } from "@/components/layout/page-transition";
import { Cursor } from "@/components/ui-brand/cursor";
import { IntroReveal } from "@/components/brand/intro-reveal";

/**
 * Chrome for the marketing site: header, footer, intro curtain, cursor and the
 * drifting colour field.
 *
 * It lives in a route group rather than the root layout so a page can opt out
 * of all of it — /playbook is a standalone sales page with its own minimal
 * chrome, and a nested layout cannot remove what the root layout renders.
 * Route groups do not appear in the URL, so every path is unchanged.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#main" className="skip-link cursor-pointer">
        Skip to content
      </a>

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
    </>
  );
}
