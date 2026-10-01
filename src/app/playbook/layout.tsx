import { PlaybookFooter } from "@/components/playbook/sections";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";

/**
 * Chrome for /playbook and its policy pages.
 *
 * Deliberately not the site header: this is a standalone sales page arriving
 * from a Reel, and a nav bar full of service links is an exit. The only route
 * back to OFFSCRIPT is the footer wordmark. `.playbook` scopes the page's own
 * accent tokens (see globals.css).
 */
export default function PlaybookLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="playbook relative z-10 flex min-h-full flex-1 flex-col">
      <a href="#main" className="skip-link cursor-pointer">
        Skip to content
      </a>
      <main id="main" className="flex-1">
        {children}
      </main>
      <PlaybookFooter />
      <WhatsAppButton topic="playbook" />
    </div>
  );
}
