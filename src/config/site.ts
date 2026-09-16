/**
 * Global site configuration.
 *
 * ⚠️ PLACEHOLDER CONTACT DETAILS — replace before going live.
 * `email`, `whatsappNumber` and `siteUrl` below are stand-ins so the UI can be
 * built and reviewed. Every one of them is referenced in exactly one place
 * (this file), so swapping in the real values updates the whole site.
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
  description:
    "Toad Labs builds web and mobile products, MVPs, SaaS platforms and AI automation — and runs the security testing that proves they hold up. Build and offensive security in one team, from Ahmedabad, for clients across India and beyond.",

  /** TODO: replace with the real inbox. */
  email: "hello@toadlabs.in",
  /** International format, digits only — used to build the wa.me link. TODO: real number. */
  whatsappNumber: "919000000000",
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
      { label: "Websites", href: "/services#websites" },
      { label: "Web & mobile apps", href: "/services#web-mobile-apps" },
      { label: "MVP development", href: "/services#mvp" },
      { label: "SaaS products", href: "/services#saas" },
      { label: "CRM", href: "/services#crm" },
    ],
  },
  {
    heading: "Automate",
    items: [
      { label: "AI automation", href: "/services#ai-automation" },
      { label: "WhatsApp automation", href: "/services#whatsapp-automation" },
      { label: "AI chatbots", href: "/services#ai-chatbots" },
      { label: "AI voice assistants", href: "/services#ai-voice" },
      { label: "Custom solutions", href: "/services#custom" },
    ],
  },
  {
    heading: "Secure",
    items: [
      { label: "VAPT", href: "/cybersecurity#vapt" },
      { label: "Penetration testing", href: "/cybersecurity#pentesting" },
      { label: "Security audits", href: "/cybersecurity#audits" },
      { label: "Secure code review", href: "/cybersecurity#code-review" },
      { label: "Cloud security", href: "/cybersecurity#cloud" },
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
