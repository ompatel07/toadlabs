import type { Metadata } from "next";
import { Check, FileText, Mail, ShieldCheck, X } from "lucide-react";
import {
  dataHandling,
  disclosure,
  reportStructure,
} from "@/config/security-policy";
import { siteConfig } from "@/config/site";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { Asterisk } from "@/components/brand/decor";
import { FinalCta } from "@/components/sections/final-cta";

export const metadata: Metadata = {
  title: "Security & disclosure",
  description:
    "Toad Labs' vulnerability disclosure policy, how we handle client data during an engagement, and the structure of our deliverables.",
  alternates: { canonical: "/security" },
};

export default function SecurityPolicyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Security & disclosure"
        title="Report a vulnerability, and how we handle yours"
        description="A security vendor should be held to the standard it sells. This page is the policy we operate under — published, dated, and machine-readable."
        aside={
          <div className="card-solid flex flex-col gap-4 rounded-xl p-6 lg:w-[320px]">
            <p className="label-mono text-ink-soft">Machine-readable</p>
            <p className="text-ink-soft t-base">
              Our disclosure contact is published to RFC 9116, so scanners and
              researchers can find it without guessing.
            </p>
            <a
              href="/.well-known/security.txt"
              className="border-ink text-ink hover:bg-ink inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-full border-2 px-5 t-sm font-medium transition-colors duration-250 ease-out hover:text-canvas"
            >
              <FileText className="size-4" aria-hidden="true" />
              /.well-known/security.txt
            </a>
            <a
              href={`mailto:${siteConfig.email}`}
              className="text-ink-soft hover:text-ink inline-flex cursor-pointer items-center gap-2 py-1.5 t-sm underline underline-offset-4"
            >
              <Mail className="size-4" aria-hidden="true" />
              {siteConfig.email}
            </a>
          </div>
        }
      />

      {/* Disclosure policy */}
      <Section dense>
        <p className="text-ink measure t-h4 leading-relaxed">
          {disclosure.intro}
        </p>

        <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="label-mono text-ink-soft flex items-center gap-2">
              <Asterisk className="text-lime-ink size-2.5" />
              In scope
            </h2>
            <ul className="mt-5 border-t-2 border-[rgba(255,255,255,0.22)]">
              {disclosure.inScope.map((item) => (
                <li
                  key={item}
                  className="text-ink flex items-start gap-3 border-b border-[rgba(255,255,255,0.138)] py-3.5 t-base"
                >
                  <Check
                    className="text-ink mt-0.5 size-4 shrink-0"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="label-mono text-ink-soft flex items-center gap-2">
              <Asterisk className="text-lime-ink size-2.5" />
              Out of scope
            </h2>
            <ul className="mt-5 border-t-2 border-[rgba(255,255,255,0.22)]">
              {disclosure.outOfScope.map((item) => (
                <li
                  key={item}
                  className="text-ink-soft flex items-start gap-3 border-b border-[rgba(255,255,255,0.138)] py-3.5 t-base"
                >
                  <X
                    className="mt-0.5 size-4 shrink-0"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 grid gap-4 lg:grid-cols-2">
          <div className="bg-lime text-canvas border-ink rounded-xl border p-8">
            <h2 className="font-display type-h3 font-bold">What we will do</h2>
            <ul className="mt-5 flex flex-col gap-3">
              {disclosure.weWill.map((item) => (
                <li key={item} className="flex items-start gap-2.5 t-base">
                  <Check
                    className="mt-0.5 size-4 shrink-0"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="border-ink/15 rounded-xl border bg-[var(--surface)] p-8">
            <h2 className="font-display text-ink type-h3 font-bold">
              What we ask of you
            </h2>
            <ul className="mt-5 flex flex-col gap-3">
              {disclosure.weAsk.map((item) => (
                <li
                  key={item}
                  className="text-ink-soft flex items-start gap-2.5 t-base"
                >
                  <Asterisk className="text-lime-ink mt-1.5 size-2 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* Data handling — the page's dark anchor. /security ran four light
          sections in a row below the header, and how a tester handles your data
          is the passage a reader most needs to stop and read, so it is the one
          that earns being set apart.

          A plain <section>, not <Section surface=...>: Section always emits a
          surface utility, and that utility is defined later in the stylesheet
          than .slab-dark, so it paints straight over the dark ground. */}
      <section className="section-dense slab-dark on-dark relative overflow-clip">
        <div className="container-tl grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.5fr)] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="label-mono text-lime">Your data</p>
            <h2 className="type-h2 mt-5 text-ink">
              What happens to your data during an engagement
            </h2>
            <p className="measure mt-5 t-lead text-white/70">
              We are asking you to hand over access to the thing you care most
              about protecting. Here is precisely how it is treated.
            </p>
          </div>

          <ol className="flex flex-col">
            {dataHandling.map((item, index) => (
              <li
                key={item.title}
                className="group/row grid grid-cols-[auto_1fr] gap-x-6 border-t border-white/15 py-8 transition-colors duration-400 ease-out hover:bg-white/[0.035] md:gap-x-10"
              >
                <span
                  className="numeral numeral-md leading-[0.8] text-white/20 transition-colors duration-400 ease-out group-hover/row:text-[color:var(--lime)]"
                  aria-hidden="true"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-display type-h3 font-bold text-ink">
                    {item.title}
                  </h3>
                  <p className="measure mt-2.5 t-base leading-relaxed text-white/65">
                    {item.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Report structure */}
      <Section dense>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="label-mono text-ink-soft">Deliverable</p>
            <h2 className="type-h2 text-ink mt-5 max-w-2xl">
              What a report actually contains
            </h2>
            <p className="text-ink-soft measure mt-5 t-lead">
              We have no sanitised sample to hand out yet — publishing one would
              mean publishing a client&apos;s findings. This is the structure
              every report follows instead.
            </p>
          </div>
          <ShieldCheck
            className="text-ink/15 hidden size-20 shrink-0 lg:block"
            strokeWidth={1.75}
            aria-hidden="true"
          />
        </div>

        <ol className="mt-12 border-t-2 border-[rgba(255,255,255,0.22)]">
          {reportStructure.map((item) => (
            <li
              key={item.section}
              className="grid gap-x-10 gap-y-1.5 border-b border-[rgba(255,255,255,0.138)] py-5 md:grid-cols-[minmax(0,0.6fr)_minmax(0,1.4fr)]"
            >
              <h3 className="label-mono text-ink pt-0.5">{item.section}</h3>
              <p className="text-ink-soft t-base leading-relaxed">
                {item.detail}
              </p>
            </li>
          ))}
        </ol>
      </Section>

      <FinalCta
        title="Still have a question?"
        description="Ask before you scope. We would rather answer an awkward question early than have it surface mid-engagement."
      />
    </>
  );
}
