"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Makes the brand object respond to being touched.
 *
 * Three distinct gestures, so it feels like a character rather than a button:
 *
 *   tap / click    it hops (squash and stretch), its eyes flash, a sonar ping
 *                  ripples from its feet, and it says something
 *   rub / stroke   drag across it and it wiggles — "that tickles"
 *   five fast taps "pentest mode": it spins, a laser scan sweeps its body, and
 *                  it reports the result
 *
 * And continuously: it tilts in 3D toward the pointer or finger resting on it.
 *
 * HOW THE MOTION IS LAYERED
 * Every moving part owns exactly one transform, on its own element, so none of
 * them overwrite each other:
 *   button     3D tilt toward the pointer (spring-damped in a rAF loop that
 *              stops itself when settled — an idle toad costs nothing)
 *   body       hop / wiggle / spin, via the Web Animations API so a reaction
 *              can restart mid-flight without class juggling
 *   children   whatever the caller already had — the idle float, scroll
 *              drift, cursor parallax — untouched
 *
 * TOUCH
 * `touch-action: pan-y`. The hero toad is most of a phone's width; blocking
 * scroll over it would trap people. Vertical swipes still scroll the page, and
 * horizontal rubs register as tickles. A drag also never counts as a tap, so
 * scrolling past the toad cannot make it hop.
 *
 * ACCESSIBILITY
 * It is a real <button>, so it is focusable and Enter/Space poke it. What it
 * says goes to a polite live region, so a screen reader hears the reply too.
 * All reactions are user-initiated, which is why they are not gated on
 * prefers-reduced-motion: nothing moves unless someone asks it to.
 */

const LINES = [
  "Ribbit. That's hello in production.",
  "Poke harder — I'm load-tested.",
  "I don't break. I get pentested.",
  "Build. Protect. Scale. Also: hop.",
  "Zero bugs found in that poke.",
  "No lock-in. I could leave. I won't.",
  "Retest included. Poke again.",
  "Shipping since my first commit.",
];

const TICKLE = ["Heh — that tickles.", "Stop, I'm ticklish!", "Okay, okay, I'm awake."];

const SCAN_LINE = "Pentest mode: scanning you… 0 criticals. You're clean.";

export function InteractiveToad({
  children,
  className,
  label = "Poke the Toad Labs toad",
}: {
  children: React.ReactNode;
  className?: string;
  label?: string;
}) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  const [message, setMessage] = useState<string | null>(null);
  const [effects, setEffects] = useState<{ id: number; scan: boolean } | null>(null);

  const lineIndex = useRef(0);
  const taps = useRef<number[]>([]);
  const hideTimer = useRef<number | null>(null);
  const effectId = useRef(0);

  // Pointer / tilt state, kept out of React so moving a finger does not
  // re-render anything.
  const tilt = useRef({ tx: 0, ty: 0, cx: 0, cy: 0, frame: 0 });
  const drag = useRef({ down: false, x: 0, y: 0, travel: 0, tickled: false });

  const say = useCallback((text: string, ms = 2800) => {
    setMessage(text);
    if (hideTimer.current) window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => setMessage(null), ms);
  }, []);

  const runTilt = useCallback(() => {
    const button = buttonRef.current;
    if (!button) return;
    const t = tilt.current;
    const step = () => {
      t.cx += (t.tx - t.cx) * 0.14;
      t.cy += (t.ty - t.cy) * 0.14;
      button.style.transform = `perspective(900px) rotateX(${(-t.cy * 14).toFixed(2)}deg) rotateY(${(t.cx * 18).toFixed(2)}deg)`;
      const settled = Math.abs(t.tx - t.cx) < 0.002 && Math.abs(t.ty - t.cy) < 0.002;
      t.frame = settled ? 0 : requestAnimationFrame(step);
    };
    if (!t.frame) t.frame = requestAnimationFrame(step);
  }, []);

  const buzz = (ms: number) => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(ms);
      } catch {
        /* unsupported on this device — silence is fine */
      }
    }
  };

  const hop = useCallback(() => {
    bodyRef.current?.animate(
      [
        { transform: "translateY(0) scale(1, 1)" },
        { transform: "translateY(3%) scale(1.09, 0.9)", offset: 0.18 },
        { transform: "translateY(-15%) scale(0.95, 1.07)", offset: 0.45 },
        { transform: "translateY(0) scale(1.06, 0.93)", offset: 0.72 },
        { transform: "translateY(0) scale(0.98, 1.02)", offset: 0.86 },
        { transform: "translateY(0) scale(1, 1)" },
      ],
      { duration: 640, easing: "cubic-bezier(0.34, 1.2, 0.64, 1)" },
    );
  }, []);

  const wiggle = useCallback(() => {
    bodyRef.current?.animate(
      [
        { transform: "rotate(0deg)" },
        { transform: "rotate(-7deg)" },
        { transform: "rotate(6deg)" },
        { transform: "rotate(-4deg)" },
        { transform: "rotate(3deg)" },
        { transform: "rotate(0deg)" },
      ],
      { duration: 560, easing: "ease-in-out" },
    );
  }, []);

  const spin = useCallback(() => {
    bodyRef.current?.animate(
      [
        { transform: "rotateY(0deg) translateY(0)" },
        { transform: "rotateY(180deg) translateY(-8%)", offset: 0.5 },
        { transform: "rotateY(360deg) translateY(0)" },
      ],
      { duration: 950, easing: "cubic-bezier(0.45, 0, 0.55, 1)" },
    );
  }, []);

  const poke = useCallback(() => {
    const now = Date.now();
    taps.current = [...taps.current.filter((t) => now - t < 2500), now];
    effectId.current += 1;

    if (taps.current.length >= 5) {
      taps.current = [];
      spin();
      setEffects({ id: effectId.current, scan: true });
      say(SCAN_LINE, 3600);
      buzz(40);
      return;
    }

    hop();
    setEffects({ id: effectId.current, scan: false });
    say(LINES[lineIndex.current % LINES.length]);
    lineIndex.current += 1;
    buzz(12);
  }, [hop, spin, say]);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;
    const t = tilt.current;
    const d = drag.current;

    const setTarget = (event: PointerEvent) => {
      const r = button.getBoundingClientRect();
      t.tx = Math.max(-1, Math.min(1, ((event.clientX - r.left) / r.width) * 2 - 1));
      t.ty = Math.max(-1, Math.min(1, ((event.clientY - r.top) / r.height) * 2 - 1));
      runTilt();
    };

    const onDown = (event: PointerEvent) => {
      d.down = true;
      d.x = event.clientX;
      d.y = event.clientY;
      d.travel = 0;
      d.tickled = false;
      setTarget(event);
    };

    const onMove = (event: PointerEvent) => {
      // Mouse tilts on hover; touch only while a finger is down.
      if (event.pointerType === "mouse" || d.down) setTarget(event);
      if (!d.down) return;
      d.travel += Math.hypot(event.clientX - d.x, event.clientY - d.y);
      d.x = event.clientX;
      d.y = event.clientY;
      if (!d.tickled && d.travel > 140) {
        d.tickled = true;
        wiggle();
        say(TICKLE[Math.floor(Math.random() * TICKLE.length)], 2200);
        buzz(20);
      }
    };

    const release = () => {
      d.down = false;
      t.tx = 0;
      t.ty = 0;
      runTilt();
    };

    const onUp = (event: PointerEvent) => {
      // A drag is never a tap: scrolling past the toad must not make it hop.
      const wasTap = d.down && d.travel < 12 && !d.tickled;
      d.down = false;
      if (event.pointerType !== "mouse") release();
      if (wasTap) poke();
    };

    button.addEventListener("pointerdown", onDown);
    button.addEventListener("pointermove", onMove);
    button.addEventListener("pointerup", onUp);
    button.addEventListener("pointercancel", release);
    button.addEventListener("pointerleave", release);

    return () => {
      button.removeEventListener("pointerdown", onDown);
      button.removeEventListener("pointermove", onMove);
      button.removeEventListener("pointerup", onUp);
      button.removeEventListener("pointercancel", release);
      button.removeEventListener("pointerleave", release);
      if (t.frame) cancelAnimationFrame(t.frame);
      if (hideTimer.current) window.clearTimeout(hideTimer.current);
    };
  }, [poke, runTilt, say, wiggle]);

  return (
    <div className={cn("relative", className)}>
      <button
        ref={buttonRef}
        type="button"
        aria-label={label}
        data-cursor="Poke me"
        onDragStart={(event) => event.preventDefault()}
        // Keyboard pokes. Pointer pokes arrive through pointerup instead, and
        // `detail === 0` is how a click event says it came from a key.
        onClick={(event) => {
          if (event.detail === 0) poke();
        }}
        className="relative block h-full w-full cursor-pointer rounded-[28%] bg-transparent p-0 outline-offset-4 select-none [touch-action:pan-y] [transform-style:preserve-3d] [-webkit-tap-highlight-color:transparent]"
      >
        <div ref={bodyRef} className="relative h-full w-full [transform-origin:50%_92%]">
          {children}

          {effects ? (
            <span key={effects.id} aria-hidden="true" className="pointer-events-none absolute inset-0">
              <span className="toad-eye" style={{ left: "26.7%", top: "21.3%" }} />
              <span className="toad-eye" style={{ left: "75%", top: "22.2%" }} />
              {effects.scan ? <span className="toad-scan" /> : <span className="toad-ping" />}
            </span>
          ) : null}
        </div>
      </button>

      {/* Speech bubble, and the live region that reads it out. */}
      <div role="status" aria-live="polite" className="sr-only">
        {message ?? ""}
      </div>
      {message ? (
        <p
          key={message + effectId.current}
          aria-hidden="true"
          // Not .panel-feature: that class sets `position: relative`, which
          // beat `absolute` and dropped the bubble into flow beneath the toad,
          // on top of the hero headline. Styled explicitly instead.
          className="toad-bubble pointer-events-none absolute -top-[4%] left-1/2 z-30 w-max max-w-[min(15rem,80vw)] rounded-xl border border-[rgba(255,255,255,0.14)] bg-[var(--surface-2)] px-3.5 py-2 text-center t-sm leading-snug font-medium text-ink shadow-[0_12px_30px_-10px_rgba(0,0,0,0.8)]"
        >
          {message}
          <span
            aria-hidden="true"
            className="absolute -bottom-[6px] left-1/2 size-2.5 -translate-x-1/2 rotate-45 border-r border-b border-[rgba(255,255,255,0.14)] bg-[var(--surface-2)]"
          />
        </p>
      ) : null}
    </div>
  );
}
