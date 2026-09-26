import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight, Check, Minus, X } from "lucide-react";
import {
  assets,
  fit,
  gallery,
  hero,
  library,
  modules,
  paperwork,
  plan,
  replies,
  repliesSection,
  research,
  rewrite,
  system,
  tracker,
  websites,
  websitesSection,
} from "@/config/playbook";
import { PlaybookImage, Shot } from "@/components/playbook/playbook-image";
import { cn } from "@/lib/utils";

/**
 * The sales page, section by section. Everything here is presentational — all
 * words live in src/config/playbook.ts.
 *
 * TWO RULES THE LAYOUT FOLLOWS
 *  1. The price appears once, at the very end. Every section before it has to
 *     earn the next scroll instead of leaning on a number.
 *  2. Reveals are the site's CSS-only `.reveal` (animation-timeline: view()),
 *     so every section ships visible and stays visible without JavaScript.
 */

export function Band({
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
    <section id={id} aria-label={label} className={cn("scroll-mt-16 py-16 md:py-24", className)}>
      <div className="mx-auto w-full max-w-[72rem] px-5 md:px-8">{children}</div>
    </section>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="label-mono pb-accent flex items-center gap-2.5">
      <span aria-hidden="true" className="inline-block h-px w-6 bg-[color:var(--accent)]" />
      {children}
    </p>
  );
}

function Heading({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={cn("font-display text-ink mt-5 type-h2 font-bold text-balance", className)}>
      {children}
    </h2>
  );
}

/* ── 1. Hero — no price anywhere near it ─────────────────────────────────── */

/**
 * A deck of real screenshots for the hero's second column. Decorative: every
 * one of these appears again further down with a proper caption and alt text,
 * so it is hidden from assistive tech rather than read out twice.
 */
function HeroDeck() {
  const cards = [
    { id: "contents", className: "left-0 top-0 w-[76%] -rotate-[4deg]" },
    { id: "pipeline", className: "right-0 top-[22%] w-[58%] rotate-[5deg]" },
    { id: "never-say", className: "left-[8%] bottom-0 w-[66%] rotate-[2deg]" },
  ];

  return (
    <div aria-hidden="true" className="relative -mt-2 aspect-[4/3.4] lg:mt-0 lg:aspect-[4/3.6]">
      {cards.map((card) => (
        <div
          key={card.id}
          className={cn(
            "pb-panel absolute overflow-hidden shadow-[0_24px_60px_-20px_rgba(0,0,0,0.8)]",
            card.className,
          )}
        >
          <PlaybookImage kind="snapshots" id={card.id} alt="" sizes="(max-width: 1023px) 70vw, 30vw" priority />
        </div>
      ))}

      {/* The reply, tucked in front — the page's whole promise in one corner. */}
      <div className="pb-panel-lit absolute right-[6%] bottom-[4%] w-[34%] overflow-hidden shadow-[0_24px_60px_-20px_rgba(0,0,0,0.85)]">
        <PlaybookImage kind="proofs" id="reply-3" alt="" sizes="(max-width: 1023px) 34vw, 16vw" priority />
      </div>
    </div>
  );
}

export function PlaybookHero() {
  return (
    <header className="pb-glow relative pt-12 pb-16 md:pt-20 md:pb-24">
      <div className="mx-auto grid w-full max-w-[72rem] gap-14 px-5 md:px-8 lg:grid-cols-[1.05fr_1fr] lg:items-center">
        <div>
          <Eyebrow>{hero.eyebrow}</Eyebrow>

          <h1 className="font-display text-ink mt-6 text-[clamp(2.5rem,9.5vw,4.5rem)] leading-[0.98] font-extrabold tracking-[-0.035em] text-balance">
            {hero.headline}
          </h1>

          <p className="text-ink mt-6 max-w-[30ch] text-[clamp(1.2rem,5vw,1.75rem)] leading-[1.15] font-semibold">
            {hero.sub}
          </p>

          <p className="text-ink-soft measure mt-6 t-lead leading-relaxed">{hero.body}</p>

          <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2">
            {hero.marks.map((mark) => (
              <li key={mark} className="label-mono text-ink-soft flex items-center gap-2">
                <Check className="pb-accent size-3.5" strokeWidth={3} aria-hidden="true" />
                {mark}
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="#inside"
              className="pb-fill inline-flex h-14 cursor-pointer items-center justify-center gap-2 rounded-full px-8 text-base font-bold transition-transform duration-200 ease-out hover:-translate-y-0.5"
            >
              {hero.primaryCta}
              <ArrowDown className="size-4" aria-hidden="true" />
            </a>
            <a
              href="#price"
              className="text-ink inline-flex h-14 cursor-pointer items-center justify-center gap-2 rounded-full border border-[rgba(255,255,255,0.18)] px-7 t-base font-medium transition-colors duration-200 ease-out hover:border-[color:var(--accent-line)]"
            >
              {hero.secondaryCta}
            </a>
          </div>
        </div>

        <HeroDeck />
      </div>
    </header>
  );
}

/* ── 2. The rewrite — the argument, in two messages ──────────────────────── */

function MessageCard({
  label,
  message,
  verdict,
  outcome,
  notes,
  tone,
}: {
  label: string;
  message: string;
  verdict: string;
  outcome: string;
  notes: readonly string[];
  tone: "bad" | "good";
}) {
  const good = tone === "good";
  return (
    <div className={cn("reveal flex flex-col", good ? "pb-panel-lit" : "pb-panel")}>
      <div className="flex items-center justify-between gap-3 border-b border-[rgba(255,255,255,0.08)] px-5 py-3">
        <span className="label-mono text-ink-soft">{label}</span>
        <span
          className={cn(
            "label-mono inline-flex items-center gap-1.5",
            good ? "pb-accent" : "text-ink-soft",
          )}
        >
          {good ? (
            <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />
          ) : (
            <X className="size-3.5" strokeWidth={3} aria-hidden="true" />
          )}
          {verdict}
        </span>
      </div>

      {/* The message and what came back, set as a thread the reader will
          recognise: sent on the right, the reply on the left. */}
      <div className="flex flex-col gap-4 px-5 py-6">
        <p
          className={cn(
            "ml-auto max-w-[92%] rounded-2xl rounded-br-md px-4 py-3 t-base leading-relaxed",
            good
              ? "bg-[color:var(--accent-wash)] text-ink border border-[color:var(--accent-line)]"
              : "bg-[var(--surface-2)] text-ink-soft",
          )}
        >
          {message}
        </p>

        {good ? (
          <p className="text-ink mr-auto max-w-[92%] rounded-2xl rounded-bl-md border border-[rgba(255,255,255,0.14)] bg-[var(--surface-2)] px-4 py-3 t-base leading-relaxed">
            {outcome}
          </p>
        ) : (
          <p className="text-ink-soft mr-auto flex max-w-[92%] items-center gap-3 t-sm leading-relaxed italic">
            <span aria-hidden="true" className="inline-block h-px w-8 bg-[rgba(255,255,255,0.2)]" />
            {outcome}
          </p>
        )}
      </div>

      <ul className="mt-auto flex flex-col gap-2.5 border-t border-[rgba(255,255,255,0.08)] px-5 py-5">
        {notes.map((note) => (
          <li key={note} className="text-ink-soft flex items-start gap-2.5 t-sm">
            <span
              aria-hidden="true"
              className={cn(
                "mt-[0.5em] inline-block size-1.5 shrink-0 rounded-full",
                good ? "bg-[color:var(--accent)]" : "bg-[rgba(255,255,255,0.25)]",
              )}
            />
            {note}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PlaybookRewrite() {
  return (
    <Band className="border-t border-[rgba(255,255,255,0.08)]" label="The message, rewritten">
      <Eyebrow>{rewrite.eyebrow}</Eyebrow>
      <Heading>{rewrite.headline}</Heading>

      <div className="mt-10 grid gap-3 lg:grid-cols-2">
        <MessageCard {...rewrite.before} tone="bad" />
        <MessageCard {...rewrite.after} tone="good" />
      </div>

      <p className="text-ink measure mt-8 t-lead font-medium">{rewrite.close}</p>
    </Band>
  );
}

/* ── 3. The system ───────────────────────────────────────────────────────── */

export function PlaybookSystem() {
  return (
    <Band label="How the system works">
      <Eyebrow>{system.eyebrow}</Eyebrow>
      <Heading>{system.headline}</Heading>

      <ol className="mt-10 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {system.steps.map((step, index) => (
          <li
            key={step.step}
            className="pb-panel reveal flex flex-col gap-3 p-6"
            style={{ animationDelay: `${index * 60}ms` }}
          >
            <span className="numeral pb-accent numeral-md leading-none" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <p className="label-mono text-ink-soft">{step.step}</p>
            <h3 className="font-display text-ink t-lead font-bold">{step.title}</h3>
            <p className="text-ink-soft t-sm leading-relaxed">{step.copy}</p>
            <p className="pb-accent mt-auto border-t border-[rgba(255,255,255,0.08)] pt-3 t-xs">
              {step.powered}
            </p>
          </li>
        ))}
      </ol>
    </Band>
  );
}

/* ── 4. What's inside ────────────────────────────────────────────────────── */

export function PlaybookInside() {
  return (
    <Band id="inside" className="border-t border-[rgba(255,255,255,0.08)]" label="What is inside">
      <Eyebrow>Nine files</Eyebrow>
      <Heading>Everything you need to start sending on Monday</Heading>

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

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <Shot
          id="bundle-files"
          alt="The bundle folder showing every included file"
          caption="Everything arrives in one folder"
          sizes="(max-width: 767px) 92vw, 46vw"
        />
        <Shot
          id="module-files"
          alt="The ten module files listed in a folder"
          caption="Ten modules, ten files"
          sizes="(max-width: 767px) 92vw, 46vw"
        />
      </div>
    </Band>
  );
}

/* ── 5. The ten modules ──────────────────────────────────────────────────── */

export function PlaybookModules() {
  return (
    <Band label="The ten modules">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start lg:gap-14">
        <div className="lg:sticky lg:top-12">
          <Eyebrow>87 pages, ten modules</Eyebrow>
          <Heading>Ten modules, in the order you will use them</Heading>
          <p className="text-ink-soft mt-5 t-lead leading-relaxed">
            The first two decide what you sell. The rest are channels: read one, run it for a
            week, then decide whether to keep it. Start with the one you are least afraid of.
          </p>
          <Shot
            id="contents"
            alt="Contents page of the playbook listing all ten modules with page numbers"
            caption="The contents page"
            sizes="(max-width: 1023px) 92vw, 40vw"
            className="mt-8"
          />
        </div>

        <ol className="flex flex-col">
          {modules.map((module, index) => (
            <li
              key={module.n}
              className="reveal flex gap-5 border-b border-[rgba(255,255,255,0.08)] py-5 first:border-t"
              style={{ animationDelay: `${Math.min(index, 6) * 40}ms` }}
            >
              <span className="numeral pb-accent shrink-0 t-lead leading-tight" aria-hidden="true">
                {module.n}
              </span>
              <div className="flex flex-col gap-1">
                <h3 className="font-display text-ink t-lead font-semibold">{module.title}</h3>
                <p className="text-ink-soft t-sm leading-relaxed">{module.copy}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Band>
  );
}

/* ── 6. The tracker ──────────────────────────────────────────────────────── */

export function PlaybookTracker() {
  return (
    <Band className="border-t border-[rgba(255,255,255,0.08)]" label="The lead tracker">
      <Eyebrow>{tracker.eyebrow}</Eyebrow>
      <Heading>{tracker.headline}</Heading>
      <p className="text-ink-soft measure mt-5 t-lead leading-relaxed">{tracker.copy}</p>

      <p className="label-mono text-ink-soft mt-8 flex items-center gap-2 md:hidden">
        Swipe the table
        <ArrowRight className="size-3.5" aria-hidden="true" />
      </p>

      {/* The sheet, rebuilt in HTML rather than shown as a picture: it reads at
          any width, and on a phone it scrolls like the real thing. tabIndex
          makes that scroll reachable from a keyboard, which overflow alone is
          not. */}
      <div
        className="pb-panel reveal mt-3 overflow-x-auto md:mt-10"
        tabIndex={0}
        role="region"
        aria-label="Lead tracker, example rows"
      >
        <table className="w-full min-w-[46rem] border-collapse text-left">
          <thead>
            <tr className="border-b border-[rgba(255,255,255,0.12)]">
              {tracker.columns.map((column) => (
                <th key={column} className="label-mono text-ink-soft px-4 py-3 font-normal">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tracker.rows.map((row) => (
              <tr key={row[0]} className="border-b border-[rgba(255,255,255,0.06)] last:border-0">
                {row.map((cell, index) => (
                  <td
                    key={`${row[0]}-${index}`}
                    className={cn(
                      "px-4 py-3.5 t-sm",
                      index === 0 && "text-ink font-medium",
                      index === 3 && "pb-accent numeral",
                      index === 2 && "numeral text-ink",
                      index > 3 && "text-ink-soft",
                      index === 1 && "text-ink-soft",
                    )}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-[1fr_1fr]">
        <ul className="pb-panel flex flex-col gap-3 p-6">
          {tracker.features.map((feature) => (
            <li key={feature} className="text-ink flex items-start gap-3 t-sm">
              <Check className="pb-accent mt-0.5 size-4 shrink-0" strokeWidth={3} aria-hidden="true" />
              {feature}
            </li>
          ))}
        </ul>
        <Shot
          id="pipeline"
          alt="The tracker pipeline dashboard with counts by stage and conversion rates"
          caption="The pipeline dashboard, from the real file"
          sizes="(max-width: 1023px) 92vw, 46vw"
        />
      </div>
    </Band>
  );
}

/* ── 7. Scripts and prompts ──────────────────────────────────────────────── */

export function PlaybookLibrary() {
  return (
    <Band label="Scripts and prompts">
      <Eyebrow>{library.eyebrow}</Eyebrow>
      <Heading>{library.headline}</Heading>

      <div className="mt-10 grid items-start gap-3 lg:grid-cols-2">
        <div className="pb-panel reveal flex flex-col gap-5 p-6 md:p-8">
          <h3 className="font-display text-ink type-h3 font-bold">{library.scripts.title}</h3>
          <ul className="flex flex-col gap-4">
            {library.scripts.groups.map((group) => (
              <li key={group.title} className="border-l-2 border-[color:var(--accent-line)] pl-4">
                <p className="text-ink t-base font-semibold">{group.title}</p>
                <p className="text-ink-soft t-sm leading-relaxed">{group.copy}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="pb-panel reveal flex flex-col gap-5 p-6 md:p-8">
          <h3 className="font-display text-ink type-h3 font-bold">{library.prompts.title}</h3>
          <ul className="flex flex-col gap-4">
            {library.prompts.groups.map((group) => (
              <li key={group.title} className="border-l-2 border-[color:var(--accent-line)] pl-4">
                <p className="text-ink t-base font-semibold">{group.title}</p>
                <p className="text-ink-soft t-sm leading-relaxed">{group.copy}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-3">
        <Shot
          id="swipe-file"
          alt="The swipe file explaining placeholders and the rules every script follows"
          caption="How the swipe file works"
        />
        <Shot
          id="never-say"
          alt="A table of things never to say, what to say instead, and why"
          caption="What never to say"
        />
        <Shot
          id="prompt-pack"
          alt="The AI prompt pack explaining the master context"
          caption="The prompt pack"
        />
      </div>
    </Band>
  );
}

/* ── 8. The 30-day plan ──────────────────────────────────────────────────── */

export function PlaybookPlan() {
  return (
    <Band className="border-t border-[rgba(255,255,255,0.08)]" label="The 30-day plan">
      <Eyebrow>{plan.eyebrow}</Eyebrow>
      <Heading>{plan.headline}</Heading>
      <p className="text-ink-soft measure mt-5 t-lead">{plan.copy}</p>

      <ol className="mt-10 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {plan.weeks.map((week, index) => (
          <li
            key={week.label}
            className="pb-panel reveal relative flex flex-col gap-2 p-6"
            style={{ animationDelay: `${index * 60}ms` }}
          >
            <span aria-hidden="true" className="absolute inset-x-6 top-0 h-px bg-[color:var(--accent)]" style={{ opacity: 1 - index * 0.22 }} />
            <p className="label-mono pb-accent">{week.label}</p>
            <h3 className="font-display text-ink t-lead font-bold">{week.title}</h3>
            <p className="text-ink-soft t-sm leading-relaxed">{week.copy}</p>
          </li>
        ))}
      </ol>

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <Shot
          id="plan"
          alt="The 30-day launch plan, with tracks to choose from before day one"
          caption="Pick a track, then start"
          sizes="(max-width: 767px) 92vw, 46vw"
        />
        <Shot
          id="plan-week"
          alt="Week one of the launch plan, broken into timed daily tasks"
          caption="Week one, with the hours it takes"
          sizes="(max-width: 767px) 92vw, 46vw"
        />
      </div>
    </Band>
  );
}

/* ── 9. Research pack and scraper ────────────────────────────────────────── */

export function PlaybookResearch() {
  return (
    <Band label="Niche research and lead sourcing">
      <Eyebrow>{research.eyebrow}</Eyebrow>
      <Heading>{research.headline}</Heading>

      <div className="mt-10 grid gap-3 lg:grid-cols-2">
        <div className="pb-panel-lit reveal flex flex-col gap-4 p-6 md:p-8">
          <h3 className="font-display text-ink type-h3 font-bold">{research.niches.title}</h3>
          <p className="text-ink-soft t-base leading-relaxed">{research.niches.copy}</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {research.niches.fields.map((field) => (
              <li
                key={field}
                className="label-mono text-ink rounded-full border border-[color:var(--accent-line)] px-3 py-1.5"
              >
                {field}
              </li>
            ))}
          </ul>
        </div>

        <div className="pb-panel reveal flex flex-col gap-4 p-6 md:p-8">
          <h3 className="font-display text-ink type-h3 font-bold">{research.scraper.title}</h3>
          <p className="text-ink-soft t-base leading-relaxed">{research.scraper.copy}</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {research.scraper.points.map((point) => (
              <li
                key={point}
                className="label-mono text-ink-soft rounded-full border border-[rgba(255,255,255,0.16)] px-3 py-1.5"
              >
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <Shot
          id="regulated"
          alt="A table of regulated professions and what their advertising rules allow"
          caption="Regulated niches, and what you may say"
          sizes="(max-width: 767px) 92vw, 46vw"
        />
        <Shot
          id="scorecard"
          alt="The lead scorecard: criteria, points and how to score each one"
          caption="How a lead is scored"
          sizes="(max-width: 767px) 92vw, 46vw"
        />
      </div>
    </Band>
  );
}

/* ── 10. Paperwork ───────────────────────────────────────────────────────── */

export function PlaybookPaperwork() {
  return (
    <Band className="border-t border-[rgba(255,255,255,0.08)]" label="Paperwork">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-14">
        <div>
          <Eyebrow>{paperwork.eyebrow}</Eyebrow>
          <Heading>{paperwork.headline}</Heading>
          <p className="text-ink-soft mt-5 t-lead leading-relaxed">{paperwork.copy}</p>

          <ul className="mt-8 flex flex-col gap-4">
            {paperwork.docs.map((doc) => (
              <li key={doc.title} className="reveal flex gap-4 border-t border-[rgba(255,255,255,0.08)] pt-4">
                <Check className="pb-accent mt-1 size-4 shrink-0" strokeWidth={3} aria-hidden="true" />
                <div>
                  <p className="text-ink t-base font-semibold">{doc.title}</p>
                  <p className="text-ink-soft t-sm leading-relaxed">{doc.copy}</p>
                </div>
              </li>
            ))}
          </ul>

          <p className="text-ink-soft mt-6 t-xs">{paperwork.note}</p>
        </div>

        <Shot
          id="invoice"
          alt="The GST tax invoice template"
          caption="The GST invoice template"
          sizes="(max-width: 1023px) 92vw, 44vw"
        />
      </div>
    </Band>
  );
}

/* ── 11. The five websites ───────────────────────────────────────────────── */

export function PlaybookWebsites() {
  return (
    <Band label="The ready-made websites">
      <Eyebrow>{websitesSection.eyebrow}</Eyebrow>
      <Heading>{websitesSection.headline}</Heading>
      <p className="text-ink-soft measure mt-5 t-lead leading-relaxed">{websitesSection.copy}</p>

      <div className="reveal mt-10 overflow-hidden rounded-2xl border border-[color:var(--accent-line)]">
        <PlaybookImage
          kind="snapshots"
          id="site-cafe"
          alt="One of the included café website templates, shown in a browser"
          sizes="(max-width: 1279px) 92vw, 68rem"
        />
      </div>

      <ul className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {websites.map((site, index) => (
          <li
            key={site.id}
            className="pb-panel reveal flex flex-col gap-3 p-6"
            style={{ animationDelay: `${Math.min(index, 5) * 50}ms` }}
          >
            <p className="label-mono pb-accent">{site.sector}</p>
            <h3 className="font-display text-ink t-lead font-bold">{site.name}</h3>
            <p className="text-ink-soft t-sm leading-relaxed">{site.blurb}</p>
            <ul className="mt-1 flex flex-wrap gap-1.5">
              {site.includes.map((item) => (
                <li
                  key={item}
                  className="label-mono text-ink-soft rounded-full border border-[rgba(255,255,255,0.14)] px-2.5 py-1"
                >
                  {item}
                </li>
              ))}
            </ul>
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
          </li>
        ))}
      </ul>

      <p className="text-ink-soft mt-6 t-xs">{websitesSection.note}</p>
    </Band>
  );
}

/* ── 12. Gallery ─────────────────────────────────────────────────────────── */

export function PlaybookGallery() {
  return (
    <Band className="border-t border-[rgba(255,255,255,0.08)]" label="Screenshots from inside the bundle">
      <Eyebrow>Look inside</Eyebrow>
      <Heading>Real pages, not a promise of pages</Heading>
      <p className="text-ink-soft measure mt-4 t-lead">Tap any screenshot to open it full size.</p>

      <ul className="mt-10 grid items-start gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {gallery.map((shot, index) => (
          <li key={shot.id} className="reveal" style={{ animationDelay: `${Math.min(index, 5) * 40}ms` }}>
            <Shot id={shot.id} alt={shot.alt} caption={shot.caption} />
          </li>
        ))}
      </ul>
    </Band>
  );
}

/* ── 13. Replies ─────────────────────────────────────────────────────────── */

export function PlaybookReplies() {
  return (
    <Band label="Replies to the outreach">
      <Eyebrow>{repliesSection.eyebrow}</Eyebrow>
      <Heading>{repliesSection.headline}</Heading>
      <p className="text-ink-soft measure mt-5 t-lead">{repliesSection.disclaimer}</p>

      <ul className="mt-10 grid grid-cols-2 gap-3 xl:grid-cols-4">
        {replies.map((shot, index) => (
          <li key={shot.id} className="reveal h-full" style={{ animationDelay: `${Math.min(index, 4) * 50}ms` }}>
            <Shot
              className="h-full"
              kind="proofs"
              id={shot.id}
              alt={shot.alt}
              caption={shot.caption}
              sizes="(max-width: 1279px) 46vw, 23vw"
            />
          </li>
        ))}
      </ul>

      <p className="text-ink-soft mt-6 t-xs">{repliesSection.privacyNote}</p>
    </Band>
  );
}

/* ── 14. Fit ─────────────────────────────────────────────────────────────── */

export function PlaybookFit() {
  return (
    <Band className="border-t border-[rgba(255,255,255,0.08)]" label="Who this is for">
      <Eyebrow>{fit.eyebrow}</Eyebrow>
      <Heading>{fit.headline}</Heading>

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

/* ── Footer ──────────────────────────────────────────────────────────────── */

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
        © {new Date().getFullYear()} OFFSCRIPT · Ahmedabad, India
      </p>
    </footer>
  );
}
