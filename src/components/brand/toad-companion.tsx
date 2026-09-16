"use client";

import { useEffect, useRef, useState } from "react";
import { BrandObject } from "@/components/brand/hero-object";

/**
 * The brand object, following the page.
 *
 * It fades in once the hero's own copy has scrolled away, drifts down the right
 * margin as the document scrolls, and settles over the footer. One object, one
 * journey — which is why the closing CTA no longer carries its own: two of them
 * in the same viewport reads as clip art, not as a motif.
 *
 * The travel is entirely CSS on a scroll(root) timeline (see globals.css), so
 * there is no scroll listener and nothing runs on the main thread while
 * scrolling. This component exists for one thing the CSS cannot do on its own:
 * standing the companion down while a section is already showing the object at
 * full size.
 *
 * Any section marked data-toad-solo takes over — the mid-page scene, which owns
 * the object at display scale. An IntersectionObserver fades the companion out
 * while such a section is on screen and back in afterwards. Using an observer
 * rather than a scroll handler keeps the cost proportional to the number of
 * solo sections (one) rather than to scroll events.
 *
 * Entirely decorative: aria-hidden, pointer-events: none, and no information
 * that is not already in the page. It is also skipped altogether on coarse
 * pointers below the small breakpoint — see the note on `narrow` below.
 */
export function ToadCompanion() {
  const [solo, setSolo] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const zones = document.querySelectorAll("[data-toad-solo]");
    if (zones.length === 0) return;

    // Track how many solo zones are visible rather than a boolean, so two
    // overlapping zones cannot leave the companion stuck hidden.
    let visible = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visible += entry.isIntersecting ? 1 : -1;
        }
        visible = Math.max(0, visible);
        setSolo(visible > 0);
      },
      { threshold: 0.12 },
    );

    zones.forEach((zone) => observer.observe(zone));
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="toad-companion" aria-hidden="true">
      <div
        className="toad-companion-inner drop-shadow-[0_14px_28px_rgba(11,12,10,0.28)]"
        data-solo={solo ? "true" : "false"}
      >
        <BrandObject sizes="(max-width: 639px) 52px, (max-width: 1023px) 72px, (max-width: 1535px) 96px, 112px" />
      </div>
    </div>
  );
}
