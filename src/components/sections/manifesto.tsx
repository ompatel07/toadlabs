import { BrandObject } from "@/components/brand/hero-object";
import { InteractiveToad } from "@/components/brand/interactive-toad";
import { OutlineType } from "@/components/brand/decor";
import { SplitText } from "@/components/brand/split-text";

/**
 * The mid-page scene.
 *
 * This section used to be one centred sentence on flat cream. Its job — pacing,
 * a rest between dense blocks — was right, but it was doing that job with
 * nothing but type, on a page where every other section was also type on cream.
 *
 * The real problem it now solves is bigger than pacing. The hero sets up a
 * visual language (an object with real depth, a lime bloom, layered type) and
 * the page abandoned every part of it below 900px. A visitor saw the hero, got
 * a promise, scrolled, and landed in a text document. That gap is what made the
 * site read as plainer than its own first screen.
 *
 * So this restates the hero's composition once, inverted: the same object, the
 * same bloom, giant type behind rather than in front, on dark instead of light.
 * Rhyming with the opening rather than repeating it is what makes a page feel
 * designed end to end instead of front-loaded.
 *
 * The two layers parallax in opposite directions on the section's own view
 * timeline — pure CSS, no listener — which is what gives the scene depth. Both
 * stop under reduced motion; the bloom and the layering carry it from there.
 */
export function Manifesto() {
  // overflow-CLIP below, not hidden. `hidden` makes the section a scroll
  // container, and a view() timeline inside then measures against the section
  // rather than the document — which never scrolls, so both parallax layers
  // froze at a constant transform. `clip` clips the bled-off outline type
  // identically without creating a scrollport.
  return (
    <section
      data-toad-solo
      className="scene on-dark relative isolate overflow-clip py-24 md:py-36"
    >
      {/* Giant outline word behind everything, bled off both edges. */}
      <OutlineType
        onDark
        className="pointer-events-none absolute top-1/2 left-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 text-[clamp(9rem,26vw,22rem)] opacity-60">
        YEAR TWO
      </OutlineType>

      <div className="container-tl relative">
        <div className="relative flex flex-col items-center gap-10">
          {/* The object, with its bloom behind it. */}
          <div className="relative flex w-[min(62vw,340px)] shrink-0 items-center justify-center md:w-[min(34vw,420px)]">
            <div
              aria-hidden="true"
              className="scene-bloom pointer-events-none absolute inset-[-22%] -z-10"
            />
            <InteractiveToad className="w-full" motionClassName="scene-object">
              <BrandObject
                className="w-full drop-shadow-[0_28px_60px_rgba(0,0,0,0.5)]"
                sizes="(max-width: 767px) 62vw, 34vw"
              />
            </InteractiveToad>
          </div>

          <div className="scene-type flex flex-col items-center gap-7 text-center">
            <p className="type-display max-w-5xl text-balance text-ink">
              <SplitText text="Anyone can ship it once. The bill arrives in" />{" "}
              {/* The full stop lives inside the highlighted span: with it
                  outside, the span's margin left a visible gap before it. */}
              {/* A real background rather than an absolutely-positioned span
                  behind the text. The layered version looked identical but left
                  the dark type with no computable background — it read as
                  deep-on-deep to anything inspecting colour, including contrast
                  tooling, and depended on a z-index to be legible at all. */}
              <span className="bg-lime inline-block rounded-[0.06em] px-[0.1em] whitespace-nowrap text-[color:var(--deep)]">
                year two.
              </span>{" "}
              We build for that bill.
            </p>

            <p className="measure t-lead text-white/70">
              We maintain our own products, so the habits that make year two
              cheap are the ones we already have. You inherit them by default.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
