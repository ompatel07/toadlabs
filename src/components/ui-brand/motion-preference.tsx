"use client";

import { useEffect, useState } from "react";

/**
 * Versioned deliberately.
 *
 * An earlier, unlabelled header control wrote to "toadlabs:motion". Anyone who
 * clicked it off kept that value after the control was removed, which left
 * their browser with every animation permanently disabled and no obvious way
 * back — the symptom being a site that animated on their phone but not their
 * laptop. Bumping the key retires those writes; the old one is also cleared on
 * read so it does not sit around.
 */
const KEY = "toadlabs:motion:v2";
const LEGACY_KEY = "toadlabs:motion";

/**
 * Lets a visitor override the OS motion setting for this site.
 *
 * The OS remains the default and is never silently ignored. But "reduce
 * motion" is usually set once, system-wide, and forgotten — and someone who
 * wants to see a site's motion should be able to say so without digging
 * through system settings.
 *
 * Deliberately a labelled text control in the footer rather than an icon in
 * the header: an unlabelled sparkle told nobody what it did, and a preference
 * this niche does not belong in primary navigation.
 */
export function MotionPreference() {
  const [enabled, setEnabled] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      localStorage.removeItem(LEGACY_KEY);
    } catch {}
    const stored = localStorage.getItem(KEY);
    if (stored === "on" || stored === "off") {
      setEnabled(stored === "on");
      return;
    }
    setEnabled(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  function toggle() {
    const next = !enabled;
    setEnabled(next);
    document.documentElement.dataset.motion = next ? "on" : "off";
    try {
      localStorage.setItem(KEY, next ? "on" : "off");
    } catch {
      // Private mode: the choice still applies for this session.
    }
  }

  // Render nothing until the effective state is known, so the label can never
  // contradict what the page is doing.
  if (enabled === null) return null;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={enabled}
      className="text-ink-soft hover:text-ink inline-flex cursor-pointer items-center gap-2 t-sm transition-colors duration-200 ease-out"
    >
      <span
        aria-hidden="true"
        className={
          enabled
            ? "bg-lime-deep inline-block size-1.5 rounded-full"
            : "bg-ink/30 inline-block size-1.5 rounded-full"
        }
      />
      Animations: {enabled ? "on" : "off"}
      <span className="sr-only">
        {enabled
          ? "Animations are on for this site. Activate to turn them off."
          : "Animations are off for this site. Activate to turn them on."}
      </span>
    </button>
  );
}

/**
 * Applies the stored preference before first paint. Inlined in the document
 * head: doing this in an effect would let one frame render with the wrong
 * setting, which for someone who asked for reduced motion is the frame that
 * matters.
 */
export const motionInitScript = `
try {
  localStorage.removeItem("${LEGACY_KEY}");
  var m = localStorage.getItem("${KEY}");
  if (m === "on" || m === "off") document.documentElement.dataset.motion = m;
} catch (e) {}
`;
