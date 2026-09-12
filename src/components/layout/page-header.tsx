import { SplitText } from "@/components/brand/split-text";
import { Asterisk, DotGrid, OutlineType } from "@/components/brand/decor";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description?: React.ReactNode;
  /** Optional right-hand slot: actions, stats, or a summary card. */
  aside?: React.ReactNode;
  /** Oversized outlined word behind the title. Defaults to the eyebrow. */
  watermark?: string;
  className?: string;
}

/**
 * Page header.
 *
 * Every non-home page opens with this, so it is worth being a set piece rather
 * than a stack of three text elements. It carries:
 *
 *  - an outlined watermark word, cropped by the left edge, giving the top of
 *    the page a graphic layer instead of empty margin
 *  - a character-by-character title reveal, so the page announces itself
 *  - a lime rule that draws itself out from the eyebrow
 *  - registration marks and a dot field, tying the inner pages to the same
 *    drafting-table language as the home page
 *
 * The title is a plain string rather than a node because SplitText needs the
 * text to segment it — that is a deliberate constraint, not an oversight.
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  aside,
  watermark,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "bg-grid relative overflow-hidden pt-16 pb-14 md:pt-24 md:pb-20",
        className,
      )}
    >
      {/* Watermark, deliberately bled off the left edge. */}
      <OutlineType className="absolute -top-6 -left-8 text-[clamp(5rem,17vw,14rem)] opacity-70">
        {(watermark ?? eyebrow).toUpperCase()}
      </OutlineType>

      <DotGrid className="top-16 right-8 hidden h-28 w-28 lg:block" />

      <div className="container-tl relative">
        <div className="grid gap-12 lg:grid-cols-[1.45fr_1fr] lg:items-end">
          <div className="flex flex-col gap-5">
            <p className="label-mono text-ink-soft flex items-center gap-2.5">
              <Asterisk className="text-lime-ink size-2.5" />
              {eyebrow}
            </p>

            {/* Drawn rule — a small piece of choreography before the title. */}
            <span
              aria-hidden="true"
              className="bg-lime-deep header-rule block h-[3px] w-full max-w-[120px] origin-left"
            />

            <h1 className="type-display text-ink max-w-4xl">
              <SplitText text={title} />
            </h1>

            {description ? (
              <p className="measure text-ink-soft t-lead md:text-lg">
                {description}
              </p>
            ) : null}
          </div>

          {aside ? <div className="lg:justify-self-end">{aside}</div> : null}
        </div>
      </div>
    </header>
  );
}
