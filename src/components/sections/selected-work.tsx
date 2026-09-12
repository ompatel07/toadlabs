import { ArrowRight } from "lucide-react";
import { caseStudies, hasPlaceholderWork } from "@/config/work";
import { Section, SectionHeading } from "@/components/layout/section";
import { ActionLink } from "@/components/ui-brand/action";
import { Reveal } from "@/components/motion/reveal";
import { WorkCard } from "@/components/sections/work-card";

export function SelectedWork() {
  return (
    <Section>
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <SectionHeading
          eyebrow="Selected work"
          title="How we approach a build"
          description="Problem, approach, stack, outcome — written so you can judge the reasoning, not just the result."
        />
        <ActionLink
          href="/work"
          variant="ghost"
          className="shrink-0 self-start md:self-auto"
        >
          All case studies
          <ArrowRight className="size-4" aria-hidden="true" />
        </ActionLink>
      </div>

      {hasPlaceholderWork ? (
        <p className="text-ink-soft mt-10 border-l-2 border-[rgba(11,12,10,0.25)] py-1 pl-4 t-base">
          <strong className="text-ink font-semibold">
            These are placeholders.
          </strong>{" "}
          They illustrate how we scope and write up an engagement. They are not
          delivered client projects, and they contain no outcome metrics.
        </p>
      ) : null}

      <ul className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {caseStudies.map((study, index) => (
          <Reveal as="li" key={study.slug} index={index}>
            <WorkCard study={study} index={index} />
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
