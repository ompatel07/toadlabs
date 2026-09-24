"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const KEY = "offscript:intro-seen";

/**
 * First-load curtain.
 *
 * An ink panel carrying the wordmark and a lime progress rule, which splits and
 * lifts to reveal the page. It is the first thing a visitor sees, so it is the
 * cheapest place to establish that this is a considered site.
 *
 * Rules it follows so it never becomes an obstacle:
 *  - once per session only; a curtain on every navigation is an irritation
 *  - the page underneath is fully rendered and interactive the whole time —
 *    this is an overlay, never a gate on content
 *  - short: ~1.1s total, and it can be dismissed by clicking or pressing a key
 *  - under reduced motion it is a brief fade with no movement
 *  - if JS never runs, it simply never appears, and the site is unaffected
 */
export function IntroReveal() {
  const [phase, setPhase] = useState<"idle" | "playing" | "done">("idle");
  const reduced = useReducedMotion();

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(KEY) === "1";
    } catch {
      // Private mode: treat as unseen. Worst case it plays once more.
    }
    // Already seen: phase stays "idle", which renders nothing.
    if (seen) return;

    // Started from a frame callback rather than the effect body, so mounting
    // does not force a second synchronous render pass.
    const start = window.requestAnimationFrame(() => setPhase("playing"));

    try {
      sessionStorage.setItem(KEY, "1");
    } catch {}

    // Locking scroll would strand anyone whose animation misfires, so the page
    // stays scrollable throughout and the curtain simply lifts on schedule.
    const timer = window.setTimeout(() => setPhase("done"), 1500);
    const skip = () => setPhase("done");

    window.addEventListener("keydown", skip, { once: true });
    window.addEventListener("pointerdown", skip, { once: true });

    return () => {
      window.cancelAnimationFrame(start);
      window.clearTimeout(timer);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
    };
  }, []);

  if (phase !== "playing") return null;

  return (
    <div
      className="intro-curtain"
      data-reduced={reduced ? "true" : undefined}
      aria-hidden="true"
    >
      <div className="intro-panel intro-panel-top">
        <div className="intro-inner">
          <span className="intro-word">OFFSCRIPT.</span>
          <span className="intro-rule" />
        </div>
      </div>
      <div className="intro-panel intro-panel-bottom">
        <div className="intro-inner">
          <span className="intro-word">OFFSCRIPT.</span>
          <span className="intro-rule" />
        </div>
      </div>
    </div>
  );
}
