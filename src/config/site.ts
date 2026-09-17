/**
 * Global site configuration.
 *
 * Contact details live only here, so changing a value updates the whole site.
 *
 * ⚠️ STILL PLACEHOLDER: `siteUrl` and `email` (the domain is not set up yet).
 * The phone / WhatsApp number is real.
 */

export interface NavItem {
  label: string;
  href: string;
}

export const siteConfig = {
  name: "Toad Labs",
  /** Used for metadata, sitemap and canonical URLs. TODO: real domain. */
  siteUrl: "https://toadlabs.in",
  tagline: "Software built to last in production — and attacked before it ships.",
  /** What the business is, in the words people search for. Leads every
   *  default title and link preview, so a shared link says "IT services and
   *  cybersecurity", not just a slogan. */
  category: "IT Services & Cybersecurity Company in Ahmedabad",
  description:
    "Toad Labs is an IT services and cybersecurity company in Ahmedabad: websites, web and mobile apps, SaaS and AI automation, plus VAPT and penetration testing.",

  /** TODO: replace with the real inbox. */
  email: "hello@toadlabs.in",
  /** International format, digits only — used to build wa.me links, and the
   *  number the contact form delivers enquiries to on WhatsApp. */
  whatsappNumber: "918780876920",
  /** Same number for calls, in E.164 and in the display format used in India. */
  phone: "+918780876920",
  phoneDisplay: "+91 87808 76920",
  whatsappMessage: "Hi Toad Labs — I'd like to talk about a project.",

  location: {
    city: "Ahmedabad",
    region: "Gujarat",
    country: "India",
    full: "Ahmedabad, Gujarat, India",
  },
} as const;

export const whatsappUrl = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
  siteConfig.whatsappMessage,
)}`;

export const mainNav: NavItem[] = [
  { label: "Services", href: "/services" },
  { label: "Cybersecurity", href: "/cybersecurity" },
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
];

export const footerNav: { heading: string; items: NavItem[] }[] = [
  {
    heading: "Build",
    items: [
      { label: "Websites", href: "/services/website-development" },
      { label: "Web & mobile apps", href: "/services/web-mobile-app-development" },
      { label: "MVP development", href: "/services/mvp-development" },
      { label: "SaaS products", href: "/services/saas-development" },
      { label: "CRM", href: "/services/custom-crm-development" },
    ],
  },
  {
    heading: "Automate",
    items: [
      { label: "AI automation", href: "/services/ai-automation" },
      { label: "WhatsApp automation", href: "/services/whatsapp-automation" },
      { label: "AI chatbots", href: "/services/ai-chatbot-development" },
      { label: "AI voice assistants", href: "/services/ai-voice-assistant-development" },
      { label: "Custom software", href: "/services/custom-software-development" },
    ],
  },
  {
    heading: "Secure",
    items: [
      { label: "VAPT", href: "/cybersecurity/vapt-services" },
      { label: "Penetration testing", href: "/cybersecurity/penetration-testing" },
      { label: "Security audits", href: "/cybersecurity/security-audit" },
      { label: "Secure code review", href: "/cybersecurity/secure-code-review" },
      { label: "Cloud security", href: "/cybersecurity/cloud-security-assessment" },
      { label: "ISO 27001 & SOC 2 readiness", href: "/cybersecurity/iso-27001-soc-2-readiness" },
      { label: "Incident response", href: "/cybersecurity/incident-response-readiness" },
    ],
  },
  {
    heading: "Company",
    items: [
      { label: "About", href: "/about" },
      { label: "Work", href: "/work" },
      { label: "Contact", href: "/contact" },
      { label: "Security & disclosure", href: "/security" },
    ],
  },
];
