import type { Metadata } from "next";
import { product } from "@/config/playbook";
import { pageMetadata } from "@/lib/seo";
import { OrderStatus } from "@/components/playbook/order-status";

export const metadata: Metadata = pageMetadata({
  title: `Order confirmed — ${product.name}`,
  description: `Your ${product.priceLabel} order for ${product.name} is confirmed and your download is ready.`,
  path: "/playbook/thank-you",
  absoluteTitle: true,
  noindex: true,
});

/**
 * Confirmation page. It renders a "checking" state on the server and asks the
 * server for the real status on the client — the redirect that lands here is
 * never treated as proof that anything was paid.
 */
export default function ThankYouPage() {
  return (
    <div className="pb-glow mx-auto w-full max-w-[46rem] px-5 py-16 md:px-8 md:py-24">
      <OrderStatus />
    </div>
  );
}
