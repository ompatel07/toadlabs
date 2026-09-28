import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Policy } from "@/config/playbook-policies";
import { product } from "@/config/playbook";
import { siteConfig } from "@/config/site";

/**
 * Shared shell for the three policy pages. Plain and short by design: these
 * are read by a buyer deciding whether to trust the purchase, and by a payment
 * processor checking the business is real. Both want sentences, not columns.
 *
 * Every policy page names the seller and the price, which is what the
 * processor's review looks for.
 */
export function PolicyPage({ policy }: { policy: Policy }) {
  return (
    <article className="mx-auto w-full max-w-[46rem] px-5 py-14 md:px-8 md:py-20">
      <Link
        href="/playbook"
        className="text-ink-soft hover:text-ink inline-flex min-h-[44px] cursor-pointer items-center gap-2 t-sm transition-colors duration-200 ease-out"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to the bundle
      </Link>

      <h1 className="font-display text-ink mt-6 type-h1 font-bold text-balance">
        {policy.title}
      </h1>

      <p className="text-ink-soft mt-4 t-lead leading-relaxed">{policy.intro}</p>

      <dl className="mt-8 grid gap-x-8 gap-y-2 border-y border-[color:var(--ink)]/20 py-5 sm:grid-cols-[auto_1fr]">
        <dt className="label-mono text-ink-soft">Seller</dt>
        <dd className="text-ink t-sm">{siteConfig.name}, {siteConfig.location.full}</dd>
        <dt className="label-mono text-ink-soft">Product</dt>
        <dd className="text-ink t-sm">{product.name}</dd>
        <dt className="label-mono text-ink-soft">Price</dt>
        <dd className="text-ink t-sm">{product.priceLabel} one-time</dd>
      </dl>

      {policy.sections.map((section) => (
        <section key={section.heading} className="mt-10">
          <h2 className="font-display text-ink type-h3 font-bold">{section.heading}</h2>
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph} className="text-ink-soft mt-4 t-base leading-relaxed">
              {paragraph}
            </p>
          ))}
          {section.list ? (
            <ul className="mt-4 flex flex-col gap-2.5">
              {section.list.map((item) => (
                <li key={item} className="text-ink-soft flex items-start gap-3 t-base">
                  <span aria-hidden="true" className="pb-accent mt-[0.45em] inline-block size-1.5 shrink-0 rounded-full bg-[color:var(--accent)]" />
                  {item}
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ))}

      <p className="text-ink-soft mt-12 border-t border-[color:var(--ink)]/20 pt-6 t-sm">
        Questions about an order? Email us at {siteConfig.email}.
      </p>
    </article>
  );
}
