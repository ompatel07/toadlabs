import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { AdminDashboard } from "@/components/playbook/admin-dashboard";

/**
 * Buyer dashboard. Not linked from anywhere, noindexed, and useless without a
 * login that is on the allowlist — but "nobody knows the URL" is not a control,
 * so the protection is the function behind it, not the obscurity of the path.
 */
export const metadata: Metadata = pageMetadata({
  title: "Orders",
  description: "Internal dashboard.",
  path: "/playbook/admin",
  absoluteTitle: true,
  noindex: true,
});

export default function PlaybookAdminPage() {
  // Read at build time. This is a Server Component, so it can read any
  // variable and hand the value down as a prop — no NEXT_PUBLIC_ copy needed,
  // which is two fewer things to set and two fewer to keep in step.
  //
  // Both values are safe in the bundle that results: the project URL is
  // public, and the anon key can read nothing while row-level security is on
  // with no policy. It is here only to exchange a magic link for a session.
  const url = process.env.SUPABASE_URL ?? "";
  const anonKey = process.env.SUPABASE_ANON_KEY ?? "";

  return (
    <section className="py-14 md:py-20">
      <div className="mx-auto w-full max-w-[72rem] px-5 md:px-8">
        <div aria-hidden="true" className="pb-rule mb-5 w-full max-w-[9rem]" />
        <p className="label-mono pb-accent">Internal</p>
        <h1 className="pb-display text-ink mt-4 text-[clamp(1.9rem,5.2vw,3.25rem)]">Orders</h1>
        <p className="text-ink-soft measure mt-4 t-base">
          Every order, and a download link you can copy and send if a buyer loses theirs.
        </p>

        <div className="mt-10">
          <AdminDashboard url={url} anonKey={anonKey} />
        </div>
      </div>
    </section>
  );
}
