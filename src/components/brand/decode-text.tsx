"use client";

import { useEffect, useRef, useState } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&$@/\\<>[]{}";

/**
 * Text that resolves from scrambled characters when it scrolls into view.
 *
 * Thematic for a security page without reaching for the usual clichés — it is
 * the *idea* of decoding, not matrix rain.
 *
 * Accessibility: the real string is always present for assistive tech and for
 * anyone with JS off; only a visual, aria-hidden copy scrambles. That matters —
 * animating the accessible text would make a screen reader announce garbage.
 */
export function DecodeText({
  text,
  className,
  duration = 900,
}: {
  text: string;
  className?: string;
  duration?: number;
}) {
  const [display, setDisplay] = useState(text);
  const ref = useRef<HTMLSpanElement>(null);
  const done = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || done.current) return;
        done.current = true;
        observer.disconnect();

        const start = performance.now();
        let frame = 0;

        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          // Characters lock in left to right as progress advances.
          const locked = Math.floor(progress * text.length);

          setDisplay(
            text
              .split("")
              .map((char, index) => {
                if (index < locked || char === " ") return char;
                return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
              })
              .join(""),
          );

          if (progress < 1) {
            frame = requestAnimationFrame(tick);
          } else {
            setDisplay(text);
          }
        };

        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [text, duration]);

  return (
    <span ref={ref} className={className}>
      {/* Announced: the real, stable string. */}
      <span className="sr-only">{text}</span>
      {/* Shown: the scrambling copy, never announced. */}
      <span aria-hidden="true">{display}</span>
    </span>
  );
}
