import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, Minus } from "lucide-react";
import {
  assets,
  fit,
  hero,
  problem,
  product,
  replies,
  repliesSection,
  snapshots,
  websites,
  websitesSection,
} from "@/config/playbook";
import { PlaybookImage } from "@/components/playbook/playbook-image";
import { cn } from "@/lib/utils";

/**
 * The sales page, section by section. Everything here is presentational: all
 * words live in src/config/playbook.ts.
 *
 * Reveal animations use the site's CSS-only `.reveal` (animation-timeline:
 * view()), so every section ships visible and stays visible if JavaScript
 * never runs. Nothing on this page is revealed by script.
 */

/** One shared wrapper so the rhythm is identical down the page. */
function Band({
  children,
  className,
  id,
  label,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
  label?: string;
}) {
  return (
    <section
      id={id}
      aria-label={label}
      className={cn("scroll-mt-16 py-16 md:py-24", className)}
    >
      <div className="mx-auto w-full max-w-[72rem] px-5 md:px-8">{children}</div>
    </section>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="label-mono pb-accent flex items-center gap-2.5">
      <span aria-hidden="true" className="inline-block h-px w-6 bg-[color:var(--accent)]" />
      {children}
    </p>
  );
}

/* ── 1. Hero ─────────────────────────────────────────────────────────────── */

export function PlaybookHero() {
  return (
    <header className="pb-glow relative pt-10 pb-14 md:pt-16 md:pb-20">
      <div className="mx-auto w-full max-w-[72rem] px-5 md:px-8">
        <Eyebrow>{hero.eyebrow}</Eyebrow>

        <h1 className="font-display text-ink mt-6 text-[clamp(2.4rem,9vw,4.5rem)] leading-[1.02] font-extrabold tracking-[-0.03em] text-balance">
          {hero.headline}
        </h1>

        <p className="text-ink mt-5 max-w-[34ch] text-[clamp(1.15rem,4.4vw,1.6rem)] leading-snug font-semibold">
          {hero.sub}
        </p>

        <p className="text-ink-soft measure mt-5 t-lead leading-relaxed">{hero.body}</p>

        <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2">
          {hero.marks.map((mark) => (
            <li key={mark} className="label-mono text-ink-soft flex items-center gap-2">
              <Check className="pb-accent size-3.5" strokeWidth={3} aria-hidden="true" />
              {mark}
            </li>
          ))}
        </ul>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
          <a
            href="#checkout"
            className="pb-fill inline-flex h-14 cursor-pointer items-center justify-center gap-2 rounded-full px-8 text-base font-bold transition-transform duration-200 ease-out hover:-translate-y-0.5"
          >
            {hero.cta}
            <ArrowRight className="size-4" aria-hidden="true" />
          </a>
          <p className="label-mono text-ink-soft sm:ml-1">{hero.ctaNote}</p>
        </div>
      </div>
    </header>
  );
}

/* ── 2. The problem ──────────────────────────────────────────────────────── */

export function PlaybookProblem() {
  return (
    <Band className="border-t border-[rgba(255,255,255,0.08)]" label="Why the usual message fails">
      <Eyebrow>{problem.eyebrow}</Eyebrow>
      <h2 className="font-display text-ink mt-5 type-h2 font-bold text-balance">
        {problem.headline}
      </h2>

      <figure className="pb-quote reveal mt-8 rounded-r-xl py-5 pr-5 pl-6">
        <blockquote className="text-ink-soft t-lead italic">
          “{problem.message}”
        </blockquote>
      </figure>

      <p className="text-ink measure mt-8 t-lead">{problem.lead}</p>

      <ol className="mt-8 grid gap-3 md:grid-cols-2">
        {problem.reasons.map((reason, index) => (
          <li
            key={reason.title}
            className="pb-panel reveal flex flex-col gap-2 p-6"
            style={{ animationDelay: `${index * 60}ms` }}
          >
            <span className="numeral pb-accent t-sm leading-none" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="font-display text-ink t-lead font-semibold">{reason.title}</h3>
            <p className="text-ink-soft t-sm leading-relaxed">{reason.copy}</p>
          </li>
        ))}
      </ol>

      <p className="text-ink measure mt-8 t-lead font-medium">{problem.close}</p>
    </Band>
  );
}

/* ── 3. What's inside ────────────────────────────────────────────────────── */

export function PlaybookInside() {
  return (
    <Band id="inside" label="What is inside the bundle">
      <Eyebrow>Nine files</Eyebrow>
      <h2 className="font-display text-ink mt-5 type-h2 font-bold text-balance">
        Everything you need to start sending on Monday
      </h2>

      <ul className="mt-10 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {assets.map((asset, index) => (
          <li
            key={asset.id}
            className="pb-panel reveal flex flex-col gap-3 p-6"
            style={{ animationDelay: `${Math.min(index, 5) * 50}ms` }}
          >
            <p className="label-mono pb-accent">{asset.format}</p>
            <h3 className="font-display text-ink t-lead font-bold">{asset.name}</h3>
            <p className="text-ink-soft t-sm leading-relaxed">{asset.what}</p>
            <p className="text-ink mt-auto border-t border-[rgba(255,255,255,0.08)] pt-3 t-sm">
              {asset.saves}
            </p>
          </li>
        ))}
      </ul>
    </Band>
  );
}

/* ── 4. Snapshots ────────────────────────────────────────────────────────── */

export function PlaybookSnapshots() {
  return (
    <Band className="border-t border-[rgba(255,255,255,0.08)]" label="Screenshots from inside the bundle">
      <Eyebrow>Look inside</Eyebrow>
      <h2 className="font-display text-ink mt-5 type-h2 font-bold text-balance">
        Real pages, not a promise of pages
      </h2>
      <p className="text-ink-soft measure mt-4 t-lead">
        Tap any screenshot to open it full size.
      </p>

      <ul className="mt-10 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {snapshots.map((shot, index) => (
          <li key={shot.id} className="reveal" style={{ animationDelay: `${Math.min(index, 5) * 50}ms` }}>
            {/* A plain link to the full-size file: opening larger works with no
                JavaScript at all, which a lightbox would not. */}
            <a
              href={`/playbook/snapshots/${shot.id}-1400.png`}
              target="_blank"
              rel="noopener noreferrer"
              className="pb-panel group block cursor-pointer overflow-hidden p-2 transition-colors duration-200 ease-out hover:border-[color:var(--accent-line)]"
            >
              <PlaybookImage
                kind="snapshots"
                id={shot.id}
                alt={shot.alt}
                sizes="(max-width: 639px) 92vw, (max-width: 1279px) 46vw, 30vw"
                className="rounded-lg"
              />
              <span className="text-ink-soft flex items-center justify-between gap-2 px-2 py-2.5 t-xs">
                {shot.caption}
                <ArrowUpRight
                  className="size-3.5 shrink-0 transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
                <span className="sr-only">(opens the full-size image)</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </Band>
  );
}

/* ── 5. Real replies ─────────────────────────────────────────────────────── */

export function PlaybookReplies() {
  return (
    <Band label="Replies to the outreach method">
      <Eyebrow>{repliesSection.eyebrow}</Eyebrow>
      <h2 className="font-display text-ink mt-5 type-h2 font-bold text-balance">
        {repliesSection.headline}
      </h2>

      <p className="text-ink-soft measure mt-5 t-lead">{repliesSection.disclaimer}</p>

      <ul className="mt-10 grid gap-3 grid-cols-2 xl:grid-cols-4">
        {replies.map((shot, index) => (
          <li
            key={shot.id}
            className="pb-panel reveal overflow-hidden p-2"
            style={{ animationDelay: `${Math.min(index, 4) * 50}ms` }}
          >
            <PlaybookImage
              kind="proofs"
              id={shot.id}
              alt={shot.alt}
              sizes="(max-width: 1279px) 46vw, 23vw"
              className="rounded-lg"
            />
            <p className="text-ink-soft px-2 py-2.5 t-xs">{shot.caption}</p>
          </li>
        ))}
      </ul>

      <p className="text-ink-soft mt-6 t-xs">{repliesSection.privacyNote}</p>
    </Band>
  );
}

/* ── 6. The five websites ────────────────────────────────────────────────── */

export function PlaybookWebsites() {
  return (
    <Band className="border-t border-[rgba(255,255,255,0.08)]" label="The five ready-made websites">
      <Eyebrow>{websitesSection.eyebrow}</Eyebrow>
      <h2 className="font-display text-ink mt-5 type-h2 font-bold text-balance">
        {websitesSection.headline}
      </h2>
      <p className="text-ink-soft measure mt-4 t-lead">{websitesSection.copy}</p>

      <ul className="mt-10 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {websites.map((site, index) => (
          <li
            key={site.id}
            className="pb-panel reveal flex flex-col overflow-hidden"
            style={{ animationDelay: `${Math.min(index, 5) * 50}ms` }}
          >
            <PlaybookImage
              kind="websites"
              id={site.id}
              alt={`The ${site.name.toLowerCase()} website template`}
              sizes="(max-width: 639px) 92vw, (max-width: 1279px) 46vw, 30vw"
            />
            <div className="flex flex-1 flex-col gap-2 p-5">
              <p className="label-mono text-ink-soft">{site.sector}</p>
              <h3 className="font-display text-ink t-lead font-bold">{site.name}</h3>
              <p className="text-ink-soft t-sm leading-relaxed">{site.blurb}</p>
              {site.demoUrl ? (
                <a
                  href={site.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pb-accent mt-2 inline-flex min-h-[44px] w-fit cursor-pointer items-center gap-1.5 t-sm font-medium underline-offset-4 hover:underline"
                >
                  View live demo
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              ) : null}
            </div>
          </li>
        ))}
      </ul>

      <p className="text-ink-soft mt-6 t-xs">{websitesSection.note}</p>
    </Band>
  );
}

/* ── 7. Who it is for ────────────────────────────────────────────────────── */

export function PlaybookFit() {
  return (
    <Band label="Who this is for">
      <Eyebrow>{fit.eyebrow}</Eyebrow>
      <h2 className="font-display text-ink mt-5 type-h2 font-bold text-balance">
        {fit.headline}
      </h2>

      <div className="mt-10 grid gap-3 md:grid-cols-2">
        <div className="pb-panel-lit reveal flex flex-col gap-4 p-6 md:p-8">
          <h3 className="font-display text-ink type-h3 font-bold">{fit.forYou.title}</h3>
          <ul className="flex flex-col gap-3">
            {fit.forYou.points.map((point) => (
              <li key={point} className="text-ink flex items-start gap-3 t-base">
                <Check className="pb-accent mt-1 size-4 shrink-0" strokeWidth={3} aria-hidden="true" />
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div className="pb-panel reveal flex flex-col gap-4 p-6 md:p-8">
          <h3 className="font-display text-ink type-h3 font-bold">{fit.notForYou.title}</h3>
          <ul className="flex flex-col gap-3">
            {fit.notForYou.points.map((point) => (
              <li key={point} className="text-ink-soft flex items-start gap-3 t-base">
                <Minus className="mt-1 size-4 shrink-0" strokeWidth={3} aria-hidden="true" />
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Band>
  );
}

/* ── 10. Footer ──────────────────────────────────────────────────────────── */

export function PlaybookFooter() {
  return (
    <footer className="border-t border-[rgba(255,255,255,0.08)] py-10">
      <div className="mx-auto flex w-full max-w-[72rem] flex-col gap-5 px-5 md:flex-row md:items-center md:justify-between md:px-8">
        <p className="text-ink-soft flex flex-wrap items-center gap-2 t-sm">
          <span>a product by</span>
          <Link
            href="/"
            className="text-ink font-display inline-flex min-h-[44px] cursor-pointer items-center font-bold underline-offset-4 hover:underline"
            style={{ letterSpacing: "0.02em" }}
          >
            OFFSCRIPT<span className="pb-accent">.</span>
          </Link>
        </p>

        <nav aria-label="Policies">
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-1">
            {[
              { label: "Terms", href: "/playbook/terms" },
              { label: "Refund policy", href: "/playbook/refund" },
              { label: "Privacy", href: "/playbook/privacy" },
            ].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-ink-soft hover:text-ink inline-flex min-h-[44px] cursor-pointer items-center t-sm underline-offset-4 transition-colors duration-200 ease-out hover:underline"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <p className="text-ink-soft mx-auto mt-4 w-full max-w-[72rem] px-5 t-xs md:px-8">
        © {new Date().getFullYear()} OFFSCRIPT · {product.priceLabel} one-time · Ahmedabad, India
      </p>
    </footer>
  );
}
