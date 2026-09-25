import { cn } from "@/lib/utils";

/**
 * The brand lockup: the OFFSCRIPT logo plus the wordmark, full stop included.
 *
 * The logo is the 3D mark, served as a <picture> because the site exports
 * statically (no image optimiser, so next/image would never negotiate the
 * WebP). Explicit width/height keep the box reserved — the header is the
 * first thing painted, and a reflowing logo is a visible CLS hit on every
 * page.
 *
 * The mark is aria-hidden and the name is real text, so assistive tech reads
 * "OFFSCRIPT." once rather than announcing a decorative image beside it.
 */
export function OffscriptMark({ className }: { className?: string }) {
  return (
    <picture>
      <source
        type="image/webp"
        srcSet="/brand/offscript-logo-48.webp 48w, /brand/offscript-logo-96.webp 96w, /brand/offscript-logo-144.webp 144w"
        sizes="24px"
      />
      <img
        src="/brand/offscript-logo-96.png"
        srcSet="/brand/offscript-logo-48.png 48w, /brand/offscript-logo-96.png 96w, /brand/offscript-logo-144.png 144w"
        sizes="24px"
        width={96}
        height={96}
        alt=""
        aria-hidden="true"
        draggable={false}
        className={cn("select-none", className)}
      />
    </picture>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "font-display text-ink inline-flex items-center gap-2 t-base whitespace-nowrap",
        className,
      )}
      style={{ fontWeight: 700, letterSpacing: "0.02em" }}
    >
      <OffscriptMark className="size-[22px] shrink-0 sm:size-6" />
      {/* One flex item, not two: as bare siblings the name and the full stop
          were separate children of this inline-flex row, so the row's gap
          pushed the dot 8px clear of the T. The dot is lime — the one accent
          in the lockup. */}
      <span>
        OFFSCRIPT<span className="text-lime">.</span>
      </span>
    </span>
  );
}
