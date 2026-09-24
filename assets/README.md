# Source assets

Masters that are **not** served by the site. Anything in `public/` is deployed
as a public URL, so full-size originals live here instead.

- `offscript-hero.png` — master for the hero object. Regenerate the served
  sizes with `node scripts/generate-hero-assets.mjs`.
- `brand/offscript-mark.svg` — the OFFSCRIPT logo; source for favicon.ico,
  icon.png, apple-icon.png and the header lockup
  (`node scripts/generate-og-images.mjs`).
- `brand/toad-lockup.*` — the previous Toad Labs lockup, kept only as history.
