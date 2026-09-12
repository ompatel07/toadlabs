"use client";

import { useEffect, useState } from "react";

/**
 * Tracks `prefers-reduced-motion`.
 *
 * Starts as `false` so server and first client render agree; the effect
 * corrects it immediately on mount. Nothing actually moves in the meantime —
 * the CSS `prefers-reduced-motion` block disables the animations regardless.
 * This hook only decides what to *render* (a static list instead of a marquee,
 * and whether the pause control is meaningful).
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);

    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return reduced;
}
