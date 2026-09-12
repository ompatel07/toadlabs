import { cn } from "@/lib/utils";

/**
 * Per-character scroll reveal for display headings.
 *
 * Each character animates on its own scroll-driven timeline with a staggered
 * range, so the line resolves left to right as it enters rather than fading in
 * as one block. Pure CSS — no JS, no measuring, and it degrades to plain
 * visible text where `animation-timeline` is unsupported.
 *
 * Accessibility: the real sentence is exposed once via aria-label, and the
 * per-character spans are hidden from assistive tech. Without that, screen
 * readers can announce split text one letter at a time.
 *
 * Words are kept intact as inline-block units so text still wraps normally at
 * word boundaries.
 */
export function SplitText({
  text,
  className,
  as: Tag = "span",
}: {
  text: string;
  className?: string;
  as?: "span" | "h1" | "h2" | "p";
}) {
  const words = text.split(" ");
  let charIndex = 0;

  return (
    <Tag className={cn("split-text", className)} aria-label={text}>
      {words.map((word, wordIndex) => (
        <span key={`${word}-${wordIndex}`} className="split-word" aria-hidden="true">
          {Array.from(word).map((char, i) => {
            const index = charIndex++;
            return (
              <span
                key={i}
                className="split-char"
                // Each character's reveal is offset a little further into the
                // element's entry range, which produces the sweep.
                style={{ "--i": index } as React.CSSProperties}
              >
                {char}
              </span>
            );
          })}
          {wordIndex < words.length - 1 ? (
            <span className="split-char">&nbsp;</span>
          ) : null}
        </span>
      ))}
    </Tag>
  );
}
