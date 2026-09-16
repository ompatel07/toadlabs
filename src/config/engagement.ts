/**
 * How an engagement is shaped and what drives its cost.
 *
 * Both of these come from looking at what comparable studios publish. Every
 * larger firm lists cooperation models; almost none of them explain what
 * actually moves the price, and the ones that skip both leave the buyer to
 * guess. For a studio this size that gap is the opportunity — a client who can
 * work out roughly what they are buying before the call arrives at it ready.
 *
 * NO PRICES ARE PUBLISHED HERE, deliberately. Rate cards and ranges are
 * commercial terms for the owner to set, not something to infer from a form's
 * budget dropdown. What is here is the shape of the commercial relationship and
 * the honest list of what makes a number go up or down — useful without
 * committing anyone to a figure.
 */

export interface EngagementModel {
  id: string;
  name: string;
  tagline: string;
  /** Set on exactly one — it gets the emphasis column. */
  common?: boolean;
  bestFor: string;
  shape: string;
  commitment: string;
  billing: string;
  pickWhen: string;
}

export const engagementModels: EngagementModel[] = [
  {
    id: "discovery",
    name: "Discovery",
    tagline: "A short paid piece of work that ends in a plan",
    bestFor: "A problem that is not yet a specification",
    shape: "One or two engineers, one to three weeks",
    commitment: "Fixed, ends with a document",
    billing: "Fixed price",
    pickWhen:
      "You need an architecture, a scope and a defensible estimate before committing a budget — including the possibility that the answer is to build less.",
  },
  {
    id: "fixed",
    name: "Fixed scope",
    tagline: "A defined phase at a price agreed up front",
    common: true,
    bestFor: "A well-understood problem with a clear boundary",
    shape: "A small team for the length of the phase",
    commitment: "Scope and price fixed in writing",
    billing: "Fixed price, milestone-based",
    pickWhen:
      "The boundary is genuinely clear. If it is not, discovery first is cheaper than the change requests that follow a fixed price built on guesses.",
  },
  {
    id: "squad",
    name: "Ongoing squad",
    tagline: "A continuing team with weekly demos",
    bestFor: "A product that keeps evolving after launch",
    shape: "A standing team, adjusted as priorities move",
    commitment: "Rolling, cancellable with notice",
    billing: "Monthly",
    pickWhen:
      "The roadmap is longer than the phase. You see working software every week rather than a status report, and nothing about leaving is engineered to be expensive.",
  },
  {
    id: "embedded",
    name: "Embedded engineers",
    tagline: "Our engineers inside your team and your process",
    bestFor: "An in-house team that needs capacity or a specific skill",
    shape: "Named engineers, your standups, your board",
    commitment: "Rolling, per engineer",
    billing: "Monthly, per engineer",
    pickWhen:
      "You have the product direction and the process, and what you need is more hands or a skill you do not want to hire permanently.",
  },
  {
    id: "security",
    name: "Security engagement",
    tagline: "Scoped testing with retest included",
    bestFor: "A system that needs testing, built by anyone",
    shape: "Testers for the agreed window, plus retest",
    commitment: "Fixed, scoped before anything is touched",
    billing: "Fixed price per engagement",
    pickWhen:
      "You need evidence rather than reassurance — a report your engineers can act on and your buyers can read, with the retest already in the price.",
  },
];

/** The attributes compared, in column order. Keyed to the model fields. */
export const engagementRows = [
  { key: "bestFor", label: "Best for" },
  { key: "shape", label: "Team shape" },
  { key: "commitment", label: "Commitment" },
  { key: "billing", label: "Billing" },
] as const;

/**
 * What actually moves the number.
 *
 * Deliberately includes the two that lower it. A list of things that only ever
 * increase a price reads as a sales document; the honest version is that some
 * decisions make the work cheaper, and a client who knows which ones can act
 * on them before the estimate rather than after.
 */
export interface CostDriver {
  title: string;
  direction: "up" | "down";
  detail: string;
}

export const costDrivers: CostDriver[] = [
  {
    title: "Unclear scope",
    direction: "up",
    detail:
      "The single largest multiplier, and the one nobody budgets for. Work that is specified as it is being built gets built more than once.",
  },
  {
    title: "Integrations you do not control",
    direction: "up",
    detail:
      "A third-party API with thin documentation, a sandbox that behaves differently from production, or a partner on their own timeline. Estimating these honestly means estimating them wide.",
  },
  {
    title: "Compliance and audit requirements",
    direction: "up",
    detail:
      "Audit trails, access reviews and evidence collection are cheap to build in at the start and expensive to retrofit. Tell us at scoping, not at the audit.",
  },
  {
    title: "Migrating live data",
    direction: "up",
    detail:
      "Moving a running system without downtime is a project in itself. The cost is in the rehearsals and the rollback plan, not the migration script.",
  },
  {
    title: "Deciding what not to build",
    direction: "down",
    detail:
      "The cheapest feature is the one cut in scoping. We will argue for cutting things, including when it shrinks the engagement.",
  },
  {
    title: "A decision-maker who is available",
    direction: "down",
    detail:
      "One person who can answer a question in a day rather than a committee that meets fortnightly. Nothing shortens a project more reliably.",
  },
];
