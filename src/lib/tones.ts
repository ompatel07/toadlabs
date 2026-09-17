/**
 * Surface tones.
 *
 * DELIBERATELY SMALL. An earlier version handed out six hues — teal, cyan,
 * amber, coral, sand, lime — and the page turned into a fruit salad: every
 * card shouting, nothing leading. Colour is not the same thing as design.
 *
 * REBUILT FOR THE DARK SYSTEM. These were four light fills (white, cream,
 * lime, one dark) written against a light page, each paired with near-black
 * text. Inverting the palette turned every one of them into light-on-light:
 * "paper" was a pure white card that still rendered white, and `text-ink` —
 * which is now the LIGHT colour — sat on top of it at 1.17:1.
 *
 * On a dark ground the tones are elevations, not colours: the default card is
 * a raised surface, `raised` is a second step up, `accent` is the signal green
 * used sparingly, and `bright` is a light panel for the rare block that has to
 * invert.
 *
 * Each tone still hard-couples a background to the one text colour that clears
 * 4.5:1 on it, so an unreadable card cannot be built.
 *
 *   surface  #12151D + ink     13.8:1
 *   raised   #1A1F2A + ink     11.6:1
 *   accent   #3CE68D + canvas  12.4:1
 *   bright   #E9EEF6 + canvas  15.9:1
 */
export type ToneName = "paper" | "canvas" | "lime" | "deep";
// Names kept so call sites do not churn; the values below are what changed.

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
  /** True when the tone is a LIGHT panel, so focus rings flip to the ground. */
  dark?: boolean;
}

export const tones: Record<ToneName, Tone> = {
  /** Default card: one step above the page. */
  paper: {
    bg: "bg-[var(--surface)]",
    text: "text-ink",
    muted: "text-ink-soft",
    chip: "bg-[var(--surface-2)] text-lime",
    border: "border-[rgba(255,255,255,0.1)]",
    rule: "border-[rgba(255,255,255,0.09)]",
  },
  /** Second elevation, for a panel sitting on another panel. */
  canvas: {
    bg: "bg-[var(--surface-2)]",
    text: "text-ink",
    muted: "text-ink-soft",
    chip: "bg-[rgba(255,255,255,0.08)] text-lime",
    border: "border-[rgba(255,255,255,0.12)]",
    rule: "border-[rgba(255,255,255,0.1)]",
  },
  /** The accent fill. A light surface, so its text is the page ground. */
  lime: {
    bg: "bg-lime",
    text: "text-canvas",
    muted: "text-canvas/75",
    chip: "bg-canvas/15 text-canvas",
    // Not border-lime: a lime edge on a lime fill is invisible. An accent
    // panel takes its definition from the page ground.
    border: "border-canvas/25",
    rule: "border-canvas/20",
    dark: true,
  },
  /** Full inversion — a bright panel on the dark page. Used sparingly. */
  deep: {
    bg: "bg-ink",
    text: "text-canvas",
    muted: "text-canvas/70",
    chip: "bg-canvas/10 text-canvas",
    border: "border-ink",
    rule: "border-canvas/15",
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
