import {
  BarChart3,
  Megaphone,
  PenLine,
  Search,
  Share2,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

/**
 * Digital marketing content — the "Grow" half of the offer.
 *
 * Same rules as everywhere else on this site: no invented case studies,
 * client counts, revenue figures or guaranteed positions. Marketing is the
 * category where inflated claims are most common, so every promise here is
 * about method and reporting, which we control, rather than results, which
 * depend on the market.
 *
 * Each entry has a matching page in config/service-pages.ts (category
 * "growth"), so the card and the page never drift apart.
 */

export interface MarketingService {
  /** Anchor id on /marketing, and the link to the detail page. */
  id: string;
  title: string;
  description: string;
  points: string[];
  icon: LucideIcon;
  featured?: boolean;
}

export const marketingServices: MarketingService[] = [
  {
    id: "seo",
    title: "SEO",
    description:
      "Get found by people already searching for what you sell. Technical fixes, the pages you are missing, and content that answers the questions buyers actually type.",
    points: [
      "Technical audit: speed, indexing, structure",
      "Keyword and intent mapping to real pages",
      "Local SEO and Google Business Profile",
    ],
    icon: Search,
    featured: true,
  },
  {
    id: "paid-ads",
    title: "Paid ads",
    description:
      "Google and Meta campaigns built around buying intent, with the landing pages and tracking that decide whether the spend works.",
    points: [
      "Google Search, Performance Max and Meta",
      "Landing pages built, not just linked",
      "Conversion tracking you can audit",
    ],
    icon: Megaphone,
    featured: true,
  },
  {
    id: "social-media",
    title: "Social media marketing",
    description:
      "A publishing rhythm your team can sustain, on the two or three platforms where your buyers actually are — not all six.",
    points: [
      "Channel choice based on where buyers are",
      "Content calendar and production",
      "Community management and response times",
    ],
    icon: Share2,
  },
  {
    id: "content",
    title: "Content marketing",
    description:
      "Articles, comparisons and landing pages that answer real buying questions, written to be useful first and to rank as a result.",
    points: [
      "Topics from sales calls and search data",
      "Writing reviewed by the people doing the work",
      "Internal linking that compounds over time",
    ],
    icon: PenLine,
  },
  {
    id: "brand",
    title: "Brand strategy & creative",
    description:
      "Positioning, messaging and identity that make it obvious what you do, who it is for, and why you rather than the cheaper option.",
    points: [
      "Positioning and messaging framework",
      "Visual identity and brand guidelines",
      "Campaign and ad creative",
    ],
    icon: Sparkles,
  },
  {
    id: "cro",
    title: "Conversion & analytics",
    description:
      "Turning the traffic you already have into enquiries: analytics you can trust, then changes tested against it rather than argued about.",
    points: [
      "Analytics and event tracking set up properly",
      "Funnel analysis from click to enquiry",
      "A/B tests on the pages that matter",
    ],
    icon: BarChart3,
  },
];

/** The marketing cards shown on the home page rail. */
export const homeMarketingIds = ["seo", "paid-ads", "brand"];

/**
 * The customer journey, used on /marketing.
 *
 * It is the clearest way to explain why marketing, build and security sit in
 * one company: each stage hands over to the next, and the handovers are where
 * most agencies lose things.
 */
export const journey = [
  {
    stage: "01",
    label: "Be found",
    title: "Get in front of people already looking",
    copy: "SEO, paid search and social put you where buyers are searching. The measure is qualified enquiries, not impressions.",
  },
  {
    stage: "02",
    label: "Be believed",
    title: "Make the choice easy to justify",
    copy: "Positioning, proof and content that answer the questions a buyer asks before they contact anyone.",
  },
  {
    stage: "03",
    label: "Convert",
    title: "Turn interest into enquiries",
    copy: "Fast, clear pages built by the same team that runs the campaigns, so traffic does not land on a page nobody optimised.",
  },
  {
    stage: "04",
    label: "Keep it",
    title: "Hold on to what you win",
    copy: "Automation, CRM and lifecycle email keep customers moving, and security testing keeps their data where it belongs.",
  },
] as const;
