/**
 * The hero 3D object.
 *
 * WHY <picture> RATHER THAN next/image
 * The site builds with `output: "export"`, which disables Next's image
 * optimiser — `images.unoptimized` is required, and next/image then emits a
 * plain <img> with the src untouched. It would do no format negotiation, so
 * the AVIF and WebP derivatives would never be served and every visitor would
 * download the 1.39MB PNG.
 *
 * A <picture> gives what next/image would have: explicit dimensions (so the
 * box is reserved and CLS stays 0), a sizes/srcset pair matching the responsive
 * widths, high fetch priority, and a preload — plus actual AVIF/WebP delivery.
 * At 1254px that is 87KB AVIF against 345KB PNG.
 *
 * Derivatives come from scripts/generate-hero-assets.mjs.
 */

const WIDTHS = [400, 600, 900, 1254] as const;

/** Matches the breakpoints in the hero layout below. */
const SIZES =
  "(max-width: 767px) 72vw, (max-width: 1023px) 46vw, (max-width: 1439px) 38vw, 560px";

const srcSet = (extension: string) =>
  WIDTHS.map((width) => `/hero/offscript-hero-${width}.${extension} ${width}w`).join(
    ", ",
  );

/** The standing figure used everywhere except the hero. */
const FIGURE_WIDTHS = [220, 340, 460, 647] as const;

const figureSrcSet = (extension: string) =>
  FIGURE_WIDTHS.map(
    (width) => `/hero/offscript-figure-${width}.${extension} ${width}w`,
  ).join(", ");

export function HeroObject({
  className,
  float = true,
}: {
  className?: string;
  /** Turn off when a wrapper applies the float instead, so anything layered
      over the image (the interactive object's glints) moves with it. */
  float?: boolean;
}) {
  return (
    <>
      {/* React hoists this to <head>. Responsive so the preload matches the
          candidate the browser will actually choose. */}
      <link
        rel="preload"
        as="image"
        type="image/avif"
        href="/hero/offscript-hero-900.avif"
        imageSrcSet={srcSet("avif")}
        imageSizes={SIZES}
        fetchPriority="high"
      />

      <div className={className}>
        {/* hero-glow paints the lime bloom behind; the float sits on the image
            itself so the glow stays put while the object drifts. The wrapper
            controls the size — width on phones, height on desktop — so the
            object can be bounded by whichever axis is scarcer. */}
        <div className="hero-glow relative isolate h-full w-full">
          <picture>
            <source type="image/avif" srcSet={srcSet("avif")} sizes={SIZES} />
            <source type="image/webp" srcSet={srcSet("webp")} sizes={SIZES} />
            <img
              src="/hero/offscript-hero-1254.png"
              srcSet={srcSet("png")}
              sizes={SIZES}
              width={1312}
              height={1199}
              fetchPriority="high"
              decoding="async"
              alt=""
              className={`${float ? "animate-hero-float " : ""}block h-full w-full object-contain select-none`}
              draggable={false}
            />
          </picture>
        </div>
      </div>
    </>
  );
}

/**
 * The same object, below the fold.
 *
 * Separate from HeroObject because everything that makes the hero copy fast is
 * wrong down here: no preload, no high fetch priority, and lazy decoding, so it
 * never competes with the LCP image for bandwidth. The brand's strongest asset
 * was being used exactly once on the entire site; this is what lets it recur.
 */
/**
 * The standing figure, used on every page section that is not the hero.
 *
 * A different pose from the hero deliberately: the hero is the wide seated
 * composition with its ring of floating cards, and repeating it further down
 * the page made the object read as clip art rather than a character. This one
 * is portrait (647x1126), so it fits the narrow columns those sections have.
 */
export function BrandObject({
  className,
  sizes = "(max-width: 767px) 60vw, 340px",
}: {
  className?: string;
  sizes?: string;
}) {
  return (
    <picture>
      <source type="image/avif" srcSet={figureSrcSet("avif")} sizes={sizes} />
      <source type="image/webp" srcSet={figureSrcSet("webp")} sizes={sizes} />
      <img
        src="/hero/offscript-figure-647.png"
        srcSet={figureSrcSet("png")}
        sizes={sizes}
        width={647}
        height={1126}
        loading="lazy"
        decoding="async"
        alt=""
        className={className}
      />
    </picture>
  );
}
