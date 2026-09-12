import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { homeServiceIds, services } from "@/config/services";
import { Section, SectionHeading } from "@/components/layout/section";
import { ActionLink } from "@/components/ui-brand/action";
import { OutlineType, DotGrid } from "@/components/brand/decor";
import { tones, accentAt } from "@/lib/tones";
import { cn } from "@/lib/utils";

/**
 * Services bento.
 *
 * Varied spans, a watermark word behind the grid, and lime on two cells only.
 * The composition carries it — an asymmetric grid of mostly-white cards with
 * two accents reads as designed; six coloured cards reads as a swatch page.
 */
const SPANS = [
  "sm:col-span-2 lg:col-span-2",
  "",
  "",
  "",
  "sm:col-span-2",
  "",
];

export function ServicesPreview() {
  const featured = homeServiceIds
    .map((id) => services.find((service) => service.id === id))
    .filter((service): service is NonNullable<typeof service> => Boolean(service));

  return (
    <Section className="relative overflow-hidden">
      {/* Watermark word, cropped by the section edge. */}
      <OutlineType className="absolute -top-4 -left-6 text-[clamp(5rem,16vw,13rem)]">
        BUILD
      </OutlineType>
      <DotGrid className="top-24 right-6 hidden h-32 w-32 lg:block" />

      <div className="relative flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <SectionHeading
          className="kinetic"
          eyebrow="Services"
          title="What we build"
          description="From a marketing site to a multi-tenant SaaS product. Scoped around the outcome you need, not a package tier."
        />
        <ActionLink
          href="/services"
          variant="ghost"
          className="shrink-0 self-start md:self-auto"
        >
          All services
          <ArrowRight className="size-4" aria-hidden="true" />
        </ActionLink>
      </div>

      <ul className="relative mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((service, index) => {
          const tone = tones[accentAt(index, [0, 4])];

          return (
            <li key={service.id} className={cn("rise", SPANS[index % SPANS.length])}>
              <Link
                href={`/services#${service.id}`}
                className={cn(
                  "group relative flex h-full cursor-pointer flex-col gap-4 overflow-hidden rounded-2xl border p-7 transition-all duration-300 ease-out hover:-translate-y-1.5 md:p-8",
                  tone.bg,
                  tone.text,
                  tone.border,
                  "hover:border-ink",
                )}
              >
                <span
                  className="numeral pointer-events-none absolute -right-1 -bottom-6 text-[6.5rem] opacity-[0.07]"
                  aria-hidden="true"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span
                  className={cn(
                    "relative inline-flex size-12 items-center justify-center rounded-full border transition-transform duration-300 ease-out group-hover:rotate-12",
                    tone.chip,
                    tone.border,
                  )}
                >
                  <service.icon className="size-5" strokeWidth={1.75} aria-hidden="true" />
                </span>

                <h3 className="font-display relative flex items-center gap-1.5 text-[1.25rem] font-bold tracking-[-0.03em]">
                  {service.title}
                  <ArrowUpRight
                    className="size-4 transition-transform duration-300 ease-out group-hover:translate-x-1 group-hover:-translate-y-1"
                    aria-hidden="true"
                  />
                </h3>

                <p className={cn("relative text-[0.9375rem]", tone.muted)}>
                  {service.description}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
