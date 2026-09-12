/**
 * Contact form submission — STUB.
 *
 * ⚠️ THIS DOES NOT SEND ANYTHING YET. It logs the payload and returns success
 * so the UI can be built and reviewed end to end. Wire it up before launch or
 * enquiries will silently vanish.
 *
 * The site builds with `output: "export"`, so there is no Next.js API route to
 * post to. Point this at one of:
 *   - a Netlify Function / serverless endpoint
 *   - a transactional email API (Resend, Postmark, SES)
 *   - a form service (Formspree, Basin)
 *
 * Replace only the marked block; the types and the calling component stay as
 * they are.
 */

export interface ContactPayload {
  name: string;
  email: string;
  company: string;
  service: string;
  budget: string;
  message: string;
}

export type ContactResult =
  | { ok: true }
  | { ok: false; error: string };

export async function submitContact(
  payload: ContactPayload,
): Promise<ContactResult> {
  // ---------------------------------------------------------------------
  // TODO: REPLACE THIS BLOCK WITH A REAL ENDPOINT CALL.
  //
  // const response = await fetch("/.netlify/functions/contact", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(payload),
  // });
  // if (!response.ok) {
  //   return { ok: false, error: "Something went wrong. Please email us instead." };
  // }
  // return { ok: true };
  // ---------------------------------------------------------------------

  // Loud on purpose: a silent fake-success is how a broken contact form goes
  // unnoticed for months.
  console.warn(
    "[Toad Labs] Contact form is still a stub — this enquiry was NOT sent.",
    payload,
  );

  // Simulate latency so the busy state is actually exercised in review.
  await new Promise((resolve) => setTimeout(resolve, 700));

  return { ok: true };
}

export const SERVICE_OPTIONS = [
  "Not sure yet",
  "Website",
  "Web or mobile app",
  "MVP development",
  "SaaS product",
  "CRM",
  "AI automation",
  "WhatsApp automation",
  "AI chatbot",
  "AI voice assistant",
  "Cybersecurity / VAPT",
  "Custom solution",
] as const;

export const BUDGET_OPTIONS = [
  "Not sure yet",
  "Under ₹2L",
  "₹2L – ₹5L",
  "₹5L – ₹15L",
  "₹15L – ₹40L",
  "₹40L+",
] as const;
