"use client";

import { securityFaqs } from "@/config/security";
import { Section, SectionHeading } from "@/components/layout/section";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

/** Objection-handling for security buyers — the questions that decide a deal. */
export function SecurityFaq() {
  return (
    <Section dense>
      <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
        <SectionHeading
          eyebrow="Before you ask"
          title="The questions that actually decide this"
          description="Mostly about risk, access, and whether we will overstate what we can do."
        />

        <Accordion
          multiple={false}
          className="border-t border-[rgba(11,12,10,0.12)]"
        >
          {securityFaqs.map((item) => (
            <AccordionItem
              key={item.question}
              value={item.question}
              className="border-b border-[rgba(11,12,10,0.12)]"
            >
              <AccordionTrigger className="font-display text-ink cursor-pointer py-5 text-[1rem] font-semibold tracking-[-0.02em] hover:no-underline md:text-[1.0625rem]">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-ink-soft measure pb-5 text-[0.9375rem] leading-relaxed">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Section>
  );
}
