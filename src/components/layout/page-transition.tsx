"use client";

import { usePathname } from "next/navigation";

/**
 * Route transition.
 *
 * Keyed on the pathname, so React remounts the subtree on every navigation and
 * the enter animation replays. That is the whole mechanism — no library, no
 * exit animation to coordinate, and nothing to get stuck half-played if a
 * navigation is interrupted.
 *
 * React's <ViewTransition> would be the richer option, but it is not exported
 * from the React build installed here, and the CSS `@view-transition` at-rule
 * only fires on full document navigations — which the App Router's client
 * routing bypasses. This works in both cases.
 *
 * The animation is a short fade and a 12px rise: small enough to stay in Tier 1
 * of the motion policy, so it runs for everyone.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div key={pathname} className="page-enter">
      {children}
    </div>
  );
}
