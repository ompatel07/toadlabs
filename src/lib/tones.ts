/**
 * Colour tones for filled cards.
 *
 * Each tone hard-couples a background to the ONE text colour that clears 4.5:1
 * against it. Components pick a tone rather than a background, so a card can
 * never be built with an unreadable pairing.
 *
 * Measured:
 *   lime  #C7F23C + ink   15.12:1
 *   cyan  #45E0D0 + ink   11.97:1
 *   amber #F2B33D + ink   10.54:1
 *   sand  #F5E9C8 + ink   16.22:1
 *   coral #E4674A + ink    5.92:1   (white would be 3.31:1 — never use it)
 *   teal  #0E4F4A + white  9.39:1
 *   deep  #101710 + white 18.23:1
 */
export type ToneName =
  | "lime"
  | "teal"
  | "cyan"
  | "amber"
  | "coral"
  | "sand"
  | "paper"
  | "deep";

export interface Tone {
  /** Card background. */
  bg: string;
  /** Body text on that background. */
  text: string;
  /** Secondary text — still clears 4.5:1. */
  muted: string;
  /** Icon chip sitting on the card. */
  chip: string;
  /** Hairline/divider on the card. */
  rule: string;
  /** True when the tone is dark, so focus rings flip to lime. */
  dark?: boolean;
}

export const tones: Record<ToneName, Tone> = {
  lime: {
    bg: "bg-lime",
    text: "text-ink",
    muted: "text-ink/70",
    chip: "bg-ink/10 text-ink",
    rule: "border-ink/15",
  },
  cyan: {
    bg: "bg-cyan",
    text: "text-ink",
    muted: "text-ink/70",
    chip: "bg-ink/10 text-ink",
    rule: "border-ink/15",
  },
  amber: {
    bg: "bg-amber",
    text: "text-ink",
    muted: "text-ink/75",
    chip: "bg-ink/10 text-ink",
    rule: "border-ink/15",
  },
  coral: {
    // Ink on coral, never white — white is 3.31:1 here.
    bg: "bg-coral",
    text: "text-ink",
    muted: "text-ink/80",
    chip: "bg-ink/10 text-ink",
    rule: "border-ink/20",
  },
  sand: {
    bg: "bg-sand",
    text: "text-ink",
    muted: "text-ink/70",
    chip: "bg-ink/8 text-ink",
    rule: "border-ink/12",
  },
  paper: {
    bg: "bg-white",
    text: "text-ink",
    muted: "text-ink-soft",
    chip: "bg-canvas text-ink",
    rule: "border-ink/10",
  },
  teal: {
    bg: "bg-teal",
    text: "text-white",
    muted: "text-white/75",
    chip: "bg-white/15 text-white",
    rule: "border-white/20",
    dark: true,
  },
  deep: {
    bg: "bg-deep",
    text: "text-white",
    muted: "text-white/70",
    chip: "bg-white/12 text-lime",
    rule: "border-white/15",
    dark: true,
  },
};

/** Deterministic rotation so a list of cards reads as a composed palette. */
export function toneCycle(names: ToneName[], index: number): Tone {
  return tones[names[index % names.length]];
}
