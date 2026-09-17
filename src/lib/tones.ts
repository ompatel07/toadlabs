/**
 * Card tones for the rotating card grids (services rail, selected work).
 *
 * Deliberately two. On the dark ground a tone is an elevation, not a colour:
 * `surface` is a card one step above the page, and `accent` is the signal
 * green, landing on roughly one card in four so it reads as emphasis rather
 * than decoration.
 *
 * Each tone hard-couples a background to the text colours that clear 4.5:1 on
 * it, so an unreadable card cannot be built.
 *
 *   surface  #12151D + ink     13.8:1
 *   accent   #3CE68D + canvas  12.4:1
 */
export type ToneName = "surface" | "accent";

export interface Tone {
  /** Card background. */
  bg: string;
  /** Body text on that background. */
  text: string;
  /** Secondary text — still clears 4.5:1. */
  muted: string;
  /** Icon chip sitting on the card. */
  chip: string;
  /** Card border. */
  border: string;
  /** Hairline/divider inside the card. */
  rule: string;
}

export const tones: Record<ToneName, Tone> = {
  surface: {
    bg: "bg-[var(--surface)]",
    text: "text-ink",
    muted: "text-ink-soft",
    chip: "bg-[var(--surface-2)] text-lime",
    border: "border-[rgba(255,255,255,0.1)]",
    rule: "border-[rgba(255,255,255,0.09)]",
  },
  // A light fill, so its text is the page ground. Not border-lime: a lime
  // edge on a lime fill is invisible.
  accent: {
    bg: "bg-lime",
    text: "text-canvas",
    muted: "text-canvas/75",
    chip: "bg-canvas/15 text-canvas",
    border: "border-canvas/25",
    rule: "border-canvas/20",
  },
};

/** Tone for the card at `index`: accent at the given positions, else surface. */
export function accentAt(index: number, accentPositions: number[] = [0, 4]): ToneName {
  return accentPositions.includes(index) ? "accent" : "surface";
}
