"use client";

import { securityFaqs } from "@/config/security";
import { Section, SectionHeading } from "@/components/layout/section";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FaqSectionProps {
  items?: { question: string; answer: string }[];
  eyebrow?: string;
  title?: string;
  description?: string;
}

/**
 * Question-and-answer section. Defaults to the security buyer questions on
 * /cybersecurity; service pages pass their own.
 */
export function SecurityFaq({
  items = securityFaqs,
  eyebrow = "Before you ask",
  title = "The questions buyers actually ask",
  description = "Mostly about risk, access, and whether we will overstate what we can do.",
}: FaqSectionProps) {
  return (
    <Section dense className="tex-rules glow-right relative">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          description={description}
        />

        <Accordion
          multiple={false}
          className="border-t border-[rgba(255,255,255,0.138)]"
        >
          {items.map((item) => (
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
