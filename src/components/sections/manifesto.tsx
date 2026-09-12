import { Asterisk } from "@/components/brand/decor";
import { SplitText } from "@/components/brand/split-text";

/**
 * A statement moment.
 *
 * Deliberately short and oversized, sitting between two dense sections. Its job
 * is pacing: after a run of information-dense blocks the eye needs somewhere to
 * rest, and a page with no rests reads as one long list regardless of how good
 * the individual sections are.
 *
 * No cards, no grid, no CTA. One sentence at display size.
 */
export function Manifesto() {
  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      <div className="container-tl">
        <div className="flex flex-col items-center gap-8 text-center">
          <Asterisk className="text-lime-ink size-5" />

          <p className="type-display text-ink max-w-5xl text-balance">
            <SplitText text="Anyone can ship it once. The bill arrives in" />{" "}
            {/* The full stop lives inside the highlighted span: with it
                outside, the span's margin left a visible gap before it. */}
            <span className="relative inline-block whitespace-nowrap">
              year two.
              <span
                aria-hidden="true"
                className="bg-lime absolute inset-x-[-0.1em] bottom-[0.08em] -z-10 h-[0.38em]"
              />
            </span>{" "}
            We build for that bill.
          </p>

          <p className="text-ink-soft max-w-xl t-lead">
            We maintain our own products, so the habits that make year two
            cheap are the ones we already have. You inherit them by default.
          </p>
        </div>
      </div>
    </section>
  );
}
