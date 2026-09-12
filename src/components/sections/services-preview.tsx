import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { homeServiceIds, services } from "@/config/services";
import { Section, SectionHeading } from "@/components/layout/section";
import { ActionLink } from "@/components/ui-brand/action";
import { tones, type ToneName } from "@/lib/tones";
import { cn } from "@/lib/utils";

/**
 * Services bento.
 *
 * Varied spans and a fixed colour rotation, so the grid reads as one composed
 * block rather than six identical tiles. Tones come from lib/tones, which
 * couples each background to the only text colour that passes on it.
 */
const LAYOUT: { tone: ToneName; span: string }[] = [
  { tone: "lime", span: "sm:col-span-2 lg:col-span-2 lg:row-span-1" },
  { tone: "teal", span: "" },
  { tone: "cyan", span: "" },
  { tone: "amber", span: "" },
  { tone: "sand", span: "sm:col-span-2" },
  { tone: "coral", span: "" },
];

export function ServicesPreview() {
  const featured = homeServiceIds
    .map((id) => services.find((service) => service.id === id))
    .filter((service): service is NonNullable<typeof service> => Boolean(service));

  return (
    <Section className="relative overflow-hidden">
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
          const { tone: toneName, span } = LAYOUT[index % LAYOUT.length];
          const tone = tones[toneName];

          return (
            <li key={service.id} className={cn("rise", span)}>
              <Link
                href={`/services#${service.id}`}
                className={cn(
                  "group relative flex h-full cursor-pointer flex-col gap-4 overflow-hidden rounded-3xl p-7 transition-transform duration-300 ease-out hover:-translate-y-1.5 md:p-8",
                  tone.bg,
                  tone.text,
                  tone.dark && "on-dark",
                )}
              >
                {/* Oversized numeral bleeding off the corner. */}
                <span
                  className="numeral pointer-events-none absolute -right-2 -bottom-6 text-[7rem] opacity-10"
                  aria-hidden="true"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span
                  className={cn(
                    "relative inline-flex size-12 items-center justify-center rounded-2xl",
                    tone.chip,
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
