import type { Metadata } from "next";
import { Clock, Mail, MapPin, MessageCircle } from "lucide-react";
import { siteConfig, whatsappUrl } from "@/config/site";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { ContactForm } from "@/components/sections/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: `Talk to Toad Labs about a build or a security engagement. Based in ${siteConfig.location.full}.`,
  alternates: { canonical: "/contact" },
};

const whatHappensNext = [
  "We read it ourselves — there is no sales team to route through.",
  "If it looks like a fit, we propose a 30-minute call to scope it.",
  "If it is not a fit, we say so, and point you somewhere better if we can.",
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Tell us what you're building"
        description="Or what you need tested. Either way you get a direct answer from the people who would do the work."
      />

      <Section className="pt-4 md:pt-6">
        {/* The form comes first in DOM order so keyboard and screen-reader
            users reach it without traversing the contact rail. */}
        <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:gap-12">
          <ContactForm />

          <aside className="flex flex-col gap-4">
            <div className="bg-muted flex flex-col gap-4 rounded-3xl p-6 md:p-7">
              <h2 className="label-mono text-ink-soft">Reach us directly</h2>

              <ul className="flex flex-col gap-3">
                <li>
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="text-ink hover:text-ink-soft inline-flex cursor-pointer items-center gap-2.5 text-[0.9375rem] transition-colors duration-200 ease-out"
                  >
                    <Mail className="size-4 shrink-0" aria-hidden="true" />
                    {siteConfig.email}
                  </a>
                </li>
                <li>
                  {/* Deliberately not WhatsApp brand green — it collides with
                      the lime and fails contrast as a text colour. */}
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border-ink text-ink hover:bg-ink inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-full border-2 px-5 text-[0.9375rem] font-medium transition-colors duration-250 ease-out hover:text-white"
                  >
                    <MessageCircle className="size-4" aria-hidden="true" />
                    Message on WhatsApp
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </li>
                <li className="text-ink-soft inline-flex items-center gap-2.5 text-[0.9375rem]">
                  <MapPin className="size-4 shrink-0" aria-hidden="true" />
                  {siteConfig.location.full}
                </li>
                <li className="text-ink-soft inline-flex items-start gap-2.5 text-[0.9375rem]">
                  <Clock className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  IST business hours, with overlap arranged for other timezones
                </li>
              </ul>
            </div>

            <div className="card-solid flex flex-col gap-3 p-6 md:p-7">
              <h2 className="label-mono text-ink-soft">What happens next</h2>
              <ol className="flex flex-col gap-3">
                {whatHappensNext.map((step, index) => (
                  <li key={step} className="flex items-start gap-3">
                    <span
                      className="numeral text-ink/25 text-[1.25rem] leading-none"
                      aria-hidden="true"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-ink-soft text-[0.9375rem]">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="bg-lime text-ink rounded-3xl p-6 md:p-7">
              <h2 className="font-display text-[1.0625rem] font-bold tracking-[-0.02em]">
                Under NDA first?
              </h2>
              <p className="mt-2 text-[0.9375rem]">
                Happy to sign yours before you tell us anything about the
                system. Just say so in the message and we will send it back
                before the call.
              </p>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
