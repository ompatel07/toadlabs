import { process } from "@/config/home";
import { OutlineType } from "@/components/brand/decor";

/**
 * Four-step process — a sticky-scroll rail.
 *
 * The heading pins while the steps travel past it. Another deliberate change of
 * archetype: no cards here, just oversized numerals, rules, and space. Sticky
 * behaviour is pure CSS `position: sticky`, so there is no scroll listener and
 * nothing to jank.
 */
export function Process() {
  return (
    <section className="section relative overflow-hidden">
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

          <ol className="flex flex-col">
            {process.map((step) => (
              <li
                key={step.number}
                className="rise group grid grid-cols-[auto_1fr] gap-x-6 border-t border-[rgba(11,12,10,0.16)] py-8 md:gap-x-10 md:py-11"
              >
                {/* Oversized numeral in the margin — the step index is the
                    graphic element, so the row needs nothing else. */}
                <span
                  className="numeral text-ink/15 numeral-lg leading-[0.8] transition-colors duration-300 ease-out group-hover:text-[color:var(--lime-deep)]"
                  aria-hidden="true"
                >
                  {step.number}
                </span>

                <div>
                  <h3 className="font-display text-ink type-h2 font-bold">
                    {step.title}
                  </h3>
                  <p className="text-ink-soft measure mt-3 t-base leading-relaxed">
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
