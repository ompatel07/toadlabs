import { process } from "@/config/home";
import { OutlineType } from "@/components/brand/decor";

/**
 * Four-step process — a sticky heading against a filling spine.
 *
 * The bones were right: a pinned heading, oversized numerals, no cards. What it
 * lacked was any sense of progression, which is the one thing a process section
 * is actually about — four ruled rows told you there were four of them and
 * nothing else.
 *
 * Now a rule runs down the steps and fills as the list crosses the viewport,
 * and each step's mark lights as it arrives. The section reads as something you
 * are moving through rather than a list you are scrolling past, and the state
 * can never disagree with the scroll position because it is not tracking it —
 * it is driven by it.
 *
 * All CSS scroll timelines: no observer, no listener, nothing to desynchronise.
 * overflow-clip rather than hidden, or those timelines would measure against
 * this section instead of the document and freeze.
 */
export function Process() {
  return (
    <section className="section edge-rules bg-glow-right relative overflow-clip bg-[var(--surface)]">
      <OutlineType className="absolute -top-4 right-0 text-[clamp(4rem,13vw,10rem)]">
        PROCESS
      </OutlineType>

      <div className="container-tl relative">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.5fr)] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="label-mono text-ink-soft">How we work</p>
            <h2 className="type-h2 text-ink mt-5">
              {/* nbsp keeps "every one" together — otherwise "one" drops to a
                  line on its own. */}
              Four steps, and you see working software in every&nbsp;one
            </h2>
            <p className="text-ink-soft measure mt-6 t-lead">
              No discovery phase that produces a slide deck. Each step ends with
              something you can look at and disagree with.
            </p>
          </div>

          {/* The spine sits in its own column so the rule is a real grid track
              rather than a border that would have to fake its own fill. */}
          <ol className="relative flex flex-col">
            {/* Track and fill, aligned to the centre of the marks. */}
            <span
              aria-hidden="true"
              className="absolute top-3 bottom-3 left-[7px] w-[2px] bg-[rgba(255,255,255,0.138)]"
            />
            <span
              aria-hidden="true"
              className="spine-fill bg-lime-deep absolute top-3 bottom-3 left-[7px] w-[2px]"
            />

            {process.map((step) => (
              <li
                key={step.number}
                className="group relative grid grid-cols-[auto_1fr] gap-x-6 py-8 md:gap-x-10 md:py-11"
              >
                <span
                  aria-hidden="true"
                  className="step-mark mt-3 size-4 shrink-0 rounded-full"
                />

                <div className="flex flex-col gap-3">
                  <div className="flex items-baseline gap-4">
                    <span
                      className="numeral step-index numeral-md leading-none"
                      aria-hidden="true"
                    >
                      {step.number}
                    </span>
                    <h3 className="font-display text-ink type-h3 font-bold">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-ink-soft measure t-base leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
