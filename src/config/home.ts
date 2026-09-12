import {
  Code2,
  GitPullRequest,
  Gauge,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

/**
 * Home page content.
 *
 * Note what is absent: client logos, testimonials, and statistics. We have no
 * real ones, and the design system bans inventing them. The trust strip states
 * verifiable capabilities and working commitments instead — claims about how we
 * work, which are true by construction.
 */

export const hero = {
  eyebrow: "Product studio & security practice",
  /** Set at display size in the hero, like a title card. */
  wordmark: "Toad Labs.",
  statement: "Software built to survive production — and tested like an adversary.",
  subtitle:
    "One team designs your architecture, ships it, and then tries to break it. Most companies buy those from two vendors and let them argue.",
  primaryCta: { label: "Book a call", href: "/contact" },
  secondaryCta: { label: "See our work", href: "/work" },
  /** Honest floating cards. No invented metrics. */
  cards: {
    build: {
      label: "Build",
      copy: "Web, mobile, MVPs, SaaS, automation",
    },
    secure: {
      label: "Secure",
      copy: "VAPT, pentesting, code review",
    },
  },
} as const;

export interface TrustItem {
  title: string;
  description: string;
  icon: LucideIcon;
}

export const trustStrip: TrustItem[] = [
  {
    title: "You work with the builders",
    description:
      "The engineer who scopes your project writes it. Nothing is handed down to a bench you never met.",
    icon: Code2,
  },
  {
    title: "Yours from commit one",
    description:
      "Your repository, your cloud accounts, your domains. No proprietary layer you have to keep paying to keep running.",
    icon: GitPullRequest,
  },
  {
    title: "Offence and defence, one team",
    description:
      "The people who review your authorisation logic are the people who try to bypass it the following month.",
    icon: ShieldCheck,
  },
  {
    title: "Budgets, not opinions",
    description:
      "Performance and accessibility targets are set at the start and checked against the running build, not argued about at the end.",
    icon: Gauge,
  },
];

export const pillars = {
  build: {
    label: "Build",
    title: "Systems that are still cheap to change in year two",
    description:
      "Most software does not fail at launch. It fails eighteen months later, when a change that should take a day takes a fortnight because nobody wrote down why the schema looks like that. We build for that moment: typed boundaries, migrations that run forwards and backwards, tests where they earn their cost, and decisions recorded with the trade-off that drove them.",
    points: [
      "Architecture decision records, not folklore",
      "Reversible migrations and seeded environments",
      "CI, staging and rollback from week one",
      "Handover documentation your next hire can follow",
    ],
    cta: { label: "Explore services", href: "/services" },
  },
  secure: {
    label: "Secure",
    title: "Then we come back and attack it",
    description:
      "Testing your own work sounds like a conflict of interest until you have seen how differently an engineer writes access control knowing a colleague will spend a week trying to defeat it. We test against OWASP ASVS and PTES, prioritise by what is reachable in your actual deployment rather than by scanner score, and retest after you remediate.",
    points: [
      "Authenticated and unauthenticated application testing",
      "Secure code review of the authorisation layer",
      "Findings ranked by real exploitability, with proof",
      "Retest included — closure is evidenced, not asserted",
    ],
    cta: { label: "Cybersecurity services", href: "/cybersecurity" },
  },
} as const;

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

export const process: ProcessStep[] = [
  {
    number: "01",
    title: "Scope",
    description:
      "We work out what the system has to do and, more usefully, what it does not. You get a written scope with the cuts visible and the reasoning attached, so later feature arguments start from a document rather than from memory.",
  },
  {
    number: "02",
    title: "Shape",
    description:
      "Data model, trust boundaries and interface settled before production code exists. This is the cheapest hour in the whole engagement, and the one most often skipped.",
  },
  {
    number: "03",
    title: "Build",
    description:
      "Weekly demos against software that runs. No percentage-complete bars — you see the same build we do, early enough that disagreeing with it is still cheap.",
  },
  {
    number: "04",
    title: "Harden and hand over",
    description:
      "Security testing, performance budgets, runbooks, and a walkthrough with whoever will operate it. You leave with the repository, the infrastructure and the knowledge.",
  },
];

/**
 * Tooling, split into two lanes for the stack band.
 *
 * The split is meaningful rather than cosmetic — build tooling runs one way,
 * security tooling the other — so the band carries information instead of just
 * filling width. Not client logos; those would have to be real.
 */
export const buildStack = [
  "TypeScript",
  "Next.js",
  "React",
  "React Native",
  "Node.js",
  "Python",
  "PostgreSQL",
  "Redis",
  "Prisma",
  "AWS",
  "GCP",
  "Terraform",
  "Docker",
  "Kubernetes",
  "GitHub Actions",
] as const;

export const secureStack = [
  "Burp Suite",
  "OWASP ASVS",
  "OWASP MASVS",
  "Semgrep",
  "Nuclei",
  "Playwright",
  "Trivy",
  "Grafana",
  "MITRE ATT&CK",
  "CIS Benchmarks",
  "NIST SP 800-115",
] as const;

/** Flat list, kept for anything that wants the whole set. */
export const techStack: string[] = [...buildStack, ...secureStack];

export interface FaqItem {
  question: string;
  answer: string;
}

export const faqs: FaqItem[] = [
  {
    question: "How is this different from hiring an agency?",
    answer:
      "Agency code has to survive one event: the handover. Every shortcut taken before that point lands on someone else afterwards, and the incentive quietly points that way for everyone involved. We run our own products, so the habits we already have are the ones you want — decisions written down, a test suite that means something, a release process your team can operate without calling us. You are buying how it is built, not just that it gets built.",
  },
  {
    question: "Do you work with teams outside Ahmedabad?",
    answer:
      "Yes, across India and internationally. Delivery runs asynchronously against a weekly demo, and we hold working-hour overlap with your timezone for the conversations that genuinely need to be live. In practice most engagements involve one scheduled call a week and a shared channel for everything else.",
  },
  {
    question: "Can you test software you did not build?",
    answer:
      "That is most of our security work — applications, APIs and cloud estates built by in-house teams and other vendors. We have no interest in litigating who wrote what. The report is about what is reachable, what it would cost an attacker, and what to fix first.",
  },
  {
    question: "What does an engagement cost?",
    answer:
      "It depends on scope, and quoting before understanding the system produces a number that is wrong in one direction or the other. Book a call and we will scope it properly. Where the boundary is clear we quote a fixed-scope phase; where it genuinely is not, we say so rather than pricing a guess and renegotiating later.",
  },
  {
    question: "Who owns the code and the infrastructure?",
    answer:
      "You do, from the first commit. Work happens in your repository and your cloud accounts wherever possible. There is no proprietary framework you have to keep paying us to maintain — if leaving us is expensive, then staying was never really a decision you got to make.",
  },
  {
    question: "What happens after launch?",
    answer:
      "Handover includes runbooks, architecture notes and a walkthrough with whoever will operate the system. After that a support or continued-development arrangement is available, but it is an option rather than a dependency we designed in. The measure of a good handover is that you could choose not to call us.",
  },
];
