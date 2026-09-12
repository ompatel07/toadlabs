import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { homeServiceIds, services } from "@/config/services";
import { Section, SectionHeading } from "@/components/layout/section";
import { ActionLink } from "@/components/ui-brand/action";
import { Reveal } from "@/components/motion/reveal";

export function ServicesPreview() {
  const featured = homeServiceIds
    .map((id) => services.find((service) => service.id === id))
    .filter((service): service is NonNullable<typeof service> =>
      Boolean(service),
    );

  return (
    <Section>
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <SectionHeading
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

      <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((service, index) => (
          <Reveal as="li" key={service.id} index={index}>
            <Link
              href={`/services#${service.id}`}
              className="card-solid lift group flex h-full cursor-pointer flex-col gap-4 p-7"
            >
              <span className="bg-canvas inline-flex size-11 items-center justify-center rounded-2xl">
                <service.icon
                  className="text-ink size-5"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
              </span>
              <h3 className="font-display text-ink mt-1 flex items-center gap-1.5 text-[1.0625rem] font-semibold tracking-[-0.02em]">
                {service.title}
                <ArrowUpRight
                  className="text-ink-soft size-4 transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </h3>
              <p className="text-ink-soft text-[0.9375rem]">
                {service.description}
              </p>
            </Link>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
