import { SplitText } from "@/components/brand/split-text";
import { Asterisk, DotGrid, OutlineType } from "@/components/brand/decor";
import { ParticleNetwork } from "@/components/brand/particle-network";
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
 * Every non-home page opens with this, so five pages stand or fall on it. The
 * previous version had the right ideas — a watermark, a drawn rule, a split
 * title — but every one of them was a whisper on cream: an outline at 70%
 * opacity, a dot field, a hairline. Against a home page that opens with a
 * glossy object, a giant wordmark and a live particle field, an inner page
 * opened with a paragraph.
 *
 * So it opens on the dark ground instead, and carries the hero's own particle
 * network. Reusing the actual hero component rather than imitating it is the
 * point: the inner pages now belong to the same site as the front door, and
 * the cream body that follows gains a hard edge to start against instead of
 * fading up from more cream.
 *
 * The watermark drifts on the page's scroll timeline, so the header has a layer
 * that moves independently of the type — the same depth trick as the mid-page
 * scene, at a distance small enough to sit behind a heading.
 *
 * The title is a plain string rather than a node because SplitText needs the
 * text to segment it — a deliberate constraint, not an oversight.
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
        // overflow-clip, never hidden: `hidden` would make this a scroll
        // container and the watermark's view() timeline would measure against
        // it rather than the document, freezing it at a constant transform.
        "slab-dark on-dark relative isolate overflow-clip pt-20 pb-16 md:pt-28 md:pb-24",
        className,
      )}
    >
      {/* Lime wash rising from the lower left. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(70%_80%_at_18%_100%,rgba(199,242,60,0.2)_0%,rgba(199,242,60,0)_68%)]"
      />
      <div aria-hidden="true" className="bg-grid pointer-events-none absolute inset-0 -z-10 opacity-[0.06]" />

      <ParticleNetwork
        tone="light"
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full opacity-70"
      />

      {/* Watermark, bled off the left edge, drifting against the type. */}
      <OutlineType
        onDark
        className="page-watermark absolute -top-4 -left-8 -z-10 text-[clamp(5rem,17vw,14rem)]"
      >
        {(watermark ?? eyebrow).toUpperCase()}
      </OutlineType>

      <DotGrid className="top-20 right-8 hidden h-28 w-28 text-white/20 lg:block" />

      <div className="container-tl relative">
        <div className="grid gap-12 lg:grid-cols-[1.45fr_1fr] lg:items-end">
          <div className="flex flex-col gap-5">
            <p className="label-mono text-lime flex items-center gap-2.5">
              <Asterisk className="size-2.5" />
              {eyebrow}
            </p>

            {/* Drawn rule — a small piece of choreography before the title. */}
            <span
              aria-hidden="true"
              className="bg-lime header-rule block h-[3px] w-full max-w-[120px] origin-left"
            />

            <h1 className="type-display max-w-4xl text-white">
              <SplitText text={title} />
            </h1>

            {description ? (
              <p className="measure t-lead text-white/70 md:text-lg">
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
