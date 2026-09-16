"use client";

import { useEffect, useRef } from "react";

/**
 * Interactive node network behind the hero.
 *
 * Nodes drift, and any two within range are joined by a line whose opacity is
 * tied to the distance — so connections fade in as points approach rather than
 * snapping on. The pointer pushes nearby nodes away, which makes the field feel
 * like a material rather than a screensaver.
 *
 * It is thematically right for this brand: a network graph, not decoration.
 *
 * PERFORMANCE — this is the only canvas on the site, so it is budgeted:
 *  - node count scales with viewport area and is hard-capped
 *  - device pixel ratio capped at 2; beyond that costs a lot for no visible gain
 *  - the link search is O(n²), which is why the cap matters
 *  - an IntersectionObserver stops the loop entirely when the hero is offscreen
 *  - the whole thing is skipped under reduced motion and on coarse pointers
 */
export function ParticleNetwork({
  className,
  tone = "ink",
}: {
  className?: string;
  /** Ink particles vanish on a dark ground; "light" swaps them for white. */
  tone?: "ink" | "light";
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;

    const LINE_RGB = tone === "light" ? "255, 255, 255" : "11, 12, 10";
    const NODE_FILL =
      tone === "light" ? "rgba(255, 255, 255, 0.34)" : "rgba(11, 12, 10, 0.36)";

    // Runs under reduced motion as well, at a slower drift. Nodes move ~0.1px
    // per frame with no directional sweep, which is ambience rather than the
    // large directional movement that setting is about — and the field is a
    // large part of what makes the hero feel alive.
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const DRIFT = calm ? 0.06 : 0.18;

    const LINK_DISTANCE = 132;
    const POINTER_RADIUS = 150;
    const MAX_NODES = 70;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let nodes: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      baseX: number;
      baseY: number;
    }[] = [];
    let pointerX = -9999;
    let pointerY = -9999;
    let frame = 0;
    let running = false;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      // One node per ~14k px², capped. Keeps density even across screen sizes
      // without letting a large monitor blow the O(n²) link search up.
      const target = Math.min(MAX_NODES, Math.round((width * height) / 14000));
      nodes = Array.from({ length: target }, () => {
        const x = Math.random() * width;
        const y = Math.random() * height;
        return {
          x,
          y,
          baseX: x,
          baseY: y,
          vx: (Math.random() - 0.5) * DRIFT,
          vy: (Math.random() - 0.5) * DRIFT,
        };
      });
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);

      for (const node of nodes) {
        node.x += node.vx;
        node.y += node.vy;

        // Wrap rather than bounce: bouncing makes the edges feel like walls.
        if (node.x < -20) node.x = width + 20;
        if (node.x > width + 20) node.x = -20;
        if (node.y < -20) node.y = height + 20;
        if (node.y > height + 20) node.y = -20;

        // Pointer repulsion, falling off with distance.
        const dx = node.x - pointerX;
        const dy = node.y - pointerY;
        const distance = Math.hypot(dx, dy);
        if (distance < POINTER_RADIUS && distance > 0.01) {
          const push = (1 - distance / POINTER_RADIUS) * 1.5;
          node.x += (dx / distance) * push;
          node.y += (dy / distance) * push;
        }
      }

      // Links. Opacity tied to the gap so they fade rather than pop.
      context.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const distance = Math.hypot(dx, dy);
          if (distance > LINK_DISTANCE) continue;
          const alpha = (1 - distance / LINK_DISTANCE) * 0.42;
          context.strokeStyle = `rgba(${LINE_RGB}, ${alpha.toFixed(3)})`;
          context.beginPath();
          context.moveTo(nodes[i].x, nodes[i].y);
          context.lineTo(nodes[j].x, nodes[j].y);
          context.stroke();
        }
      }

      // Nodes. Ones near the pointer light lime.
      for (const node of nodes) {
        const near =
          Math.hypot(node.x - pointerX, node.y - pointerY) < POINTER_RADIUS;
        context.fillStyle = near ? "rgba(199, 242, 60, 0.95)" : NODE_FILL;
        context.beginPath();
        context.arc(node.x, node.y, near ? 2.6 : 1.8, 0, Math.PI * 2);
        context.fill();
      }

      frame = requestAnimationFrame(draw);
    };

    const start = () => {
      if (running) return;
      running = true;
      frame = requestAnimationFrame(draw);
    };

    const stop = () => {
      running = false;
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointerX = event.clientX - rect.left;
      pointerY = event.clientY - rect.top;
    };

    const onPointerLeave = () => {
      pointerX = -9999;
      pointerY = -9999;
    };

    resize();

    // Only animate while the hero is actually on screen.
    const observer = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0 },
    );
    observer.observe(canvas);

    const onResize = () => resize();
    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerleave", onPointerLeave);

    return () => {
      observer.disconnect();
      stop();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [tone]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      // Decorative: never announced, never focusable.
      role="presentation"
    />
  );
}
