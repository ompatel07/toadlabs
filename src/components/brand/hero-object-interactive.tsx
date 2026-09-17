"use client";

import { useEffect, useRef } from "react";
import { HeroObject } from "@/components/brand/hero-object";
import { InteractiveToad } from "@/components/brand/interactive-toad";

/**
 * Wraps the hero object with a damped cursor parallax.
 *
 * The transform is written to CSS custom properties on a wrapper element and
 * applied in CSS, so it composes with the idle float animation instead of
 * fighting it — the float owns `transform` on the inner element, this owns it
 * on the outer one.
 *
 * Guards:
 *  - pointer:fine only, so it never runs on touch devices (where there is no
 *    hover cursor and the listener would be dead weight)
 *  - disabled entirely under prefers-reduced-motion
 *  - the position is only read in the listener; the transform is written in a
 *    rAF loop that stops itself when the value settles, so an idle cursor
 *    costs nothing
 */
export function HeroObjectInteractive({ className }: { className?: string }) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const fine = window.matchMedia("(pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduced.matches) return;

    // Maximum travel, in px and degrees.
    const SHIFT = 16;
    const TILT = 3.5;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let frame = 0;

    const tick = () => {
      // Critically damped enough to feel weighty rather than twitchy.
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      wrapper.style.setProperty("--px", `${(currentX * SHIFT).toFixed(2)}px`);
      wrapper.style.setProperty("--py", `${(currentY * SHIFT).toFixed(2)}px`);
      wrapper.style.setProperty("--rot", `${(currentX * TILT).toFixed(2)}deg`);

      const settled =
        Math.abs(targetX - currentX) < 0.001 &&
        Math.abs(targetY - currentY) < 0.001;

      frame = settled ? 0 : requestAnimationFrame(tick);
    };

    const onPointerMove = (event: PointerEvent) => {
      // Normalised to -1..1 from the viewport centre.
      targetX = (event.clientX / window.innerWidth) * 2 - 1;
      targetY = (event.clientY / window.innerHeight) * 2 - 1;
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const onPointerLeave = () => {
      targetX = 0;
      targetY = 0;
      if (!frame) frame = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerleave", onPointerLeave);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onPointerLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className={className}
      data-cursor="Toad Labs"
      style={{ willChange: "transform" }}
    >
      <div className="hero-parallax h-full w-full">
        <InteractiveToad className="h-full w-full">
          <HeroObject className="h-full w-full" />
        </InteractiveToad>
      </div>
    </div>
  );
}
