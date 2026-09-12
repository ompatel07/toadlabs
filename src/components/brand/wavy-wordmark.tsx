"use client";

import { useEffect, useState } from "react";

/**
 * The hero wordmark: SVG text under a turbulence/displacement filter.
 *
 * Three implementation notes worth keeping:
 *
 * 1. The filter is applied through CSS (`.wordmark-warp`), not the SVG `filter`
 *    attribute. SVG presentation attributes cannot be media-queried, and the
 *    brief needs the displacement switched off below 768px — so it has to be a
 *    CSS property to be overridable.
 *
 * 2. `textLength` + `lengthAdjust="spacingAndGlyphs"` pins the wordmark to the
 *    viewBox width. Without it the span would depend on the loaded font's
 *    metrics, and would visibly reflow between the fallback and Clash Display.
 *    With it, the wordmark touches both edges at every width, in every font.
 *
 * 3. The SMIL <animate> is only mounted client-side once reduced motion is
 *    ruled out. Rendering it on the server and removing it later would let the
 *    animation run for a frame for users who asked for no motion.
 */
export function WavyWordmark({ text = "Toad Labs." }: { text?: string }) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setAnimate(!query.matches);

    const onChange = (event: MediaQueryListEvent) => setAnimate(!event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return (
    <svg
      viewBox="0 0 1200 300"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      focusable="false"
      className="block h-auto w-full"
    >
      <defs>
        <filter
          id="toad-wave"
          x="-6%"
          y="-30%"
          width="112%"
          height="160%"
          colorInterpolationFilters="sRGB"
        >
          {/* Tuned below the brief's 0.008 0.012 starting point: at that
              frequency the noise is finer than the stroke weight, so it bites
              chunks out of the letterforms rather than bending them. Longer
              wavelengths bend the whole stroke, which is the molten read we
              want while staying legible. */}
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.005 0.007"
            numOctaves={2}
            seed={7}
            result="noise"
          >
            {animate ? (
              <animate
                attributeName="baseFrequency"
                dur="12s"
                values="0.005 0.007; 0.007 0.0045; 0.005 0.007"
                keyTimes="0; 0.5; 1"
                calcMode="spline"
                keySplines="0.42 0 0.58 1; 0.42 0 0.58 1"
                repeatCount="indefinite"
              />
            ) : null}
          </feTurbulence>
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale={10}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>

      <g className="wordmark-warp">
        <text
          x="600"
          y="218"
          textAnchor="middle"
          textLength="1176"
          lengthAdjust="spacingAndGlyphs"
          className="fill-ink font-wordmark"
          style={{
            fontSize: "217px",
            fontWeight: 400,
            letterSpacing: "-0.03em",
            fontOpticalSizing: "auto",
          }}
        >
          {text.toUpperCase()}
        </text>
      </g>
    </svg>
  );
}
