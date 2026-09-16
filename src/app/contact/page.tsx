import type { Metadata } from "next";
import { ArrowUpRight, Bug, Clock, Mail, MapPin, MessageCircle, ShieldCheck } from "lucide-react";
import { siteConfig, whatsappUrl } from "@/config/site";
import { Asterisk, TickerStrip } from "@/components/brand/decor";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { ContactForm } from "@/components/sections/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: `Talk to Toad Labs about a build or a security engagement. Based in ${siteConfig.location.full}.`,
  alternates: { canonical: "/contact" },
};

/**
 * What actually happens after someone sends the form.
 *
 * Written as commitments with a stated timeframe rather than reassurance —
 * "we will get back to you soon" is what every form says and it tells the
 * reader nothing they can hold us to.
 */
const whatHappensNext = [
  {
    when: "Within a day",
    title: "An engineer reads it",
    copy:
      "Not a sales team, not a routing rule. Whoever replies is one of the people who would actually do the work.",
  },
  {
    when: "The reply",
    title: "A real answer, or a real no",
    copy:
      "If it is a fit, we propose a 30-minute call and tell you what would help us to see beforehand. If it is not, we say so — and point you somewhere better where we can.",
  },
  {
    when: "The call",
    title: "Scoping, not a pitch",
    copy:
      "We spend it on your system and your constraints, not on slides. You leave with an approach and a rough shape of the cost, whether or not you hire us.",
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Start with the problem, not the spec"
        description="Tell us what is actually going wrong, or what you need tested. You get a straight answer from the engineers who would do the work — including if that answer is that you need less than you think."
      />

      <TickerStrip
        items={[
          "No sales team",
          "Replies from engineers",
          "NDA before scoping",
          "An honest no is a valid answer",
        ]}
        speed="42s"
      />

      <Section className="pt-10 md:pt-14">
        {/* Form first in DOM order so keyboard and screen-reader users reach it
            without traversing the contact rail. */}
        <div className="grid gap-8 lg:grid-cols-[1.55fr_1fr] lg:gap-12">
          <ContactForm />

          {/* Sticky on desktop: the form is roughly twice the height of this
              column, and without it the right third of the page is dead space
              for most of the scroll. */}
          <aside className="flex flex-col gap-4 lg:sticky lg:top-28 lg:self-start">
            <div className="bg-muted flex flex-col gap-4 rounded-xl p-6 md:p-7">
              <h2 className="label-mono text-ink-soft">Or reach us directly</h2>

              <ul className="flex flex-col gap-3">
                <li>
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="text-ink hover:text-ink-soft inline-flex cursor-pointer items-center gap-2.5 t-base transition-colors duration-200 ease-out"
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
                    className="border-ink text-ink hover:bg-ink inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-full border-2 px-5 t-base font-medium transition-colors duration-250 ease-out hover:text-canvas"
                  >
                    <MessageCircle className="size-4" aria-hidden="true" />
                    Message on WhatsApp
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </li>
                <li className="text-ink-soft inline-flex items-center gap-2.5 t-base">
                  <MapPin className="size-4 shrink-0" aria-hidden="true" />
                  {siteConfig.location.full}
                </li>
                <li className="text-ink-soft inline-flex items-start gap-2.5 t-base">
                  <Clock className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  IST business hours, with overlap arranged for other timezones
                </li>
              </ul>
            </div>

            <div className="bg-lime text-canvas relative overflow-hidden rounded-xl p-6 md:p-7">
              <ShieldCheck
                className="absolute -right-6 -bottom-6 size-32 text-[rgba(255,255,255,0.081)]"
                strokeWidth={1}
                aria-hidden="true"
              />
              <h2 className="font-display relative t-lead font-bold">
                Under NDA first?
              </h2>
              <p className="relative mt-2 t-base">
                Happy to sign yours before you tell us anything about the
                system. Say so in the message and we will send it back before
                the call.
              </p>
            </div>

            {/* Researchers land on this page too, and the disclosure policy is
                what they are actually looking for. */}
            <a
              href="/security"
              className="group/dis card-solid flex cursor-pointer items-start gap-3 rounded-xl p-6 transition-colors duration-250 ease-out hover:border-ink md:p-7"
            >
              <Bug className="text-ink mt-0.5 size-5 shrink-0" strokeWidth={1.75} aria-hidden="true" />
              <span className="flex flex-col gap-1.5">
                <span className="font-display text-ink t-base font-bold">
                  Reporting a vulnerability?
                </span>
                <span className="text-ink-soft t-sm leading-relaxed">
                  Our disclosure policy sets out what is in scope, what we ask
                  of you, and how quickly we respond.
                </span>
                <span className="text-ink inline-flex items-center gap-1.5 t-sm font-medium underline-offset-4 group-hover/dis:underline">
                  Read the policy
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </span>
              </span>
            </a>
          </aside>
        </div>
      </Section>

      {/* Promoted out of the sidebar. This is the answer to the question every
          visitor has before they press send, and it was hiding in a small box
          under two other small boxes. */}
      <Section className="pt-4 md:pt-8">
        <p className="label-mono text-ink-soft mb-8">
          After you press send
        </p>
        <ol className="grid gap-px overflow-hidden rounded-xl bg-[rgba(255,255,255,0.161)] md:grid-cols-3">
          {whatHappensNext.map((step, index) => (
            <li
              key={step.title}
              className="bg-canvas reveal flex flex-col gap-3 p-7 md:p-8"
              style={{ animationDelay: `${index * 90}ms` }}
            >
              <div className="flex items-baseline justify-between gap-4">
                <span className="numeral numeral-md text-ink/18 leading-none" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="label-mono text-lime-ink">{step.when}</span>
              </div>
              <h3 className="font-display text-ink type-h3 font-bold">
                {step.title}
              </h3>
              <p className="text-ink-soft t-base leading-relaxed">{step.copy}</p>
              <Asterisk className="text-lime-ink mt-auto size-3" />
            </li>
          ))}
        </ol>
      </Section>
    </>
  );
}
