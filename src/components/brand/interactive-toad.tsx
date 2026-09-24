"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * The brand object, as a character.
 *
 * GESTURES
 *   tap / click     hop with squash-and-stretch, eyes flash, sonar ping, a line
 *   hold            charge: it crouches, eyes power up, a ring fills under its
 *                   feet. Release to launch, higher the longer you held
 *   rub / stroke    wiggle: "that tickles"
 *   5 fast taps     pentest mode: 3D spin, laser scan, "0 criticals"
 *
 * AMBIENT LIFE
 *   eyes            a highlight in each pupil slides toward the pointer anywhere
 *                   on the page, or the finger on a phone. When nobody is moving
 *                   it glances around by itself
 *   tilt            3D lean toward a pointer resting on it
 *   sleep           20s with no activity and it dozes: eyes dim, colour drains,
 *                   z's float up. Any activity wakes it with a startle
 *   memory          pokes are counted across the whole visit. At milestones it
 *                   comments, and from 20 it offers a "Book a call" link
 *   hint            one toad per page can show "tap · hold · rub" once a visit
 *
 * LAYERING: every moving part owns exactly one transform on its own element.
 *   button   tilt (spring in a rAF loop that stops itself when settled)
 *   body     hop / wiggle / spin / launch via the Web Animations API, and the
 *            charge crouch via inline style while held
 *   motion   the caller's float or scroll drift. The eye overlays live INSIDE
 *            this wrapper so they move with the image; layered over the bare
 *            image they would slide off the pupils as it drifted
 *   children the image itself
 *
 * Eye positions are measured, not guessed: lime-pixel centroids in the 1254px
 * derivative put the pupils at (26.7%, 21.3%) and (75.0%, 22.2%).
 *
 * TOUCH: touch-action pan-y, so vertical swipes still scroll the page over a
 * toad that fills most of a phone screen. A drag never counts as a tap or a
 * charge. Long-press context menus are suppressed so a hold can charge.
 *
 * COST: the look/tilt loop runs only while the toad is on screen
 * (IntersectionObserver) and stops the moment values settle.
 *
 * ACCESSIBILITY: a real <button> with a label, so Enter/Space poke it. Replies
 * the visitor caused go to a polite live region; automatic remarks (waking up)
 * are shown but not announced, so a screen reader is never interrupted by a
 * toad nobody touched.
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
const WAKE = [
  "Wasn't asleep. Was compiling.",
  "Huh? I'm up. Deploying.",
  "Back online. Zero downtime. Mostly.",
];
const SCAN_LINE = "Pentest mode: scanning you… 0 criticals. You're clean.";

const MILESTONES: Record<number, { text: string; cta?: boolean }> = {
  10: { text: "Ten pokes. You'd make a good tester." },
  20: { text: "Twenty pokes. At this point, just book a call.", cta: true },
  50: { text: "Fifty. Respect. We read every message.", cta: true },
};

const SLEEP_AFTER_MS = 20000;
const HOLD_DELAY_MS = 240;
const CHARGE_MS = 900;
const COUNT_KEY = "offscript:pokes";
const MET_KEY = "offscript:toad-met";

// sessionStorage can throw (private mode, blocked storage). A toad that
// forgets is fine; a toad that crashes the page is not.
const readStore = (key: string) => {
  try {
    return window.sessionStorage.getItem(key);
  } catch {
    return null;
  }
};
const writeStore = (key: string, value: string) => {
  try {
    window.sessionStorage.setItem(key, value);
  } catch {
    /* storage unavailable */
  }
};

const buzz = (ms: number) => {
  try {
    // Without a live user gesture Chrome refuses and logs an intervention
    // warning to the console, so only ask when the browser would say yes.
    if (navigator.userActivation && !navigator.userActivation.isActive) return;
    navigator.vibrate?.(ms);
  } catch {
    /* unsupported */
  }
};

const clamp = (v: number, min = -1, max = 1) => Math.max(min, Math.min(max, v));

type Effect = { id: number; kind: "poke" | "scan" | "launch" };

const EYES = [
  { left: "26.7%", top: "21.3%" },
  { left: "75%", top: "22.2%" },
];

export function InteractiveToad({
  children,
  className,
  motionClassName,
  hint = false,
  label = "Poke the OFFSCRIPT toad",
}: {
  children: React.ReactNode;
  className?: string;
  /** Float or scroll-drift class, applied to the wrapper that also holds the
      eye overlays so they stay on the pupils while the image moves. */
  motionClassName?: string;
  /** Show the one-time "tap · hold · rub" hint. Use on one toad per page. */
  hint?: boolean;
  label?: string;
}) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  const [message, setMessage] = useState<{ text: string; id: number } | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const [effect, setEffect] = useState<Effect | null>(null);
  const [sleeping, setSleeping] = useState(false);
  const [showCta, setShowCta] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const effectId = useRef(0);
  const lineIndex = useRef(0);
  const taps = useRef<number[]>([]);
  const timers = useRef<{ message?: number; cta?: number }>({});
  const sleepingRef = useRef(false);

  // Animation state kept out of React: moving a pointer re-renders nothing.
  const s = useRef({
    tx: 0, ty: 0, tcx: 0, tcy: 0,
    lx: 0, ly: 0, lcx: 0, lcy: 0,
    eyeMax: 8,
    frame: 0,
    visible: false,
    lastPointer: 0,
    lastActivity: 0,
  });
  const d = useRef({
    down: false, x: 0, y: 0, travel: 0, tickled: false,
    charging: false, charge: 0, chargeStart: 0, chargeFrame: 0, holdTimer: 0,
  });

  /* ── speech ─────────────────────────────────────────────────────────── */

  const say = useCallback((text: string, ms = 2800, announce = true) => {
    // A fresh id per remark re-keys the bubble, so repeating the same line
    // still replays its entrance.
    setMessage((previous) => ({ text, id: (previous?.id ?? 0) + 1 }));
    if (announce) setAnnouncement(text);
    window.clearTimeout(timers.current.message);
    timers.current.message = window.setTimeout(() => setMessage(null), ms);
  }, []);

  const dismissHint = useCallback(() => {
    writeStore(MET_KEY, "1");
    setShowHint(false);
  }, []);

  /* ── the one rAF loop: tilt + eyes ──────────────────────────────────── */

  const kick = useCallback(() => {
    const st = s.current;
    if (st.frame || !st.visible) return;
    const step = () => {
      const button = buttonRef.current;
      const body = bodyRef.current;
      if (!button || !body) {
        st.frame = 0;
        return;
      }
      st.tcx += (st.tx - st.tcx) * 0.14;
      st.tcy += (st.ty - st.tcy) * 0.14;
      st.lcx += (st.lx - st.lcx) * 0.12;
      st.lcy += (st.ly - st.lcy) * 0.12;
      button.style.transform = `perspective(900px) rotateX(${(-st.tcy * 14).toFixed(2)}deg) rotateY(${(st.tcx * 18).toFixed(2)}deg)`;
      body.style.setProperty("--lx", `${(st.lcx * st.eyeMax).toFixed(2)}px`);
      body.style.setProperty("--ly", `${(st.lcy * st.eyeMax * 0.8).toFixed(2)}px`);
      const settled =
        Math.abs(st.tx - st.tcx) < 0.002 &&
        Math.abs(st.ty - st.tcy) < 0.002 &&
        Math.abs(st.lx - st.lcx) < 0.002 &&
        Math.abs(st.ly - st.lcy) < 0.002;
      st.frame = settled ? 0 : requestAnimationFrame(step);
    };
    st.frame = requestAnimationFrame(step);
  }, []);

  /* ── body motion ────────────────────────────────────────────────────── */

  const animateBody = useCallback(
    (frames: Keyframe[], duration: number, easing: string) => {
      bodyRef.current?.animate(frames, { duration, easing });
    },
    [],
  );

  const hop = useCallback(
    (height = 15) =>
      animateBody(
        [
          { transform: "translateY(0) scale(1, 1)" },
          { transform: "translateY(3%) scale(1.09, 0.9)", offset: 0.18 },
          { transform: `translateY(-${height}%) scale(0.95, 1.07)`, offset: 0.45 },
          { transform: "translateY(0) scale(1.06, 0.93)", offset: 0.72 },
          { transform: "translateY(0) scale(0.98, 1.02)", offset: 0.86 },
          { transform: "translateY(0) scale(1, 1)" },
        ],
        640,
        "cubic-bezier(0.34, 1.2, 0.64, 1)",
      ),
    [animateBody],
  );

  /* ── counting + milestones ──────────────────────────────────────────── */

  const offerCta = useCallback(() => {
    setShowCta(true);
    window.clearTimeout(timers.current.cta);
    timers.current.cta = window.setTimeout(() => setShowCta(false), 7000);
  }, []);

  /** Counts the poke and says the milestone line if there is one. */
  const countAndMaybeCelebrate = useCallback((): boolean => {
    const next = Number(readStore(COUNT_KEY) ?? 0) + 1;
    writeStore(COUNT_KEY, String(next));
    const milestone = MILESTONES[next];
    if (!milestone) return false;
    say(milestone.text, milestone.cta ? 5200 : 3200);
    if (milestone.cta) offerCta();
    return true;
  }, [offerCta, say]);

  /* ── sleep / wake ───────────────────────────────────────────────────── */

  const setAsleep = useCallback((value: boolean) => {
    sleepingRef.current = value;
    setSleeping(value);
  }, []);

  const noteActivity = useCallback(
    (fromToad: boolean) => {
      s.current.lastActivity = Date.now();
      if (!sleepingRef.current) return;
      setAsleep(false);
      // A poke has its own reaction; only a passive wake gets a remark.
      if (!fromToad && s.current.visible) {
        hop(8);
        say(WAKE[Math.floor(Math.random() * WAKE.length)], 2600, false);
      }
    },
    [hop, say, setAsleep],
  );

  /* ── gestures ───────────────────────────────────────────────────────── */

  const poke = useCallback(() => {
    noteActivity(true);
    dismissHint();
    const now = Date.now();
    taps.current = [...taps.current.filter((t) => now - t < 2500), now];
    effectId.current += 1;

    if (taps.current.length >= 5) {
      taps.current = [];
      animateBody(
        [
          { transform: "rotateY(0deg) translateY(0)" },
          { transform: "rotateY(180deg) translateY(-8%)", offset: 0.5 },
          { transform: "rotateY(360deg) translateY(0)" },
        ],
        950,
        "cubic-bezier(0.45, 0, 0.55, 1)",
      );
      setEffect({ id: effectId.current, kind: "scan" });
      say(SCAN_LINE, 3600);
      buzz(40);
      return;
    }

    hop();
    setEffect({ id: effectId.current, kind: "poke" });
    if (!countAndMaybeCelebrate()) {
      say(LINES[lineIndex.current % LINES.length]);
      lineIndex.current += 1;
    }
    buzz(12);
  }, [animateBody, countAndMaybeCelebrate, dismissHint, hop, noteActivity, say]);

  const stopCharge = useCallback(() => {
    const dd = d.current;
    dd.charging = false;
    cancelAnimationFrame(dd.chargeFrame);
    const body = bodyRef.current;
    if (body) {
      body.style.transform = "";
      body.style.setProperty("--charge", "0");
    }
  }, []);

  const launch = useCallback(
    (charge: number) => {
      noteActivity(true);
      dismissHint();
      effectId.current += 1;
      const c = Math.max(0.15, charge);
      animateBody(
        [
          { transform: `translateY(${(c * 4).toFixed(2)}%) scale(${(1 + 0.1 * c).toFixed(3)}, ${(1 - 0.18 * c).toFixed(3)})` },
          { transform: `translateY(-${(18 + 34 * c).toFixed(1)}%) scale(0.92, 1.1)`, offset: 0.45 },
          { transform: "translateY(0) scale(1.1, 0.88)", offset: 0.76 },
          { transform: "translateY(0) scale(0.98, 1.02)", offset: 0.9 },
          { transform: "translateY(0) scale(1, 1)" },
        ],
        700 + 350 * c,
        "cubic-bezier(0.3, 1.25, 0.6, 1)",
      );
      setEffect({ id: effectId.current, kind: "launch" });
      if (!countAndMaybeCelebrate()) {
        say(c > 0.95 ? "Full-power launch." : c > 0.55 ? "Big jump!" : "Hop.");
      }
      buzz(c > 0.95 ? 45 : 25);
    },
    [animateBody, countAndMaybeCelebrate, dismissHint, noteActivity, say],
  );

  /* ── visibility, page-wide pointer, idle glances, sleep ─────────────── */

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;
    const st = s.current;
    st.lastActivity = Date.now();

    const io = new IntersectionObserver(
      ([entry]) => {
        st.visible = entry.isIntersecting;
        if (st.visible) kick();
      },
      { threshold: 0.05 },
    );
    io.observe(button);

    const measure = () => {
      const r = button.getBoundingClientRect();
      st.eyeMax = r.width * 0.018;
      return r;
    };

    const onGlobalPointer = (event: PointerEvent) => {
      noteActivity(false);
      if (!st.visible) return;
      const r = measure();
      st.lx = clamp((event.clientX - (r.left + r.width / 2)) / (r.width * 1.1));
      st.ly = clamp((event.clientY - (r.top + r.height * 0.22)) / (r.height * 1.1));
      st.lastPointer = Date.now();
      kick();
    };
    const onOtherActivity = () => noteActivity(false);

    window.addEventListener("pointermove", onGlobalPointer, { passive: true });
    window.addEventListener("pointerdown", onGlobalPointer, { passive: true });
    window.addEventListener("scroll", onOtherActivity, { passive: true });
    window.addEventListener("keydown", onOtherActivity);

    const idle = window.setInterval(() => {
      if (!st.visible || d.current.down) return;
      const now = Date.now();
      if (!sleepingRef.current && now - st.lastActivity > SLEEP_AFTER_MS) {
        setAsleep(true);
        st.lx = 0;
        st.ly = 0.35;
        kick();
        return;
      }
      if (!sleepingRef.current && now - st.lastPointer > 3000) {
        measure();
        st.lx = Math.random() * 1.6 - 0.8;
        st.ly = Math.random() * 0.9 - 0.4;
        kick();
      }
    }, 2600);

    return () => {
      io.disconnect();
      window.removeEventListener("pointermove", onGlobalPointer);
      window.removeEventListener("pointerdown", onGlobalPointer);
      window.removeEventListener("scroll", onOtherActivity);
      window.removeEventListener("keydown", onOtherActivity);
      window.clearInterval(idle);
      if (st.frame) cancelAnimationFrame(st.frame);
      st.frame = 0;
    };
  }, [kick, noteActivity, setAsleep]);

  useEffect(() => {
    if (!hint || readStore(MET_KEY)) return;
    const show = window.setTimeout(() => setShowHint(true), 2500);
    const hide = window.setTimeout(() => setShowHint(false), 9500);
    return () => {
      window.clearTimeout(show);
      window.clearTimeout(hide);
    };
  }, [hint]);

  /* ── on the toad: tilt, tap, hold-to-charge, rub ────────────────────── */

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;
    const st = s.current;
    const dd = d.current;

    const tiltTo = (event: PointerEvent) => {
      const r = button.getBoundingClientRect();
      st.tx = clamp(((event.clientX - r.left) / r.width) * 2 - 1);
      st.ty = clamp(((event.clientY - r.top) / r.height) * 2 - 1);
      kick();
    };

    const chargeLoop = () => {
      const body = bodyRef.current;
      if (!dd.charging || !body) return;
      const c = Math.min(1, (Date.now() - dd.chargeStart) / CHARGE_MS);
      if (c >= 1 && dd.charge < 1) buzz(15);
      dd.charge = c;
      body.style.transform = `translateY(${(c * 4).toFixed(2)}%) scale(${(1 + 0.1 * c).toFixed(3)}, ${(1 - 0.18 * c).toFixed(3)})`;
      body.style.setProperty("--charge", c.toFixed(3));
      dd.chargeFrame = requestAnimationFrame(chargeLoop);
    };

    const onDown = (event: PointerEvent) => {
      dd.down = true;
      dd.x = event.clientX;
      dd.y = event.clientY;
      dd.travel = 0;
      dd.tickled = false;
      dd.charge = 0;
      tiltTo(event);
      window.clearTimeout(dd.holdTimer);
      dd.holdTimer = window.setTimeout(() => {
        if (!dd.down || dd.travel >= 12) return;
        dd.charging = true;
        dd.chargeStart = Date.now();
        noteActivity(true);
        dismissHint();
        chargeLoop();
      }, HOLD_DELAY_MS);
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "mouse" || dd.down) tiltTo(event);
      if (!dd.down) return;
      dd.travel += Math.hypot(event.clientX - dd.x, event.clientY - dd.y);
      dd.x = event.clientX;
      dd.y = event.clientY;
      if (dd.charging && dd.travel >= 12) stopCharge();
      if (!dd.tickled && dd.travel > 140) {
        dd.tickled = true;
        noteActivity(true);
        dismissHint();
        animateBody(
          [
            { transform: "rotate(0deg)" },
            { transform: "rotate(-7deg)" },
            { transform: "rotate(6deg)" },
            { transform: "rotate(-4deg)" },
            { transform: "rotate(3deg)" },
            { transform: "rotate(0deg)" },
          ],
          560,
          "ease-in-out",
        );
        say(TICKLE[Math.floor(Math.random() * TICKLE.length)], 2200);
        buzz(20);
      }
    };

    const settle = () => {
      st.tx = 0;
      st.ty = 0;
      kick();
    };

    const onUp = (event: PointerEvent) => {
      window.clearTimeout(dd.holdTimer);
      const wasDown = dd.down;
      dd.down = false;
      if (dd.charging) {
        const charge = dd.charge;
        stopCharge();
        launch(charge);
      } else if (wasDown && dd.travel < 12 && !dd.tickled) {
        // A drag is never a tap: scrolling past must not make it hop.
        poke();
      }
      if (event.pointerType !== "mouse") settle();
    };

    const onCancel = () => {
      window.clearTimeout(dd.holdTimer);
      dd.down = false;
      if (dd.charging) stopCharge();
      settle();
    };

    const noMenu = (event: Event) => event.preventDefault();

    button.addEventListener("pointerdown", onDown);
    button.addEventListener("pointermove", onMove);
    button.addEventListener("pointerup", onUp);
    button.addEventListener("pointercancel", onCancel);
    button.addEventListener("pointerleave", onCancel);
    button.addEventListener("contextmenu", noMenu);

    return () => {
      button.removeEventListener("pointerdown", onDown);
      button.removeEventListener("pointermove", onMove);
      button.removeEventListener("pointerup", onUp);
      button.removeEventListener("pointercancel", onCancel);
      button.removeEventListener("pointerleave", onCancel);
      button.removeEventListener("contextmenu", noMenu);
      window.clearTimeout(dd.holdTimer);
      cancelAnimationFrame(dd.chargeFrame);
    };
  }, [animateBody, dismissHint, kick, launch, noteActivity, poke, say, stopCharge]);

  useEffect(() => {
    const t = timers.current;
    return () => {
      window.clearTimeout(t.message);
      window.clearTimeout(t.cta);
    };
  }, []);

  /* ── render ─────────────────────────────────────────────────────────── */

  return (
    <div className={cn("relative", className)}>
      <button
        ref={buttonRef}
        type="button"
        aria-label={label}
        data-cursor="Poke me"
        onDragStart={(event) => event.preventDefault()}
        // Keyboard pokes. Pointer pokes arrive through pointerup; a click with
        // `detail === 0` is how the browser says it came from a key.
        onClick={(event) => {
          if (event.detail === 0) poke();
        }}
        className="relative block h-full w-full cursor-pointer rounded-[28%] bg-transparent p-0 outline-offset-4 select-none [touch-action:pan-y] [transform-style:preserve-3d] [-webkit-tap-highlight-color:transparent] [-webkit-touch-callout:none]"
      >
        <div ref={bodyRef} className="relative h-full w-full [transform-origin:50%_92%]">
          <div
            data-sleeping={sleeping ? "true" : "false"}
            className={cn(
              "relative h-full w-full",
              motionClassName,
              sleeping ? "toad-asleep" : "toad-awake",
            )}
          >
            {children}

            <span aria-hidden="true" className="pointer-events-none absolute inset-0">
              {EYES.map((eye) => (
                <span key={`look-${eye.left}`} className="toad-look" style={eye} />
              ))}
              {EYES.map((eye) => (
                <span key={`lid-${eye.left}`} className="toad-lid" style={eye} />
              ))}
              {EYES.map((eye) => (
                <span key={`power-${eye.left}`} className="toad-power" style={eye} />
              ))}
              <span className="toad-charge-ring" />

              {sleeping ? (
                <span className="toad-zzz" style={{ left: "74%", top: "-4%" }}>
                  <i>z</i>
                  <i>z</i>
                  <i>z</i>
                </span>
              ) : null}

              {effect ? (
                <span key={effect.id} className="absolute inset-0">
                  {EYES.map((eye) => (
                    <span key={`flash-${eye.left}`} className="toad-eye" style={eye} />
                  ))}
                  {effect.kind === "scan" ? (
                    <span className="toad-scan" />
                  ) : (
                    <span className="toad-ping" />
                  )}
                  {effect.kind === "launch" ? (
                    <span className="toad-ping toad-ping-late" />
                  ) : null}
                </span>
              ) : null}
            </span>
          </div>
        </div>
      </button>

      {/* Replies the visitor caused. Automatic remarks are not announced. */}
      <div role="status" aria-live="polite" className="sr-only">
        {announcement}
      </div>

      {/* Bubble, milestone link and first-visit hint share one slot above the
          head. The column is click-through except for the link itself. */}
      <div className="pointer-events-none absolute -top-[4%] left-1/2 z-30 flex w-max max-w-[min(15rem,80vw)] -translate-x-1/2 flex-col items-center gap-2">
        {message ? (
          <p
            key={message.id}
            aria-hidden="true"
            className="toad-bubble-in relative rounded-xl border border-[rgba(255,255,255,0.14)] bg-[var(--surface-2)] px-3.5 py-2 text-center t-sm leading-snug font-medium text-ink shadow-[0_12px_30px_-10px_rgba(0,0,0,0.8)]"
          >
            {message.text}
            <span
              aria-hidden="true"
              className="absolute -bottom-[6px] left-1/2 size-2.5 -translate-x-1/2 rotate-45 border-r border-b border-[rgba(255,255,255,0.14)] bg-[var(--surface-2)]"
            />
          </p>
        ) : showHint ? (
          <p
            aria-hidden="true"
            className="toad-bubble-in label-mono rounded-full border border-[rgba(255,255,255,0.14)] bg-[var(--surface-2)] px-3 py-1.5 text-ink-soft"
          >
            tap · hold · rub
          </p>
        ) : null}

        {showCta ? (
          <Link
            href="/contact"
            className="toad-cta bg-lime text-canvas pointer-events-auto inline-flex h-10 items-center gap-1.5 rounded-full px-4 t-sm font-semibold"
          >
            Book a call
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>
        ) : null}
      </div>
    </div>
  );
}
