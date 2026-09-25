import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getServicePage,
  servicePagePath,
  servicePages,
} from "@/config/service-pages";
import { pageMetadata } from "@/lib/seo";
import { ServiceDetail } from "@/components/sections/service-detail";

export const dynamicParams = false;

export function generateStaticParams() {
  return servicePages
    .filter((page) => page.category === "security")
    .map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/cybersecurity/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const page = getServicePage("security", slug);
  if (!page) return {};
  return pageMetadata({
    title: page.seoTitle,
    description: page.metaDescription,
    path: servicePagePath(page),
    image: "cybersecurity",
  });
}

export default async function ServicePageRoute({
  params,
}: PageProps<"/cybersecurity/[slug]">) {
  const { slug } = await params;
  const page = getServicePage("security", slug);
  if (!page) notFound();
  return <ServiceDetail page={page} />;
}
