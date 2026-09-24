import { cn } from "@/lib/utils";

/**
 * The brand lockup: the OFFSCRIPT mark plus the wordmark.
 *
 * Inline SVG rather than an image file: at 20px the mark is a handful of
 * shapes, so inlining it costs less than the request it replaces, stays sharp
 * on any display, and cannot flash or reflow while the header paints.
 *
 * The mark keeps its own brand colours (lime tile, ink glyph, coral dot)
 * rather than inheriting the page's accent — a logo is fixed, not themed.
 *
 * It is aria-hidden and the name is real text, so assistive tech reads
 * "OFFSCRIPT" once rather than announcing a decorative image beside it.
 */
export function OffscriptMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <rect width="64" height="64" rx="19" fill="#d3ff38" />
      <path
        d="M17 43V28a10 10 0 0 1 10-10h14a10 10 0 0 1 10 10v9a10 10 0 0 1-10 10H31"
        stroke="#111426"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <path
        d="m15 45 12-10 8 6 15-17m-8 0h8v8"
        stroke="#111426"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="15" cy="45" r="3" fill="#fa5b3d" />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "font-display text-ink inline-flex items-center gap-2.5 t-base whitespace-nowrap",
        className,
      )}
      style={{ fontWeight: 700, letterSpacing: "0.02em" }}
    >
      <OffscriptMark className="size-[22px] shrink-0 sm:size-6" />
      OFFSCRIPT
    </span>
  );
}
