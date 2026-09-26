import { playbookImages, type PlaybookImageKind } from "@/config/playbook-images.generated";
import { cn } from "@/lib/utils";

/**
 * A generated playbook image: AVIF, WebP and a PNG fallback.
 *
 * <picture> rather than next/image because the site is a static export with
 * the optimiser disabled — next/image would emit a plain <img> and never
 * negotiate the modern formats.
 *
 * Width and height come from the generated manifest, so each screenshot
 * reserves its own true box. These are documents and spreadsheets: forcing
 * them into one shared aspect ratio would crop away the text that makes them
 * worth showing.
 */

const WIDTHS: Record<PlaybookImageKind, number[]> = {
  snapshots: [480, 900, 1400],
  proofs: [360, 600, 840],
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
  priority?: boolean;
}) {
  const size = (playbookImages[kind] as Record<string, { width: number; height: number }>)[id];
  if (!size) return null;

  const largest = WIDTHS[kind][WIDTHS[kind].length - 1];

  return (
    <picture>
      <source type="image/avif" srcSet={srcSet(kind, id, "avif")} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet(kind, id, "webp")} sizes={sizes} />
      <img
        src={`/playbook/${kind}/${id}-${largest}.png`}
        srcSet={srcSet(kind, id, "png")}
        sizes={sizes}
        width={size.width}
        height={size.height}
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

/** Screenshot in a frame, with its caption, linking to the full-size file. */
export function Shot({
  kind = "snapshots",
  id,
  alt,
  caption,
  sizes = "(max-width: 639px) 92vw, (max-width: 1279px) 46vw, 32vw",
  className,
}: {
  kind?: PlaybookImageKind;
  id: string;
  alt: string;
  caption: string;
  sizes?: string;
  className?: string;
}) {
  return (
    <figure className={cn("pb-panel group flex flex-col overflow-hidden", className)}>
      {/* A plain link to the full-size file: opening larger works without any
          JavaScript, which a lightbox would not. */}
      <a
        href={`/playbook/${kind}/${id}-${WIDTHS[kind][WIDTHS[kind].length - 1]}.png`}
        target="_blank"
        rel="noopener noreferrer"
        className="block cursor-pointer"
      >
        <PlaybookImage kind={kind} id={id} alt={alt} sizes={sizes} />
      </a>
      <figcaption className="text-ink-soft mt-auto flex items-center justify-between gap-3 px-4 py-3 t-xs">
        {caption}
        <span className="pb-accent opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          open
        </span>
      </figcaption>
    </figure>
  );
}
