"use client";

import { faqs } from "@/config/playbook";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

/**
 * FAQ, on the site's existing accordion — which is configured to keep closed
 * answers in the HTML (hidden="until-found"), so every answer is crawlable and
 * findable with the browser's own find-in-page.
 */
export function PlaybookFaq() {
  return (
    <section
      id="faq"
      aria-label="Frequently asked questions"
      className="scroll-mt-16 border-t-2 border-[color:var(--ink)] py-16 md:py-24"
    >
      <div className="mx-auto w-full max-w-[72rem] px-5 md:px-8">
        <p className="label-mono pb-accent flex items-center gap-2.5">
          <span aria-hidden="true" className="inline-block h-px w-6 bg-[color:var(--accent)]" />
          Before you buy
        </p>
        <h2 className="font-display text-ink mt-5 type-h2 font-bold text-balance">
          Questions people ask first
        </h2>

        <Accordion multiple={false} className="mt-10 border-t border-[color:var(--ink)]">
          {faqs.map((item) => (
            <AccordionItem
              key={item.question}
              value={item.question}
              className="border-b border-[color:var(--ink)]"
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
    </section>
  );
}
