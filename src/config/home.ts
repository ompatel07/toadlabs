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
  /* The three words on the logo. "Product studio" undersold the half of the
     business that is services — websites, apps, CRM, automation — and named a
     shape rather than a capability. These cover both halves and are already
     the brand's own line, so the badge and the mark now say the same thing. */
  eyebrow: ["Attract", "Build", "Protect"],
  /** Set at display size in the hero, like a title card. */
  wordmark: "OFFSCRIPT.",
  statement: "Software built to last in production — and attacked before it ships.",
  subtitle:
    "Digital marketing, software and cybersecurity from Ahmedabad. One team brings in the leads, builds the site, app or product they land in, and attacks it before your customers trust it with their data.",
  primaryCta: { label: "Book a call", href: "/contact" },
  secondaryCta: { label: "See our work", href: "/work" },
  /** Honest floating cards. No invented metrics. */
  cards: {
    build: {
      label: "Grow & build",
      copy: "SEO, ads, websites, apps, SaaS",
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
      "The engineer who scopes your project is the one who writes it. Nothing is handed to a team you never met.",
    icon: Code2,
  },
  {
    title: "Yours from commit one",
    description:
      "Your repository, your cloud accounts, your domains — from day one. Nothing you have to keep paying us to keep running.",
    icon: GitPullRequest,
  },
  {
    title: "Offence and defence, one team",
    description:
      "The people who write your access control are the people who try to break it the following month.",
    icon: ShieldCheck,
  },
  {
    title: "Budgets, not opinions",
    description:
      "Speed and accessibility targets are agreed up front and checked against the real build — not argued about after launch.",
    icon: Gauge,
  },
];

export const pillars = {
  grow: {
    label: "Grow",
    title: "First, bring people who are ready to buy",
    description:
      "Most software projects are judged on a number nobody planned for: enquiries. We run the search, paid and content work that brings buyers in, and we build the pages they land on — so the campaign and the page are never two vendors blaming each other for the same drop-off.",
    points: [
      "SEO, Google Ads and paid social run against enquiries",
      "Landing pages built in-house, not requested from someone else",
      "Analytics and conversion tracking you can actually audit",
      "Reporting that leads with cost per enquiry",
    ],
    cta: { label: "Digital marketing", href: "/marketing" },
  },
  build: {
    label: "Build",
    title: "Then build something still cheap to change in year two",
    description:
      "Most software does not fail at launch. It fails eighteen months in, when a change that should take a day takes a fortnight because nobody wrote down why the database looks like that. We build for that moment: typed boundaries, migrations that run both ways, tests where they earn their cost, and every significant decision recorded with the trade-off behind it.",
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
    title: "Then come back and attack it",
    description:
      "Testing your own work sounds like a conflict of interest — until you see how differently an engineer writes access control knowing a colleague will spend a week trying to defeat it. We test against OWASP ASVS and PTES, rank findings by what is actually reachable in your deployment rather than by scanner score, and retest once you have fixed them.",
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
      "You get a written scope that says what we are building and what we are deliberately not — with the reasoning attached. Later arguments about features start from that document instead of from memory.",
  },
  {
    number: "02",
    title: "Shape",
    description:
      "We settle the data model, the trust boundaries and the interface before any production code exists. It is the cheapest hour of the whole engagement, and the one most often skipped.",
  },
  {
    number: "03",
    title: "Build",
    description:
      "Every week you see working software, not a progress bar. You are looking at the same build we are, early enough that changing your mind is still cheap.",
  },
  {
    number: "04",
    title: "Harden and hand over",
    description:
      "We security-test it, hold it to the agreed performance budgets, write the runbooks, and walk your team through it. You end up owning the repository, the infrastructure and the knowledge to run it.",
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


export interface FaqItem {
  question: string;
  answer: string;
}

export const faqs: FaqItem[] = [
  {
    question: "How is this different from hiring an agency?",
    answer:
      "You are buying how it gets built, not just that it gets built. Agency code only has to survive one event — the handover — and every shortcut taken before then lands on whoever inherits it. We maintain our own products, so we already work the way you want your software built: decisions written down, a test suite that means something, and a release process your team can run without calling us.",
  },
  {
    question: "Do you work with teams outside Ahmedabad?",
    answer:
      "Yes — across India and internationally. In practice that means one scheduled call a week, a shared channel for everything else, and working hours that overlap yours for anything that genuinely needs to be live. Progress is measured by a weekly demo of working software, not status reports.",
  },
  {
    question: "Can you test software you did not build?",
    answer:
      "Yes — most of our security work is on code we did not write, built by in-house teams or other vendors. We have no interest in assigning blame for how it got there. The report tells you what an attacker can actually reach, what it would cost them, and what to fix first.",
  },
  {
    question: "What does an engagement cost?",
    answer:
      "It depends on scope, and any number quoted before we understand your system will be wrong in one direction or the other. Book a call and we will scope it properly. Where the boundary is clear you get a fixed price for a defined phase. Where it genuinely is not, we will tell you that instead of pricing a guess and renegotiating later.",
  },
  {
    question: "Who owns the code and the infrastructure?",
    answer:
      "You do, from the first commit. We work in your repository and your cloud accounts wherever possible, and we build nothing proprietary that you have to keep paying us to maintain. If leaving us were expensive, staying would not really be your decision.",
  },
  {
    question: "What happens after launch?",
    answer:
      "You get runbooks, architecture notes and a walkthrough with whoever will operate the system. After that, ongoing support or continued development is available if you want it — but it is an option, not a dependency we built in. A good handover is one where you could choose never to call us again.",
  },
];
