import type { SecurityService } from "@/config/security";
import { cn } from "@/lib/utils";

/**
 * Security capabilities as a bento rather than a uniform grid.
 *
 * This page previously ran two identical three-column grids back to back —
 * capabilities, then engagement phases — so the second one read as a repeat of
 * the first and the eye skipped both. Varying the cell sizes gives the section
 * its own silhouette, and inverting the two flagship disciplines says which
 * work is the centre of gravity without a badge saying "most popular".
 *
 * Spans are declared per service id rather than derived from order, because the
 * layout is a composition: it has to stay balanced if the config is reordered,
 * and a rule like "every third card is wide" produces a hole the moment someone
 * adds an eighth service. An id with no entry falls back to a two-column cell.
 */
const LAYOUT: Record<string, { span: string; dark?: boolean }> = {
  vapt: { span: "xl:col-span-3", dark: true },
  pentesting: { span: "xl:col-span-3", dark: true },
  audits: { span: "xl:col-span-2" },
  "code-review": { span: "xl:col-span-2" },
  cloud: { span: "xl:col-span-2" },
  compliance: { span: "xl:col-span-3" },
  "incident-response": { span: "xl:col-span-3" },
};

export function SecurityCapabilities({
  services,
}: {
  services: SecurityService[];
}) {
  return (
    <ul className="mt-12 grid gap-3 md:grid-cols-2 xl:grid-cols-6">
      {services.map((service, index) => {
        const { span = "xl:col-span-2", dark = false } =
          LAYOUT[service.id] ?? {};
        return (
          <li
            key={service.id}
            className={cn("reveal", span)}
            style={{ animationDelay: `${Math.min(index, 5) * 70}ms` }}
          >
            <article
              id={service.id}
              className={cn(
                "group/cap relative flex h-full scroll-mt-28 flex-col gap-3.5 overflow-hidden rounded-lg p-6 transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1",
                dark ? "slab-dark on-dark" : "card-solid",
              )}
            >
              {/* Oversized ghost glyph. On the flagship cards only — on the
                  smaller cells there is no room for it to read as anything but
                  clutter. */}
              {dark ? (
                <service.icon
                  className="pointer-events-none absolute -right-8 -bottom-8 size-44 text-white/[0.05] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/cap:-rotate-12"
                  strokeWidth={0.75}
                  aria-hidden="true"
                />
              ) : null}

              <div className="relative flex items-start justify-between gap-4">
                <span
                  className={cn(
                    "inline-flex size-10 items-center justify-center rounded-xl",
                    dark ? "bg-lime text-canvas" : "bg-canvas text-ink",
                  )}
                >
                  <service.icon
                    className="size-[18px]"
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                </span>
                <span
                  className={cn(
                    "numeral t-sm leading-none",
                    dark ? "text-white/25" : "text-ink/20",
                  )}
                  aria-hidden="true"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <h2
                className={cn(
                  "font-display relative font-semibold",
                  dark ? "type-h3 text-ink" : "t-lead text-ink",
                )}
              >
                {service.title}
              </h2>
              <p
                className={cn(
                  "relative leading-relaxed",
                  dark ? "t-base text-white/70" : "t-sm text-ink-soft",
                )}
              >
                {service.summary}
              </p>

              <ul
                className={cn(
                  "relative grid gap-1.5 border-t pt-3.5",
                  dark
                    ? "border-white/15 sm:grid-cols-2 sm:gap-x-6"
                    : "border-[rgba(255,255,255,0.115)]",
                )}
              >
                {service.scope.map((item) => (
                  <li
                    key={item}
                    className={cn(
                      "flex items-start gap-2 t-xs leading-snug",
                      dark ? "text-white/70" : "text-ink-soft",
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "mt-1.5 inline-block size-1 shrink-0 rounded-full",
                        dark ? "bg-lime" : "bg-lime-deep",
                      )}
                    />
                    {item}
                  </li>
                ))}
              </ul>

              <ul className="relative mt-auto flex flex-wrap gap-1.5 pt-1">
                {service.standards.map((standard) => (
                  <li
                    key={standard}
                    className={cn(
                      "label-mono rounded-full border px-2 py-0.5",
                      dark
                        ? "border-white/25 text-white/75"
                        : "border-[rgba(255,255,255,0.161)] text-ink-soft",
                    )}
                  >
                    {standard}
                  </li>
                ))}
              </ul>
            </article>
          </li>
        );
      })}
    </ul>
  );
}
