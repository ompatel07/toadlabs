"use client";

import { MessageCircleQuestion } from "lucide-react";
import { faqs } from "@/config/home";
import { Section } from "@/components/layout/section";
import { WaveDivider } from "@/components/brand/decor";
import { ActionLink } from "@/components/ui-brand/action";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function Faq() {
  return (
    <div className="relative bg-white">
      <WaveDivider fill="var(--canvas)" className="-mt-px" />

      <Section surface="white" className="relative overflow-hidden !pt-4">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.5fr] lg:gap-14">
        {/* Sticky lime panel — the page's single warm anchor, and it keeps the
            CTA in view while the list is read. */}
        <div className="bg-lime text-ink border-ink flex h-fit flex-col gap-5 rounded-[2rem] border p-8 lg:sticky lg:top-28">
          <span className="bg-ink/10 inline-flex size-12 items-center justify-center rounded-2xl">
            <MessageCircleQuestion
              className="size-6"
              strokeWidth={2}
              aria-hidden="true"
            />
          </span>
          <h2 className="font-display text-[1.75rem] leading-[1.05] font-bold tracking-[-0.03em] md:text-[2.25rem]">
            Questions we get asked
          </h2>
          <p className="text-ink/75 text-[0.9375rem]">
            If yours is not here, ask it on the call — we would rather answer it
            before you sign anything.
          </p>
          <ActionLink href="/contact" variant="primary" className="mt-1 w-fit">
            Ask us directly
          </ActionLink>
        </div>

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

      <WaveDivider fill="var(--canvas)" flip className="-mb-px" />
    </div>
  );
}
