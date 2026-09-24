"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * The brand object, as a character.
 *
 * The artwork is a developer in a beanbag with a laptop, ringed by six
 * floating cards (code, analytics, image, shield, megaphone, idea). Every
 * effect is anchored to something IN that picture — the sunglasses, the laptop
 * screen, a card — rather than floating over it generically.
 *
 * GESTURES
 *   tap / click     bob with squash-and-stretch, the screen flares, and the
 *                   next card in the ring lights up. A line appears
 *   hold            build: the character leans in, the screen brightens, and a
 *                   progress ring fills. Release to ship it — the harder the
 *                   charge, the bigger the release
 *   rub / stroke    wiggle: "that tickles"
 *   5 fast taps     audit mode: 3D spin, a scan sweep, "0 criticals"
 *
 * AMBIENT LIFE
 *   glints          a highlight in each sunglass lens slides toward the
 *                   pointer anywhere on the page, or the finger on a phone.
 *                   When nobody is moving it glances around by itself
 *   screen          the laptop screen glows, and breathes while idle
 *   tilt            3D lean toward a pointer resting on it
 *   sleep           20s with no activity and it dozes: the screen dims, colour
 *                   drains, z's float up from the head. Any activity wakes it
 *   memory          pokes are counted across the whole visit. At milestones it
 *                   comments, and from 20 it offers a "Book a call" link
 *   hint            one object per page can show "tap · hold · rub" once
 *
 * LAYERING: every moving part owns exactly one transform on its own element.
 *   button   tilt (spring in a rAF loop that stops itself when settled)
 *   body     bob / wiggle / spin / ship via the Web Animations API, and the
 *            charge lean via inline style while held
 *   motion   the caller's float or scroll drift. The overlays live INSIDE this
 *            wrapper so they move with the image; layered over the bare image
 *            they would slide off the lenses as it drifted
 *   children the image itself
 *
 * Anchors are measured off the 1312x1199 master, as percentages of the
 * rendered box: lenses at (51.0%, 40.8%) and (58.4%, 41.8%), the laptop screen
 * at (63%, 63%), and the six cards around the ring.
 *
 * TOUCH: touch-action pan-y, so vertical swipes still scroll the page over an
 * object that fills most of a phone screen. A drag never counts as a tap or a
 * charge. Long-press context menus are suppressed so a hold can charge.
 *
 * COST: the look/tilt loop runs only while the object is on screen
 * (IntersectionObserver) and stops the moment values settle.
 *
 * ACCESSIBILITY: a real <button> with a label, so Enter/Space poke it. Replies
 * the visitor caused go to a polite live region; automatic remarks (waking up)
 * are shown but not announced, so a screen reader is never interrupted by
 * something nobody touched.
 */

const LINES = [
  "Deploying. Don't look away.",
  "That click? Tracked as a conversion.",
  "I don't break. I get pentested.",
  "Attract. Build. Protect. In that order.",
  "Zero criticals found in that poke.",
  "No lock-in. Everything's in your name.",
  "Cost per enquiry: still the only metric.",
  "Shipping since the first commit.",
];
const TICKLE = ["Hey — I'm typing here.", "Stop, that tickles.", "Okay, okay, I'm awake."];
const WAKE = [
  "Wasn't asleep. Was compiling.",
  "Huh? I'm up. Shipping.",
  "Back online. Zero downtime. Mostly.",
];
const SCAN_LINE = "Audit mode: scanning you… 0 criticals. You're clean.";

const MILESTONES: Record<number, { text: string; cta?: boolean }> = {
  10: { text: "Ten pokes. You'd make a good tester." },
  20: { text: "Twenty pokes. At this point, just book a call.", cta: true },
  50: { text: "Fifty. Respect. We read every message.", cta: true },
};

const SLEEP_AFTER_MS = 20000;
const HOLD_DELAY_MS = 240;
const CHARGE_MS = 900;
const COUNT_KEY = "offscript:pokes";
const MET_KEY = "offscript:object-met";

// sessionStorage can throw (private mode, blocked storage). An object that
// forgets is fine; one that crashes the page is not.
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

type Effect = { id: number; kind: "poke" | "scan" | "ship"; card: number };

/**
 * Anchors per artwork, measured on each master rather than guessed — the two
 * poses put the lenses, the laptop and the cards in completely different
 * places, and an overlay a few percent out lands on a cheek instead of a lens.
 *
 *   hero    the wide seated composition (1312x1199), ringed by six cards
 *   figure  the standing figure (647x1126), no cards to light
 */
type Anchor = { left: string; top: string };

const ARTWORK: Record<
  "hero" | "figure",
  { lenses: Anchor[]; screen: Anchor; cards: Anchor[] }
> = {
  hero: {
    lenses: [
      { left: "51%", top: "40.8%" },
      { left: "58.4%", top: "41.8%" },
    ],
    screen: { left: "63%", top: "63%" },
    cards: [
      { left: "28%", top: "15%" },
      { left: "80%", top: "27%" },
      { left: "81%", top: "46%" },
      { left: "85%", top: "62%" },
      { left: "13%", top: "57%" },
      { left: "17%", top: "38%" },
    ],
  },
  figure: {
    lenses: [
      { left: "37.4%", top: "25.9%" },
      { left: "52%", top: "28%" },
    ],
    screen: { left: "68.5%", top: "37.2%" },
    cards: [],
  },
};

export function InteractiveObject({
  children,
  className,
  motionClassName,
  hint = false,
  artwork = "hero",
  floatClassName,
  label = "Poke the OFFSCRIPT character",
}: {
  children: React.ReactNode;
  className?: string;
  /** Which master is inside, so the overlays land on the right features. */
  artwork?: "hero" | "figure";
  /** Gentle idle float. Applied to an inner wrapper so it composes with a
      scroll-driven drift on the outer one instead of overwriting it. */
  floatClassName?: string;
  /** Float or scroll-drift class, applied to the wrapper that also holds the
      eye overlays so they stay on the pupils while the image moves. */
  motionClassName?: string;
  /** Show the one-time "tap · hold · rub" hint. Use on one object per page. */
  hint?: boolean;
  label?: string;
}) {
  const { lenses: LENSES, screen: SCREEN, cards: CARDS } = ARTWORK[artwork];

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
  const cardIndex = useRef(0);
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
    (fromObject: boolean) => {
      s.current.lastActivity = Date.now();
      if (!sleepingRef.current) return;
      setAsleep(false);
      // A poke has its own reaction; only a passive wake gets a remark.
      if (!fromObject && s.current.visible) {
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
      setEffect({ id: effectId.current, kind: "scan", card: cardIndex.current });
      say(SCAN_LINE, 3600);
      buzz(40);
      return;
    }

    hop();
    cardIndex.current = CARDS.length ? (cardIndex.current + 1) % CARDS.length : 0;
    setEffect({ id: effectId.current, kind: "poke", card: cardIndex.current });
    if (!countAndMaybeCelebrate()) {
      say(LINES[lineIndex.current % LINES.length]);
      lineIndex.current += 1;
    }
    buzz(12);
  }, [CARDS.length, animateBody, countAndMaybeCelebrate, dismissHint, hop, noteActivity, say]);

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
      setEffect({ id: effectId.current, kind: "ship", card: cardIndex.current });
      if (!countAndMaybeCelebrate()) {
        say(c > 0.95 ? "Shipped. All systems lit." : c > 0.55 ? "Deployed." : "Pushed a commit.");
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

  /* ── on the object: tilt, tap, hold-to-charge, rub ──────────────────── */

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
        className="relative block h-full w-full cursor-pointer rounded-2xl bg-transparent p-0 outline-offset-4 select-none [touch-action:pan-y] [transform-style:preserve-3d] [-webkit-tap-highlight-color:transparent] [-webkit-touch-callout:none]"
      >
        <div ref={bodyRef} className="relative h-full w-full [transform-origin:50%_92%]">
          <div
            data-sleeping={sleeping ? "true" : "false"}
            className={cn(
              "relative h-full w-full",
              motionClassName,
              sleeping ? "obj-asleep" : "obj-awake",
            )}
          >
            <div className={cn("relative h-full w-full", floatClassName)}>
              {children}

              <span aria-hidden="true" className="pointer-events-none absolute inset-0">
              {LENSES.map((eye) => (
                <span key={`look-${eye.left}`} className="obj-look" style={eye} />
              ))}
              {LENSES.map((eye) => (
                <span key={`power-${eye.left}`} className="obj-power" style={eye} />
              ))}

              {/* The laptop screen: breathes while idle, brightens with the
                  charge, goes dark asleep. */}
              <span className="obj-screen" style={SCREEN} />
              <span className="obj-charge-ring" />

              {sleeping ? (
                <span className="obj-zzz" style={{ left: "62%", top: "6%" }}>
                  <i>z</i>
                  <i>z</i>
                  <i>z</i>
                </span>
              ) : null}

              {effect ? (
                <span key={effect.id} className="absolute inset-0">
                  {LENSES.map((eye) => (
                    <span key={`flash-${eye.left}`} className="obj-eye" style={eye} />
                  ))}
                  <span className="obj-flare" style={SCREEN} />

                  {/* A poke lights the next card; shipping lights all six in
                      sequence, which reads as the whole system reacting. */}
                  {(effect.kind === "ship" ? CARDS : CARDS.slice(effect.card, effect.card + 1)).map(
                    (card, index) => (
                      <span
                        key={`card-${card.left}-${card.top}`}
                        className="obj-card"
                        style={{
                          ...card,
                          animationDelay: `${effect.kind === "ship" ? index * 80 : 0}ms`,
                        }}
                      />
                    ),
                  )}

                  {effect.kind === "scan" ? (
                    <span className="obj-scan" />
                  ) : (
                    <span className="obj-ping" />
                  )}
                  {effect.kind === "ship" ? (
                    <span className="obj-ping obj-ping-late" />
                  ) : null}
                </span>
              ) : null}
              </span>
            </div>
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
            className="obj-bubble-in relative rounded-xl border border-[rgba(255,255,255,0.14)] bg-[var(--surface-2)] px-3.5 py-2 text-center t-sm leading-snug font-medium text-ink shadow-[0_12px_30px_-10px_rgba(0,0,0,0.8)]"
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
            className="obj-bubble-in label-mono rounded-full border border-[rgba(255,255,255,0.14)] bg-[var(--surface-2)] px-3 py-1.5 text-ink-soft"
          >
            tap · hold · rub
          </p>
        ) : null}

        {showCta ? (
          <Link
            href="/contact"
            className="obj-cta bg-lime text-canvas pointer-events-auto inline-flex h-10 items-center gap-1.5 rounded-full px-4 t-sm font-semibold"
          >
            Book a call
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>
        ) : null}
      </div>
    </div>
  );
}
