/**
 * Generates the hero image derivatives.
 *
 * The site is a fully static export (`output: "export"`), so Next's image
 * optimiser is disabled and nothing is transcoded at request time. Formats and
 * widths therefore have to be produced ahead of time and referenced from a
 * <picture> element.
 *
 * Sources, both kept outside public/ so the full-size masters are not
 * deployed as public URLs nobody should load:
 *   assets/offscript-hero.png    the seated composition, hero only
 *   assets/offscript-figure.png  the standing figure, everywhere else
 * Output: offscript-hero-<width>.{avif,webp,png}
 *         offscript-figure-<width>.{avif,webp,png}
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
mkdirSync(dir, { recursive: true });

// Covers ~72vw on a 390px phone at 2x through ~38vw on a 1920px display at 2x.
const WIDTHS = [400, 600, 900, 1254];

/**
 * The figure appears at 240-340 CSS px. Its master is 647px wide, so that is
 * the top of the ladder — upscaling past the source would add bytes and no
 * detail. 647 still covers the largest placement at roughly 1.9x.
 */
const SETS = [
  { name: "offscript-hero", file: "offscript-hero.png", widths: WIDTHS },
  { name: "offscript-figure", file: "offscript-figure.png", widths: [220, 340, 460, 647] },
];

for (const set of SETS) {
  const file = join(root, "assets", set.file);
  if (!existsSync(file)) {
    console.error(`Missing source image: ${file}`);
    process.exit(1);
  }
  const meta = await sharp(file).metadata();
  console.log(`${set.name}: source ${meta.width}x${meta.height}, alpha: ${meta.hasAlpha}`);

  for (const width of set.widths) {
    if (width > meta.width) continue;
    const base = sharp(file).resize({ width });

    await base.clone().avif({ quality: 58, effort: 6 }).toFile(join(dir, `${set.name}-${width}.avif`));
    await base.clone().webp({ quality: 82, effort: 6, alphaQuality: 90 }).toFile(join(dir, `${set.name}-${width}.webp`));
    await base.clone().png({ compressionLevel: 9, palette: true, quality: 90 }).toFile(join(dir, `${set.name}-${width}.png`));

    console.log(`  wrote ${width}px (avif, webp, png)`);
  }
}

console.log("done");
