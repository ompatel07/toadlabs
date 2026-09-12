import { trustStrip } from "@/config/home";
import { tones, type ToneName } from "@/lib/tones";
import { cn } from "@/lib/utils";

/**
 * Capability statements as colour blocks.
 *
 * Still capability claims rather than logos or metrics — but rendered as a
 * four-up colour band, which is what turns the site's most boilerplate-prone
 * section into the one that sets the palette for the whole page.
 */
const TONES: ToneName[] = ["lime", "teal", "cyan", "amber"];

export function TrustStrip() {
  return (
    <section className="section-dense relative">
      <div className="container-tl">
        <h2 className="sr-only">How we work</h2>

        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {trustStrip.map((item, index) => {
            const tone = tones[TONES[index % TONES.length]];
            return (
              <li key={item.title} className="rise">
                <div
                  className={cn(
                    "group flex h-full flex-col gap-3 rounded-3xl p-6 transition-transform duration-300 ease-out hover:-translate-y-1.5",
                    tone.bg,
                    tone.text,
                    tone.dark && "on-dark",
                  )}
                >
                  <span
                    className={cn(
                      "inline-flex size-10 items-center justify-center rounded-xl transition-transform duration-300 ease-out group-hover:rotate-6",
                      tone.chip,
                    )}
                  >
                    <item.icon className="size-[18px]" strokeWidth={2} aria-hidden="true" />
                  </span>
                  <h3 className="font-display text-[1rem] font-bold tracking-[-0.02em]">
                    {item.title}
                  </h3>
                  <p className={cn("text-[0.875rem] leading-snug", tone.muted)}>
                    {item.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
