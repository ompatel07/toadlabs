import { cn } from "@/lib/utils";

interface PageHeaderProps {
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Optional right-hand slot: actions, stats, or a summary card. */
  aside?: React.ReactNode;
  className?: string;
}

/**
 * Shared header for every non-home page.
 *
 * Sets the page's single h1 and keeps the top of each route visually
 * consistent, so the site reads as one thing rather than a set of templates.
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  aside,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "relative overflow-hidden pt-14 pb-12 md:pt-20 md:pb-16",
        className,
      )}
    >
      <div
        className="blob-accent -top-32 -left-24 h-[420px] w-[420px]"
        aria-hidden="true"
      />

      <div className="container-tl relative">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <div className="flex flex-col gap-5">
            <p className="label-mono text-ink-soft">{eyebrow}</p>
            <h1 className="type-display text-ink max-w-4xl">{title}</h1>
            {description ? (
              <p className="measure text-ink-soft t-lead md:text-lg">
                {description}
              </p>
            ) : null}
          </div>

          {aside ? <div className="lg:justify-self-end">{aside}</div> : null}
        </div>
      </div>
    </header>
  );
}
