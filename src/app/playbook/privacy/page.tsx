import type { Metadata } from "next";
import { privacy } from "@/config/playbook-policies";
import { pageMetadata } from "@/lib/seo";
import { PolicyPage } from "@/components/playbook/policy-page";

export const metadata: Metadata = pageMetadata({
  title: privacy.metaTitle,
  description: privacy.metaDescription,
  path: "/playbook/privacy",
  absoluteTitle: true,
});

export default function PrivacyPage() {
  return <PolicyPage policy={privacy} />;
}
