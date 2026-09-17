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
    <Section dense className="tex-rules glow-right relative">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
        <SectionHeading
          eyebrow="Before you ask"
          title="The questions buyers actually ask"
          description="Mostly about risk, access, and whether we will overstate what we can do."
        />

        <Accordion
          multiple={false}
          className="border-t border-[rgba(255,255,255,0.138)]"
        >
          {securityFaqs.map((item) => (
            <AccordionItem
              key={item.question}
              value={item.question}
              className="border-b border-[rgba(255,255,255,0.138)]"
            >
              <AccordionTrigger className="font-display text-ink cursor-pointer py-5 t-lead font-semibold hover:no-underline">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-ink-soft measure pb-5 t-base leading-relaxed">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Section>
  );
}
