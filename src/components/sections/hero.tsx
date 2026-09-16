import Link from "next/link";
import { ArrowUpRight, ShieldCheck, Boxes } from "lucide-react";
import { hero } from "@/config/home";
import { siteConfig } from "@/config/site";
import { WavyWordmark } from "@/components/brand/wavy-wordmark";
import { HeroObjectInteractive } from "@/components/brand/hero-object-interactive";
import { ParticleNetwork } from "@/components/brand/particle-network";
import { cn } from "@/lib/utils";

/**
 * Hero.
 *
 * SIZING IS HEIGHT-DRIVEN, NOT WIDTH-DRIVEN
 * An earlier version sized the object in vw and positioned everything with vw
 * offsets. It measured fine against bare viewports and then broke in a real
 * browser, where chrome leaves far less height than a viewport of the same
 * width. Now:
 *
 *   - the stage is what is left after the two fixed rows
 *   - the object is sized as a percentage of THAT height, so it can never
 *     outgrow the space available
 *   - the cards anchor to the stage's bottom corners, so they track the object
 *     instead of drifting into the closing row
 *
 * That holds at any width/height combination, including short landscape
 * viewports, without per-breakpoint tuning.
 *
 * Below 768px the overlay is dropped for a plain column — overlapping display
 * type on a phone costs legibility for no gain.
 */

function HeroCard({
  label,
  copy,
  icon: Icon,
  className,
}: {
  label: string;
  copy: string;
  icon: typeof Boxes;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "glass-soft flex flex-col gap-1.5 px-5 py-4 transition-transform duration-300 ease-out hover:-translate-y-1",
        className,
      )}
    >
      <span className="text-ink inline-flex items-center gap-2 text-sm font-semibold">
        <Icon className="size-4" strokeWidth={2} aria-hidden="true" />
        {label}
      </span>
      <span className="text-ink-soft t-xs leading-snug">{copy}</span>
    </div>
  );
}

export function Hero() {
  return (
    <section className="bg-grid relative flex min-h-[calc(100svh-var(--header-h))] flex-col overflow-x-clip pb-6 md:h-[calc(100svh-var(--header-h))] md:min-h-0">
      {/* Node network behind the composition. A network graph is the right
          motif for a studio that builds and tests systems — and it responds to
          the pointer, so the hero is something you can push around. */}
      <ParticleNetwork className="pointer-events-none absolute inset-0 z-0 h-full w-full" />
      {/* Meta row */}
      <div className="container-tl relative z-10 flex shrink-0 items-start justify-between gap-4 pt-3">
        <span className="glass-pill text-ink inline-flex items-center gap-2 px-3.5 py-2 t-xs font-medium">
          <span
            aria-hidden="true"
            className="bg-lime-deep inline-block size-1.5 shrink-0 rounded-full"
          />
          {hero.eyebrow}
        </span>
        <span className="label-mono text-ink-soft hidden pt-2 sm:block">
          {siteConfig.location.city}, {siteConfig.location.country}
        </span>
      </div>

      {/* Stage */}
      <div className="relative z-10 flex min-h-0 flex-1 flex-col items-center md:block">
        {/* Layer 1: wordmark, pinned to the top of the stage. */}
        <h1 className="mt-2 w-[92vw] md:absolute md:top-0 md:left-1/2 md:mt-0 md:-translate-x-1/2">
          <span className="sr-only">Toad Labs</span>
          {/* Decorative here — the accessible name is the hidden text above, so
              it is not announced twice. */}
          <WavyWordmark />
        </h1>

        {/* Layer 2: the object, anchored to the bottom of the stage and sized
            by stage height. Bottom-anchored plus height-sized is what keeps it
            overlapping the wordmark's lower half at every aspect ratio. */}
        <HeroObjectInteractive
          className={cn(
            "relative z-10 mt-0 aspect-square w-[64vw] max-w-[380px]",
            "md:absolute md:bottom-0 md:left-1/2 md:mt-0 md:h-[84%] md:w-auto md:max-w-[52vw] md:-translate-x-1/2",
          )}
        />

        {/* Layer 3: cards. A column on phones, then anchored to the stage's
            bottom corners from 768px up, clear of both the type and the CTA. */}
        <div className="mt-4 grid w-full grid-cols-1 gap-2.5 px-5 sm:grid-cols-2 md:absolute md:inset-x-0 md:bottom-0 md:mt-0 md:block md:gap-0 md:px-0">
          <HeroCard
            label={hero.cards.build.label}
            copy={hero.cards.build.copy}
            icon={Boxes}
            className="hero-card-left"
          />
          <HeroCard
            label={hero.cards.secure.label}
            copy={hero.cards.secure.copy}
            icon={ShieldCheck}
            className="hero-card-right"
          />
        </div>
      </div>

      {/* Closing row */}
      <div className="container-tl relative z-10 mt-6 flex shrink-0 flex-col gap-4 sm:flex-row sm:items-end sm:justify-between md:mt-4">
        <div className="max-w-xl">
          <p className="font-display text-ink type-h2 leading-[1.2] font-semibold text-balance">
            {hero.statement}
          </p>
          <p className="text-ink-soft mt-2 t-base">{hero.subtitle}</p>
        </div>

        {/* Circular on desktop, full-width button on phones. */}
        <Link
          href={hero.primaryCta.href}
          className={cn(
            "bg-lime text-canvas group inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full font-semibold transition-all duration-300 ease-out hover:bg-[#d3f95c] hover:shadow-[0_10px_30px_-8px_rgba(168,213,32,0.7)]",
            "h-12 w-full px-6 t-base",
            "sm:size-26 sm:flex-col sm:gap-1 sm:px-0 t-xs sm:leading-tight",
          )}
        >
          {hero.primaryCta.label}
          <ArrowUpRight
            className="size-4 transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden="true"
          />
        </Link>
      </div>
    </section>
  );
}
