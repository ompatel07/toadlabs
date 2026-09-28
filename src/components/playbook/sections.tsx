import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight, Check, Minus, ShieldCheck, X } from "lucide-react";
import {
  assets,
  fit,
  guarantee,
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
 * THREE RULES THE LAYOUT FOLLOWS
 *  1. The price appears once, at the very end. Every section before it has to
 *     earn the next scroll instead of leaning on a number.
 *  2. Nothing is shown twice. An earlier draft ran a fourteen-image gallery of
 *     screenshots the page had already used in context, which is what made it
 *     long without making it convincing. Each screenshot now appears exactly
 *     once, beside the thing it proves.
 *  3. Reveals are the site's CSS-only `.reveal` (animation-timeline: view()),
 *     so every section ships visible and stays visible without JavaScript.
 */

export function Band({
  children,
  className,
  id,
  label,
  chapter,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
  label?: string;
  /** Sets the ghost numeral behind the band, so sections read as chapters. */
  chapter?: string;
}) {
  return (
    <section
      id={id}
      aria-label={label}
      className={cn("relative scroll-mt-16 py-14 md:py-20", className)}
    >
      <div
        className={cn("mx-auto w-full max-w-[72rem] px-5 md:px-8", chapter && "pb-chapter")}
        data-chapter={chapter}
      >
        {children}
      </div>
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
    <h2 className={cn("pb-display text-ink mt-4 text-[clamp(1.9rem,5.2vw,3.25rem)]", className)}>
      {children}
    </h2>
  );
}

/* ── 1. Hero ─────────────────────────────────────────────────────────────── */

/**
 * A deck of real screenshots for the hero's second column. Decorative: every
 * one appears again further down with a proper caption and alt text, so it is
 * hidden from assistive tech rather than read out twice.
 *
 * The tilt is a custom property because the float animation composes with it —
 * a Tailwind `rotate-*` class would be overwritten on the animation's first
 * frame.
 */
function HeroDeck() {
  const cards = [
    { id: "contents", tilt: "-4deg", className: "left-0 top-0 w-[76%]" },
    { id: "pipeline", tilt: "5deg", className: "right-0 top-[22%] w-[58%]" },
    { id: "never-say", tilt: "2deg", className: "left-[8%] bottom-0 w-[66%]" },
  ];

  return (
    <div aria-hidden="true" className="relative -mt-2 aspect-[4/3.4] lg:mt-0 lg:aspect-[4/3.6]">
      {cards.map((card, index) => (
        <div
          key={card.id}
          className={cn(
            "pb-panel pb-float absolute overflow-hidden shadow-[0_24px_60px_-20px_rgba(0,0,0,0.8)]",
            card.className,
          )}
          style={
            {
              "--tilt": card.tilt,
              animationDuration: `${7 + index * 1.4}s`,
              animationDelay: `${index * -2.2}s`,
            } as React.CSSProperties
          }
        >
          <PlaybookImage
            kind="snapshots"
            id={card.id}
            alt=""
            sizes="(max-width: 1023px) 70vw, 30vw"
            priority
          />
        </div>
      ))}

      {/* The reply, tucked in front — the page's whole promise in one corner. */}
      <div
        className="pb-panel-lit pb-float absolute right-[6%] bottom-[4%] w-[34%] overflow-hidden shadow-[0_24px_60px_-20px_rgba(0,0,0,0.85)]"
        style={{ "--tilt": "-3deg", animationDuration: "9.5s", animationDelay: "-5s" } as React.CSSProperties}
      >
        <PlaybookImage kind="proofs" id="reply-3" alt="" sizes="(max-width: 1023px) 34vw, 16vw" priority />
      </div>
    </div>
  );
}

export function PlaybookHero() {
  return (
    <header className="pb-field relative pt-10 pb-12 md:pt-14 md:pb-16">
      <div className="mx-auto w-full max-w-[72rem] px-5 md:px-8">
        <Eyebrow>{hero.eyebrow}</Eyebrow>

        {/* Full width, not trapped in a column: the type is the hero image. */}
        <h1 className="pb-display text-ink mt-6 text-[clamp(3rem,12.5vw,9rem)]">
          <span className="block">{hero.headline[0]}</span>
          <span className="pb-outline pb-outline-accent block">{hero.headline[1]}</span>
        </h1>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-14">
          <div>
            <p className="text-ink max-w-[26ch] text-[clamp(1.25rem,5vw,1.75rem)] leading-[1.2] font-semibold">
              The problem isn&apos;t your skill.{" "}
              <span className="pb-mark">It&apos;s your first message.</span>
            </p>

            <p className="text-ink-soft measure mt-5 t-lead leading-relaxed">{hero.body}</p>

            <p className="pb-sticker text-ink mt-7 px-4 py-2.5 t-sm font-bold">
              <ShieldCheck className="pb-accent size-4 shrink-0" strokeWidth={2.4} aria-hidden="true" />
              {guarantee.short}
            </p>

            <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2">
              {hero.marks.map((mark) => (
                <li key={mark} className="label-mono text-ink-soft flex items-center gap-2">
                  <Check className="pb-accent size-3.5" strokeWidth={3} aria-hidden="true" />
                  {mark}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
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
      </div>
    </header>
  );
}

/* ── 2. Ticker ───────────────────────────────────────────────────────────── */

/** The bundle at a glance, on a loop. Pauses on hover via .marquee-viewport. */
export function PlaybookTicker() {
  const lane = [...hero.ticker, ...hero.ticker];

  return (
    <div
      aria-hidden="true"
      className="marquee-viewport marquee-edge overflow-hidden border-y border-[rgba(255,255,255,0.08)] py-4"
    >
      <div className="animate-marquee flex w-max items-center gap-8">
        {lane.map((item, index) => (
          <span key={`${item}-${index}`} className="label-mono text-ink-soft flex items-center gap-8">
            {item}
            <span aria-hidden="true" className="pb-accent">
              ●
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── 3. The rewrite — the argument, in two messages ──────────────────────── */

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
    <Band label="The message, rewritten" chapter="01">
      <Eyebrow>{rewrite.eyebrow}</Eyebrow>
      <Heading>{rewrite.headline}</Heading>

      <div className="mt-8 grid gap-3 lg:grid-cols-2">
        <MessageCard {...rewrite.before} tone="bad" />
        <MessageCard {...rewrite.after} tone="good" />
      </div>

      <p className="text-ink measure mt-7 t-lead font-medium">{rewrite.close}</p>
    </Band>
  );
}

/* ── 4. The system ───────────────────────────────────────────────────────── */

export function PlaybookSystem() {
  return (
    <Band className="border-t border-[rgba(255,255,255,0.08)]" label="How the system works" chapter="02">
      <Eyebrow>{system.eyebrow}</Eyebrow>
      <Heading>{system.headline}</Heading>

      <ol className="mt-8 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {system.steps.map((step, index) => (
          <li
            key={step.step}
            className="pb-panel pb-lift reveal flex flex-col gap-3 p-6"
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

/* ── 5. What's inside, and the ten modules ───────────────────────────────── */

export function PlaybookInside() {
  return (
    <Band id="inside" className="border-t border-[rgba(255,255,255,0.08)]" label="What is inside" chapter="03">
      <Eyebrow>Nine files</Eyebrow>
      <Heading>Everything you need to start sending on Monday</Heading>

      <ul className="mt-8 grid gap-0 md:grid-cols-2 md:gap-3 xl:grid-cols-3">
        {assets.map((asset, index) => (
          <li
            key={asset.id}
            className="pb-file reveal flex flex-col gap-1.5 py-4 md:gap-3 md:p-6"
            style={{ animationDelay: `${Math.min(index, 5) * 50}ms` }}
          >
            <p className="label-mono pb-accent">{asset.format}</p>
            <h3 className="font-display text-ink t-lead font-bold">{asset.name}</h3>
            <p className="text-ink-soft t-sm leading-relaxed">{asset.what}</p>
          </li>
        ))}
      </ul>

      {/* The modules run on from here rather than opening a band of their own:
          they are the contents of the first file in the grid above. */}
      <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start lg:gap-14">
        <div className="lg:sticky lg:top-12">
          <Eyebrow>87 pages, ten modules</Eyebrow>
          <Heading className="type-h3">Ten modules, in the order you will use them</Heading>
          <p className="text-ink-soft mt-4 t-base leading-relaxed">
            The first two decide what you sell. The rest are channels: read one, run it for a
            week, then decide whether to keep it. Start with the one you are least afraid of.
          </p>
          <Shot
            id="contents"
            alt="Contents page of the playbook listing all ten modules with page numbers"
            caption="The contents page"
            sizes="(max-width: 1023px) 92vw, 40vw"
            className="mt-6"
          />
        </div>

        <ol className="flex flex-col">
          {modules.map((module, index) => (
            <li
              key={module.n}
              className="reveal flex gap-4 border-b border-[rgba(255,255,255,0.08)] py-3 first:border-t"
              style={{ animationDelay: `${Math.min(index, 6) * 40}ms` }}
            >
              <span className="numeral pb-accent shrink-0 t-lead leading-tight" aria-hidden="true">
                {module.n}
              </span>
              <div className="flex flex-col gap-1">
                <h3 className="font-display text-ink t-base font-semibold">{module.title}</h3>
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
    <Band className="border-t border-[rgba(255,255,255,0.08)]" label="The lead tracker" chapter="04">
      <Eyebrow>{tracker.eyebrow}</Eyebrow>
      <Heading>{tracker.headline}</Heading>
      <p className="text-ink-soft measure mt-4 t-lead leading-relaxed">{tracker.copy}</p>

      <p className="label-mono text-ink-soft mt-7 flex items-center gap-2 md:hidden">
        Swipe the table
        <ArrowRight className="size-3.5" aria-hidden="true" />
      </p>

      {/* The sheet, rebuilt in HTML rather than shown as a picture: it reads at
          any width, and on a phone it scrolls like the real thing. tabIndex
          makes that scroll reachable from a keyboard, which overflow alone is
          not. */}
      <div
        className="pb-panel reveal mt-3 overflow-x-auto md:mt-8"
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

      <div className="mt-3 grid gap-3 lg:grid-cols-2">
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

function GroupChips({
  title,
  groups,
  lit,
}: {
  title: string;
  groups: readonly { title: string; copy: string }[];
  lit?: boolean;
}) {
  return (
    <div className={cn("reveal flex flex-col gap-4 p-6 md:p-8", lit ? "pb-panel-lit" : "pb-panel")}>
      <h3 className="font-display text-ink type-h3 font-bold">{title}</h3>
      <ul className="flex flex-col">
        {groups.map((group) => (
          <li
            key={group.title}
            className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5 border-b border-[rgba(255,255,255,0.08)] py-2.5 last:border-0"
          >
            <span className="text-ink t-base font-semibold">{group.title}</span>
            <span className="text-ink-soft t-sm">{group.copy}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PlaybookLibrary() {
  return (
    <Band className="border-t border-[rgba(255,255,255,0.08)]" label="Scripts and prompts" chapter="05">
      <Eyebrow>{library.eyebrow}</Eyebrow>
      <Heading>{library.headline}</Heading>

      <div className="mt-8 grid items-start gap-3 lg:grid-cols-[1.15fr_1fr]">
        <GroupChips title={library.scripts.title} groups={library.scripts.groups} lit />
        <div className="flex flex-col gap-3">
          <GroupChips title={library.prompts.title} groups={library.prompts.groups} />
          <Shot
            id="swipe-file"
            alt="The swipe file explaining placeholders and the rules every script follows"
            caption="How the swipe file works"
            sizes="(max-width: 1023px) 92vw, 42vw"
          />
        </div>
      </div>
    </Band>
  );
}

/* ── 8. The 30-day plan ──────────────────────────────────────────────────── */

export function PlaybookPlan() {
  return (
    <Band className="pb-paper" label="The 30-day plan" chapter="06">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-14">
        <div>
          <Eyebrow>{plan.eyebrow}</Eyebrow>
          <Heading>{plan.headline}</Heading>
          <p className="text-ink-soft mt-4 t-lead">{plan.copy}</p>

          <ol className="mt-8 grid gap-3 sm:grid-cols-2">
            {plan.weeks.map((week, index) => (
              <li
                key={week.label}
                className="pb-panel pb-lift reveal relative flex flex-col gap-2 p-5"
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-x-5 top-0 h-px bg-[color:var(--accent)]"
                  style={{ opacity: 1 - index * 0.22 }}
                />
                <p className="label-mono pb-accent">{week.label}</p>
                <h3 className="font-display text-ink t-base font-bold">{week.title}</h3>
                <p className="text-ink-soft t-sm leading-relaxed">{week.copy}</p>
              </li>
            ))}
          </ol>
        </div>

        <Shot
          id="plan-week"
          alt="Week one of the launch plan, broken into timed daily tasks"
          caption="Week one, with the hours each day takes"
          sizes="(max-width: 1023px) 92vw, 44vw"
        />
      </div>
    </Band>
  );
}

/* ── 9. Research and paperwork — the two ends of the job ─────────────────── */

export function PlaybookResearch() {
  return (
    <Band className="border-t border-[rgba(255,255,255,0.08)]" label="Research and paperwork" chapter="07">
      <Eyebrow>{research.eyebrow}</Eyebrow>
      <Heading>Know who you are writing to, and what to send when they say yes</Heading>

      <div className="mt-8 grid gap-3 lg:grid-cols-2">
        <div className="pb-panel-lit reveal flex flex-col gap-4 p-6 md:p-8">
          <h3 className="font-display text-ink type-h3 font-bold">{research.niches.title}</h3>
          <p className="text-ink-soft t-base leading-relaxed">{research.niches.copy}</p>
          <ul className="mt-1 flex flex-wrap gap-2">
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
          <ul className="mt-1 flex flex-wrap gap-2">
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

      <Shot
        id="regulated"
        alt="A table of regulated professions and what their advertising rules allow"
        caption="Regulated niches, and exactly what you may say to them"
        sizes="(max-width: 1279px) 92vw, 68rem"
        className="mt-3"
      />

      {/* Paperwork rides along here rather than taking a band of its own. */}
      <div className="mt-14 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-14">
        <div>
          <Eyebrow>{paperwork.eyebrow}</Eyebrow>
          <Heading className="type-h3">{paperwork.headline}</Heading>
          <p className="text-ink-soft mt-4 t-base leading-relaxed">{paperwork.copy}</p>

          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {paperwork.docs.map((doc) => (
              <li key={doc.title} className="reveal flex gap-3 border-t border-[rgba(255,255,255,0.08)] pt-3">
                <Check className="pb-accent mt-1 size-4 shrink-0" strokeWidth={3} aria-hidden="true" />
                <div>
                  <p className="text-ink t-base font-semibold">{doc.title}</p>
                  <p className="text-ink-soft t-sm leading-relaxed">{doc.copy}</p>
                </div>
              </li>
            ))}
          </ul>

          <p className="text-ink-soft mt-5 t-xs">{paperwork.note}</p>
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

/* ── 10. The five websites ───────────────────────────────────────────────── */

export function PlaybookWebsites() {
  return (
    <Band className="border-t border-[rgba(255,255,255,0.08)]" label="The ready-made websites" chapter="08">
      <Eyebrow>{websitesSection.eyebrow}</Eyebrow>
      <Heading>{websitesSection.headline}</Heading>
      <p className="text-ink-soft measure mt-4 t-lead leading-relaxed">{websitesSection.copy}</p>

      <div className="reveal mt-8 overflow-hidden rounded-2xl border border-[color:var(--accent-line)]">
        <PlaybookImage
          kind="snapshots"
          id="site-cafe"
          alt="One of the included café and restaurant website templates"
          sizes="(max-width: 1279px) 92vw, 68rem"
        />
      </div>

      <ul className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {websites.map((site, index) => (
          <li
            key={site.id}
            className="pb-panel pb-lift reveal flex flex-col gap-3 p-6"
            style={{ animationDelay: `${Math.min(index, 5) * 50}ms` }}
          >
            <p className="label-mono pb-accent">{site.sector}</p>
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
          </li>
        ))}
      </ul>

      <p className="text-ink-soft mt-5 t-xs">{websitesSection.note}</p>
    </Band>
  );
}

/* ── 11. Replies ─────────────────────────────────────────────────────────── */

export function PlaybookReplies() {
  return (
    <Band className="pb-field border-t border-[rgba(255,255,255,0.08)]" label="Replies to the outreach" chapter="09">
      <Eyebrow>{repliesSection.eyebrow}</Eyebrow>
      <Heading>{repliesSection.headline}</Heading>
      <p className="text-ink-soft measure mt-4 t-lead">{repliesSection.disclaimer}</p>

      <ul className="mt-8 grid grid-cols-2 gap-3 xl:grid-cols-4">
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

      <p className="text-ink-soft mt-5 t-xs">{repliesSection.privacyNote}</p>
    </Band>
  );
}

/* ── 12. Fit ─────────────────────────────────────────────────────────────── */

export function PlaybookFit() {
  return (
    <Band className="pb-paper" label="Who this is for" chapter="10">
      <Eyebrow>{fit.eyebrow}</Eyebrow>
      <Heading>{fit.headline}</Heading>

      <div className="mt-8 grid gap-3 md:grid-cols-2">
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
