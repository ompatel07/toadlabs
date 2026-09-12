"use client";

import { faqs } from "@/config/home";
import { Section, SectionHeading } from "@/components/layout/section";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function Faq() {
  return (
    <Section>
      <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
        <SectionHeading
          eyebrow="FAQ"
          title="Questions we get asked"
          description="If yours is not here, ask it on the call — we would rather answer it before you sign anything."
        />

        <Accordion
          multiple={false}
          className="border-t border-[rgba(11,12,10,0.12)]"
        >
          {faqs.map((item) => (
            <AccordionItem
              key={item.question}
              value={item.question}
              className="border-b border-[rgba(11,12,10,0.12)]"
            >
              <AccordionTrigger className="font-display text-ink cursor-pointer py-5 text-[1.0625rem] font-semibold tracking-[-0.02em] hover:no-underline md:text-[1.1875rem]">
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
