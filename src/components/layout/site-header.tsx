"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { mainNav, siteConfig } from "@/config/site";
import { Wordmark } from "@/components/brand/wordmark";
import { ActionLink } from "@/components/ui-brand/action";
import { MotionToggle } from "@/components/ui-brand/motion-toggle";
import { cn } from "@/lib/utils";

/** Floating glass pill that sticks to the top of the viewport. */
export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Escape closes the panel and returns focus to the control that opened it.
  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-50 pt-3 sm:pt-5">
      <div className="container-tl">
        <div className="glass-pill flex h-14 items-center justify-between gap-3 pr-2 pl-4 sm:h-16 sm:pr-3 sm:pl-5">
          <Link
            href="/"
            className="cursor-pointer rounded-full"
            aria-label={`${siteConfig.name} — home`}
          >
            <Wordmark />
          </Link>

          <nav
            aria-label="Main"
            className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex"
          >
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={cn(
                  "cursor-pointer rounded-full px-3.5 py-2 text-sm font-medium transition-colors duration-200 ease-out",
                  isActive(item.href)
                    ? "text-ink bg-[rgba(11,12,10,0.07)]"
                    : "text-ink-soft hover:text-ink hover:bg-[rgba(11,12,10,0.05)]",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1.5">
            <MotionToggle />
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
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              className="text-ink inline-flex size-10 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 ease-out hover:bg-[rgba(11,12,10,0.06)] md:hidden"
            >
              {open ? (
                <X className="size-5" aria-hidden="true" />
              ) : (
                <Menu className="size-5" aria-hidden="true" />
              )}
              <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            </button>
          </div>
        </div>

        {/* Kept mounted and toggled with `hidden`, so the collapsed panel stays
            out of the tab order without remounting on every open. */}
        <div id="mobile-nav" hidden={!open} className="md:hidden">
          <nav
            aria-label="Mobile"
            className="glass mt-2 flex flex-col gap-1 p-3"
          >
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={cn(
                  "cursor-pointer rounded-2xl px-4 py-3 font-medium transition-colors duration-200 ease-out",
                  isActive(item.href)
                    ? "text-ink bg-[rgba(11,12,10,0.07)]"
                    : "text-ink-soft hover:text-ink hover:bg-[rgba(11,12,10,0.05)]",
                )}
              >
                {item.label}
              </Link>
            ))}
            <ActionLink href="/contact" className="mt-1 w-full">
              Book a call
            </ActionLink>
          </nav>
        </div>
      </div>
    </header>
  );
}
