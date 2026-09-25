"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, MessageCircle, X } from "lucide-react";
import { mainNav, siteConfig, whatsappUrl } from "@/config/site";
import { Wordmark } from "@/components/brand/wordmark";
import { ActionLink } from "@/components/ui-brand/action";
import { cn } from "@/lib/utils";

/**
 * Site header.
 *
 * Desktop: a floating glass pill that contracts as the page scrolls (CSS
 * scroll timeline, see globals.css — no listener). Nav items share one
 * underline gesture: it grows from the centre on hover and sits full width on
 * the current page, so hover and active are the same idea at two lengths
 * rather than two unrelated treatments.
 *
 * Mobile: a full-screen sheet rather than the four-row dropdown this used to
 * open. A phone menu's one advantage is the whole screen, and a dropdown
 * throws it away — the sheet gets nav at display size, both direct contact
 * routes, and the location, which is most of what someone opening a menu on a
 * phone is actually after.
 *
 * Accessibility, all of it deliberate:
 *  - the sheet is aria-modal with a label, and background scroll is locked
 *    while it is open
 *  - focus moves into the sheet on open and returns to the toggle on close,
 *    whether it closes by Escape, by the close button, or by navigating
 *  - Tab is trapped inside the sheet, so focus cannot wander behind the
 *    overlay into content the visitor cannot see
 *  - the panel is unmounted when closed rather than hidden, so nothing behind
 *    it is reachable and no stale node sits in the tab order
 */
export function SiteHeader() {
  const pathname = usePathname();
  // The sheet remembers the route it was opened on, so navigating closes it
  // by derivation — no effect resetting state after the route changes.
  const [openedOn, setOpenedOn] = useState<string | null>(null);
  const open = openedOn === pathname;
  const setOpen = (next: boolean) => setOpenedOn(next ? pathname : null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    // Lock the page behind the sheet. Restoring the previous value rather than
    // clearing it means this cannot stomp a lock set by something else.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    sheetRef.current?.querySelector<HTMLElement>("a, button")?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenedOn(null);
        toggleRef.current?.focus();
        return;
      }
      if (event.key !== "Tab") return;

      // Trap: wrap focus at both ends of the sheet.
      const focusables = sheetRef.current?.querySelectorAll<HTMLElement>(
        "a[href], button:not([disabled])",
      );
      if (!focusables || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      {/* Reading-position line. Decorative in the accessibility sense — the
          information it carries is already in the scrollbar — so it is hidden
          from assistive tech rather than announced as a progressbar that never
          receives focus. */}
      <div className="scroll-progress" aria-hidden="true" />

      <header className="header-shell sticky top-0 z-50 pt-3 sm:pt-5">
        <div className="container-tl">
          <div className="glass-pill flex h-14 items-center justify-between gap-3 pr-2 pl-3 sm:h-16 sm:pr-3 sm:pl-4">
            <Link
              href="/"
              className="inline-flex min-h-[44px] cursor-pointer items-center rounded-full px-1 py-1"
              aria-label={`${siteConfig.name} — home`}
            >
              <Wordmark />
            </Link>

            <nav
              aria-label="Main"
              className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-0.5 lg:flex"
            >
              {mainNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cn(
                    "nav-link cursor-pointer rounded-full px-3.5 pt-2 pb-3 text-sm font-medium transition-colors duration-200 ease-out",
                    isActive(item.href)
                      ? "text-ink"
                      : "text-ink-soft hover:text-ink",
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-1.5">
              <ActionLink
                href="/contact"
                size="sm"
                className="hidden sm:inline-flex"
              >
                Book a call
              </ActionLink>

              <button
                ref={toggleRef}
                type="button"
                onClick={() => setOpen(true)}
                aria-expanded={open}
                aria-controls="mobile-nav"
                className="text-ink inline-flex size-10 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 ease-out hover:bg-[rgba(255,255,255,0.07)] lg:hidden"
              >
                <Menu className="size-5" aria-hidden="true" />
                <span className="sr-only">Open menu</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {open ? (
        <div
          id="mobile-nav"
          ref={sheetRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="nav-sheet bg-canvas/98 fixed inset-0 z-[70] flex flex-col backdrop-blur-xl lg:hidden"
        >
          <div className="container-tl flex h-14 shrink-0 items-center justify-between pt-3 sm:h-16 sm:pt-5">
            <Wordmark />
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                toggleRef.current?.focus();
              }}
              className="text-ink inline-flex size-10 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 ease-out hover:bg-[rgba(255,255,255,0.07)]"
            >
              <X className="size-5" aria-hidden="true" />
              <span className="sr-only">Close menu</span>
            </button>
          </div>

          <nav
            aria-label="Mobile"
            className="container-tl flex flex-1 flex-col justify-center gap-1 pb-8"
          >
            {mainNav.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                // Navigating closes the sheet by itself, but tapping the page
                // you are already on changes no route — close it explicitly.
                onClick={() => setOpenedOn(null)}
                style={{ animationDelay: `${60 + index * 55}ms` }}
                className={cn(
                  "nav-sheet-item group/nav flex items-center justify-between gap-4 border-b border-[rgba(255,255,255,0.1)] py-5",
                  isActive(item.href) ? "text-lime" : "text-ink",
                )}
              >
                <span className="font-display type-h3 font-bold">
                  {item.label}
                </span>
                <ArrowUpRight
                  className="text-ink-soft size-5 transition-transform duration-300 ease-out group-hover/nav:translate-x-0.5 group-hover/nav:-translate-y-0.5"
                  aria-hidden="true"
                />
              </Link>
            ))}

            <div
              className="nav-sheet-item mt-8 flex flex-col gap-3"
              style={{ animationDelay: `${60 + mainNav.length * 55}ms` }}
            >
              <ActionLink href="/contact" className="w-full" onClick={() => setOpenedOn(null)}>
                Book a call
              </ActionLink>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-[rgba(255,255,255,0.2)] t-base font-medium transition-colors duration-200 ease-out hover:border-[rgba(255,255,255,0.4)]"
              >
                <MessageCircle className="size-4" aria-hidden="true" />
                WhatsApp us
                <span className="sr-only">(opens in a new tab)</span>
              </a>
              <p className="label-mono text-ink-soft mt-2 text-center">
                {siteConfig.location.full}
              </p>
            </div>
          </nav>
        </div>
      ) : null}
    </>
  );
}
