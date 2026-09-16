import Link from "next/link";
import { Mail, MapPin, MessageCircle } from "lucide-react";
import { footerNav, siteConfig, whatsappUrl } from "@/config/site";
import { Wordmark } from "@/components/brand/wordmark";
import { BrandObject } from "@/components/brand/hero-object";

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
                  className="text-ink hover:text-ink-soft inline-flex cursor-pointer items-center gap-2.5 transition-colors duration-200 ease-out"
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
                  className="text-ink hover:text-ink-soft inline-flex cursor-pointer items-center gap-2.5 transition-colors duration-200 ease-out"
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
                        className="text-ink hover:text-ink-soft cursor-pointer t-base transition-colors duration-200 ease-out"
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

        {/* Sign-off: the object, then the oversized wordmark beneath it.
            It sat ON the wordmark in the first version, which covered the
            closing "S." so the name read "TOAD LAB", and the footer rule cut
            across its feet. Giving it its own line costs a little height and
            fixes both — it now reads as a mark above the name rather than
            something dropped on top of it. */}
        <div className="mt-16 flex flex-col items-center md:mt-20">
          <div
            aria-hidden="true"
            className="relative w-[clamp(72px,9vw,124px)]"
          >
            <div className="scene-bloom absolute inset-[-30%] -z-10 opacity-75" />
            <BrandObject
              className="object-settled w-full drop-shadow-[0_16px_30px_rgba(11,12,10,0.28)]"
              sizes="124px"
            />
          </div>

          {/* Clipped at the baseline so it reads as a printed edge rather than
              a heading. */}
          <div
            aria-hidden="true"
            className="mt-5 -mb-4 w-full overflow-hidden md:-mb-8"
          >
            <p className="numeral text-ink/8 text-center text-[clamp(3.5rem,15vw,13rem)] leading-[0.8] whitespace-nowrap select-none">
              TOAD LABS.
            </p>
          </div>
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
