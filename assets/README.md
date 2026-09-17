# Source assets

Masters that are **not** served by the site. Anything in `public/` is deployed
as a public URL, so full-size originals live here instead.

- `toad-3d.png` — master for the hero object. Regenerate the served sizes with
  `node scripts/generate-hero-assets.mjs`.
- `brand/toad-favicon.png` — flat mark on a rounded tile; source for
  favicon.ico, icon.png and apple-icon.png (`node scripts/generate-og-images.mjs`).
- `brand/toad-lockup.*` — full logo lockup, currently unused on the site. Kept
  for social cards and documents.
