/**
 * What drives the cost of an engagement.
 *
 * Comparable studios publish nothing on this — every route ends at "request an
 * estimate". A client who can work out roughly what moves the number arrives at
 * the call ready to have a real conversation.
 *
 * NO PRICES ARE PUBLISHED HERE, deliberately. Rate cards and ranges are
 * commercial terms for the owner to set, not something to infer from a form's
 * budget dropdown.
 *
 * (An engagement-model comparison table also lived here. It was accurate and
 * dull, and it was occupying the widest block on a page whose job is to show
 * capability. The engagement shapes belong to the scoping conversation.)
 */

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
