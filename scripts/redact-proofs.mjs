/**
 * Redacts the identifying parts of the reply screenshots before publishing.
 *
 * Bars are drawn in the marker colour already present in each image - sampled
 * from an existing blob rather than hard-coded - so a new bar reads as the same
 * deliberate redaction rather than as a second, different mark. Boxes were
 * measured off 4x crops of each master, not guessed.
 *
 * Masters live outside the repo. Only the redacted output is committed.
 */
import sharp from "sharp";

/** WhatsApp/Instagram marker blue, used when a sample misses the blob. */
const MARKER = "rgb(0,120,215)";

/**
 * Reads the colour of one pixel, to match the sender's own marker.
 *
 * A sample that lands beside the blob rather than on it would tint the bar
 * white or pale, which is worse than not matching at all - so anything that is
 * not a saturated blue falls back to the standard marker.
 */
async function sampleAt(file, x, y) {
  const { data, info } = await sharp(file).raw().toBuffer({ resolveWithObject: true });
  const i = (y * info.width + x) * info.channels;
  const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
  const isMarker = b > 140 && b - r > 60 && b - g > 40;
  return isMarker ? `rgb(${r},${g},${b})` : MARKER;
}

const JOBS = [
  {
    src: "E:/proofs/1.png",
    out: "assets/playbook/proofs/reply-1.png",
    sample: [200, 22],
    bars: [
      [58, 4, 36, 32],    // avatar initial
      [123, 58, 46, 21],  // recipient first name
      [193, 537, 60, 20], // quoted project price - reads as an earnings claim
    ],
  },
  {
    src: "E:/proofs/2.png",
    out: "assets/playbook/proofs/reply-2.png",
    sample: [200, 22],
    bars: [
      [57, 4, 36, 32], [123, 58, 54, 21], [123, 109, 130, 21],
      [318, 364, 62, 22], [90, 386, 22, 20],
    ],
  },
  {
    src: "E:/proofs/3.png",
    out: "assets/playbook/proofs/reply-3.png",
    sample: [200, 22],
    bars: [[56, 4, 36, 32], [96, 6, 80, 21], [290, 312, 90, 22], [89, 333, 22, 18]],
  },
  {
    src: "E:/proofs/4.png",
    out: "assets/playbook/proofs/reply-4.png",
    sample: [200, 22],
    bars: [[95, 10, 36, 20], [322, 182, 59, 21], [89, 200, 18, 18]],
  },
  {
    src: "E:/proofs/5.png",
    out: "assets/playbook/proofs/reply-5.png",
    sample: [200, 176],
    bars: [
      [53, 7, 32, 30],    // avatar initials
      [93, 12, 88, 21],   // chat title
      [332, 167, 45, 21], // tail of the demo URL
      [88, 186, 28, 20],  // and where it wraps
    ],
  },
  {
    src: "E:/proofs/7.png",
    out: "assets/playbook/proofs/reply-6.png",
    sample: [80, 18],
    bars: [[124, 53, 38, 18]], // tail of the demo URL; header already marked
  },
  {
    src: "E:/proofs/8.png",
    out: "assets/playbook/proofs/reply-7.png",
    sample: [80, 18],
    bars: [], // nothing identifying left in view
  },
  {
    src: "E:/proofs/9.png",
    out: "assets/playbook/proofs/reply-8.png",
    sample: [80, 18],
    bars: [[158, 556, 30, 20]], // trailing digits of a phone number
  },
  {
    src: "E:/proofs/10.png",
    out: "assets/playbook/proofs/reply-9.png",
    sample: [80, 18],
    bars: [[284, 204, 86, 20], [124, 225, 40, 20]], // demo URL, and its wrap
  },
];

for (const job of JOBS) {
  const { width, height } = await sharp(job.src).metadata();
  const colour = await sampleAt(job.src, job.sample[0], job.sample[1]);
  const rects = job.bars
    .map(([x, y, w, h]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${Math.min(h, w) / 2}" fill="${colour}"/>`)
    .join("");
  const pipeline = sharp(job.src);
  if (rects) {
    pipeline.composite([
      { input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">${rects}</svg>`), top: 0, left: 0 },
    ]);
  }
  await pipeline.png().toFile(job.out);
  console.log(`${job.out} ${width}x${height} - ${job.bars.length} bars, ${colour}`);
}
