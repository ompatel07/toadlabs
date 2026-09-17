import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Asterisk, TickerStrip } from "@/components/brand/decor";
import { ActionLink } from "@/components/ui-brand/action";

/**
 * 404.
 *
 * There was no not-found.tsx, so a mistyped URL got Next's unstyled default —
 * a bare white page with no header, no footer, and no way back into the site.
 * On a static export that page is a real artefact that ships, and it was the
 * one screen on the domain that did not look like us.
 *
 * No metadata export: Next serves this with a 404 status and the route is not
 * in the sitemap, so there is nothing to describe to a crawler.
 */

const routes = [
  { href: "/services", label: "Services", hint: "Ten disciplines, one standard" },
  { href: "/cybersecurity", label: "Cybersecurity", hint: "How we test, and against what" },
  { href: "/work", label: "Work", hint: "Selected engagements" },
  { href: "/about", label: "About", hint: "Who is actually doing the work" },
];

export default function NotFound() {
  return (
    <>
      <section className="section tex-circuit glow-left relative overflow-hidden">
        {/* Ghost numerals behind the message. Decorative and aria-hidden — the
            page's actual heading carries the meaning. */}
        <span
          aria-hidden="true"
          className="numeral pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 leading-none whitespace-nowrap select-none text-[clamp(14rem,42vw,34rem)] text-[rgba(255,255,255,0.057)]"
        >
          404
        </span>

        <div className="container-tl relative">
          <p className="label-mono text-lime-ink flex items-center gap-2">
            <Asterisk className="size-3" />
            Error 404
          </p>

          <h1 className="font-display text-ink type-display mt-5 max-w-[16ch] font-bold">
            This page isn&apos;t here
          </h1>

          <p className="text-ink-soft measure mt-5 t-lead leading-relaxed">
            Either the link is wrong, or we moved something and did not redirect
            it properly. If that was our fault we would genuinely like to know —
            a broken link is a bug like any other.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <ActionLink href="/">
              Back to the homepage
              <ArrowRight className="size-4" aria-hidden="true" />
            </ActionLink>
            <Link
              href="/contact"
              className="border-ink text-ink hover:bg-ink inline-flex h-13 cursor-pointer items-center gap-2 rounded-full border-2 px-6 t-base font-medium transition-colors duration-250 ease-out hover:text-canvas"
            >
              Tell us the link was broken
            </Link>
          </div>
        </div>
      </section>

      <TickerStrip
        items={["404", "Page not found", "Try one of these instead"]}
        tone="lime"
        speed="26s"
        reverse
      />

      <section className="section-dense tex-sonar relative">
        <div className="container-tl">
          <ul className="border-t border-[rgba(255,255,255,0.184)]">
            {routes.map((route, index) => (
              <li key={route.href} className="border-b border-[rgba(255,255,255,0.184)]">
                <Link
                  href={route.href}
                  className="group/link grid cursor-pointer grid-cols-[auto_1fr_auto] items-center gap-5 py-6 md:gap-8"
                >
                  <span
                    className="numeral numeral-md text-ink/15 leading-none transition-colors duration-300 ease-out group-hover/link:text-[color:var(--lime-deep)]"
                    aria-hidden="true"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="flex flex-col gap-1">
                    <span className="font-display text-ink type-h3 font-bold transition-transform duration-300 ease-out motion-safe:md:group-hover/link:translate-x-2">
                      {route.label}
                    </span>
                    <span className="text-ink-soft t-sm">{route.hint}</span>
                  </span>
                  <ArrowUpRight
                    className="text-ink size-6 transition-transform duration-300 ease-out motion-safe:group-hover/link:translate-x-1 motion-safe:group-hover/link:-translate-y-1"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
