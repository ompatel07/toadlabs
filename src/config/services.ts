import {
  Bot,
  Globe,
  Layers,
  MessageSquare,
  PhoneCall,
  Puzzle,
  Rocket,
  Smartphone,
  Users,
  Workflow,
  type LucideIcon,
} from "lucide-react";

export interface Service {
  /** Anchor id — used by /services and by every deep link in the footer. */
  id: string;
  title: string;
  /** Outcome-focused, max two sentences. Lead with what the client ends up
   *  with, not with the stack. */
  description: string;
  /** Capability detail. Stack names belong here, not in the description. */
  points: string[];
  icon: LucideIcon;
  /** Feature tiles span two columns on the services grid. */
  featured?: boolean;
}

export const services: Service[] = [
  {
    id: "websites",
    title: "Websites",
    description:
      "A site that loads fast on a mid-range phone, holds up to an SEO audit, and your team can edit without a developer on standby.",
    points: [
      "Static generation, Core Web Vitals budgets in CI",
      "Semantic markup and WCAG AA as the baseline",
      "Structured data, sitemaps, canonical handling",
    ],
    icon: Globe,
  },
  {
    id: "web-mobile-apps",
    title: "Web & mobile apps",
    description:
      "One product that works properly on every screen your customers actually own — sharing one core instead of drifting into two codebases that disagree.",
    points: [
      "React and React Native over one shared core",
      "Offline-tolerant state and conflict resolution",
      "Store submission, signing and release pipelines",
    ],
    icon: Smartphone,
  },
  {
    id: "mvp",
    title: "MVP development",
    description:
      "The smallest honest version of your product, in front of real users while you still have the runway to act on what they do.",
    points: [
      "Scope negotiation — what gets cut, and why, in writing",
      "Auth, permissions and audit built early; polish deferred",
      "Instrumented from day one so learning is evidence, not opinion",
    ],
    icon: Rocket,
    featured: true,
  },
  {
    id: "saas",
    title: "SaaS products",
    description:
      "Multi-tenant software with the unglamorous parts that decide whether you can sell to bigger customers: tenant isolation, roles, billing and audit trails.",
    points: [
      "Tenant isolation enforced at the data layer, not the UI",
      "RBAC, subscription billing, usage metering",
      "Observability, error budgets and a release process",
    ],
    icon: Layers,
    featured: true,
  },
  {
    id: "crm",
    title: "CRM",
    description:
      "A pipeline your team actually keeps up to date, because it saves them time — shaped around how you really sell, not how a vendor assumed you would.",
    points: [
      "Custom stages, permissions and record models",
      "Email, calendar and WhatsApp integration",
      "Migration from spreadsheets or an off-the-shelf tool",
    ],
    icon: Users,
  },
  {
    id: "ai-automation",
    title: "AI automation",
    description:
      "We automate the specific repetitive work eating your team's week, and put a human checkpoint anywhere a wrong answer would be expensive.",
    points: [
      "Document extraction, triage, summarisation, routing",
      "Human-in-the-loop review on consequential steps",
      "An evaluation set, so quality is measured against a baseline",
    ],
    icon: Workflow,
  },
  {
    id: "whatsapp-automation",
    title: "WhatsApp automation",
    description:
      "Reach customers where they already reply, without anyone watching an inbox at midnight. Built on the official WhatsApp Business Platform — not a workaround that gets your number banned.",
    points: [
      "Template design and approval, opt-in handling",
      "Notifications, reminders, order and booking flows",
      "Clean escalation from automated reply to a person",
    ],
    icon: MessageSquare,
  },
  {
    id: "ai-chatbots",
    title: "AI chatbots",
    description:
      "An assistant grounded in your own content that says \"I don't know\" instead of inventing an answer — because a confident wrong reply costs more than no reply.",
    points: [
      "Answers grounded in your own documentation, with citations",
      "Refusal behaviour and escalation paths defined up front",
      "Conversation logging and ongoing quality review",
    ],
    icon: Bot,
  },
  {
    id: "ai-voice",
    title: "AI voice assistants",
    description:
      "Voice agents that handle the calls which follow a script and hand the rest to a person — fast enough that callers stay on the line.",
    points: [
      "Inbound qualification, booking and callbacks",
      "Low-latency speech pipelines and barge-in handling",
      "Telephony integration, recording and transcripts",
    ],
    icon: PhoneCall,
  },
  {
    id: "custom",
    title: "Custom solutions",
    description:
      "The work that fits no category — internal tools, integrations, migrations, and the unglamorous systems quietly holding your operations together.",
    points: [
      "Internal tools and admin systems",
      "Third-party and legacy integrations",
      "Data migration and platform moves, run without downtime",
    ],
    icon: Puzzle,
  },
];

/** Slightly shortened copy for the home page grid. */
export const homeServiceIds = [
  "websites",
  "web-mobile-apps",
  "mvp",
  "saas",
  "ai-automation",
  "whatsapp-automation",
] as const;
