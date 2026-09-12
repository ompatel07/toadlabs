import { trustStrip } from "@/config/home";
import { Reveal } from "@/components/motion/reveal";

/**
 * Capability statements rather than client logos or metrics — we have no real
 * ones, and inventing them is off the table. Set as a quiet ruled row so it
 * reads as substance, not as a badge wall.
 */
export function TrustStrip() {
  return (
    <section className="section-dense">
      <div className="container-tl">
        <h2 className="sr-only">How we work</h2>
        <ul className="border-t border-[rgba(11,12,10,0.1)] md:grid md:grid-cols-4">
          {trustStrip.map((item, index) => (
            <Reveal
              as="li"
              key={item.title}
              index={index}
              className="border-b border-[rgba(11,12,10,0.1)] md:border-b-0 md:not-last:border-r md:not-last:border-[rgba(11,12,10,0.1)]"
            >
              <div className="flex flex-col gap-2 py-6 md:px-6 md:first:pl-0 md:last:pr-0">
                <item.icon
                  className="text-ink size-[18px]"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
                <h3 className="font-display text-ink mt-1 text-[0.9375rem] font-semibold tracking-[-0.02em]">
                  {item.title}
                </h3>
                <p className="text-ink-soft text-[0.875rem] leading-snug">
                  {item.description}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
