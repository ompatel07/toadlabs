import { cn } from "@/lib/utils";

interface RevealProps {
  children: React.ReactNode;
  /** Kept for call-site compatibility; scroll-driven reveals need no stagger
   *  index, since each element animates against its own scroll position. */
  index?: number;
  className?: string;
  as?: "div" | "li" | "article";
}

/**
 * Scroll-driven entrance.
 *
 * A plain server component — the animation lives entirely in CSS (see the
 * `.reveal` rule in globals.css). The element renders visible and is animated
 * only where `animation-timeline: view()` is supported, so there is no hidden
 * initial state in the HTML and nothing to hydrate.
 *
 * This replaced a Framer Motion `whileInView` implementation, which shipped
 * `opacity:0` inline into the static export and left sections blank without JS.
 */
export function Reveal({ children, className, as: Tag = "div" }: RevealProps) {
  return <Tag className={cn("reveal", className)}>{children}</Tag>;
}
