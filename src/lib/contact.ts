/**
 * Contact form delivery — via WhatsApp.
 *
 * The site is a static export with no server, so the form does not POST
 * anywhere. Instead it composes the enquiry into a WhatsApp message addressed
 * to siteConfig.whatsappNumber and opens it; the visitor presses send in
 * WhatsApp (the app on a phone, WhatsApp Web on a desktop).
 *
 * Why this rather than a form service: it needs no third-party account or API
 * key, nothing is stored anywhere in between, the reply channel is the one the
 * team already answers on, and the visitor can see exactly what is being sent
 * before it goes.
 *
 * The limitation to know about: the message only arrives if the visitor
 * presses send in WhatsApp. If an email-based form is added later, validate
 * and rate-limit on that endpoint too — nothing a browser sends can be
 * trusted — and add its origin to CONNECT_SRC in scripts/security-headers.mjs.
 */

export const CONTACT_TOPICS = ["grow", "build", "secure", "other", "unspecified"] as const;
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

export const GROWTH_SERVICES = [
  "Not sure yet",
  "SEO",
  "Google Ads / PPC",
  "Paid social",
  "Social media marketing",
  "Content marketing",
  "Brand strategy & creative",
  "Conversion & analytics",
] as const;

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
  // The whole enquiry travels in a wa.me URL, so the message is capped well
  // below what an encoded URL can safely carry.
  message: 2000,
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

const KNOWN_SERVICES = new Set<string>([
  ...GROWTH_SERVICES,
  ...BUILD_SERVICES,
  ...SECURE_SERVICES,
]);
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

const TOPIC_LABEL: Record<ContactTopic, string> = {
  grow: "Grow something (marketing)",
  build: "Build something",
  secure: "Test something (security)",
  other: "Something else",
  unspecified: "Not specified",
};

/**
 * Builds the wa.me link for an enquiry. Everything is normalised and
 * allowlisted first, then URL-encoded, so nothing a visitor types can change
 * the destination number or break out of the text parameter.
 */
export function contactWhatsappUrl(payload: ContactPayload, phone: string): string {
  const clean = normaliseContact(payload);
  const NL = String.fromCharCode(10);
  const lines = [
    "Hi OFFSCRIPT, I'd like to talk about a project.",
    "",
    `*Name:* ${clean.name}`,
    `*Email:* ${clean.email}`,
    clean.company ? `*Company:* ${clean.company}` : null,
    `*Looking for:* ${TOPIC_LABEL[clean.topic]}`,
    clean.topic !== "other" && clean.topic !== "unspecified"
      ? `*Service:* ${clean.service}`
      : null,
    clean.topic !== "other" && clean.topic !== "unspecified"
      ? `*Budget:* ${clean.budget}`
      : null,
    "",
    "*Message:*",
    clean.message,
  ].filter((line): line is string => line !== null);

  const digits = phone.replace(/[^0-9]/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(lines.join(NL))}`;
}

/** Server-side-style check, repeated here so a tampered form cannot skip it. */
export function isDeliverable(payload: ContactPayload): boolean {
  const clean = normaliseContact(payload);
  return (
    clean.name.length > 0 &&
    EMAIL_PATTERN.test(clean.email) &&
    clean.message.length >= MESSAGE_MIN
  );
}
