import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle, ArrowLeft, ArrowRight } from "lucide-react";
import { caseStudies, getCaseStudy } from "@/config/work";
import { Section } from "@/components/layout/section";
import { cn } from "@/lib/utils";
import { FinalCta } from "@/components/sections/final-cta";

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};

  return {
    title: study.title,
    description: study.summary,
    alternates: { canonical: `/work/${study.slug}` },
    // A placeholder case study must never be indexed and mistaken for a real
    // client reference.
    ...(study.isPlaceholder ? { robots: { index: false, follow: false } } : {}),
  };
}

/** Problem → Approach → Stack → Outcome, in that fixed order. */
export default async function CaseStudyPage({
  params,
}: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  const index = caseStudies.findIndex((item) => item.slug === study.slug);
  const next = caseStudies[(index + 1) % caseStudies.length];

  return (
    <>
      <header className="relative overflow-hidden pt-12 pb-10 md:pt-16">
        <div
          className="blob-accent -top-32 -left-24 h-[400px] w-[400px]"
          aria-hidden="true"
        />
        <div className="container-tl relative">
          <Link
            href="/work"
            className="text-ink-soft hover:text-ink inline-flex cursor-pointer items-center gap-2 t-sm transition-colors duration-200 ease-out"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            All case studies
          </Link>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <span className="label-mono text-ink-soft">{study.sector}</span>
            {study.isPlaceholder ? (
              <span className="label-mono text-ink rounded-full border border-[rgba(255,255,255,0.287)] px-2.5 py-1">
                Placeholder
              </span>
            ) : null}
          </div>

          <h1 className="type-display text-ink mt-4 max-w-4xl">
            {study.title}
          </h1>
          <p className="measure text-ink-soft mt-5 t-lead md:text-lg">
            {study.summary}
          </p>
        </div>
      </header>

      {study.isPlaceholder ? (
        <div className="container-tl">
          <div className="flex items-start gap-3.5 rounded-lg border-2 border-[rgba(255,255,255,0.22)] bg-[var(--surface)] p-5">
            <AlertTriangle
              className="text-ink mt-0.5 size-5 shrink-0"
              strokeWidth={2}
              aria-hidden="true"
            />
            <p className="text-ink-soft measure t-base">
              <strong className="text-ink font-semibold">
                This is an illustrative placeholder.
              </strong>{" "}
              It shows how we scope and document an engagement. It is not a
              delivered client project, the client is a generic sector
              descriptor, and the outcomes below are described qualitatively
              because there are no real metrics to report.
            </p>
          </div>
        </div>
      ) : null}

      <Section className="pt-12 md:pt-16">
        <div className="grid gap-12 lg:grid-cols-[1fr_2fr] lg:gap-16">
          {/* Stack rail */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <h2 className="label-mono text-ink-soft">Stack</h2>
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {study.stack.map((tool) => (
                <li
                  key={tool}
                  className="label-mono text-ink rounded-full border border-[rgba(255,255,255,0.161)] bg-[var(--surface)] px-2.5 py-1"
                >
                  {tool}
                </li>
              ))}
            </ul>

            <h2 className="label-mono text-ink-soft mt-8">Chapters</h2>
            <ol className="mt-4 flex flex-col">
              {["Problem", "Approach", "Outcome"].map((chapter, index) => (
                <li key={chapter}>
                  <a
                    href={`#${chapter.toLowerCase()}`}
                    className="text-ink-soft hover:text-ink group flex cursor-pointer items-baseline gap-3 border-b border-[rgba(255,255,255,0.138)] py-2.5 transition-colors duration-200 ease-out"
                  >
                    <span className="label-mono opacity-60">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="t-base font-medium transition-transform duration-200 ease-out group-hover:translate-x-1">
                      {chapter}
                    </span>
                  </a>
                </li>
              ))}
            </ol>

            <h2 className="label-mono text-ink-soft mt-8">Focus</h2>
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {study.tags.map((tag) => (
                <li
                  key={tag}
                  className="label-mono text-ink-soft bg-[var(--surface-2)] rounded-full px-2.5 py-1"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </aside>

          <div className="flex flex-col gap-16">
            {[
              { heading: "Problem", body: study.problem },
              { heading: "Approach", body: study.approach },
              { heading: "Outcome", body: study.outcome },
            ].map((block, blockIndex) => (
              <section
                key={block.heading}
                id={block.heading.toLowerCase()}
                className="scroll-mt-28"
              >
                {/* Chapter marker: an oversized numeral in the margin and a
                    rule that runs to the edge, so each block reads as a chapter
                    rather than a paragraph with a bold line above it. */}
                <div className="flex items-baseline gap-5 border-t-2 border-[rgba(255,255,255,0.22)] pt-5">
                  <span
                    className="numeral text-ink/20 numeral-md leading-none"
                    aria-hidden="true"
                  >
                    {String(blockIndex + 1).padStart(2, "0")}
                  </span>
                  <h2 className="font-display text-ink type-h2 font-bold">
                    {block.heading}
                  </h2>
                </div>

                <ul className="mt-7 flex flex-col gap-5">
                  {block.body.map((line, lineIndex) => (
                    <li
                      key={line}
                      className="rise grid grid-cols-[auto_1fr] gap-4"
                    >
                      <span
                        aria-hidden="true"
                        className="bg-lime-deep mt-2.5 inline-block size-1.5 shrink-0 rounded-full"
                      />
                      <p
                        className={cn(
                          "text-ink measure leading-relaxed",
                          // The first line of each chapter carries the weight.
                          lineIndex === 0 ? "t-lead font-medium" : "t-base text-ink-soft",
                        )}
                      >
                        {line}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </Section>

      {/* Next case study */}
      <div className="container-tl pb-4">
        <Link
          href={`/work/${next.slug}`}
          className="card-solid lift group flex cursor-pointer items-center justify-between gap-6 p-6 md:p-8"
        >
          <span>
            <span className="label-mono text-ink-soft block">
              Next case study
            </span>
            <span className="font-display text-ink mt-1.5 block type-h3 font-semibold">
              {next.title}
            </span>
          </span>
          <ArrowRight
            className="text-ink size-5 shrink-0 transition-transform duration-300 ease-out group-hover:translate-x-1"
            aria-hidden="true"
          />
        </Link>
      </div>

      <FinalCta />
    </>
  );
}
