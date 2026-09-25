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
    .filter((page) => page.category === "build")
    .map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const page = getServicePage("build", slug);
  if (!page) return {};
  return pageMetadata({
    title: page.seoTitle,
    description: page.metaDescription,
    path: servicePagePath(page),
    image: "services",
  });
}

export default async function ServicePageRoute({
  params,
}: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const page = getServicePage("build", slug);
  if (!page) notFound();
  return <ServiceDetail page={page} />;
}
