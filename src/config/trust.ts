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
 * STILL DELIBERATELY ABSENT: client logos, named testimonials, and any
 * certification we do not hold. On a security site an unverifiable credential
 * is worse than no credential, because a technical buyer checks — and a logo
 * wall assembled without written permission is a legal problem as well as a
 * credibility one.
 *
 * Track-record figures DO now appear, and they live in `config/proof.ts` —
 * they are the studio's own numbers, supplied by the owner, and that file is
 * the only place they are written down. Compliance is stated throughout as
 * readiness and support, never as certification.
 *
 * What is here is verifiable by inspection: public methodologies anyone can
 * look up, deliverables that either arrive or do not, and commitments that are
 * either honoured or not. See proofSlots at the bottom for the places logos
 * and testimonials go once there is written permission for them.
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
      "Your repository, your cloud accounts, your domains — from the first commit. Nothing proprietary that you have to keep paying us to keep running.",
    icon: GitPullRequest,
  },
  {
    title: "Retest is included",
    description:
      "A finding is not closed because someone says it is fixed. We verify it and reissue the report, so you can prove it closed rather than claim it.",
    icon: RefreshCw,
  },
  {
    title: "Least-privilege access",
    description:
      "We ask for the least access that lets us do the agreed work, on named accounts you can revoke at any time — and we tell you what we intend to touch before we touch it.",
    icon: KeyRound,
  },
  {
    title: "Data returned or destroyed",
    description:
      "When the engagement ends, all test data, credentials and evidence are handed back or securely destroyed — and we confirm it in writing.",
    icon: Trash2,
  },
  {
    title: "NDA before scoping",
    description:
      "We will sign yours before you tell us anything about the system. The scoping conversation happens under it, not after.",
    icon: ScrollText,
  },
  {
    title: "Findings you can act on",
    description:
      "Every finding comes with steps to reproduce it, its real-world impact, and a specific fix. If we cannot explain how it would be exploited, it does not go in the report as a finding.",
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
      "Written for the engineers who have to fix it — not padded to justify a page count.",
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
      "Ordered by what is genuinely exploitable in your deployment, not by raw scanner output.",
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
      "The part most vendors charge extra for. With us it is part of the price.",
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
