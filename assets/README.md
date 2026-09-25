# Source assets

Masters that are **not** served by the site. Anything in `public/` is deployed
as a public URL, so full-size originals live here instead.

- `offscript-hero.png` — master for the hero object. Regenerate the served
  sizes with `node scripts/generate-hero-assets.mjs`.
- `brand/offscript-logo.png` — the 3D OFFSCRIPT logo. Source for favicon.ico,
  icon.png, apple-icon.png and the header/footer lockup rasters in
  `public/brand/` (`node scripts/generate-og-images.mjs`).
- `brand/offscript-mark.svg` — the flat version of the same mark, kept for
  places that need vector artwork (print, documents).
- `brand/toad-lockup.*` — the previous Toad Labs lockup, kept only as history.
