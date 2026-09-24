/**
 * Generates the link-preview images (Open Graph / Twitter cards) and app icons.
 *
 * These are what WhatsApp, LinkedIn, Slack, X and Google show when a OFFSCRIPT
 * link is shared, so they state what the company IS — IT services and
 * cybersecurity — rather than only a slogan.
 *
 * Output (committed, so builds need nothing extra):
 *   public/og/{default,services,cybersecurity}.png   1200x630
 *   src/app/icon.png        512x512   (Next.js icon file convention)
 *   src/app/apple-icon.png  180x180
 *   src/app/favicon.ico     16, 32 and 48px (browser tabs, Google results)
 * Icons are the OFFSCRIPT mark (assets/brand/offscript-mark.svg); the preview
 * cards keep the 3D object until its replacement arrives.
 *
 * Run: node scripts/generate-og-images.mjs
 */
import sharp from "sharp";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const toad = join(root, "public", "hero", "toad-3d-600.png");

const CANVAS = "#0a0c11";
const LIME = "#3ce68d";
const INK = "#e9eef6";
const SOFT = "#949fb3";
const SANS = "'Segoe UI', 'Helvetica Neue', Arial, sans-serif";
const MONO = "Consolas, 'DejaVu Sans Mono', monospace";

const escape = (text) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const CARDS = {
  default: {
    eyebrow: "BUILD  ·  PROTECT  ·  SCALE",
    lines: ["IT services &", "cybersecurity company"],
    detail: "Websites · Apps · SaaS · AI automation · VAPT · Pentesting",
  },
  services: {
    eyebrow: "SOFTWARE DEVELOPMENT SERVICES",
    lines: ["Websites, apps, SaaS", "& AI automation"],
    detail: "Web & mobile apps · MVPs · CRM · WhatsApp · Chatbots",
  },
  marketing: {
    eyebrow: "DIGITAL MARKETING",
    lines: ["Marketing that ends", "in enquiries"],
    detail: "SEO · Google Ads · Paid social · Content · Brand · Analytics",
  },
  cybersecurity: {
    eyebrow: "CYBERSECURITY SERVICES",
    lines: ["VAPT &", "penetration testing"],
    detail: "Web & mobile pentests · Security audits · Cloud security",
  },
};

function cardSvg({ eyebrow, lines, detail }) {
  const headline = lines
    .map(
      (line, index) =>
        `<text x="72" y="${262 + index * 78}" font-family="${SANS}" font-size="66" font-weight="700" fill="${INK}" letter-spacing="-1.5">${escape(line)}</text>`,
    )
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs>
    <radialGradient id="glow" cx="78%" cy="55%" r="55%">
      <stop offset="0%" stop-color="${LIME}" stop-opacity="0.28"/>
      <stop offset="100%" stop-color="${LIME}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="${CANVAS}"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <rect x="0" y="0" width="1200" height="6" fill="${LIME}"/>
  <text x="72" y="118" font-family="${SANS}" font-size="40" font-weight="800" fill="${INK}" letter-spacing="-0.5">OFFSCRIPT</text>
  <text x="72" y="176" font-family="${MONO}" font-size="22" fill="${LIME}" letter-spacing="3">${escape(eyebrow)}</text>
  ${headline}
  <text x="72" y="470" font-family="${SANS}" font-size="26" fill="${SOFT}">${escape(detail)}</text>
  <rect x="72" y="516" width="330" height="54" rx="27" fill="none" stroke="rgba(255,255,255,0.22)"/>
  <circle cx="100" cy="543" r="6" fill="${LIME}"/>
  <text x="118" y="552" font-family="${SANS}" font-size="24" fill="${INK}">Ahmedabad, India</text>
</svg>`;
}

mkdirSync(join(root, "public", "og"), { recursive: true });

const toadCard = await sharp(toad).resize(430, 430, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer();

for (const [name, card] of Object.entries(CARDS)) {
  const out = join(root, "public", "og", `${name}.png`);
  await sharp(Buffer.from(cardSvg(card)))
    .composite([{ input: toadCard, left: 740, top: 150 }])
    .png({ compressionLevel: 9, palette: true, quality: 90 })
    .toFile(out);
  console.log("wrote", out);
}

// App icons are the OFFSCRIPT mark, rasterised from its SVG at each size so
// the glyph stays crisp at 16px instead of being resampled from one bitmap.
const MARK_SVG = join(root, "assets", "brand", "offscript-mark.svg");
const TILE = "#d3ff38"; // the mark's own lime, not the site accent

async function mark(size) {
  return sharp(MARK_SVG, { density: 384 }).resize(size, size).png().toBuffer();
}

async function icon(size, file, { opaque = false } = {}) {
  let image = sharp(await mark(size));
  // iOS applies its own rounded mask and turns transparency black, so the
  // Apple icon is flattened onto the tile's own lime: the corners then match
  // the tile instead of framing it in black.
  if (opaque) image = image.flatten({ background: TILE });
  await image.png({ compressionLevel: 9, palette: true, quality: 95 }).toFile(file);
  console.log("wrote", file);
}
await icon(512, join(root, "src", "app", "icon.png"));
await icon(180, join(root, "src", "app", "apple-icon.png"), { opaque: true });

/**
 * favicon.ico — browser tabs, bookmarks, and the icon Google shows next to a
 * search result, at 16, 32 and 48px.
 *
 * sharp cannot write ICO, so the container is assembled by hand: ICO allows
 * PNG-encoded images, which every current browser accepts.
 */
async function favicon(file) {
  const sizes = [16, 32, 48];
  const images = await Promise.all(sizes.map((size) => mark(size)));

  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(sizes.length, 4);

  let offset = 6 + 16 * sizes.length;
  const entries = images.map((image, index) => {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(sizes[index] % 256, 0); // width (0 would mean 256)
    entry.writeUInt8(sizes[index] % 256, 1); // height
    entry.writeUInt8(0, 2); // palette colours
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // colour planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(image.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += image.length;
    return entry;
  });

  writeFileSync(file, Buffer.concat([header, ...entries, ...images]));
  console.log("wrote", file);
}
await favicon(join(root, "src", "app", "favicon.ico"));
