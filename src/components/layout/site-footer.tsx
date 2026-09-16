import Link from "next/link";
import { Mail, MapPin, MessageCircle } from "lucide-react";
import { footerNav, siteConfig, whatsappUrl } from "@/config/site";
import { Wordmark } from "@/components/brand/wordmark";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-[rgba(11,12,10,0.1)]">
      <div className="container-tl py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_3fr]">
          <div className="flex flex-col gap-5">
            <Wordmark />
            <p className="measure-tight text-ink-soft t-base">
              {/* City and full stop are joined into one string. As separate
                  JSX nodes the browser could break between them, which left a
                  lone "." on its own line — on every page. */}
              {siteConfig.tagline} An IT services and cybersecurity studio in{" "}
              {`${siteConfig.location.city}.`}
            </p>

            <ul className="flex flex-col gap-3 t-base">
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="text-ink hover:text-ink-soft inline-flex cursor-pointer items-center gap-2.5 py-1.5 transition-colors duration-200 ease-out"
                >
                  <Mail className="size-4" aria-hidden="true" />
                  {siteConfig.email}
                </a>
              </li>
              <li>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink hover:text-ink-soft inline-flex cursor-pointer items-center gap-2.5 py-1.5 transition-colors duration-200 ease-out"
                >
                  <MessageCircle className="size-4" aria-hidden="true" />
                  WhatsApp
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
              <li className="text-ink-soft inline-flex items-center gap-2.5">
                <MapPin className="size-4" aria-hidden="true" />
                {siteConfig.location.full}
              </li>
            </ul>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {footerNav.map((group) => (
              <div key={group.heading}>
                <h2 className="label-mono text-ink-soft mb-4">
                  {group.heading}
                </h2>
                <ul className="flex flex-col gap-2.5">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="text-ink hover:text-ink-soft inline-block cursor-pointer py-1.5 t-base transition-colors duration-200 ease-out"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Oversized wordmark sign-off in the hero's display face. Clipped at
            the baseline so it reads as a printed edge rather than a heading. */}
        <div
          aria-hidden="true"
          className="mt-16 -mb-4 overflow-hidden md:mt-20 md:-mb-8"
        >
          <p className="numeral text-ink/8 text-center text-[clamp(3.5rem,15vw,13rem)] leading-[0.8] whitespace-nowrap select-none">
            TOAD LABS.
          </p>
        </div>

        <div className="text-ink-soft mt-10 flex flex-col gap-2 border-t border-[rgba(11,12,10,0.1)] pt-8 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {year} {siteConfig.name}. All rights reserved.
          </p>
          <p className="label-mono">Built in {siteConfig.location.city}</p>
        </div>
      </div>
    </footer>
  );
}
