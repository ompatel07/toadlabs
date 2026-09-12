/**
 * Case studies.
 *
 * ⚠️ EVERY ENTRY BELOW IS A PLACEHOLDER.
 *
 * These are illustrative examples of how we work, not delivered client
 * engagements. The design system treats this as a hard rule
 * (design-system/toad-labs/pages/work.md) because publishing invented client
 * work is a real-world harm, so the UI surfaces it in four places: a banner on
 * the index, a badge on each card, a notice on each case study, and
 * `robots: noindex` on the individual pages.
 *
 * When real work replaces these:
 *   1. set `isPlaceholder: false`
 *   2. the banner, badges, notices and noindex drop away automatically
 *   3. only then add outcome metrics — and only ones that are actually true
 *
 * Note there are no numbers in any `outcome` below. That is deliberate.
 */

export interface CaseStudy {
  slug: string;
  /** Generic sector descriptor — never an invented company name. */
  sector: string;
  title: string;
  summary: string;
  isPlaceholder: boolean;
  problem: string[];
  approach: string[];
  stack: string[];
  /** Qualitative only while `isPlaceholder` is true. */
  outcome: string[];
  tags: string[];
}

export const caseStudies: CaseStudy[] = [
  {
    slug: "b2b-logistics-platform",
    sector: "B2B logistics",
    title: "Replacing a spreadsheet dispatch process with a real platform",
    summary:
      "A regional freight operator coordinating daily dispatch across shared spreadsheets, with no single view of a shipment.",
    isPlaceholder: true,
    problem: [
      "Dispatch ran on a set of shared spreadsheets that several people edited at once, so the same shipment could exist in three states.",
      "Nobody could answer where a consignment was without phoning the driver.",
      "Every new customer meant another tab and another manual reconciliation step.",
    ],
    approach: [
      "Mapped the real dispatch workflow with the people doing it before proposing any software.",
      "Shipped a single shipment record as the source of truth, then moved one workflow at a time onto it.",
      "Kept the spreadsheet export alive during the transition so the team was never forced to switch cold.",
    ],
    stack: [
      "Next.js",
      "TypeScript",
      "PostgreSQL",
      "Prisma",
      "Redis",
      "AWS",
    ],
    outcome: [
      "Dispatch moved from parallel spreadsheets to one shared record with an auditable history.",
      "Status questions became self-service instead of a phone call.",
      "Onboarding a new customer stopped requiring a new spreadsheet tab.",
    ],
    tags: ["Web app", "Internal tools", "Migration"],
  },
  {
    slug: "fintech-mvp",
    sector: "Fintech",
    title: "An MVP scoped down until it could actually ship",
    summary:
      "A founding team with a twelve-month feature list and a runway that did not support one.",
    isPlaceholder: true,
    problem: [
      "The initial scope covered four user types and a full back office before a single user had been observed.",
      "Compliance requirements were being designed around assumptions rather than a confirmed regulatory path.",
      "Runway made a twelve-month first release an existential risk.",
    ],
    approach: [
      "Cut scope to one user type and the single transaction that had to work.",
      "Built the audit and permission model early — the parts that are expensive to retrofit — and deferred everything cosmetic.",
      "Shipped to a closed group of real users and instrumented the flow before extending it.",
    ],
    stack: [
      "Next.js",
      "TypeScript",
      "PostgreSQL",
      "Stripe",
      "Terraform",
      "GCP",
    ],
    outcome: [
      "A working product in front of real users while runway remained, rather than a larger one after it.",
      "The permission and audit foundations carried into later releases without a rewrite.",
      "Scope decisions were recorded, so later feature debates started from a written baseline.",
    ],
    tags: ["MVP", "Fintech", "Product strategy"],
  },
  {
    slug: "healthcare-saas-security",
    sector: "Healthcare SaaS",
    title: "A security review before an enterprise procurement round",
    summary:
      "A growing SaaS product facing its first serious security questionnaire from a prospective enterprise customer.",
    isPlaceholder: true,
    problem: [
      "The product had grown quickly and no external party had ever tested it.",
      "Access control had been added per-feature over two years, with no central model.",
      "A procurement questionnaire was due and the team had no evidence to attach to it.",
    ],
    approach: [
      "Ran an application penetration test against the OWASP Top 10 and OWASP ASVS, plus a secure code review of the authorisation layer.",
      "Prioritised findings by exploitability in their actual deployment rather than by raw scanner severity.",
      "Retested after remediation and issued an updated report the team could take into procurement.",
    ],
    stack: [
      "Burp Suite",
      "OWASP ASVS",
      "Semgrep",
      "AWS",
      "Terraform",
    ],
    outcome: [
      "Authorisation moved from per-feature checks to one reviewable policy layer.",
      "Findings were remediated and confirmed closed on retest.",
      "The team went into procurement with a current report instead of an assurance.",
    ],
    tags: ["VAPT", "Secure code review", "Compliance readiness"],
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((study) => study.slug === slug);
}

export const hasPlaceholderWork = caseStudies.some(
  (study) => study.isPlaceholder,
);
