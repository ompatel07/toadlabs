"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";
import { product } from "@/config/playbook";

/**
 * Slim purchase bar for phones, shown once the hero has scrolled past.
 *
 * It is progressive enhancement, not structure: the page has a working CTA in
 * the hero and a full checkout section, so if this never renders nothing is
 * lost. It watches a sentinel with IntersectionObserver rather than listening
 * to scroll, and it hides itself again once the checkout section is on screen,
 * so it never covers the button it points at.
 */
export function PlaybookStickyBar() {
  const [visible, setVisible] = useState(false);
  const shownRef = useRef(false);

  useEffect(() => {
    const hero = document.querySelector("header");
    const target = document.getElementById("checkout");
    if (!hero || !target) return;

    const state = { pastHero: false, atCheckout: false };
    const apply = () => {
      const next = state.pastHero && !state.atCheckout;
      if (next !== shownRef.current) {
        shownRef.current = next;
        setVisible(next);
      }
    };

    const heroWatcher = new IntersectionObserver(
      ([entry]) => {
        state.pastHero = !entry.isIntersecting;
        apply();
      },
      { rootMargin: "-40px 0px 0px 0px" },
    );
    const checkoutWatcher = new IntersectionObserver(
      ([entry]) => {
        state.atCheckout = entry.isIntersecting;
        apply();
      },
      { rootMargin: "0px 0px -20% 0px" },
    );

    heroWatcher.observe(hero);
    checkoutWatcher.observe(target);
    return () => {
      heroWatcher.disconnect();
      checkoutWatcher.disconnect();
    };
  }, []);

  return (
    <div
      className="pb-bar fixed inset-x-0 bottom-0 z-50 px-4 pt-3 transition-[transform,visibility] duration-300 ease-out md:hidden"
      style={{
        transform: visible ? "translateY(0)" : "translateY(120%)",
        visibility: visible ? "visible" : "hidden",
      }}
    >
      <div className="mx-auto flex max-w-[34rem] items-center gap-3">
        <div className="flex flex-col leading-tight">
          <span className="numeral text-ink text-lg font-bold">{product.priceLabel}</span>
          <span className="label-mono text-ink-soft">one-time</span>
        </div>
        <a
          href="#checkout"
          aria-label={`Get the bundle for ${product.priceLabel}`}
          className="pb-fill ml-auto inline-flex h-12 flex-1 cursor-pointer items-center justify-center gap-2 rounded-full px-5 text-sm font-bold"
        >
          Get the bundle
          <ArrowUp className="size-4 rotate-180" aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
