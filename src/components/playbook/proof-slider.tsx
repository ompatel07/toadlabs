"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { replies } from "@/config/playbook";
import { Shot } from "@/components/playbook/playbook-image";

/**
 * The reply screenshots, as a slider.
 *
 * WHY IT IS A SCROLLER AND NOT A TRANSFORM CAROUSEL
 * The track is a real overflow-x container with scroll-snap. That means it
 * already works before this component hydrates, and it keeps working if the
 * JavaScript never arrives: you can swipe it on a phone, drag the scrollbar,
 * and tab through the figures. The buttons and dots below are an enhancement
 * on top of behaviour that exists without them — they call scrollTo, they are
 * not the mechanism.
 *
 * It does not auto-advance. WCAG 2.2.2 requires a pause control for anything
 * that moves on its own for more than five seconds, and a carousel that moves
 * while somebody is reading a screenshot is working against the one job this
 * section has.
 */
export function PlaybookProofSlider() {
  const trackRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  /* Which slide is centred, and whether either end has been reached. Read from
     scroll position rather than tracked in state, so a swipe, a keyboard
     scroll and a button press all report the same thing. */
  const sync = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const slides = Array.from(track.children) as HTMLElement[];
    if (slides.length === 0) return;

    const centre = track.scrollLeft + track.clientWidth / 2;
    let nearest = 0;
    let best = Infinity;
    slides.forEach((slide, index) => {
      const distance = Math.abs(slide.offsetLeft + slide.offsetWidth / 2 - centre);
      if (distance < best) {
        best = distance;
        nearest = index;
      }
    });

    const start = track.scrollLeft <= 4;
    const end = track.scrollLeft >= track.scrollWidth - track.clientWidth - 4;

    // At the ends, report the end. With several slides in view the nearest to
    // the centre is not the first one, so an untouched slider would open
    // reading "02 / 09".
    setActive(start ? 0 : end ? slides.length - 1 : nearest);
    setAtStart(start);
    setAtEnd(end);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    sync();
    track.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      track.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, [sync]);

  const go = useCallback((index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const slide = track.children[index] as HTMLElement | undefined;
    if (!slide) return;
    // Centre the slide rather than align it left: at widths showing three at a
    // time, aligning left walks the last group off the end.
    track.scrollTo({
      left: slide.offsetLeft - (track.clientWidth - slide.offsetWidth) / 2,
      behavior: "smooth",
    });
  }, []);

  const step = useCallback(
    (direction: -1 | 1) => go(Math.min(replies.length - 1, Math.max(0, active + direction))),
    [active, go],
  );

  return (
    <div className="mt-8">
      <ul
        ref={trackRef}
        tabIndex={0}
        role="region"
        aria-label="Replies to the outreach"
        className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-3 md:mx-0 md:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {replies.map((shot, index) => (
          <li
            key={shot.id}
            className="w-[78vw] shrink-0 snap-center sm:w-[46vw] lg:w-[30%] xl:w-[23%]"
            aria-label={`${index + 1} of ${replies.length}`}
          >
            <Shot
              className="h-full"
              kind="proofs"
              id={shot.id}
              alt={shot.alt}
              caption={shot.caption}
              sizes="(max-width: 639px) 78vw, (max-width: 1023px) 46vw, 30vw"
            />
          </li>
        ))}
      </ul>

      <div className="mt-5 flex items-center gap-4">
        <button
          type="button"
          onClick={() => step(-1)}
          disabled={atStart}
          aria-label="Previous reply"
          className="text-ink inline-flex size-12 cursor-pointer items-center justify-center rounded-full border-2 border-[color:var(--ink)] transition-colors duration-150 ease-out enabled:hover:bg-[color:var(--ink)] enabled:hover:text-[color:var(--canvas)] disabled:cursor-default disabled:opacity-30"
        >
          <ArrowLeft className="size-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => step(1)}
          disabled={atEnd}
          aria-label="Next reply"
          className="text-ink inline-flex size-12 cursor-pointer items-center justify-center rounded-full border-2 border-[color:var(--ink)] transition-colors duration-150 ease-out enabled:hover:bg-[color:var(--ink)] enabled:hover:text-[color:var(--canvas)] disabled:cursor-default disabled:opacity-30"
        >
          <ArrowRight className="size-5" aria-hidden="true" />
        </button>

        {/* Position. Nine tappable segments plus two arrows cannot fit a 44px
            target each on a 390px screen, so the phone gets a plain progress
            bar and navigates by swipe and arrows; the segments become controls
            once there is room for them to be real targets. */}
        <div aria-hidden="true" className="h-[3px] flex-1 bg-[color:var(--ink)]/20 sm:hidden">
          <div
            className="h-full bg-[color:var(--accent)] transition-[width] duration-200 ease-out"
            style={{ width: `${((active + 1) / replies.length) * 100}%` }}
          />
        </div>

        <ol className="hidden flex-1 items-center gap-1.5 sm:flex">
          {replies.map((shot, index) => (
            <li key={shot.id} className="flex-1">
              <button
                type="button"
                onClick={() => go(index)}
                aria-label={`Go to reply ${index + 1}`}
                aria-current={index === active}
                className="flex h-11 w-full cursor-pointer items-center"
              >
                <span
                  aria-hidden="true"
                  className={
                    index === active
                      ? "block h-[3px] w-full bg-[color:var(--accent)]"
                      : "block h-[3px] w-full bg-[color:var(--ink)]/20"
                  }
                />
              </button>
            </li>
          ))}
        </ol>

        <p className="label-mono text-ink-soft shrink-0 tabular-nums">
          {String(active + 1).padStart(2, "0")}/{String(replies.length).padStart(2, "0")}
        </p>
      </div>
    </div>
  );
}
