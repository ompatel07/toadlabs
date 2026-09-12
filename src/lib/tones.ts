/**
 * Surface tones.
 *
 * DELIBERATELY SMALL. An earlier version handed out six hues — teal, cyan,
 * amber, coral, sand, lime — and the page turned into a fruit salad: every
 * card shouting, nothing leading. Colour is not the same thing as design.
 *
 * The palette is now ink and canvas, one accent (lime), and one dark
 * (deep). Visual interest comes from form instead — borders, rules, scale,
 * separators, decorative marks, layout asymmetry. See components/brand/decor.
 *
 * Each tone still hard-couples a background to the one text colour that clears
 * 4.5:1 on it, so an unreadable card cannot be built.
 *
 *   paper  #FFFFFF + ink   17.9:1
 *   canvas #EFEEE8 + ink   16.9:1
 *   lime   #C7F23C + ink   15.1:1
 *   deep   #101710 + white 18.2:1
 */
export type ToneName = "paper" | "canvas" | "lime" | "deep";

export interface Tone {
  /** Card background. */
  bg: string;
  /** Body text on that background. */
  text: string;
  /** Secondary text — still clears 4.5:1. */
  muted: string;
  /** Icon chip sitting on the card. */
  chip: string;
  /** Border. Structure carries the design now, so most cards have a real one. */
  border: string;
  /** Hairline/divider inside the card. */
  rule: string;
  /** True when the tone is dark, so focus rings flip to lime. */
  dark?: boolean;
}

export const tones: Record<ToneName, Tone> = {
  paper: {
    bg: "bg-white",
    text: "text-ink",
    muted: "text-ink-soft",
    chip: "bg-canvas text-ink",
    border: "border-[rgba(11,12,10,0.14)]",
    rule: "border-[rgba(11,12,10,0.1)]",
  },
  canvas: {
    bg: "bg-canvas",
    text: "text-ink",
    muted: "text-ink-soft",
    chip: "bg-white text-ink",
    border: "border-[rgba(11,12,10,0.16)]",
    rule: "border-[rgba(11,12,10,0.12)]",
  },
  lime: {
    bg: "bg-lime",
    text: "text-ink",
    muted: "text-ink/70",
    chip: "bg-ink/10 text-ink",
    border: "border-ink",
    rule: "border-ink/15",
  },
  deep: {
    bg: "bg-deep",
    text: "text-white",
    muted: "text-white/70",
    chip: "bg-white/12 text-lime",
    border: "border-ink",
    rule: "border-white/15",
    dark: true,
  },
};

/**
 * Accent rotation for card grids.
 *
 * Mostly paper, with lime landing on roughly one card in four and deep used
 * once. The rhythm is what makes the accent read as emphasis rather than
 * decoration — if every card is accented, none of them is.
 */
export function accentAt(index: number, limePositions: number[] = [0, 4]): ToneName {
  return limePositions.includes(index) ? "lime" : "paper";
}

export function toneCycle(names: ToneName[], index: number): Tone {
  return tones[names[index % names.length]];
}
