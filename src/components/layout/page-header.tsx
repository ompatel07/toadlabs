import Link from "next/link";
import { SplitText } from "@/components/brand/split-text";
import { Asterisk, DotGrid, OutlineType } from "@/components/brand/decor";
import { ParticleNetwork } from "@/components/brand/particle-network";
import { BrandObject } from "@/components/brand/hero-object";
import { InteractiveObject } from "@/components/brand/interactive-object";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description?: React.ReactNode;
  /** Optional right-hand slot: actions, stats, or a summary card. */
  aside?: React.ReactNode;
  /** Trail above the eyebrow, ending at the current page (not linked). */
  breadcrumbs?: { name: string; href: string }[];
  /** Oversized outlined word behind the title. Defaults to the eyebrow. */
  watermark?: string;
  className?: string;
}

/**
 * Page header.
 *
 * Every non-home page opens with this. It carries the hero's own particle
 * network — reusing the component rather than imitating it — so the inner
 * pages belong to the same site as the front door.
 *
 * The watermark drifts on the page's scroll timeline, so the header has a layer
 * that moves independently of the type — the same depth trick as the mid-page
 * scene, at a distance small enough to sit behind a heading.
 *
 * Each header also carries the brand object, so every page opens on it rather
 * than only the home page. Its size depends on whether the page passes an
 * `aside`: with a card in the right column the object drops behind it at a
 * smaller size and bleeds off the edge, and without one it takes the column
 * outright. Below lg it is withdrawn entirely — the header stacks to a single
 * column there and an object would either crowd the heading or shrink to a
 * sticker.
 *
 * The title is a plain string rather than a node because SplitText needs the
 * text to segment it — a deliberate constraint, not an oversight.
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  aside,
  breadcrumbs,
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
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(70%_80%_at_18%_100%,rgba(60,230,141,0.2)_0%,rgba(60,230,141,0)_68%)]"
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 opacity-[0.06]" />

      <ParticleNetwork className="pointer-events-none absolute inset-0 -z-10 h-full w-full opacity-70" />

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
            {breadcrumbs?.length ? (
              <nav aria-label="Breadcrumb">
                <ol className="text-ink-soft flex flex-wrap items-center gap-x-2 gap-y-1 t-sm">
                  {breadcrumbs.map((crumb, index) => {
                    const last = index === breadcrumbs.length - 1;
                    return (
                      <li key={crumb.href} className="flex items-center gap-2">
                        {last ? (
                          <span aria-current="page" className="text-ink">
                            {crumb.name}
                          </span>
                        ) : (
                          <>
                            <Link
                              href={crumb.href}
                              className="hover:text-ink cursor-pointer py-1 underline-offset-4 transition-colors duration-200 ease-out hover:underline"
                            >
                              {crumb.name}
                            </Link>
                            <span aria-hidden="true">/</span>
                          </>
                        )}
                      </li>
                    );
                  })}
                </ol>
              </nav>
            ) : null}
            <p className="label-mono text-lime flex items-center gap-2.5">
              <Asterisk className="size-2.5" />
              {eyebrow}
            </p>

            {/* Drawn rule — a small piece of choreography before the title. */}
            <span
              aria-hidden="true"
              className="bg-lime header-rule block h-[3px] w-full max-w-[120px] origin-left"
            />

            <h1 className="type-display max-w-4xl text-ink">
              <SplitText text={title} />
            </h1>

            {description ? (
              <p className="measure t-lead text-white/70 md:text-lg">
                {description}
              </p>
            ) : null}
          </div>

          {/* Right column: the aside, then the object beneath it. Stacking
              them beats layering — with the object behind the card only its
              feet cleared the bottom edge, which read as an accident rather
              than a composition. */}
          <div className="hidden flex-col items-end lg:flex">
            {aside}

            {/* No longer aria-hidden or pointer-events-none: the object is an
                interactive button now, and a button inside an aria-hidden
                subtree is focusable but unannounced. Only the bloom stays
                decorative. */}
            <div
              className={cn(
                "relative",
                aside
                  ? "-mr-10 -mb-24 w-[240px] xl:-mr-4 xl:w-[280px]"
                  : "-mr-6 -mb-28 w-[340px] xl:-mr-2 xl:w-[400px]",
              )}
            >
              <div aria-hidden="true" className="scene-bloom pointer-events-none absolute inset-[-22%] -z-10" />
              <InteractiveObject motionClassName="object-drift">
                <BrandObject
                  className="w-full drop-shadow-[0_28px_60px_rgba(0,0,0,0.5)]"
                  sizes={aside ? "280px" : "400px"}
                />
              </InteractiveObject>
            </div>
          </div>

          {/* Below lg the aside returns to the flow beneath the heading; the
              object is withdrawn, since a single-column header has no room for
              it that does not crowd the heading. */}
          {aside ? <div className="lg:hidden">{aside}</div> : null}
        </div>
      </div>
    </header>
  );
}
