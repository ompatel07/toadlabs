"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Custom cursor: a small dot that tracks exactly, and a ring that lags behind.
 *
 * The ring uses mix-blend-mode: difference, so it inverts against whatever is
 * under it — lime, ink slab or paper — instead of needing a colour per surface.
 *
 * Interactive targets opt in with `data-cursor="..."`, which swells the ring and
 * can show a short label. That is what turns a cursor from decoration into
 * something that tells you what a region does before you click it.
 *
 * Guards: pointer:fine only (never on touch), off under reduced motion, and the
 * native cursor is only hidden once this is actually running — so it can never
 * leave a visitor with no pointer at all.
 */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [active, setActive] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)");

    // Reduced motion does not disable the cursor — replacing a pointer is not
    // vestibular motion. It removes the ring's LAG instead, so the ring tracks
    // exactly rather than trailing.
    const decide = () => setEnabled(fine.matches);
    decide();
    fine.addEventListener("change", decide);
    return () => {
      fine.removeEventListener("change", decide);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // Hiding the system cursor is deferred to here, so it only happens once
    // the replacement is definitely rendering.
    document.documentElement.classList.add("has-custom-cursor");

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;
    let frame = 0;
    let seen = false;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const EASE = calm ? 1 : 0.16;

    const tick = () => {
      // The ring eases toward the pointer; the dot is pinned to it exactly.
      ringX += (mouseX - ringX) * EASE;
      ringY += (mouseY - ringY) * EASE;
      ring.style.transform = `translate3d(${ringX.toFixed(2)}px, ${ringY.toFixed(2)}px, 0) translate(-50%, -50%)`;
      // Stop once the ring has caught up; the next pointer move restarts it.
      // Left running, this loop cost a frame of work forever after the first
      // mouse move, including while the pointer sat still.
      const settled =
        Math.abs(mouseX - ringX) < 0.1 && Math.abs(mouseY - ringY) < 0.1;
      frame = settled ? 0 : requestAnimationFrame(tick);
    };

    const onMove = (event: PointerEvent) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;

      if (!seen) {
        seen = true;
        ringX = mouseX;
        ringY = mouseY;
        dot.style.opacity = "1";
        ring.style.opacity = "1";
      }
      if (!frame) frame = requestAnimationFrame(tick);

      const target = (event.target as Element | null)?.closest?.(
        "[data-cursor], a, button, input, textarea, select, summary",
      );
      if (!target) {
        setActive(false);
        setLabel(null);
        return;
      }
      setActive(true);
      setLabel(target.getAttribute("data-cursor"));
    };

    const onLeave = () => {
      dot.style.opacity = "0";
      ring.style.opacity = "0";
      seen = false;
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      if (frame) cancelAnimationFrame(frame);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div aria-hidden="true">
      <div ref={dotRef} className="cursor-dot" />
      <div
        ref={ringRef}
        className="cursor-ring"
        data-active={active ? "true" : undefined}
        data-labelled={label ? "true" : undefined}
      >
        {label ? <span className="cursor-label">{label}</span> : null}
      </div>
    </div>
  );
}
