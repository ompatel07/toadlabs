"use client";

import { useEffect, useRef } from "react";

/**
 * Writes scroll velocity to a CSS custom property on the given element.
 *
 * Kept out of React state on purpose: velocity changes every frame, and
 * re-rendering a component at 60fps to move one number is wasteful. Writing
 * straight to a custom property lets CSS do the work on the compositor.
 *
 * Returns a ref to attach. Does nothing under reduced motion.
 */
export function useScrollVelocity(maxDeg = 2.2) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let lastY = window.scrollY;
    let velocity = 0;
    let frame = 0;
    let idle = 0;

    const tick = () => {
      const y = window.scrollY;
      const delta = y - lastY;
      lastY = y;

      // Ease toward the current delta, then decay back to rest.
      velocity += (delta - velocity) * 0.2;
      velocity *= 0.9;

      const skew = Math.max(-maxDeg, Math.min(maxDeg, velocity * 0.12));
      node.style.setProperty("--skew", `${skew.toFixed(3)}deg`);

      // Stop the loop once it has settled, and restart it on the next scroll.
      if (Math.abs(velocity) < 0.05) {
        idle += 1;
        if (idle > 20) {
          node.style.setProperty("--skew", "0deg");
          frame = 0;
          return;
        }
      } else {
        idle = 0;
      }
      frame = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [maxDeg]);

  return ref;
}
