/**
 * Generates every image the /playbook page uses.
 *
 * Sources (masters, kept out of public/ so full-size originals are not
 * deployed):
 *   assets/playbook/snapshots/<id>.(png|jpg|webp)   product screenshots
 *   assets/playbook/proofs/<id>.(png|jpg|webp)      reply screenshots
 *   assets/playbook/websites/<id>.(png|jpg|webp)    website template shots
 *
 * Output: public/playbook/<kind>/<id>-<width>.{avif,webp,png}
 *
 * WHEN A MASTER IS MISSING it writes a labelled placeholder at exactly the
 * same dimensions instead of failing. That is deliberate: the page can be
 * built, reviewed and measured before the screenshots exist, and dropping the
 * real files in later changes nothing about the layout — same boxes, same
 * aspect ratios, no shift.
 *
 * Run: node scripts/generate-playbook-assets.mjs
 * Uses sharp, which ships with Next — no extra dependency.
 */
import sharp from "sharp";
import { existsSync, mkdirSync, readdirSync } from "node:fs";
import { basename, extname, join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

/**
 * Ids must match src/config/playbook.ts. A master whose name is not in this
 * list is reported rather than silently ignored.
 */
const KINDS = {
  snapshots: {
    size: { width: 1400, height: 875 },
    widths: [480, 900, 1400],
    ids: [
      "playbook-contents",
      "playbook-module",
      "tracker-dashboard",
      "tracker-scoring",
      "swipe-file",
      "prompt-pack",
      "launch-plan",
      "paperwork",
    ],
  },
  proofs: {
    size: { width: 840, height: 1494 },
    widths: [360, 600, 840],
    ids: ["reply-1", "reply-2", "reply-3", "reply-4"],
  },
  websites: {
    size: { width: 1400, height: 875 },
    widths: [480, 900, 1400],
    ids: ["salon", "dental", "gym", "cafe", "interiors"],
  },
};

const CANVAS = "#12151d";
const ACCENT = "#3fd9e8";
const INK = "#949fb3";
const MONO = "Consolas, 'DejaVu Sans Mono', monospace";

const escape = (text) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function placeholder({ width, height }, kind, id) {
  const label = id.replace(/-/g, " ").toUpperCase();
  const unit = Math.min(width, height);
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <rect width="${width}" height="${height}" fill="${CANVAS}"/>
  <rect x="1" y="1" width="${width - 2}" height="${height - 2}" fill="none" stroke="${ACCENT}" stroke-opacity="0.35" stroke-dasharray="10 8"/>
  <text x="50%" y="46%" text-anchor="middle" font-family="${MONO}" font-size="${Math.round(unit * 0.045)}" fill="${ACCENT}" letter-spacing="2">${escape(label)}</text>
  <text x="50%" y="54%" text-anchor="middle" font-family="${MONO}" font-size="${Math.round(unit * 0.03)}" fill="${INK}">${kind} · ${width}x${height} · awaiting artwork</text>
</svg>`);
}

let generated = 0;
let placeholders = 0;
let bytes = 0;

for (const [kind, spec] of Object.entries(KINDS)) {
  const sourceDir = join(root, "assets", "playbook", kind);
  const outDir = join(root, "public", "playbook", kind);
  mkdirSync(outDir, { recursive: true });

  const masters = new Map();
  if (existsSync(sourceDir)) {
    for (const file of readdirSync(sourceDir)) {
      const id = basename(file, extname(file));
      if (!spec.ids.includes(id)) {
        console.warn(`  ! ${kind}/${file} does not match any id in the config — skipped`);
        continue;
      }
      masters.set(id, join(sourceDir, file));
    }
  }

  for (const id of spec.ids) {
    const master = masters.get(id);
    if (!master) placeholders += 1;

    // Masters are covered into the target box so every card in a row matches;
    // placeholders are already the exact size.
    const base = master
      ? sharp(master).resize(spec.size.width, spec.size.height, { fit: "cover", position: "top" })
      : sharp(placeholder(spec.size, kind, id));
    const source = await base.png().toBuffer();

    for (const width of spec.widths) {
      const resized = sharp(source).resize({ width });
      const targets = [
        [`${id}-${width}.avif`, resized.clone().avif({ quality: 55, effort: 6 })],
        [`${id}-${width}.webp`, resized.clone().webp({ quality: 80, effort: 6 })],
        [`${id}-${width}.png`, resized.clone().png({ compressionLevel: 9, palette: true, quality: 90 })],
      ];
      for (const [name, pipeline] of targets) {
        const info = await pipeline.toFile(join(outDir, name));
        bytes += info.size;
        generated += 1;
      }
    }
    console.log(`  ${master ? "art" : "placeholder"}  ${kind}/${id}`);
  }
}

console.log(
  `\n${generated} files, ${(bytes / 1024 / 1024).toFixed(2)} MB total` +
    (placeholders ? `, ${placeholders} still placeholders` : ", all from artwork"),
);
if (placeholders) {
  console.log("Drop masters in assets/playbook/<kind>/<id>.png and run this again.");
}
