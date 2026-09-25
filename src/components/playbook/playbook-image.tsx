import { cn } from "@/lib/utils";

/**
 * A generated playbook image: AVIF, WebP and a PNG fallback.
 *
 * Written as <picture> rather than next/image because the site is a static
 * export with the optimiser disabled — next/image would emit a plain <img>
 * and never negotiate the modern formats. Width and height are always
 * explicit so the box is reserved before the file arrives and nothing on the
 * page shifts while it loads.
 *
 * Files come from scripts/generate-playbook-assets.mjs, which writes a
 * labelled placeholder at the same dimensions when the source is missing — so
 * the layout is final even before the real screenshots exist.
 */

export type PlaybookImageKind = "snapshots" | "proofs" | "websites";

const WIDTHS: Record<PlaybookImageKind, number[]> = {
  snapshots: [480, 900, 1400],
  proofs: [360, 600, 840],
  websites: [480, 900, 1400],
};

/** Intrinsic size of each kind, so the aspect ratio is reserved up front. */
export const SIZE: Record<PlaybookImageKind, { width: number; height: number }> = {
  snapshots: { width: 1400, height: 875 },
  proofs: { width: 840, height: 1494 },
  websites: { width: 1400, height: 875 },
};

function srcSet(kind: PlaybookImageKind, id: string, extension: string) {
  return WIDTHS[kind]
    .map((width) => `/playbook/${kind}/${id}-${width}.${extension} ${width}w`)
    .join(", ");
}

export function PlaybookImage({
  kind,
  id,
  alt,
  sizes,
  className,
  priority = false,
}: {
  kind: PlaybookImageKind;
  id: string;
  alt: string;
  sizes: string;
  className?: string;
  /** Only the first image above the fold should set this. */
  priority?: boolean;
}) {
  const { width, height } = SIZE[kind];
  const largest = WIDTHS[kind][WIDTHS[kind].length - 1];

  return (
    <picture>
      <source type="image/avif" srcSet={srcSet(kind, id, "avif")} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet(kind, id, "webp")} sizes={sizes} />
      <img
        src={`/playbook/${kind}/${id}-${largest}.png`}
        srcSet={srcSet(kind, id, "png")}
        sizes={sizes}
        width={width}
        height={height}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        className={cn("block h-auto w-full select-none", className)}
        draggable={false}
      />
    </picture>
  );
}
