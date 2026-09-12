import {
  Bug,
  ClipboardCheck,
  Cloud,
  Code2,
  FileSearch,
  Radar,
  ShieldCheck,
  Siren,
  type LucideIcon,
} from "lucide-react";

/**
 * Cybersecurity page content.
 *
 * Rules held throughout: no invented certifications, no breach statistics, no
 * "X% of apps we test" figures, and compliance framed as readiness support
 * rather than a guaranteed pass. Methodologies named are public standards.
 */

export interface SecurityService {
  id: string;
  title: string;
  summary: string;
  scope: string[];
  standards: string[];
  icon: LucideIcon;
}

export const securityServices: SecurityService[] = [
  {
    id: "vapt",
    title: "VAPT",
    summary:
      "Vulnerability assessment and penetration testing across your applications, APIs, and network surface — automated coverage where it helps, manual testing where it matters.",
    scope: [
      "External and internal network testing",
      "Web application and API assessment",
      "Authenticated and unauthenticated passes",
      "Credentialed configuration review",
    ],
    standards: ["PTES", "NIST SP 800-115", "OWASP Top 10"],
    icon: Radar,
  },
  {
    id: "pentesting",
    title: "Web & mobile penetration testing",
    summary:
      "Manual, goal-oriented testing against your application the way an attacker would approach it — chaining low-severity issues into the ones that actually matter.",
    scope: [
      "Authentication and session handling",
      "Authorisation and multi-tenant isolation",
      "Business logic abuse",
      "iOS and Android application testing",
    ],
    standards: ["OWASP ASVS", "OWASP MASVS"],
    icon: Bug,
  },
  {
    id: "audits",
    title: "Security audits",
    summary:
      "A structured review of how your system is built and operated, mapped against a verification standard so you can see coverage rather than a list of opinions.",
    scope: [
      "Architecture and trust-boundary review",
      "Control coverage against ASVS levels",
      "Secrets handling and key management",
      "Logging, monitoring, and alerting gaps",
    ],
    standards: ["OWASP ASVS", "CIS Benchmarks"],
    icon: ClipboardCheck,
  },
  {
    id: "code-review",
    title: "Secure code review",
    summary:
      "Reading the code, not just probing the surface. Finds the authorisation flaws and injection paths that black-box testing structurally cannot reach.",
    scope: [
      "Authorisation logic and access control",
      "Injection, deserialisation, SSRF paths",
      "Dependency and supply-chain review",
      "Static analysis tuned to your codebase",
    ],
    standards: ["OWASP ASVS", "MITRE ATT&CK"],
    icon: Code2,
  },
  {
    id: "cloud",
    title: "Cloud security posture",
    summary:
      "Review of your AWS, GCP, or Azure footprint — IAM, network exposure, storage, and the defaults nobody revisited after the first deploy.",
    scope: [
      "IAM roles, policies, and privilege creep",
      "Public exposure and network segmentation",
      "Storage, encryption, and backup posture",
      "Infrastructure-as-code review",
    ],
    standards: ["CIS Benchmarks", "NIST SP 800-115"],
    icon: Cloud,
  },
  {
    id: "compliance",
    title: "Compliance readiness",
    summary:
      "Preparation support for the security questionnaire or audit ahead of you. We help you get evidence in order — we do not certify you, and no one can promise you a pass.",
    scope: [
      "Gap analysis against your target framework",
      "Evidence collection and documentation",
      "Policy and control mapping",
      "Questionnaire and auditor-question support",
    ],
    standards: ["ISO 27001 (readiness)", "SOC 2 (readiness)"],
    icon: FileSearch,
  },
  {
    id: "incident-response",
    title: "Incident response readiness",
    summary:
      "Making sure that when something does happen, you already know who does what. Tabletop exercises and runbooks, built before you need them.",
    scope: [
      "Response runbooks and escalation paths",
      "Tabletop exercises with your team",
      "Logging and forensic-readiness review",
      "Post-incident review process",
    ],
    standards: ["NIST SP 800-61", "MITRE ATT&CK"],
    icon: Siren,
  },
];

/** How a security engagement actually runs. */
export interface EngagementPhase {
  number: string;
  title: string;
  description: string;
  outputs: string[];
}

export const engagementPhases: EngagementPhase[] = [
  {
    number: "01",
    title: "Scope & rules of engagement",
    description:
      "We agree exactly what is in scope, what is explicitly out, when we test, and who to call if something goes wrong. Signed before anything is touched.",
    outputs: ["Signed scope document", "Rules of engagement", "Named contacts"],
  },
  {
    number: "02",
    title: "Reconnaissance & mapping",
    description:
      "We map the real attack surface — endpoints, roles, trust boundaries, third-party integrations — rather than assuming the documented one is complete.",
    outputs: ["Attack surface map", "Trust boundary diagram", "Test plan"],
  },
  {
    number: "03",
    title: "Testing",
    description:
      "Manual testing supported by tooling, against the agreed standards. Critical findings are reported the moment we confirm them, not held back for the report.",
    outputs: ["Live critical alerts", "Working proof-of-concepts", "Daily notes"],
  },
  {
    number: "04",
    title: "Reporting",
    description:
      "Findings written for engineers and summarised for decision-makers, prioritised by exploitability in your deployment rather than by raw scanner severity.",
    outputs: ["Technical report", "Severity breakdown", "Executive summary"],
  },
  {
    number: "05",
    title: "Remediation support",
    description:
      "We stay available while you fix things. Questions about a finding go to the person who found it, not to a support queue.",
    outputs: ["Fix guidance", "Engineer-to-engineer calls"],
  },
  {
    number: "06",
    title: "Retest & sign-off",
    description:
      "We verify the fixes and reissue the report showing what closed and what remains. This is included, not a separate engagement.",
    outputs: ["Retest report", "Closure evidence", "Procurement-ready document"],
  },
];

/**
 * Severity model.
 *
 * Colour is never the only carrier of meaning — every row states the label in
 * text and the swatch is paired with it.
 */
export interface Severity {
  label: string;
  token: string;
  meaning: string;
  response: string;
}

export const severityModel: Severity[] = [
  {
    label: "Critical",
    token: "bg-sev-critical",
    meaning:
      "Directly exploitable, leads to system compromise or mass data exposure.",
    response: "Reported on discovery, same day.",
  },
  {
    label: "High",
    token: "bg-sev-high",
    meaning:
      "Exploitable with limited constraints; significant data or integrity impact.",
    response: "Reported within 24 hours.",
  },
  {
    label: "Medium",
    token: "bg-sev-medium",
    meaning:
      "Exploitable under specific conditions, or a meaningful weakening of defence in depth.",
    response: "Included in the report.",
  },
  {
    label: "Low",
    token: "bg-sev-low",
    meaning:
      "Limited impact or difficult to exploit, but a real deviation from good practice.",
    response: "Included in the report.",
  },
  {
    label: "Informational",
    token: "bg-sev-info",
    meaning:
      "No direct security impact; hardening opportunities and observations.",
    response: "Included as an appendix.",
  },
];

export const securityFaqs = [
  {
    question: "Will testing take our production system down?",
    answer:
      "That risk is what the rules of engagement exist to manage. We agree testing windows, rate limits, and any techniques that are off the table before we start, and we prefer a staging environment that mirrors production where one exists. If we do test production, you get a named contact who can reach us immediately, and we stop on request.",
  },
  {
    question: "Do you test systems you did not build?",
    answer:
      "Most of our security work is on other people's code — built by in-house teams or by other vendors. We have no interest in blaming whoever built it; the report is about what to fix and in what order.",
  },
  {
    question: "Can you certify us for ISO 27001 or SOC 2?",
    answer:
      "No, and be careful with anyone who says they can — certification comes from an accredited auditor, not from a testing vendor. What we do is readiness work: gap analysis against the framework, getting evidence in order, and answering the technical questions an auditor or an enterprise questionnaire will ask.",
  },
  {
    question: "What access do you need?",
    answer:
      "The narrowest access that lets us do the agreed work, on named accounts we can hand back. For an authenticated application test that usually means one account per role. We tell you what we intend to touch before we touch it, and test data and credentials are returned or destroyed at the end.",
  },
  {
    question: "How soon do we hear about a serious finding?",
    answer:
      "Immediately. Critical findings are reported the moment we confirm them, with enough detail to act on, rather than being held back for the final report. You should never learn about a critical issue for the first time in a PDF two weeks later.",
  },
  {
    question: "Is the retest really included?",
    answer:
      "Yes. A finding is not closed because someone says it is fixed — we verify it and reissue the report showing what actually closed. Charging separately for that would make the original report the product, when the point is the fix.",
  },
];
