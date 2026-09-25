import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { AlertTriangle } from "lucide-react";
import { caseStudies, hasPlaceholderWork } from "@/config/work";
import { PageHeader } from "@/components/layout/page-header";
import { TickerStrip } from "@/components/brand/decor";
import { Section } from "@/components/layout/section";
import { WorkIndex } from "@/components/sections/work-index";
import { WriteupAnatomy } from "@/components/sections/writeup-anatomy";
import { FinalCta } from "@/components/sections/final-cta";

export const metadata: Metadata = pageMetadata({
  title: "Our Work: Software & Security Case Studies",
  description:
    "How OFFSCRIPT approaches software development and security engagements: the problem, our approach, the stack and the outcome. Illustrative case studies.",
  path: "/work",
  // Placeholder work must not be indexed as if it were real client evidence.
  noindex: hasPlaceholderWork,
});

export default function WorkPage() {
  return (
    <>
      <PageHeader
        eyebrow="Work"
        title="The reasoning, not the screenshot"
        description="Problem, approach, stack, outcome — written so you can judge how we think about a system. That is the only part of a case study that tells you anything useful."
      />

      <TickerStrip
        items={[
          "Problem",
          "Approach",
          "Stack",
          "Outcome",
          "Written up honestly",
          "No invented metrics",
        ]}
        speed="36s"
        reverse
      />

      {hasPlaceholderWork ? (
        <div className="container-tl">
          {/* Unmissable, not small print. Publishing invented client work is a
              real-world harm, so this states it plainly at the top. */}
          <div className="flex items-start gap-3.5 rounded-lg border-2 border-[rgba(255,255,255,0.22)] bg-[var(--surface)] p-5 md:p-6">
            <AlertTriangle
              className="text-ink mt-0.5 size-5 shrink-0"
              strokeWidth={2}
              aria-hidden="true"
            />
            <div>
              <p className="font-display text-ink t-base font-bold">
                These case studies are placeholders
              </p>
              <p className="text-ink-soft measure mt-1.5 t-base">
                They illustrate how we scope, build and write up an engagement.
                They are <strong className="text-ink">not</strong> delivered
                client projects. Company names are generic sector descriptors,
                and there are deliberately no outcome metrics — we will not
                publish numbers we cannot stand behind. Real case studies
                replace these as engagements complete.
              </p>
            </div>
          </div>
        </div>
      ) : null}

      <Section className="field-base relative pt-12 md:pt-16">
        {/* The cards' titles are h3, so this level has to exist for the
            document outline to be unbroken. */}
        <h2 className="sr-only">Case studies</h2>
        <WorkIndex studies={caseStudies} />
      </Section>

      <WriteupAnatomy />

      <FinalCta
        title="Your project could be the first real one here"
        description="We would rather show your work than a placeholder. Tell us what you're building."
      />
    </>
  );
}
