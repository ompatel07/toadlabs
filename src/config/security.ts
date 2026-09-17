import {
  Bug,
  ClipboardCheck,
  Cloud,
  Code2,
  FileSearch,
  Radar,
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
      "Assessment and penetration testing across your applications, APIs and network. Tools give us coverage; a tester on the keyboard finds everything that requires understanding how your business actually works.",
    scope: [
      "External and internal network testing",
      "Web application and API assessment",
      "Authenticated passes for every user role",
      "Credentialed configuration review",
    ],
    standards: ["PTES", "NIST SP 800-115", "OWASP Top 10"],
    icon: Radar,
  },
  {
    id: "pentesting",
    title: "Web & mobile penetration testing",
    summary:
      "Manual testing with a goal, not a checklist. Scanners find known signatures — the findings that matter usually come from chaining three 'low severity' issues into one that ends with your data.",
    scope: [
      "Authentication, session and token handling",
      "Authorisation and multi-tenant isolation",
      "Business logic and workflow abuse",
      "iOS and Android, including local storage and transport",
    ],
    standards: ["OWASP ASVS", "OWASP MASVS"],
    icon: Bug,
  },
  {
    id: "audits",
    title: "Security audits",
    summary:
      "A structured review of how your system is built and run, mapped to a published verification standard. You get measured coverage you can point at — not one engineer's list of opinions.",
    scope: [
      "Architecture and trust-boundary review",
      "Control coverage against a chosen ASVS level",
      "Secrets handling and key management",
      "Logging, monitoring and alerting gaps",
    ],
    standards: ["OWASP ASVS", "CIS Benchmarks"],
    icon: ClipboardCheck,
  },
  {
    id: "code-review",
    title: "Secure code review",
    summary:
      "We read the source, not just probe the surface. Some of the most damaging flaws — like a user being able to load another customer's records — are nearly invisible from outside and obvious the moment you read the code.",
    scope: [
      "Authorisation logic and access-control paths",
      "Injection, deserialisation and SSRF sinks",
      "Dependency and supply-chain review",
      "Static analysis tuned to your codebase, not defaults",
    ],
    standards: ["OWASP ASVS", "MITRE ATT&CK"],
    icon: Code2,
  },
  {
    id: "cloud",
    title: "Cloud security posture",
    summary:
      "A review of your AWS, GCP or Azure setup: permissions, what is exposed to the internet, how data is stored, and the defaults nobody revisited after the first deploy went out under deadline.",
    scope: [
      "IAM roles, policies and privilege creep",
      "Public exposure and network segmentation",
      "Encryption, key rotation and backup posture",
      "Infrastructure-as-code review",
    ],
    standards: ["CIS Benchmarks", "NIST SP 800-115"],
    icon: Cloud,
  },
  {
    id: "compliance",
    title: "Compliance readiness",
    summary:
      "Preparation for the audit or security questionnaire in front of you. We get your evidence in order and answer the technical questions. We do not issue certificates, and nobody honest will promise you a pass.",
    scope: [
      "Gap analysis against your target framework",
      "Evidence collection and control mapping",
      "Policy documentation support",
      "Enterprise questionnaire and auditor-question support",
    ],
    standards: ["ISO 27001 (readiness)", "SOC 2 (readiness)"],
    icon: FileSearch,
  },
  {
    id: "incident-response",
    title: "Incident response readiness",
    summary:
      "Decide who does what before it happens, rather than at 2am in a group chat. Runbooks and practice drills, built while there is still time to think clearly.",
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
      "We agree exactly what is in scope, what is off limits, when we test, and who to call if something goes wrong. All of it signed before anything is touched.",
    outputs: ["Signed scope document", "Rules of engagement", "Named contacts"],
  },
  {
    number: "02",
    title: "Reconnaissance & mapping",
    description:
      "We map what is really exposed — endpoints, user roles, trust boundaries, third-party integrations — rather than trusting that the documentation is complete. It rarely is.",
    outputs: ["Attack surface map", "Trust boundary diagram", "Test plan"],
  },
  {
    number: "03",
    title: "Testing",
    description:
      "Manual testing supported by tools, against the standards we agreed. Anything critical reaches you the moment we confirm it — we do not sit on it until the report.",
    outputs: ["Live critical alerts", "Working proof-of-concepts", "Daily notes"],
  },
  {
    number: "04",
    title: "Reporting",
    description:
      "Findings written for your engineers and summarised for whoever signs off, ordered by what is genuinely exploitable in your deployment rather than by raw scanner severity.",
    outputs: ["Technical report", "Severity breakdown", "Executive summary"],
  },
  {
    number: "05",
    title: "Remediation support",
    description:
      "We stay available while you fix things. A question about a finding goes straight to the person who found it — not into a support queue.",
    outputs: ["Fix guidance", "Engineer-to-engineer calls"],
  },
  {
    number: "06",
    title: "Retest & sign-off",
    description:
      "We verify your fixes and reissue the report showing exactly what closed and what is still open. This is included in the price, not a separate engagement.",
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
      "Exploitable right now, and it leads to system compromise or mass data exposure.",
    response: "Reported on discovery, same day.",
  },
  {
    label: "High",
    token: "bg-sev-high",
    meaning:
      "Exploitable with few obstacles, with serious impact on your data or its integrity.",
    response: "Reported within 24 hours.",
  },
  {
    label: "Medium",
    token: "bg-sev-medium",
    meaning:
      "Exploitable under specific conditions, or a real weakening of your defences.",
    response: "Included in the report.",
  },
  {
    label: "Low",
    token: "bg-sev-low",
    meaning:
      "Hard to exploit or limited in impact, but still a genuine departure from good practice.",
    response: "Included in the report.",
  },
  {
    label: "Informational",
    token: "bg-sev-info",
    meaning:
      "No direct security impact — hardening opportunities and things worth knowing.",
    response: "Included as an appendix.",
  },
];

export const securityFaqs = [
  {
    question: "Will testing take our production system down?",
    answer:
      "No — and managing that risk is exactly what the rules of engagement are for. Before we start we agree testing windows, rate limits and any techniques that are off the table, and we prefer a staging environment that mirrors production where you have one. If we do test production, you get a named contact who can reach us instantly, and we stop the moment you ask.",
  },
  {
    question: "Do you test systems you did not build?",
    answer:
      "Yes — most of our security work is on other people's code, built by in-house teams or other vendors. We have no interest in blaming whoever built it. The report is about what to fix, and in what order.",
  },
  {
    question: "Can you certify us for ISO 27001 or SOC 2?",
    answer:
      "No — and be careful with anyone who says they can. Certification comes from an accredited auditor, never from a testing vendor. What we do is get you ready: a gap analysis against the framework, your evidence in order, and straight answers to the technical questions an auditor or an enterprise questionnaire will put to you.",
  },
  {
    question: "What access do you need?",
    answer:
      "The least access that lets us do the agreed work, on named accounts you can revoke. For a logged-in application test that usually means one account per user role. We tell you what we intend to touch before we touch it, and all test data and credentials are returned or destroyed when we finish.",
  },
  {
    question: "How soon do we hear about a serious finding?",
    answer:
      "Immediately. We report critical findings the moment we confirm them, with enough detail for your team to act that day. You should never learn about a critical issue for the first time in a PDF two weeks later.",
  },
  {
    question: "Is the retest really included?",
    answer:
      "Yes. A finding is not closed because someone says it is fixed — we verify it and reissue the report showing what actually closed. Charging extra for that would make the report the product, when the whole point is the fix.",
  },
];
