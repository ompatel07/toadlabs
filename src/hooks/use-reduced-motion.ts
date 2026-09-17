"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const query = window.matchMedia(QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/**
 * Tracks `prefers-reduced-motion` as an external store.
 *
 * The server snapshot is `true` — "reduced" — so prerendered HTML never ships
 * motion that a visitor who asked for none would see for a frame before
 * hydration corrects it. Subscribing through useSyncExternalStore rather than
 * mirroring the query into state from an effect avoids the extra render pass.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => true,
  );
}
