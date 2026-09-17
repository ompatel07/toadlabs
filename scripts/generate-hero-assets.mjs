/**
 * Generates the hero image derivatives.
 *
 * The site is a fully static export (`output: "export"`), so Next's image
 * optimiser is disabled and nothing is transcoded at request time. Formats and
 * widths therefore have to be produced ahead of time and referenced from a
 * <picture> element.
 *
 * Source: assets/toad-3d.png (transparent PNG, 1.5 MB). Kept outside public/
 * so the full-size master is not deployed as a public URL nobody should load.
 * Output: toad-3d-<width>.{avif,webp,png}
 *
 * Run: node scripts/generate-hero-assets.mjs
 * Uses sharp, which ships with Next — no extra dependency.
 */
import sharp from "sharp";
import { existsSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "public", "hero");
const source = join(root, "assets", "toad-3d.png");

if (!existsSync(source)) {
  console.error(`Missing source image: ${source}`);
  process.exit(1);
}

mkdirSync(dir, { recursive: true });

// Covers ~72vw on a 390px phone at 2x through ~38vw on a 1920px display at 2x.
const WIDTHS = [400, 600, 900, 1254];

const meta = await sharp(source).metadata();
console.log(`source ${meta.width}x${meta.height}, alpha: ${meta.hasAlpha}`);

for (const width of WIDTHS) {
  if (width > meta.width) continue;
  const base = sharp(source).resize(width, width, {
    fit: "contain",
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  });

  await base
    .clone()
    .avif({ quality: 58, effort: 6 })
    .toFile(join(dir, `toad-3d-${width}.avif`));

  await base
    .clone()
    .webp({ quality: 82, effort: 6, alphaQuality: 90 })
    .toFile(join(dir, `toad-3d-${width}.webp`));

  await base
    .clone()
    .png({ compressionLevel: 9, palette: true, quality: 90 })
    .toFile(join(dir, `toad-3d-${width}.png`));

  console.log(`  wrote ${width}px (avif, webp, png)`);
}

console.log("done");
