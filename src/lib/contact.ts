/**
 * Contact form submission — STUB.
 *
 * ⚠️ THIS DOES NOT SEND ANYTHING YET. It validates and normalises the payload,
 * then returns success so the UI can be built and reviewed end to end. Wire it
 * up before launch or enquiries will silently vanish.
 *
 * The site builds with `output: "export"`, so there is no Next.js API route to
 * post to. Point this at one of:
 *   - a Netlify Function / serverless endpoint
 *   - a transactional email API (Resend, Postmark, SES)
 *   - a form service (Formspree, Basin)
 *
 * When you do, also add that endpoint's origin to `connect-src` in the
 * Content-Security-Policy (scripts/security-headers.mjs), or the browser will
 * block the request. A same-origin Netlify Function needs no change.
 *
 * Replace only the marked block; the types and the calling component stay as
 * they are.
 */

export const CONTACT_TOPICS = ["build", "secure", "other", "unspecified"] as const;
export type ContactTopic = (typeof CONTACT_TOPICS)[number];

export interface ContactPayload {
  /** Which path the visitor picked first — the triage signal. */
  topic: ContactTopic;
  name: string;
  email: string;
  company: string;
  service: string;
  budget: string;
  message: string;
}

export const BUILD_SERVICES = [
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
  "Custom solution",
] as const;

export const SECURE_SERVICES = [
  "Not sure yet",
  "VAPT",
  "Web application pentest",
  "Mobile application pentest",
  "Secure code review",
  "Cloud posture review",
  "Compliance readiness",
  "Incident response readiness",
] as const;

export const BUDGET_OPTIONS = [
  "Not sure yet",
  "Under ₹2L",
  "₹2L – ₹5L",
  "₹5L – ₹15L",
  "₹15L – ₹40L",
  "₹40L+",
] as const;

/**
 * Field limits. Enforced in the form (maxLength) and again in
 * `normaliseContact`, because a limit that only exists in the markup is a
 * suggestion. The receiving endpoint MUST re-check all of this server-side —
 * nothing a browser sends can be trusted.
 */
export const CONTACT_LIMITS = {
  name: 100,
  email: 254, // RFC 5321 maximum
  company: 120,
  service: 80,
  budget: 40,
  message: 5000,
} as const satisfies Record<Exclude<keyof ContactPayload, "topic">, number>;

export const MESSAGE_MIN = 20;

/** Deliberately simple: one @, no spaces or markup characters, a dotted domain. */
export const EMAIL_PATTERN =
  /^[^\s@<>()[\],;:"]+@[^\s@<>()[\],;:"]+\.[^\s@<>()[\],;:"]{2,}$/;

// C0 control characters other than tab, newline and carriage return, plus DEL.
// Stripped so a payload cannot smuggle header-splitting or terminal escape
// sequences into whatever email or ticketing system eventually receives it.
// Filtered by code point rather than a regex literal, which would have to
// embed the very characters it removes.
function stripControl(value: string): string {
  let out = "";
  for (const char of value) {
    const code = char.codePointAt(0) ?? 0;
    const control = (code < 32 && code !== 9 && code !== 10 && code !== 13) || code === 127;
    if (!control) out += char;
  }
  return out;
}

function tidy(value: string, max: number, singleLine: boolean): string {
  let text = stripControl(value.normalize("NFC"));
  if (singleLine) text = text.replace(/[\r\n]+/g, " ");
  return text.trim().slice(0, max);
}

const KNOWN_SERVICES = new Set<string>([...BUILD_SERVICES, ...SECURE_SERVICES]);
const KNOWN_BUDGETS = new Set<string>(BUDGET_OPTIONS);

/**
 * Trim, strip control characters, flatten single-line fields and cap lengths.
 * Select values are allowlisted: anything that is not one of our own options
 * (a tampered request) is replaced rather than passed through.
 */
export function normaliseContact(payload: ContactPayload): ContactPayload {
  const service = tidy(payload.service, CONTACT_LIMITS.service, true);
  const budget = tidy(payload.budget, CONTACT_LIMITS.budget, true);
  return {
    topic: CONTACT_TOPICS.includes(payload.topic) ? payload.topic : "unspecified",
    name: tidy(payload.name, CONTACT_LIMITS.name, true),
    email: tidy(payload.email, CONTACT_LIMITS.email, true).toLowerCase(),
    company: tidy(payload.company, CONTACT_LIMITS.company, true),
    service: KNOWN_SERVICES.has(service) ? service : "Not specified",
    budget: KNOWN_BUDGETS.has(budget) ? budget : "Not sure yet",
    message: tidy(payload.message, CONTACT_LIMITS.message, false),
  };
}

export type ContactResult =
  | { ok: true }
  | { ok: false; error: string };

export async function submitContact(
  payload: ContactPayload,
): Promise<ContactResult> {
  const clean = normaliseContact(payload);
  if (
    !clean.name ||
    !EMAIL_PATTERN.test(clean.email) ||
    clean.message.length < MESSAGE_MIN
  ) {
    return { ok: false, error: "Some required details are missing." };
  }

  // ---------------------------------------------------------------------
  // TODO: REPLACE THIS BLOCK WITH A REAL ENDPOINT CALL.
  //
  // const response = await fetch("/.netlify/functions/contact", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(clean),
  // });
  // if (!response.ok) {
  //   return { ok: false, error: "Something went wrong. Please email us instead." };
  // }
  // return { ok: true };
  // ---------------------------------------------------------------------

  // Loud on purpose: a silent fake-success is how a broken contact form goes
  // unnoticed for months. The payload itself is NOT logged — it is a
  // visitor's name, email and message, and the console is readable by browser
  // extensions and anyone looking at a shared screen.
  console.warn(
    "[Toad Labs] Contact form is still a stub — this enquiry was NOT sent.",
  );

  // Simulate latency so the busy state is actually exercised in review.
  await new Promise((resolve) => setTimeout(resolve, 700));

  return { ok: true };
}
