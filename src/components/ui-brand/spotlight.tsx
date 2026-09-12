"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Wraps a dark panel so a soft light follows the pointer across it.
 *
 * Only the two CSS custom properties are written from JS; the gradient itself
 * is painted by CSS (`.spotlight::before`), so a frame costs one composited
 * layer rather than a re-render.
 *
 * Listener is scoped to the element, attached only for fine pointers, and
 * skipped entirely under reduced motion.
 */
export function Spotlight({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (
      !window.matchMedia("(pointer: fine)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    let frame = 0;
    let x = 0;
    let y = 0;

    const paint = () => {
      frame = 0;
      node.style.setProperty("--mx", `${x}px`);
      node.style.setProperty("--my", `${y}px`);
    };

    const onMove = (event: PointerEvent) => {
      const rect = node.getBoundingClientRect();
      x = event.clientX - rect.left;
      y = event.clientY - rect.top;
      // Coalesce to one write per frame.
      if (!frame) frame = requestAnimationFrame(paint);
    };

    node.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      node.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={ref} className={cn("spotlight", className)}>
      {children}
    </div>
  );
}
