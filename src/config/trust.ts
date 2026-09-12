import {
  ClipboardCheck,
  FileSearch,
  GitPullRequest,
  KeyRound,
  RefreshCw,
  ScrollText,
  ShieldCheck,
  Trash2,
  type LucideIcon,
} from "lucide-react";

/**
 * Trust content.
 *
 * DELIBERATELY ABSENT: client logos, testimonials, certifications, and any
 * numeric claim ("200+ projects", "99.9% uptime", "ISO 27001"). None of those
 * are true yet, and on a security site an unverifiable credential is worse than
 * no credential — a technical buyer checks.
 *
 * What is here instead is verifiable by inspection: public methodologies anyone
 * can look up, deliverables that either arrive or do not, and commitments that
 * are either honoured or not. See PROOF_SLOTS at the bottom for the places real
 * evidence should go once it exists.
 */

/**
 * Public standards our work is measured against.
 *
 * Phrased as "we test against", never as accreditation — naming a methodology
 * is a statement about our process, whereas a logo would imply endorsement we
 * do not have.
 */
export interface Standard {
  name: string;
  full: string;
  scope: string;
}

export const standards: Standard[] = [
  {
    name: "OWASP Top 10",
    full: "Open Worldwide Application Security Project",
    scope: "Web application risk baseline",
  },
  {
    name: "OWASP ASVS",
    full: "Application Security Verification Standard",
    scope: "Depth-graded verification requirements",
  },
  {
    name: "OWASP MASVS",
    full: "Mobile Application Security Verification Standard",
    scope: "iOS and Android applications",
  },
  {
    name: "PTES",
    full: "Penetration Testing Execution Standard",
    scope: "Engagement structure and reporting",
  },
  {
    name: "NIST SP 800-115",
    full: "Technical Guide to Information Security Testing",
    scope: "Assessment methodology",
  },
  {
    name: "CIS Benchmarks",
    full: "Center for Internet Security Benchmarks",
    scope: "Cloud and host hardening",
  },
  {
    name: "MITRE ATT&CK",
    full: "Adversarial Tactics, Techniques & Common Knowledge",
    scope: "Threat modelling and mapping",
  },
];

/** Commitments that are checkable — each either happens or it does not. */
export interface Guarantee {
  title: string;
  description: string;
  icon: LucideIcon;
}

export const guarantees: Guarantee[] = [
  {
    title: "You own everything",
    description:
      "Your repository, your cloud accounts, your domains, from the first commit. No proprietary layer you have to keep paying to keep running.",
    icon: GitPullRequest,
  },
  {
    title: "Retest is included",
    description:
      "A finding is not closed because someone says it is fixed. We verify it and reissue the report, so closure is evidenced rather than claimed.",
    icon: RefreshCw,
  },
  {
    title: "Least-privilege access",
    description:
      "We ask for the narrowest access that lets us do the agreed work, on named accounts you can revoke, and we tell you what we intend to touch before we touch it.",
    icon: KeyRound,
  },
  {
    title: "Data returned or destroyed",
    description:
      "Test data, credentials and evidence are handed back or securely destroyed when the engagement ends, and we confirm it in writing.",
    icon: Trash2,
  },
  {
    title: "NDA before scoping",
    description:
      "Happy to sign yours before you tell us anything about the system. The scoping conversation happens under it, not after.",
    icon: ScrollText,
  },
  {
    title: "Findings you can act on",
    description:
      "Reproduction steps, real-world impact, and a concrete fix for every finding. If we cannot explain how it would be exploited, it does not go in as a finding.",
    icon: FileSearch,
  },
];

/** Exactly what lands at the end of a security engagement. */
export interface Deliverable {
  title: string;
  description: string;
  detail: string[];
  icon: LucideIcon;
}

export const deliverables: Deliverable[] = [
  {
    title: "Technical report",
    description:
      "Written for the engineers who have to fix it, not to pad a page count.",
    detail: [
      "Reproduction steps for every finding",
      "Affected endpoints, parameters, and versions",
      "Concrete remediation, not generic advice",
      "Evidence: requests, responses, screenshots",
    ],
    icon: FileSearch,
  },
  {
    title: "Severity breakdown",
    description:
      "Prioritised by exploitability in your actual deployment, not raw scanner output.",
    detail: [
      "Critical through informational, with reasoning",
      "Business impact stated in plain language",
      "A fix order you can hand to a sprint",
      "Executive summary for non-engineers",
    ],
    icon: ClipboardCheck,
  },
  {
    title: "Retest & sign-off",
    description:
      "The part most vendors charge extra for. It is part of the engagement.",
    detail: [
      "Retest after you remediate",
      "Updated report showing what closed",
      "Anything still open, clearly stated",
      "A document you can take to procurement",
    ],
    icon: ShieldCheck,
  },
];

/**
 * PROOF SLOTS — where real evidence goes once it exists.
 *
 * Flip `enabled` to true and fill the arrays; the components read these flags
 * and render nothing while they are false, so no empty section ever ships.
 */
export const proofSlots = {
  clientLogos: { enabled: false, items: [] as { name: string; src: string }[] },
  testimonials: {
    enabled: false,
    items: [] as { quote: string; author: string; role: string }[],
  },
  certifications: {
    enabled: false,
    items: [] as { name: string; issuer: string; year: string }[],
  },
} as const;
