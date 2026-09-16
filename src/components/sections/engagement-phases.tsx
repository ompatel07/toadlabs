import { engagementPhases } from "@/config/security";
import { Asterisk, OutlineType } from "@/components/brand/decor";

/**
 * The six phases of a security engagement — the cybersecurity page's dark
 * anchor.
 *
 * Two problems solved at once. It was a six-card grid immediately after the
 * capabilities bento, so the page ran two card layouts back to back and the
 * second one read as a repeat. And the page ran NINE consecutive light
 * sections with no tonal break anywhere below the header, which is what made
 * it feel long and undifferentiated however good the individual sections were.
 *
 * So this is the break: full-bleed ink, a numbered spine, and the phases as
 * ruled rows rather than tiles. A sequence is the one thing a grid cannot
 * express — six cards say "six things", where a spine says "in this order",
 * which is the entire point of stating a process up front.
 *
 * Outputs sit on the right as chips, so a reader scanning for deliverables can
 * find them without reading the prose.
 */
export function EngagementPhases() {
  return (
    <section className="slab-dark on-dark relative isolate overflow-clip py-20 md:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(70%_60%_at_85%_0%,rgba(60,230,141,0.16)_0%,rgba(60,230,141,0)_65%)]"
      />
      <OutlineType
        onDark
        className="absolute -top-6 -left-6 -z-10 text-[clamp(4rem,13vw,10rem)]"
      >
        PROCESS
      </OutlineType>

      <div className="container-tl relative">
        <div className="max-w-3xl">
          <p className="label-mono text-lime flex items-center gap-2">
            <Asterisk className="size-2.5" />
            Engagement process
          </p>
          <h2 className="type-h2 mt-5 text-ink">
            Six phases, agreed before anything is touched
          </h2>
          <p className="measure mt-6 t-lead text-white/70">
            The rules of engagement exist so that testing never becomes a
            surprise. You know what we will do, when, and who to call to stop
            it.
          </p>
        </div>

        <ol className="mt-14 border-t border-white/15">
          {engagementPhases.map((phase) => (
            <li
              key={phase.number}
              className="group/phase grid gap-x-8 gap-y-4 border-b border-white/15 py-8 transition-colors duration-400 ease-out hover:bg-white/[0.035] md:grid-cols-[auto_minmax(0,1.25fr)_minmax(0,1fr)] md:py-9"
            >
              <span
                className="numeral numeral-lg leading-none text-white/20 transition-colors duration-400 ease-out group-hover/phase:text-[color:var(--lime)]"
                aria-hidden="true"
              >
                {phase.number}
              </span>

              <div className="flex flex-col gap-2.5">
                <h3 className="font-display type-h3 font-bold text-ink transition-transform duration-400 ease-out md:group-hover/phase:translate-x-1.5">
                  {phase.title}
                </h3>
                <p className="t-base leading-relaxed text-white/65">
                  {phase.description}
                </p>
              </div>

              {/* Deliverables, findable without reading the prose. */}
              <ul className="flex flex-wrap content-start gap-1.5 md:justify-end">
                {phase.outputs.map((output) => (
                  <li
                    key={output}
                    className="label-mono rounded-full border border-white/25 px-2.5 py-1 text-white/75 transition-colors duration-300 ease-out group-hover/phase:border-[color:var(--lime)] group-hover/phase:text-[color:var(--lime)]"
                  >
                    {output}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
