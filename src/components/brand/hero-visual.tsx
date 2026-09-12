import { cn } from "@/lib/utils";

/**
 * Hero centrepiece — an abstract glass bloom.
 *
 * Built from overlapping translucent petals rather than a single lit sphere.
 * Depth comes from the overlaps: each petal is semi-transparent, so where they
 * cross the colour deepens, which is what makes it read as a formed glass
 * object instead of a gradient circle. A ring passes behind the bloom and then
 * in front of it — split into two arcs for exactly that reason.
 *
 * Decorative, so it is hidden from assistive tech. The drift animation is
 * disabled under prefers-reduced-motion by the utility class itself.
 */

/** One petal, pointing right from the centre at (300, 300). */
const PETAL =
  "M300 300C332 240 396 206 458 220C478 282 434 348 358 364C322 371 300 342 300 300Z";

/** rotation, gradient id, opacity, blur filter */
const PETALS: [number, string, number, string | undefined][] = [
  [-96, "tl-p-deep", 0.92, "url(#tl-blur-sm)"],
  [-38, "tl-p-mid", 0.86, undefined],
  [16, "tl-p-bright", 0.9, undefined],
  [64, "tl-p-mid", 0.82, undefined],
  [118, "tl-p-deep", 0.88, "url(#tl-blur-sm)"],
  [168, "tl-p-dark", 0.9, undefined],
  [218, "tl-p-mid", 0.76, "url(#tl-blur-sm)"],
  [272, "tl-p-bright", 0.7, undefined],
];

export function HeroVisual({ className }: { className?: string }) {
  return (
    <div className={cn("pointer-events-none relative", className)}>
      <svg
        viewBox="0 0 600 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="animate-drift h-full w-full overflow-visible"
      >
        <defs>
          <linearGradient id="tl-p-bright" x1="12%" y1="8%" x2="88%" y2="92%">
            <stop offset="0%" stopColor="#F2FFC8" />
            <stop offset="38%" stopColor="#CDF75E" />
            <stop offset="100%" stopColor="#5FC07E" />
          </linearGradient>

          <linearGradient id="tl-p-mid" x1="10%" y1="14%" x2="90%" y2="88%">
            <stop offset="0%" stopColor="#B8EE6A" />
            <stop offset="45%" stopColor="#4FAE74" />
            <stop offset="100%" stopColor="#1E7050" />
          </linearGradient>

          <linearGradient id="tl-p-deep" x1="18%" y1="10%" x2="82%" y2="94%">
            <stop offset="0%" stopColor="#7FD59A" />
            <stop offset="50%" stopColor="#248062" />
            <stop offset="100%" stopColor="#0D4334" />
          </linearGradient>

          <linearGradient id="tl-p-dark" x1="24%" y1="16%" x2="76%" y2="90%">
            <stop offset="0%" stopColor="#2A8A66" />
            <stop offset="60%" stopColor="#124A38" />
            <stop offset="100%" stopColor="#07281F" />
          </linearGradient>

          {/* Warm core where the petals converge. */}
          <radialGradient id="tl-core" cx="42%" cy="38%" r="58%">
            <stop offset="0%" stopColor="#FBFFE0" stopOpacity="0.95" />
            <stop offset="42%" stopColor="#DFFA8E" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#9FE04A" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="tl-spec" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="tl-ring" x1="0%" y1="0%" x2="100%" y2="60%">
            <stop offset="0%" stopColor="#0B0C0A" stopOpacity="0.05" />
            <stop offset="34%" stopColor="#1A6248" stopOpacity="0.45" />
            <stop offset="60%" stopColor="#CBF561" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#0B0C0A" stopOpacity="0.06" />
          </linearGradient>

          <radialGradient id="tl-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#C7F23C" stopOpacity="0.34" />
            <stop offset="55%" stopColor="#5FBE8A" stopOpacity="0.13" />
            <stop offset="100%" stopColor="#5FBE8A" stopOpacity="0" />
          </radialGradient>

          <filter id="tl-blur-lg" x="-45%" y="-45%" width="190%" height="190%">
            <feGaussianBlur stdDeviation="32" />
          </filter>
          <filter id="tl-blur-sm" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="7" />
          </filter>
        </defs>

        {/* Ambient bloom behind the form. */}
        <ellipse
          cx="300"
          cy="300"
          rx="276"
          ry="262"
          fill="url(#tl-glow)"
          filter="url(#tl-blur-lg)"
        />

        {/* Ring, back half. */}
        <g transform="rotate(-17 300 312)">
          <path
            d="M22 312 A 278 92 0 0 0 578 312"
            fill="none"
            stroke="url(#tl-ring)"
            strokeWidth="9"
            strokeLinecap="round"
            opacity="0.7"
          />
        </g>

        {/* The bloom. Petals are translucent so overlaps deepen the colour. */}
        <g>
          {PETALS.map(([angle, gradient, opacity, blur], index) => (
            <path
              key={index}
              d={PETAL}
              fill={`url(#${gradient})`}
              opacity={opacity}
              filter={blur}
              transform={`rotate(${angle} 300 300)`}
            />
          ))}

          {/* Convergent core, painted over the petal joins. */}
          <ellipse cx="292" cy="288" rx="132" ry="118" fill="url(#tl-core)" />

          {/* Specular hits. */}
          <ellipse
            cx="250"
            cy="222"
            rx="54"
            ry="32"
            fill="url(#tl-spec)"
            transform="rotate(-32 250 222)"
          />
          <ellipse
            cx="352"
            cy="196"
            rx="15"
            ry="9"
            fill="#FFFFFF"
            opacity="0.55"
            transform="rotate(-20 352 196)"
          />
        </g>

        {/* Ring, front half. */}
        <g transform="rotate(-17 300 312)">
          <path
            d="M22 312 A 278 92 0 0 1 578 312"
            fill="none"
            stroke="url(#tl-ring)"
            strokeWidth="9"
            strokeLinecap="round"
          />
          <path
            d="M22 312 A 278 92 0 0 1 578 312"
            fill="none"
            stroke="#FFFFFF"
            strokeOpacity="0.38"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </g>
      </svg>
    </div>
  );
}
