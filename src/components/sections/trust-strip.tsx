import { trustStrip } from "@/config/home";
import { TickerStrip } from "@/components/brand/decor";

/**
 * How we work — a spec manifest.
 *
 * REPLACES a four-card grid that had gone wrong on two axes at once.
 *
 * Visually it was incoherent: one lime card sat between three dark ones, and
 * the icon chips were `bg-canvas`, which after the palette inversion is the
 * page ground — darker than the card they sit on, so each one read as a hole
 * punched in the panel rather than a chip.
 *
 * Functionally it was broken: the cells carried an "ink wipe" hover, written
 * when ink was near-black and the text went white on hover. Inverted, the wipe
 * turns the card LIGHT and the text was still going light — so pointing at a
 * card made its own text disappear.
 *
 * Rather than patch a device that no longer suited the system, this is the
 * form the content always wanted. These are four claims about how the studio
 * operates; a spec sheet states claims, a card grid decorates them. No fills,
 * no chips, no hover inversion — a ruled row of columns with mono indices, an
 * accent rule that draws in on hover, and the type doing the work. It also
 * removes four opportunities for a tone to go wrong.
 */
export function TrustStrip() {
  return (
    <>
      <TickerStrip
        items={[
          "Product discipline",
          "Security in-house",
          "You own the code",
          "No lock-in",
          "Senior engineers",
        ]}
      />

      <section className="section-dense relative">
        <div className="container-tl">
          <h2 className="sr-only">How we work</h2>

          {/* Hairline grid. The rules are the design — a 1px column separator
              at each boundary, and a heavier rule closing the top. */}
          <ul className="grid border-t border-[rgba(255,255,255,0.22)] sm:grid-cols-2 lg:grid-cols-4">
            {trustStrip.map((item, index) => (
              <li
                key={item.title}
                className="group/spec rise relative flex flex-col gap-4 border-b border-[rgba(255,255,255,0.1)] py-8 pr-6 lg:border-b-0 lg:border-r lg:last:border-r-0 lg:pr-8 lg:pl-8 lg:first:pl-0"
                style={{ animationDelay: `${index * 70}ms` }}
              >
                {/* Accent rule that draws across the column on hover. Sits on
                    the top border, so nothing moves and no fill is needed. */}
                <span
                  aria-hidden="true"
                  className="bg-lime absolute -top-px left-0 h-px w-full origin-left scale-x-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/spec:scale-x-100 lg:left-8 lg:w-[calc(100%-2rem)] lg:first:left-0"
                />

                <div className="flex items-center justify-between gap-4">
                  <span className="numeral text-ink-soft/50 t-sm leading-none" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <item.icon
                    className="text-lime size-[18px] transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/spec:-rotate-6"
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                </div>

                <h3 className="font-display text-ink t-lead leading-snug font-bold">
                  {item.title}
                </h3>
                <p className="text-ink-soft t-sm leading-relaxed">
                  {item.description}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
