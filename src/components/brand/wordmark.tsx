import { cn } from "@/lib/utils";

/**
 * The brand lockup: the toad face mark plus the wordmark.
 *
 * Replaces an abstract rounded square with a dot in it, which was a placeholder
 * standing in for a logo the studio did not have yet. There is a real mark now,
 * so the placeholder is gone.
 *
 * Served as <picture> rather than next/image: the site builds with
 * `output: "export"`, which disables the optimiser, so next/image would emit a
 * plain <img> and never negotiate the WebP. Explicit width/height keep the box
 * reserved, which matters here — the header is the first thing painted and a
 * reflowing logo is a visible CLS hit on every page.
 *
 * The mark is aria-hidden and the name is real text, so assistive tech reads
 * "Toad Labs" once rather than announcing a decorative image beside it.
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "font-display text-ink inline-flex items-center gap-2.5 t-base whitespace-nowrap",
        className,
      )}
      style={{ fontWeight: 700 }}
    >
      <picture>
        <source type="image/webp" srcSet="/brand/toad-mark.webp" />
        <img
          src="/brand/toad-mark.png"
          alt=""
          aria-hidden="true"
          width={834}
          height={357}
          className="h-[18px] w-auto shrink-0 sm:h-5"
        />
      </picture>
      Toad Labs
    </span>
  );
}
