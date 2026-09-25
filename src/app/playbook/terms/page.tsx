import type { Metadata } from "next";
import { terms } from "@/config/playbook-policies";
import { pageMetadata } from "@/lib/seo";
import { PolicyPage } from "@/components/playbook/policy-page";

export const metadata: Metadata = pageMetadata({
  title: terms.metaTitle,
  description: terms.metaDescription,
  path: "/playbook/terms",
  absoluteTitle: true,
  noindex: true,
});

export default function TermsPage() {
  return <PolicyPage policy={terms} />;
}
