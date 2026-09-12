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
      "A site that loads fast, ranks, and turns visitors into booked calls. Built to be edited without a developer on standby.",
    points: [
      "Marketing sites, landing pages, documentation",
      "Static generation, Core Web Vitals budgets",
      "Accessibility and semantic markup by default",
    ],
    icon: Globe,
  },
  {
    id: "web-mobile-apps",
    title: "Web & mobile apps",
    description:
      "One product that behaves properly on every screen your users actually own. Shared logic, native-feeling interfaces.",
    points: [
      "React and React Native, one shared domain layer",
      "Offline-tolerant state and sync",
      "App store and Play Store release pipelines",
    ],
    icon: Smartphone,
  },
  {
    id: "mvp",
    title: "MVP development",
    description:
      "The smallest honest version of your product, shipped to real users fast enough to learn something. Scoped so the code survives if the bet works.",
    points: [
      "Scope negotiation — what gets cut, and why",
      "Working software in weeks, not quarters",
      "No throwaway architecture disguised as speed",
    ],
    icon: Rocket,
    featured: true,
  },
  {
    id: "saas",
    title: "SaaS products",
    description:
      "Multi-tenant products with the parts nobody demos but everybody needs: billing, roles, audit trails, and an upgrade path.",
    points: [
      "Tenancy, RBAC, and subscription billing",
      "Usage metering and admin tooling",
      "Observability and release process from day one",
    ],
    icon: Layers,
    featured: true,
  },
  {
    id: "crm",
    title: "CRM",
    description:
      "A pipeline your team fills in because it saves them time, not because you told them to. Shaped around how you actually sell.",
    points: [
      "Custom pipelines, stages, and permissions",
      "Email, calendar, and WhatsApp integration",
      "Migration from spreadsheets or an off-the-shelf tool",
    ],
    icon: Users,
  },
  {
    id: "ai-automation",
    title: "AI automation",
    description:
      "Automate the specific repetitive work that eats your team's week, with a human checkpoint where it matters. Measured against a baseline before it goes live.",
    points: [
      "Document extraction, triage, summarisation, routing",
      "Human-in-the-loop review for consequential steps",
      "Evaluation harness so quality is tracked, not assumed",
    ],
    icon: Workflow,
  },
  {
    id: "whatsapp-automation",
    title: "WhatsApp automation",
    description:
      "Reach customers where they already reply, without a person watching the inbox at midnight. Built on the official Business Platform.",
    points: [
      "WhatsApp Business Platform, template approvals",
      "Notifications, reminders, order and booking flows",
      "Clean handoff from automated reply to a real person",
    ],
    icon: MessageSquare,
  },
  {
    id: "ai-chatbots",
    title: "AI chatbots",
    description:
      "An assistant grounded in your own content that says \"I don't know\" instead of inventing an answer. Scoped, tested, and monitored after launch.",
    points: [
      "Retrieval grounded in your documentation",
      "Guardrails, refusal behaviour, and escalation paths",
      "Conversation logging and quality review",
    ],
    icon: Bot,
  },
  {
    id: "ai-voice",
    title: "AI voice assistants",
    description:
      "Voice agents that handle the calls that follow a script, and hand over the ones that don't. Built for latency people will tolerate.",
    points: [
      "Inbound qualification, booking, and callbacks",
      "Low-latency speech pipelines",
      "Telephony integration and call transcripts",
    ],
    icon: PhoneCall,
  },
  {
    id: "custom",
    title: "Custom solutions",
    description:
      "The work that doesn't fit a category — internal tools, integrations, migrations, and the systems holding your operations together.",
    points: [
      "Internal tools and admin systems",
      "Third-party and legacy integrations",
      "Data migration and platform moves",
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
