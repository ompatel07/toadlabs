/**
 * Responsible disclosure policy and engagement handling.
 *
 * This is a real trust artifact rather than a claim: a published disclosure
 * policy and a machine-readable /.well-known/security.txt are what a technical
 * buyer actually checks. For a security vendor, not having them reads as a
 * warning sign.
 *
 * Nothing here asserts a certification, an audit result, or insurance cover we
 * have not confirmed. Everything is a statement of practice.
 */

export const disclosure = {
  intro:
    "If you have found a security issue in an OFFSCRIPT property, we want to hear about it. This page says exactly how to report one, what we will do, and what we ask of you.",
  inScope: [
    "toadlabs.in and its subdomains",
    "Any OFFSCRIPT-operated application or API",
    "Our public source repositories",
  ],
  outOfScope: [
    "Systems belonging to our clients — report those to the client, or to us only if we operate them under contract",
    "Findings from automated scanners with no demonstrated impact",
    "Social engineering of our team or contractors",
    "Physical attacks, or anything that degrades service for others",
    "Missing security headers or best-practice deviations with no exploitable path",
  ],
  weWill: [
    "Acknowledge your report within two business days",
    "Give you an assessment and an intended fix timeline within ten business days",
    "Keep you updated while we work it, and tell you when it is fixed",
    "Credit you publicly if you want it, and stay quiet if you do not",
    "Not pursue legal action against good-faith research under this policy",
  ],
  weAsk: [
    "Give us reasonable time to fix before disclosing publicly",
    "Do not access, modify, or exfiltrate data that is not yours",
    "Use only your own test accounts",
    "Do not run denial-of-service or spam testing",
    "One issue per report, with enough detail to reproduce it",
  ],
} as const;

/** How client data is handled during an engagement. */
export const dataHandling = [
  {
    title: "Access",
    body: "We ask for the narrowest access that lets us do the agreed work, on named accounts that can be revoked. We tell you what we intend to touch before we touch it, and we do not share credentials between engineers.",
  },
  {
    title: "Storage",
    body: "Engagement data lives on encrypted disks, in a workspace scoped to that engagement. Findings and evidence are not copied to personal devices or to third-party AI services.",
  },
  {
    title: "Retention",
    body: "Test data, credentials, and evidence are returned or destroyed at the end of the engagement, and we confirm it in writing. We keep the final report only as long as you want us to.",
  },
  {
    title: "Disclosure",
    body: "What we find on your systems is yours. We do not name clients, publish findings, or use your engagement as a case study without written permission.",
  },
];

/**
 * The structure of a real deliverable.
 *
 * Publishing the table of contents demonstrates the standard of work without
 * inventing a result — it is the honest version of "download our sample report"
 * when there is no sanitised sample to give away yet.
 */
export const reportStructure = [
  {
    section: "01 — Executive summary",
    detail:
      "One page, no jargon. What was tested, what the overall posture looks like, and the three things that matter most.",
  },
  {
    section: "02 — Scope and methodology",
    detail:
      "Exactly what was in and out of scope, the standards applied, testing windows, and the limitations of the assessment.",
  },
  {
    section: "03 — Findings by severity",
    detail:
      "Each with reproduction steps, affected endpoints, evidence, real-world impact, and a concrete fix — not a scanner ID.",
  },
  {
    section: "04 — Remediation plan",
    detail:
      "A prioritised order of work you can hand straight to a sprint, with effort estimates where we can give them honestly.",
  },
  {
    section: "05 — Retest results",
    detail:
      "Issued after you remediate. States what closed, what did not, and what remains accepted risk.",
  },
  {
    section: "Appendix — Informational notes",
    detail:
      "Hardening opportunities and observations with no direct security impact, kept out of the main body so it stays actionable.",
  },
];
