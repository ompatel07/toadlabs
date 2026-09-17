import { guarantees } from "@/config/trust";
import { Stamp, Asterisk } from "@/components/brand/decor";

/**
 * Engagement commitments — a hairline index, not a card grid.
 *
 * Each is falsifiable: it either happens on an engagement or it visibly does
 * not. That is what replaces the unverifiable badge wall a security site
 * usually leads with.
 *
 * Rendered as ruled rows with the index and icon hanging in the margin. Reads
 * like a list of contract clauses, which is the right register for promises —
 * and gives the page a break from consecutive card grids.
 */
export function Guarantees() {
  return (
    <section className="section bg-rules bg-glow-right relative bg-[var(--surface)]">
      <div className="container-tl">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <p className="label-mono text-ink-soft flex items-center gap-2">
              <Asterisk className="text-lime-ink size-2.5" />
              How we engage
            </p>
            <h2 className="type-h2 text-ink mt-5 max-w-2xl">
              Commitments you can hold us to
            </h2>
            <p className="text-ink-soft measure mt-5 t-lead">
              No badges, no logo wall. Six things that either happen on your
              engagement or visibly do not.
            </p>
          </div>
          <Stamp className="hidden shrink-0 lg:flex">
            No
            <br />
            lock-in
          </Stamp>
        </div>

        <ul className="mt-14 border-t-2 border-[rgba(255,255,255,0.22)]">
          {guarantees.map((item, index) => (
            <li
              key={item.title}
              className="rise group grid items-start gap-x-6 border-b border-[rgba(255,255,255,0.161)] py-7 md:grid-cols-[auto_minmax(0,0.9fr)_minmax(0,1.4fr)] md:gap-x-10 md:py-8"
            >
              <span
                className="label-mono text-ink-soft hidden pt-1.5 md:block"
                aria-hidden="true"
              >
                {String(index + 1).padStart(2, "0")}
              </span>

              <h3 className="font-display text-ink flex items-start gap-3 type-h3 font-bold">
                <span className="bg-[var(--surface-2)] text-lime inline-flex size-9 shrink-0 items-center justify-center rounded-full transition-transform duration-300 ease-out group-hover:rotate-12 md:hidden">
                  <item.icon className="size-4" strokeWidth={2} aria-hidden="true" />
                </span>
                {item.title}
              </h3>

              <div className="mt-3 flex items-start gap-5 md:mt-0">
                <span className="bg-[var(--surface-2)] text-lime hidden size-10 shrink-0 items-center justify-center rounded-full transition-transform duration-300 ease-out group-hover:rotate-12 md:inline-flex">
                  <item.icon
                    className="size-[18px]"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                </span>
                <p className="text-ink-soft t-base leading-relaxed">
                  {item.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
