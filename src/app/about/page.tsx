import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { PageHeader } from "@/components/layout/page-header";
import { TickerStrip } from "@/components/brand/decor";
import { Section, SectionHeading } from "@/components/layout/section";
import { MetricsBand } from "@/components/sections/metrics-band";
import { Sectors } from "@/components/sections/sectors";
import { PrinciplesIndex } from "@/components/sections/principles-index";
import { FinalCta } from "@/components/sections/final-cta";

export const metadata: Metadata = {
  title: "About",
  description:
    "Toad Labs is a founder-led product studio in Ahmedabad applying product-builder discipline to client software and security work.",
  alternates: { canonical: "/about" },
};

/**
 * NOTE ON CONTENT
 * Written in "we" voice with no founder name, founding year, headcount, awards
 * or client count — none of those have been supplied, and inventing them on an
 * About page is exactly the kind of thing a prospect checks. Everything here is
 * a position we can defend rather than a fact we made up. Swap in real
 * specifics whenever you have them.
 */

const principles = [
  {
    title: "Scope is a design problem",
    copy: "The most valuable thing we do is often talk you out of something. A feature that ships late and unused cost more than the one we cut in week one — so cuts get written down with the reasoning, not quietly dropped.",
  },
  {
    title: "Working software beats status",
    copy: "Every week ends with something running that you can click. No progress decks, no percentage-complete bars. If it is not running, it is not done, and we would rather have that conversation early.",
  },
  {
    title: "Write the decision down",
    copy: "Architecture choices get recorded with the trade-off that drove them. It means a decision can be revisited on its merits later instead of re-argued from memory, and your next hire can read why things are the way they are.",
  },
  {
    title: "Build it, then attack it",
    copy: "Running security testing in the same studio changes how we build. You write authorisation differently when you know the person reviewing it will be trying to bypass it next month.",
  },
  {
    title: "No lock-in by design",
    copy: "Your repository, your cloud accounts, your domains. No proprietary framework you have to keep paying us to maintain. If leaving is expensive, staying is not really a choice you made.",
  },
  {
    title: "Say the uncomfortable thing",
    copy: "If the deadline is not achievable, if the approach is wrong, or if you need less than you asked for, you hear it while there is still time to act. Agreeable vendors are expensive.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="We maintain what we build. That changes how we build."
        description="A founder-led studio in Ahmedabad, running its own products alongside client work. The habits that keep software cheap to change in year two are ones we already need for ourselves — you inherit them by default."
      />

      <TickerStrip
        items={[
          "Scope is a design problem",
          "Working software beats status",
          "Write the decision down",
          "Build it, then attack it",
          "No lock-in by design",
          "Say the uncomfortable thing",
        ]}
        speed="46s"
      />

      <MetricsBand />

      {/* Story — the one place on the site that breaks the card grid, set as a
          narrow measure offset left so it reads as writing rather than UI. */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-20">
          <div className="flex flex-col gap-6">
            <h2 className="font-display text-ink type-h2 font-bold">
              Why product discipline matters for client builds
            </h2>

            <div className="measure text-ink-soft flex flex-col gap-5 t-lead leading-relaxed">
              <p>
                There is a specific failure mode in agency software. The code
                only has to survive one thing — the handover. It passes, the
                invoice clears, and the consequences of every shortcut land on
                somebody else six months later. Nobody set out to do that; the
                incentive just points that way.
              </p>
              <p>
                Product teams have the opposite incentive. You are going to be
                the one paged at 2am. You are going to be the one adding a
                feature to that module next quarter. So you write the test, you
                fix the migration properly, you leave the note explaining the
                weird bit.
              </p>
              <p>
                Toad Labs builds its own products. That means the second set of
                habits is the one we already have, and client work gets it by
                default rather than as an upsell. Typed boundaries, tests where
                they earn their cost, CI and rollback from the first week,
                documentation your next hire can follow.
              </p>
              <p>
                The security side came from the same instinct. Once you have
                been on the receiving end of a vulnerability report about your
                own product, you stop treating security as a phase at the end.
                Now we run that testing for other teams too — including on
                software we did not write.
              </p>
            </div>

            <blockquote className="border-ink mt-2 border-l-2 pl-5">
              <p className="font-display text-ink type-h2 leading-snug font-semibold">
                If leaving us is expensive, then staying was never really a
                decision you got to make.
              </p>
            </blockquote>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="card-solid flex flex-col gap-5 p-7">
              <div>
                <h2 className="label-mono text-ink-soft">Where we are</h2>
                <p className="text-ink mt-2 t-base">
                  {siteConfig.location.full}
                </p>
              </div>
              <div className="border-t border-[rgba(255,255,255,0.115)] pt-5">
                <h2 className="label-mono text-ink-soft">How we work</h2>
                <p className="text-ink-soft mt-2 t-base">
                  Async delivery with a weekly demo, overlapping your working
                  hours for the calls that need to be live. We work with teams
                  across India and internationally.
                </p>
              </div>
              <div className="border-t border-[rgba(255,255,255,0.115)] pt-5">
                <h2 className="label-mono text-ink-soft">What we do</h2>
                <p className="text-ink-soft mt-2 t-base">
                  Product and client software — web, mobile, MVPs, SaaS,
                  automation — plus offensive security testing and readiness
                  work.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </Section>

      {/* Principles — ruled rows rather than cards, to keep this page reading
          as an editorial piece. */}
      <Section surface="white" className="bg-grid edge-rules relative border-y border-[rgba(255,255,255,0.115)]">
        <SectionHeading
          eyebrow="Principles"
          title="How we actually work"
          description="Not values on a wall. These are the rules that settle arguments when a project gets tight."
        />

        <div className="mt-12">
          <PrinciplesIndex principles={principles} />
        </div>
      </Section>

      <Sectors />


      <FinalCta
        title="Work with us"
        description="Tell us what you are building, or what you need tested. We will tell you honestly whether we are the right studio for it."
      />
    </>
  );
}
