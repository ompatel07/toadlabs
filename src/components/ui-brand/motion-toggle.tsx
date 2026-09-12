"use client";

import { useEffect, useState } from "react";
import { Sparkles, SparklesIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const KEY = "toadlabs:motion";

/**
 * Lets a visitor turn animation on or off for this site.
 *
 * The OS `prefers-reduced-motion` setting remains the default — we never
 * silently ignore it. But that setting is often enabled system-wide and
 * forgotten, and someone who wants to see the motion on one site should be
 * able to say so. The choice is stored and re-applied on the next visit.
 *
 * The actual switching is CSS (`html[data-motion]`); this only sets the
 * attribute. See the MOTION CONTROL block in globals.css.
 */
export function MotionToggle({ className }: { className?: string }) {
  const [enabled, setEnabled] = useState<boolean | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(KEY);
    if (stored === "on" || stored === "off") {
      setEnabled(stored === "on");
      return;
    }
    // No stored choice: reflect whatever the OS is asking for.
    setEnabled(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  function toggle() {
    const next = !enabled;
    setEnabled(next);
    document.documentElement.dataset.motion = next ? "on" : "off";
    try {
      localStorage.setItem(KEY, next ? "on" : "off");
    } catch {
      // Private mode — the toggle still works for this session.
    }
  }

  // Render nothing until the effective state is known, so the label can never
  // contradict what the page is actually doing.
  if (enabled === null) {
    return <span className={cn("inline-block size-10", className)} aria-hidden="true" />;
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={enabled}
      title={enabled ? "Turn animations off" : "Turn animations on"}
      className={cn(
        "text-ink inline-flex size-10 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 ease-out hover:bg-[rgba(11,12,10,0.06)]",
        enabled && "bg-lime hover:bg-[#d3f95c]",
        className,
      )}
    >
      {enabled ? (
        <Sparkles className="size-[18px]" strokeWidth={2} aria-hidden="true" />
      ) : (
        <SparklesIcon className="size-[18px] opacity-45" strokeWidth={2} aria-hidden="true" />
      )}
      <span className="sr-only">
        {enabled ? "Animations are on. Turn them off." : "Animations are off. Turn them on."}
      </span>
    </button>
  );
}

/**
 * Applies the stored preference before first paint.
 *
 * Inlined in <head> deliberately: doing this in an effect would let one frame
 * render with the wrong setting, which for someone who has asked for reduced
 * motion is exactly the frame that matters.
 */
export const motionInitScript = `
try {
  var m = localStorage.getItem("${KEY}");
  if (m === "on" || m === "off") document.documentElement.dataset.motion = m;
} catch (e) {}
`;
