import type { Metadata } from "next";
import { AlertTriangle } from "lucide-react";
import { caseStudies, hasPlaceholderWork } from "@/config/work";
import { PageHeader } from "@/components/layout/page-header";
import { TickerStrip } from "@/components/brand/decor";
import { Section } from "@/components/layout/section";
import { WorkIndex } from "@/components/sections/work-index";
import { FinalCta } from "@/components/sections/final-cta";

export const metadata: Metadata = {
  title: "Work",
  description:
    "How Toad Labs approaches a build: problem, approach, stack, outcome. Illustrative case studies.",
  alternates: { canonical: "/work" },
  // Placeholder work must not be indexed as if it were real client evidence.
  ...(hasPlaceholderWork ? { robots: { index: false, follow: true } } : {}),
};

export default function WorkPage() {
  return (
    <>
      <PageHeader
        eyebrow="Work"
        title="The reasoning, not the screenshot"
        description="Problem, approach, stack, outcome. Written so you can judge how we think about a system, which is the only part of a case study that tells you anything."
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
          <div className="flex items-start gap-3.5 rounded-2xl border-2 border-[rgba(11,12,10,0.8)] bg-white p-5 md:p-6">
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

      <Section className="pt-12 md:pt-16">
        {/* The cards' titles are h3, so this level has to exist for the
            document outline to be unbroken. */}
        <h2 className="sr-only">Case studies</h2>
        <WorkIndex studies={caseStudies} />
      </Section>

      <FinalCta
        title="Your project could be the first real one here"
        description="We would rather show your work than a placeholder. Tell us what you're building."
      />
    </>
  );
}
