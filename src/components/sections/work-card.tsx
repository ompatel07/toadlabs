import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { CaseStudy } from "@/config/work";

/** Shared between the home preview and the /work index. */
export function WorkCard({ study }: { study: CaseStudy }) {
  return (
    <Link
      href={`/work/${study.slug}`}
      className="card-solid lift group flex h-full cursor-pointer flex-col gap-4 p-7"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="label-mono text-ink-soft">{study.sector}</span>
        {study.isPlaceholder ? (
          // Required on every card for as long as placeholder work is live.
          <span className="label-mono text-ink shrink-0 rounded-full border border-[rgba(11,12,10,0.2)] px-2.5 py-1">
            Placeholder
          </span>
        ) : null}
      </div>

      <h3 className="font-display text-ink flex items-start gap-1.5 text-[1.0625rem] font-semibold tracking-[-0.02em]">
        <span>{study.title}</span>
        <ArrowUpRight
          className="text-ink-soft mt-1 size-4 shrink-0 transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          aria-hidden="true"
        />
      </h3>

      <p className="text-ink-soft text-[0.9375rem]">{study.summary}</p>

      <ul className="mt-auto flex flex-wrap gap-1.5 pt-2">
        {study.tags.map((tag) => (
          <li
            key={tag}
            className="bg-canvas text-ink-soft label-mono rounded-full px-2.5 py-1"
          >
            {tag}
          </li>
        ))}
      </ul>
    </Link>
  );
}
