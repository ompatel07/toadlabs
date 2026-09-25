import type { Metadata } from "next";
import { refund } from "@/config/playbook-policies";
import { pageMetadata } from "@/lib/seo";
import { PolicyPage } from "@/components/playbook/policy-page";

export const metadata: Metadata = pageMetadata({
  title: refund.metaTitle,
  description: refund.metaDescription,
  path: "/playbook/refund",
  absoluteTitle: true,
  noindex: true,
});

export default function RefundPage() {
  return <PolicyPage policy={refund} />;
}
