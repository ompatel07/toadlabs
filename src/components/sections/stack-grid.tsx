import { buildStack, secureStack } from "@/config/home";
import { Section, SectionHeading } from "@/components/layout/section";
import { cn } from "@/lib/utils";

/**
 * The stack, in depth.
 *
 * Replaces the engagement comparison matrix that used to sit here. That table
 * was accurate and dull — five columns of prose asking to be read across, in
 * the middle of a page whose job is to show capability. The engagement shapes
 * still belong to a conversation; they did not belong in the widest, heaviest
 * block on the page.
 *
 * A technical buyer scanning a services page is looking for exactly this: do
 * they work in what we work in. Naming the tools answers it in two seconds,
 * where prose about "modern technologies" answers it never.
 *
 * Split into build and security lanes because the two halves of the studio use
 * genuinely different toolchains, and showing both is the substantive version
 * of the claim that offence and defence sit in one team.
 *
 * Each chip carries a scroll-driven stagger so the grid assembles rather than
 * appearing, and lifts on hover. The lanes differ in ground — canvas against
 * ink — so the section reads as two halves at a glance.
 */
export function StackGrid() {
  const lanes = [
    {
      label: "Build",
      hint: "Product, platform and infrastructure",
      items: buildStack,
      dark: false,
    },
    {
      label: "Secure",
      hint: "Testing, analysis and the standards behind them",
      items: secureStack,
      dark: true,
    },
  ];

  return (
    <Section className="overflow-clip">
      <SectionHeading
        eyebrow="Toolchain"
        title="What we actually build with"
        description="Named rather than described. If you already run some of this, the handover is shorter — and if you run something we have not listed, say so, because most of it transfers."
      />

      <div className="mt-12 grid gap-4 lg:grid-cols-2">
        {lanes.map((lane) => (
          <div
            key={lane.label}
            className={cn(
              "relative isolate flex flex-col gap-6 overflow-clip rounded-xl p-7 md:p-9",
              lane.dark ? "slab-dark on-dark" : "card-solid",
            )}
          >
            <div className="flex items-baseline justify-between gap-4">
              <h3
                className={cn(
                  "font-display type-h3 font-bold",
                  lane.dark ? "text-ink" : "text-ink",
                )}
              >
                {lane.label}
              </h3>
              <span
                className={cn(
                  "numeral t-sm leading-none",
                  lane.dark ? "text-white/30" : "text-ink/25",
                )}
                aria-hidden="true"
              >
                {String(lane.items.length).padStart(2, "0")}
              </span>
            </div>

            <p className={cn("t-sm", lane.dark ? "text-white/60" : "text-ink-soft")}>
              {lane.hint}
            </p>

            <ul className="flex flex-wrap gap-2">
              {lane.items.map((item, index) => (
                <li
                  key={item}
                  className="rise"
                  style={{ animationDelay: `${Math.min(index, 12) * 45}ms` }}
                >
                  <span
                    className={cn(
                      "inline-flex cursor-default items-center rounded-full border px-3.5 py-1.5 t-sm font-medium transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5",
                      lane.dark
                        ? "border-white/22 text-canvas/85 hover:border-lime hover:bg-lime hover:text-canvas"
                        : "border-[rgba(255,255,255,0.207)] text-ink hover:border-ink hover:bg-ink hover:text-canvas",
                    )}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
