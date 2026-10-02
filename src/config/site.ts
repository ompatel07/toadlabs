/**
 * Global site configuration.
 *
 * Contact details live only here, so changing a value updates the whole site.
 *
 * ⚠️ STILL PLACEHOLDER: `siteUrl` and `email` (the domain is not set up yet).
 * `email` has to be real before launch: it is now the ONLY way anyone can
 * reach the business, including for a refund.
 *
 * NO PHONE NUMBER LIVES HERE ANY MORE. It was a personal mobile, and it
 * appeared in the footer of every page, in tel: links, in the contact form's
 * delivery URL and in the organisation JSON-LD — five separate places for a
 * scraper to find it. An address can be rotated; a harvested number cannot.
 */

export interface NavItem {
  label: string;
  href: string;
}

export const siteConfig = {
  name: "OFFSCRIPT",
  /** Used for metadata, sitemap and canonical URLs. TODO: real domain. */
  siteUrl: "https://toadlabs.in",
  tagline: "Software built to last in production — and attacked before it ships.",
  /** What the business is, in the words people search for. Leads every
   *  default title and link preview, so a shared link says "IT services and
   *  cybersecurity", not just a slogan. */
  category: "Digital Marketing, Software & Cybersecurity",
  description:
    "OFFSCRIPT is a digital marketing, software and cybersecurity company in Ahmedabad: SEO and paid ads, websites, apps, SaaS, AI automation, VAPT and pentesting.",

  /**
   * The only way anyone can reach the business, including for a refund the
   * guarantee promises. It has to be a monitored inbox.
   *
   * ⚠️ VERIFY THE DOMAIN. This was given as "@google.com", which is Google's
   * own corporate domain — nobody outside Google can hold an address there, so
   * mail to it will not arrive. Almost certainly "@gmail.com" was meant.
   * Written as given rather than guessed, because a wrong support address is a
   * buyer who cannot claim a refund.
   */
  email: "offscriptlabss@google.com",

  location: {
    city: "Ahmedabad",
    region: "Gujarat",
    country: "India",
    full: "Ahmedabad, Gujarat, India",
  },
} as const;

/** The one way to reach the business, used everywhere a contact link appears. */
export const mailtoUrl = `mailto:${siteConfig.email}?subject=${encodeURIComponent(
  "Enquiry for OFFSCRIPT",
)}`;

export const mainNav: NavItem[] = [
  { label: "Services", href: "/services" },
  { label: "Marketing", href: "/marketing" },
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
    heading: "Grow",
    items: [
      { label: "SEO services", href: "/marketing/seo-services" },
      { label: "Google Ads & PPC", href: "/marketing/google-ads-ppc" },
      { label: "Social media marketing", href: "/marketing/social-media-marketing" },
      { label: "Content marketing", href: "/marketing/content-marketing" },
      { label: "Brand strategy & creative", href: "/marketing/brand-strategy-creative" },
      { label: "Conversion & analytics", href: "/marketing/conversion-rate-optimisation" },
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
