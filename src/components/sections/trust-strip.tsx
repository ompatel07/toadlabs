import { trustStrip } from "@/config/home";
import { TickerStrip, CrossMark } from "@/components/brand/decor";
import { cn } from "@/lib/utils";

/**
 * Capability statements.
 *
 * These were four flat bordered cells, one of them filled lime — structurally
 * correct and completely inert. They are the first thing under the hero, so
 * "inert" was the wrong thing to be.
 *
 * Now each cell is a surface that responds: an ink wipe that rises from the
 * bottom edge on hover, taking the type and the icon to their inverted state
 * with it, over an oversized ghost numeral that stays put. The lime cell keeps
 * its emphasis by inverting the other way — it is already filled, so it wipes
 * to ink rather than from it, which keeps one cell visually dominant without
 * giving it a different interaction.
 *
 * Every transform is behind motion-safe; the colour change alone carries the
 * hover state for anyone who has asked for less movement.
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

          <ul className="grid gap-0 sm:grid-cols-2 lg:grid-cols-4">
            {trustStrip.map((item, index) => {
              // The third cell is the lime one. It starts filled, so its wipe
              // runs to ink instead of from it.
              const accent = index === 2;
              return (
                <li key={item.title} className="rise relative">
                  {/* Registration mark at each cell's top-left corner. */}
                  <CrossMark className="text-ink/25 -top-2 -left-2 size-4" />

                  <div
                    className={cn(
                      "group/cell relative isolate flex h-full flex-col gap-3.5 overflow-clip border p-6 transition-colors duration-500 ease-out",
                      // Collapse the shared borders into single rules.
                      "-mt-px -ml-px",
                      accent
                        ? "bg-lime border-ink text-ink"
                        : "border-[rgba(11,12,10,0.16)] bg-white text-ink hover:border-ink",
                    )}
                  >
                    {/* The wipe. Rises from the bottom edge behind the
                        content, so nothing reflows and no shadow is needed. */}
                    <span
                      aria-hidden="true"
                      className={cn(
                        "pointer-events-none absolute inset-0 -z-10 origin-bottom scale-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-safe:group-hover/cell:scale-y-100",
                        accent ? "bg-ink" : "bg-ink",
                      )}
                    />

                    {/* Oversized ghost numeral, bled off the corner. */}
                    <span
                      aria-hidden="true"
                      className={cn(
                        "numeral pointer-events-none absolute -right-3 -bottom-7 -z-10 text-[5.5rem] leading-none select-none transition-colors duration-500 ease-out",
                        accent
                          ? "text-ink/[0.07] group-hover/cell:text-white/[0.07]"
                          : "text-ink/[0.06] group-hover/cell:text-white/[0.08]",
                      )}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span
                      className={cn(
                        "inline-flex size-11 items-center justify-center rounded-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-safe:group-hover/cell:rotate-[-8deg]",
                        accent
                          ? "bg-ink text-lime group-hover/cell:bg-lime group-hover/cell:text-ink"
                          : "bg-canvas text-ink group-hover/cell:bg-lime",
                      )}
                    >
                      <item.icon className="size-[18px]" strokeWidth={2} aria-hidden="true" />
                    </span>

                    <h3 className="font-display t-base font-bold transition-colors duration-500 ease-out group-hover/cell:text-white">
                      {item.title}
                    </h3>
                    <p
                      className={cn(
                        "t-sm leading-snug transition-colors duration-500 ease-out group-hover/cell:text-white/70",
                        accent ? "text-ink/75" : "text-ink-soft",
                      )}
                    >
                      {item.description}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </>
  );
}
