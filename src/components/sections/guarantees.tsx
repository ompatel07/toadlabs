import { Check } from "lucide-react";
import { guarantees } from "@/config/trust";
import { Stamp, Asterisk } from "@/components/brand/decor";

/**
 * Engagement commitments — a terms sheet.
 *
 * WHAT WAS WRONG WITH THE PREVIOUS VERSION
 * It was three loose columns — numeral, title, then icon and description —
 * spread across the full container width. The middle of each row was empty, so
 * the icons floated in the centre of the page attached to nothing, and the eye
 * had to travel the whole width to connect a title to its own description. The
 * "NO LOCK-IN" stamp sat in the top-right corner, unrelated to anything.
 *
 * It was also the site's fifth ruled-row index. Cost drivers, sectors,
 * principles and deliverables all use that device; by this point in the page it
 * had stopped reading as a choice.
 *
 * WHAT THIS IS INSTEAD
 * The content is six contractual commitments, each written to be falsifiable —
 * it either happens on your engagement or it visibly does not. So it is set as
 * the artifact it describes: a single terms sheet with a document header, a
 * clause number per row, a confirmation mark against each, and the stamp
 * pressed onto the corner of the document rather than parked beside it.
 *
 * The check marks confirm inclusion — they are not a claim that anything has
 * been machine-verified, and the footer says so in words.
 *
 * Rows are zebra-tinted at 2% white, which is enough to track a long line
 * across a wide panel and far too little to affect the text contrast beneath.
 */
export function Guarantees() {
  return (
    <section className="section bg-rules bg-glow-right relative">
      <div className="container-tl">
        {/* The stamp lives beside the heading, not on the document.
            Both panel corners and its top edge were tried: the panel runs the
            full container width, so text reaches every edge and a 133px stamp
            lands on some of it wherever it goes. Reserving space inside the
            panel only shrank the header label. Beside the heading there is
            genuine empty space — the heading block is capped at max-w-2xl —
            so it reads as a seal on the section and collides with nothing. */}
        <div className="flex flex-wrap items-start justify-between gap-8">
        <div className="max-w-2xl">
          <p className="label-mono text-ink-soft flex items-center gap-2">
            <Asterisk className="text-lime size-2.5" />
            How we engage
          </p>
          <h2 className="type-h2 text-ink mt-5">
            Commitments you can hold us to
          </h2>
          <p className="text-ink-soft measure mt-5 t-lead">
            No badges, no logo wall. Six things that either happen on your
            engagement or visibly do not.
          </p>
        </div>

          <Stamp
            aria-hidden="true"
            className="hidden shrink-0 border-[color:var(--lime)] text-[color:var(--lime)] lg:flex"
          >
            No
            <br />
            lock-in
          </Stamp>
        </div>

        {/* Wrapper exists so the stamp can sit OUTSIDE the panel's overflow
            clip. Inside it, the top-anchored stamp was cropped by the rounded
            corner and landed on top of the header's right-hand label. */}
        <div className="relative mt-12">
          <div className="panel-feature corner-marks relative overflow-hidden">
          {/* Document header. */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[rgba(255,255,255,0.12)] px-6 py-4 md:px-8 lg:pr-48">
            <p className="label-mono text-ink-soft">Engagement terms</p>
            <p className="label-mono text-lime">
              {guarantees.length} of {guarantees.length} included as standard
            </p>
          </div>

          <ol>
            {guarantees.map((item, index) => (
              <li
                key={item.title}
                className={
                  "group/clause relative grid grid-cols-[auto_1fr] items-start gap-x-4 gap-y-2 border-b border-[rgba(255,255,255,0.07)] px-6 py-6 transition-colors duration-300 ease-out last:border-b-0 hover:bg-[rgba(255,255,255,0.035)] md:grid-cols-[auto_auto_minmax(0,1fr)] md:gap-x-6 md:px-8" +
                  (index % 2 === 1 ? " bg-[rgba(255,255,255,0.02)]" : "")
                }
              >
                {/* Accent rule that draws down the left edge on hover. */}
                <span
                  aria-hidden="true"
                  className="bg-lime absolute top-0 bottom-0 left-0 w-[2px] origin-top scale-y-0 transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/clause:scale-y-100"
                />

                <span className="bg-lime/12 text-lime mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded">
                  <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />
                </span>

                <span className="numeral text-ink-soft/60 mt-1 hidden t-sm leading-none md:block">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="flex flex-col gap-1.5 md:grid md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.35fr)] md:items-baseline md:gap-6">
                  <h3 className="font-display text-ink t-lead font-bold">
                    {item.title}
                  </h3>
                  <p className="text-ink-soft t-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          {/* Document footer — the honest framing for the check marks above. */}
          <div className="border-t border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.02)] px-6 py-4 md:px-8">
            <p className="text-ink-soft t-sm">
              Every clause above is falsifiable: it either happens on your
              engagement or it visibly does not. Ask us to point at any of them
              on the call.
            </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
