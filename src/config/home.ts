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
  eyebrow: "IT services & cybersecurity",
  /** Set at display size in the hero, like a title card. */
  wordmark: "Toad Labs.",
  statement:
    "Product-builder discipline, applied to client builds.",
  subtitle:
    "We build software the way product teams build it — then we try to break it before anyone else does.",
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
    title: "Senior engineers only",
    description:
      "The people who scope your project are the people who write it.",
    icon: Code2,
  },
  {
    title: "You own the code",
    description:
      "Your repository, your infrastructure, your accounts. From commit one.",
    icon: GitPullRequest,
  },
  {
    title: "Security in-house",
    description:
      "We test what we build — and what other teams built, too.",
    icon: ShieldCheck,
  },
  {
    title: "Performance budgets",
    description:
      "Measured against real targets, not declared done and forgotten.",
    icon: Gauge,
  },
];

export const pillars = {
  build: {
    label: "Build",
    title: "Software that survives its second year",
    description:
      "Most agency code is written to pass a handover, not to be maintained. We build the way product teams build, because that is what we are the rest of the time: typed boundaries, real tests, migrations that run, and a release process your team can operate without us.",
    points: [
      "Architecture decisions written down, not folklore",
      "Tests where they earn their cost",
      "CI, staging, and rollback from the first week",
      "Documentation your next hire can actually follow",
    ],
    cta: { label: "Explore services", href: "/services" },
  },
  secure: {
    label: "Secure",
    title: "Then we try to break it",
    description:
      "Building and breaking in the same studio means findings arrive with a fix, not just a severity rating. We run VAPT, penetration tests, and secure code reviews against public standards — OWASP Top 10, ASVS, PTES — and we retest after you remediate.",
    points: [
      "VAPT and application penetration testing",
      "Secure code review and cloud posture review",
      "Findings prioritised by real exploitability",
      "Retest included, so closure is evidenced",
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
      "We work out what the thing actually has to do, and just as importantly what it does not. You get a written scope with the cuts and the reasoning visible.",
  },
  {
    number: "02",
    title: "Shape",
    description:
      "Architecture, data model, and interface decided before anyone writes production code. Decisions are recorded so they can be revisited rather than re-argued.",
  },
  {
    number: "03",
    title: "Build",
    description:
      "Weekly demos against working software. No status decks — if it is not running, it is not done, and you see the same build we do.",
  },
  {
    number: "04",
    title: "Harden & hand over",
    description:
      "Security testing, performance budgets, and a handover your team can operate. Repository, infrastructure, and documentation are yours.",
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
      "Most agencies optimise for delivery against a signed scope; the code only has to survive until handover. We run our own products, so we build client work the same way we build software we will still be maintaining in two years. Practically, that means you get architecture decisions in writing, a test suite, and a release process — not a zip file and a support address.",
  },
  {
    question: "Do you work with teams outside Ahmedabad?",
    answer:
      "Yes. We are based in Ahmedabad and work with teams across India and internationally. Delivery runs asynchronously with a weekly demo, and we overlap working hours with your timezone for the calls that need to be live.",
  },
  {
    question: "Can you do security testing on software you did not build?",
    answer:
      "That is a large share of our security work. We test applications, APIs, and cloud environments built by in-house teams and other vendors. Reports are written for two audiences: engineers who need reproduction steps, and decision-makers who need to know what to fix first.",
  },
  {
    question: "What does an engagement cost?",
    answer:
      "It depends on scope, and we would rather scope it properly than publish a number that turns out to be wrong. Book a call and we will talk through what you need; if a fixed-scope phase makes sense, we will quote one, and if the work is genuinely open-ended we will say so rather than pretend otherwise.",
  },
  {
    question: "Who owns the code and the infrastructure?",
    answer:
      "You do, from the first commit. Work happens in your repository and your cloud accounts wherever possible. There is no proprietary framework you have to keep paying us to maintain, and no lock-in that makes leaving expensive.",
  },
  {
    question: "What happens after launch?",
    answer:
      "Handover includes documentation, runbooks, and a walkthrough with whoever will operate the system. Beyond that we can stay on for a support or ongoing development arrangement, but it is an option rather than a dependency we designed in.",
  },
];
