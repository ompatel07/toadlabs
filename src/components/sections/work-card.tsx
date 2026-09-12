import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { CaseStudy } from "@/config/work";
import { tones, accentAt } from "@/lib/tones";
import { cn } from "@/lib/utils";

/** Shared between the home preview and the /work index. */
export function WorkCard({ study, index = 0 }: { study: CaseStudy; index?: number }) {
  const tone = tones[accentAt(index, [1])];

  return (
    <Link
      href={`/work/${study.slug}`}
      className={cn(
        "group relative flex h-full cursor-pointer flex-col gap-4 overflow-hidden rounded-2xl border p-7 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-ink",
        tone.bg,
        tone.text,
        tone.border,
        tone.dark && "on-dark",
      )}
    >
      <span
        className="numeral pointer-events-none absolute -right-2 -bottom-7 numeral-lg opacity-10"
        aria-hidden="true"
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className="relative flex items-start justify-between gap-3">
        <span className="label-mono opacity-70">{study.sector}</span>
        {study.isPlaceholder ? (
          // Required on every card while placeholder work is live.
          <span className="label-mono border-ink/30 shrink-0 rounded-full border px-2.5 py-1">
            Placeholder
          </span>
        ) : null}
      </div>

      <h3 className="font-display relative flex items-start gap-1.5 t-h4 font-bold">
        <span>{study.title}</span>
        <ArrowUpRight
          className="mt-1 size-4 shrink-0 transition-transform duration-300 ease-out group-hover:translate-x-1 group-hover:-translate-y-1"
          aria-hidden="true"
        />
      </h3>

      <p className={cn("relative t-base", tone.muted)}>
        {study.summary}
      </p>

      <ul className="relative mt-auto flex flex-wrap gap-1.5 pt-2">
        {study.tags.map((tag) => (
          <li
            key={tag}
            className={cn("label-mono rounded-full px-2.5 py-1", tone.chip)}
          >
            {tag}
          </li>
        ))}
      </ul>
    </Link>
  );
}
