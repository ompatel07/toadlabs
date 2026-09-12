import { trustStrip } from "@/config/home";
import { TickerStrip, CrossMark } from "@/components/brand/decor";
import { tones, accentAt } from "@/lib/tones";
import { cn } from "@/lib/utils";

/**
 * Capability statements.
 *
 * Bordered cells on the canvas with registration marks at the corners — the
 * structure does the work, and lime lands on exactly one cell so it reads as
 * emphasis rather than as another colour in a set.
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
              const tone = tones[accentAt(index, [2])];
              return (
                <li key={item.title} className="rise relative">
                  {/* Registration mark at each cell's top-left corner. */}
                  <CrossMark className="text-ink/25 -top-2 -left-2 size-4" />
                  <div
                    className={cn(
                      "group flex h-full flex-col gap-3 border p-6 transition-colors duration-300 ease-out",
                      tone.bg,
                      tone.text,
                      tone.border,
                      // Collapse the shared borders into single rules.
                      "-mt-px -ml-px",
                    )}
                  >
                    <span
                      className={cn(
                        "inline-flex size-10 items-center justify-center rounded-full transition-transform duration-300 ease-out group-hover:rotate-12",
                        tone.chip,
                      )}
                    >
                      <item.icon className="size-[18px]" strokeWidth={2} aria-hidden="true" />
                    </span>
                    <h3 className="font-display text-[1rem] font-bold tracking-[-0.02em]">
                      {item.title}
                    </h3>
                    <p className={cn("text-[0.875rem] leading-snug", tone.muted)}>
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
