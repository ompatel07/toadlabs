import {
  Building2,
  ClipboardList,
  Fingerprint,
  History,
  KeySquare,
  Landmark,
  Lock,
  MapPinned,
  Package,
  ShoppingCart,
  Stethoscope,
  Truck,
  type LucideIcon,
} from "lucide-react";

/**
 * Track record and compliance content.
 *
 * ── EDIT THE NUMBERS HERE AND NOWHERE ELSE ──────────────────────────────────
 * These figures are public claims. A buyer evaluating a security vendor checks
 * them, and an inflated number is the kind of thing that ends a deal at the
 * procurement stage rather than the sales one. Keep them true, and revise them
 * here when they change — no component hardcodes a figure.
 *
 * Still deliberately absent, per the original brief: client logos, named
 * testimonials, and any certification we do not hold. Compliance work is
 * written throughout as readiness and support, never as certification —
 * certification is issued by an accredited auditor, not by us, and claiming
 * otherwise on a security site is the fastest way to lose a technical buyer.
 */

export interface Metric {
  /** The figure itself. Keep the qualifier ("+") in `suffix`, not here. */
  value: number;
  suffix?: string;
  label: string;
  /** What the number actually counts — prevents it reading as a vanity stat. */
  detail: string;
}

export const metrics: Metric[] = [
  {
    value: 500,
    suffix: "+",
    label: "Projects delivered",
    detail:
      "Websites, products, internal systems and security engagements taken from scope to production.",
  },
  {
    value: 75,
    suffix: "+",
    label: "Clients served",
    detail:
      "From first-time founders to established teams with an in-house engineering function.",
  },
  {
    value: 10,
    label: "Disciplines in-house",
    detail:
      "Build and security under one roof, so testing is not a handover to a third party.",
  },
  {
    value: 7,
    label: "Public standards",
    detail:
      "Methodologies our work is measured against — OWASP, PTES, NIST and CIS among them.",
  },
];

/**
 * Sectors rather than logos.
 *
 * Naming an industry says something real about domain familiarity without
 * implying an endorsement we have not been given, and without the awkwardness
 * of a logo wall assembled from clients who never agreed to appear on it.
 */
export interface Sector {
  name: string;
  note: string;
  icon: LucideIcon;
}

export const sectors: Sector[] = [
  {
    name: "Fintech & payments",
    note: "Ledger accuracy, reconciliation, and keeping card data out of scope.",
    icon: Landmark,
  },
  {
    name: "Healthcare",
    note: "Patient data handling, access separation, and retained audit trails.",
    icon: Stethoscope,
  },
  {
    name: "Logistics",
    note: "Fleet and consignment tracking that stays correct when the network drops.",
    icon: Truck,
  },
  {
    name: "E-commerce & retail",
    note: "Checkout reliability, inventory integrity, and peak-load behaviour.",
    icon: ShoppingCart,
  },
  {
    name: "SaaS & B2B platforms",
    note: "Multi-tenant isolation, roles, billing, and the audit trail buyers ask for.",
    icon: Package,
  },
  {
    name: "Manufacturing & enterprise",
    note: "Integrations with systems that predate the team maintaining them.",
    icon: Building2,
  },
];

/**
 * ISO 27001 readiness.
 *
 * The scope of what we do and — equally important on this page — what we do
 * not. Anyone promising a certification outcome is either confused about how
 * certification works or hoping you are.
 */
export const complianceProgramme = {
  framework: "ISO 27001",
  full: "ISO/IEC 27001 Information Security Management",
  summary:
    "We prepare you for the audit and answer the technical questions it raises. The certificate itself is issued by an accredited certification body after their audit — not by us, and not by any testing vendor.",
  weDo: [
    "Gap analysis against Annex A controls, with findings ranked by effort and risk",
    "Control mapping from the standard down to the system that actually implements it",
    "Evidence collection: logs, access reviews, change records, in the form an auditor expects",
    "Policy and procedure documentation support, written to match how you really operate",
    "Technical answers for auditors and for enterprise security questionnaires",
    "Remediation of the technical gaps we find, since we are the engineers anyway",
  ],
  weDoNot: [
    "Issue certificates — only an accredited certification body can",
    "Guarantee a pass, because no honest party can promise another organisation's audit result",
    "Act as your certification auditor, which would be a conflict of interest",
  ],
};

/**
 * What "compliance-compatible" means in the code.
 *
 * The claim is only worth making if it is specific. Each of these is a build
 * decision made at the start of a project because retrofitting it later is
 * where compliance budgets actually go.
 */
export interface CompliancePractice {
  title: string;
  description: string;
  icon: LucideIcon;
}

export const compliancePractices: CompliancePractice[] = [
  {
    title: "Audit trails from day one",
    description:
      "Every change to a sensitive record is written with actor, timestamp, and what it was before. This is the evidence an auditor asks for first, and it cannot be reconstructed after the fact.",
    icon: History,
  },
  {
    title: "Access control at the data layer",
    description:
      "Roles and tenant isolation enforced where the query runs, not in the interface. A UI-level check is a suggestion; anything that reaches the API bypasses it.",
    icon: KeySquare,
  },
  {
    title: "Encryption in transit and at rest",
    description:
      "TLS everywhere, storage encrypted by default, and keys held in a managed service with rotation that does not require a redeploy to perform.",
    icon: Lock,
  },
  {
    title: "Data residency and retention",
    description:
      "Where records live and how long they are kept are configuration, not assumptions buried in code — so a residency requirement or a deletion request is a setting rather than a migration.",
    icon: MapPinned,
  },
  {
    title: "Identity and session handling",
    description:
      "Authentication, session lifetime, and privileged-action re-verification built to a verification standard rather than to whatever the framework scaffolded.",
    icon: Fingerprint,
  },
  {
    title: "Change records that hold up",
    description:
      "Reviewed pull requests, a release history, and a deployment trail. When an auditor asks who approved a change and when, the answer is already written down.",
    icon: ClipboardList,
  },
];
