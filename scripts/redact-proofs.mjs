/**
 * Redacts the identifying parts of the reply screenshots before publishing.
 * Bars are the same marker blue the sender already used, so they read as a
 * deliberate redaction rather than a rendering fault. Boxes were measured off
 * 4x crops of each master, not guessed.
 */
import sharp from "sharp";

const BLUE = "rgb(0,120,215)";

const JOBS = [
  {
    src: "E:/proofs/1.png",
    out: "assets/playbook/proofs/reply-1.png",
    bars: [
      [58, 4, 36, 32],    // avatar initial
      [123, 58, 46, 21],  // recipient first name
      [193, 537, 60, 20], // quoted project price — not an earnings claim, but it reads like one
    ],
  },
  {
    src: "E:/proofs/2.png",
    out: "assets/playbook/proofs/reply-2.png",
    bars: [
      [57, 4, 36, 32],     // avatar initial
      [123, 58, 54, 21],   // recipient first name
      [123, 109, 130, 21], // business name
      [318, 364, 62, 22],  // tail of the demo URL
      [90, 386, 22, 20],   // and where it wraps
    ],
  },
  {
    src: "E:/proofs/3.png",
    out: "assets/playbook/proofs/reply-3.png",
    bars: [
      [56, 4, 36, 32],    // avatar initials
      [96, 6, 80, 21],    // chat title: business name
      [290, 312, 90, 22], // tail of the demo URL
      [89, 333, 22, 18],  // and where it wraps
    ],
  },
  {
    src: "E:/proofs/4.png",
    out: "assets/playbook/proofs/reply-4.png",
    bars: [
      [95, 10, 36, 20],   // country code beside the number
      [322, 182, 59, 21], // tail of the demo URL
      [89, 200, 18, 18],  // and where it wraps
    ],
  },
];

for (const job of JOBS) {
  const { width, height } = await sharp(job.src).metadata();
  const rects = job.bars
    .map(([x, y, w, h]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${Math.min(h, w) / 2}" fill="${BLUE}"/>`)
    .join("");
  const overlay = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">${rects}</svg>`,
  );
  await sharp(job.src)
    .composite([{ input: overlay, top: 0, left: 0 }])
    .png()
    .toFile(job.out);
  console.log(`${job.out} ${width}x${height} — ${job.bars.length} bars`);
}
