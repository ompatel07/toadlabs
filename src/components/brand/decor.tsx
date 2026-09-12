import { cn } from "@/lib/utils";

/**
 * Decorative kit.
 *
 * The site's visual interest comes from these — separators, marks, rules and
 * texture — rather than from adding more hues. Everything here is inline SVG or
 * CSS: no images, no extra requests, and every piece is aria-hidden because
 * none of it carries meaning.
 */

/** Wavy edge between two surfaces. `flip` points the wave the other way. */
export function WaveDivider({
  className,
  fill = "var(--canvas)",
  flip = false,
}: {
  className?: string;
  fill?: string;
  flip?: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none relative w-full leading-[0]", className)}
    >
      <svg
        viewBox="0 0 1440 64"
        preserveAspectRatio="none"
        className={cn("block h-10 w-full md:h-16", flip && "rotate-180")}
      >
        <path
          d="M0 32c60-24 120-32 180-24s120 32 180 40 120 0 180-16 120-32 180-24 120 32 180 40 120 0 180-16 120-32 180-24v56H0Z"
          fill={fill}
        />
      </svg>
    </div>
  );
}

/** Scalloped edge — a row of half-circles. */
export function ScallopDivider({
  className,
  fill = "var(--canvas)",
  flip = false,
}: {
  className?: string;
  fill?: string;
  flip?: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none relative w-full leading-[0]", className)}
    >
      <svg
        viewBox="0 0 1200 40"
        preserveAspectRatio="none"
        className={cn("block h-6 w-full md:h-10", flip && "rotate-180")}
      >
        <path
          d="M0 40V16c25 0 25-16 50-16s25 16 50 16 25-16 50-16 25 16 50 16 25-16 50-16 25 16 50 16 25-16 50-16 25 16 50 16 25-16 50-16 25 16 50 16 25-16 50-16 25 16 50 16 25-16 50-16 25 16 50 16 25-16 50-16 25 16 50 16 25-16 50-16 25 16 50 16 25-16 50-16 25 16 50 16 25-16 50-16 25 16 50 16v24Z"
          fill={fill}
        />
      </svg>
    </div>
  );
}

/**
 * Ticker strip — a continuously scrolling ink band.
 *
 * Two identical tracks sit side by side and the pair translates by exactly
 * -50%. At the moment the first track leaves, the second is precisely where
 * the first began, so the loop is seamless with no snap.
 *
 * `tone` picks ink or lime; `speed` and `reverse` let neighbouring strips run
 * at different rates and directions, which is what stops several of them on one
 * page reading as the same element repeated.
 *
 * Accessibility: the strip is decorative, so the whole thing is aria-hidden and
 * the duplicate costs nothing in the accessibility tree. It pauses on hover and
 * focus-within, and the edges are masked so items dissolve rather than being
 * clipped.
 */
export function TickerStrip({
  items,
  className,
  tone = "ink",
  speed = "34s",
  reverse = false,
}: {
  items: string[];
  className?: string;
  tone?: "ink" | "lime";
  speed?: string;
  reverse?: boolean;
}) {
  const track = (
    <div className="flex shrink-0 items-center gap-6 pr-6">
      {items.map((item) => (
        <span
          key={item}
          className="label-mono flex shrink-0 items-center gap-6 whitespace-nowrap"
        >
          {item}
          <Asterisk
            className={cn(
              "size-2.5",
              tone === "ink" ? "text-lime" : "text-ink/50",
            )}
          />
        </span>
      ))}
    </div>
  );

  return (
    <div
      aria-hidden="true"
      className={cn(
        "marquee-viewport relative flex overflow-hidden py-2.5 select-none",
        tone === "ink" ? "bg-ink text-white/85" : "bg-lime text-ink",
        className,
      )}
    >
      {[0, 1].map((copy) => (
        <div
          key={copy}
          className={cn(
            "flex shrink-0 items-center",
            reverse ? "animate-marquee-reverse" : "animate-marquee",
          )}
          style={{ animationDuration: speed }}
        >
          {track}
        </div>
      ))}
    </div>
  );
}

/** Small six-point asterisk — the recurring punctuation mark of the site. */
export function Asterisk({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cn("shrink-0", className)}>
      <path
        d="M12 1v22M2.5 6.5l19 11M21.5 6.5l-19 11"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Hand-drawn style underline swash, sits under a word. */
export function Squiggle({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 12"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={cn("block w-full", className)}
    >
      <path
        d="M2 8c18-6 36-7 54-3s36 9 54 5 36-9 54-6 32 4 34 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Faint blueprint grid — reads as engineering rather than decoration. */
export function GridLines({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0", className)}
      style={{
        backgroundImage:
          "linear-gradient(to right, rgba(11,12,10,0.055) 1px, transparent 1px), linear-gradient(to bottom, rgba(11,12,10,0.055) 1px, transparent 1px)",
        backgroundSize: "72px 72px",
        maskImage:
          "radial-gradient(ellipse 90% 70% at 50% 40%, #000 40%, transparent 100%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 90% 70% at 50% 40%, #000 40%, transparent 100%)",
      }}
    />
  );
}

/** Dot matrix block, for corners and margins. */
export function DotGrid({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute", className)}
      style={{
        backgroundImage:
          "radial-gradient(rgba(11,12,10,0.18) 1.4px, transparent 1.4px)",
        backgroundSize: "14px 14px",
      }}
    />
  );
}

/** Crosshair tick — placed at grid intersections, like a print registration mark. */
export function CrossMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      className={cn("pointer-events-none absolute", className)}
    >
      <path
        d="M8 1v14M1 8h14"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Rotated circular stamp. Used once or twice per page, never more. */
export function Stamp({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "border-ink text-ink label-mono flex size-24 shrink-0 -rotate-12 items-center justify-center rounded-full border-2 text-center leading-[1.3] md:size-28",
        className,
      )}
    >
      {children}
    </span>
  );
}

/**
 * Outlined display text used as a background graphic layer. Stroke only, so it
 * reads as a watermark rather than competing with real headings.
 */
export function OutlineType({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "numeral pointer-events-none block leading-[0.8] whitespace-nowrap select-none",
        className,
      )}
      style={{
        WebkitTextStroke: "1.5px rgba(11,12,10,0.16)",
        color: "transparent",
      }}
    >
      {children}
    </span>
  );
}
