/**
 * Layout and legibility across every screen the site will actually meet.
 *
 *   npm run build && node scripts/audit/preview-server.mjs
 *   node scripts/audit/responsive.mjs
 *
 * Four things, chosen because each is a real failure a visitor would hit and
 * none of them shows up in a build:
 *
 *   horizontal scroll   a page wider than its viewport, usually one element
 *                       or pseudo-element hanging over the edge
 *   tap targets         under WCAG 2.5.8's 24px floor in either direction, or
 *                       cramped in both — what causes a mis-tap is two targets
 *                       close together, not one narrow word
 *   tiny text           under 10px, where legibility genuinely fails
 *   contrast            every text node against the background it sits on,
 *                       at the WCAG AA threshold for its size and weight
 */
import fs from "node:fs";
import path from "node:path";
import { launch, goto, evaluate, setViewport } from "./cdp.mjs";
import { setTimeout as sleep } from "node:timers/promises";

const BASE = process.env.PREVIEW_URL || "http://127.0.0.1:3211";
const OUT = path.join(import.meta.dirname, "..", "..", "out");

const SIZES = [
  [320, 568, "iPhone SE"],
  [360, 740, "small Android"],
  [390, 844, "iPhone 14"],
  [430, 932, "iPhone Pro Max"],
  [844, 390, "phone landscape"],
  [768, 1024, "iPad portrait"],
  [1024, 768, "iPad landscape"],
  [1280, 800, "laptop"],
  [1440, 900, "desktop"],
  [1920, 1080, "large desktop"],
];

/** Every exported page, so a new one is covered the day it is added. */
function pages(dir = OUT, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) pages(full, acc);
    else if (entry.name === "index.html") {
      const rel = "/" + path.relative(OUT, full).split(path.sep).join("/").replace(/index\.html$/, "");
      if (!/^\/(404|_not-found)\//.test(rel)) acc.push(rel);
    }
  }
  return acc;
}

const AUDIT = `(() => {
  const lum = (rgb) => {
    const [r, g, b] = rgb.map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const parse = (s) => (s.match(/[0-9.]+/g) || []).slice(0, 3).map(Number);
  // Returns the painted background, or null when it cannot be known. An
  // ancestor carrying a gradient or image means the colour behind the text is
  // not a value any computed style reports — guessing there produced a 1.07
  // ratio for every element on the site, including 80px display type that is
  // obviously legible. A check that reports everything reports nothing.
  const bgOf = (el) => {
    let n = el;
    while (n && n !== document.documentElement) {
      const cs = getComputedStyle(n);
      if (cs.backgroundImage && cs.backgroundImage !== 'none') return null;
      const p = parse(cs.backgroundColor);
      const alpha = (cs.backgroundColor.match(/[0-9.]+/g) || [])[3];
      if (p.length === 3 && (alpha === undefined || Number(alpha) > 0.5)) return p;
      n = n.parentElement;
    }
    const root = getComputedStyle(document.body);
    if (root.backgroundImage && root.backgroundImage !== 'none') return null;
    return parse(root.backgroundColor);
  };

  const out = { overflow: document.documentElement.scrollWidth - innerWidth, small: [], tiny: [], contrast: [] };

  // Deliberately hidden controls are not tap targets. A skip link is 1x1
  // until it is focused, and an off-screen control cannot be mis-tapped.
  const hidden = (el, cs, r) =>
    cs.visibility === 'hidden' ||
    cs.display === 'none' ||
    Number(cs.opacity) === 0 ||
    cs.clipPath === 'inset(50%)' ||
    r.bottom < 0 || r.right < 0 ||
    (r.width <= 2 && r.height <= 2);

  for (const el of document.querySelectorAll('a, button, input, select, textarea, [role=button], [role=radio]')) {
    const r = el.getBoundingClientRect();
    const cs0 = getComputedStyle(el);
    if (r.width === 0 || r.height === 0) continue;
    if (hidden(el, cs0, r)) continue;
    // What actually causes a mis-tap is two targets close together, not a
    // narrow one. A footer link 34px wide but a full 44px tall sits in its own
    // row with a row's worth of separation, and padding the word "CRM" out to
    // 44px would be cosmetic. So: fail anything under the WCAG 2.5.8 floor of
    // 24 in either direction, and anything cramped in BOTH directions.
    // A pixel of tolerance: CSS layout produces fractional heights, and a
    // breadcrumb set to min-h-[44px] measures 43.98 after line-height
    // rounding. Half a pixel does not decide whether a thumb lands.
    const tooSmall = r.width < 23 || r.height < 23;
    const cramped = r.width < 43 && r.height < 43;
    if (tooSmall || cramped) {
      const id = el.tagName.toLowerCase() + '.' + (el.className || '').toString().split(' ')[0];
      out.small.push((el.getAttribute('aria-label') || el.textContent || el.tagName).trim().slice(0, 20) + ' ' + r.width.toFixed(1) + 'x' + r.height.toFixed(1) + ' <' + id + '>');
    }
  }

  for (const el of document.querySelectorAll('body *')) {
    const text = [...el.childNodes].filter((n) => n.nodeType === 3 && n.nodeValue.trim()).map((n) => n.nodeValue.trim()).join('');
    if (!text) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none') continue;
    // Decorative text is exempt under WCAG 1.4.3, and the site marks its ghost
    // numerals and watermarks aria-hidden precisely because they carry no
    // information. Measuring them reports a failure nobody can read anyway.
    if (el.closest('[aria-hidden="true"]')) continue;
    // Screen-reader-only text is clipped to a pixel. Its colour is never seen,
    // so a contrast ratio for it means nothing.
    const box = el.getBoundingClientRect();
    if (box.width <= 2 || box.height <= 2) continue;
    const size = parseFloat(cs.fontSize);
    // No standard sets a minimum font size. The site's eyebrow labels are a
    // deliberate 11px uppercase mono with wide tracking, used consistently on
    // every page — flagging those is an opinion, not a finding. Below 10px is
    // where legibility actually goes.
    if (size < 10) out.tiny.push(size.toFixed(1) + 'px "' + text.slice(0, 24) + '"');

    const fg = parse(cs.color), bg = bgOf(el);
    if (fg.length !== 3 || !bg || bg.length !== 3) continue;
    const l1 = lum(fg), l2 = lum(bg);
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    const need = size >= 24 || (size >= 18.66 && parseInt(cs.fontWeight, 10) >= 700) ? 3 : 4.5;
    if (ratio < need) out.contrast.push(ratio.toFixed(2) + '/' + need + ' ' + size.toFixed(0) + 'px "' + text.slice(0, 18) + '" <' + el.tagName.toLowerCase() + '.' + (el.className || '').toString().split(' ')[0] + '>');
  }

  out.small = [...new Set(out.small)].slice(0, 4);
  out.tiny = [...new Set(out.tiny)].slice(0, 4);
  out.contrast = [...new Set(out.contrast)].slice(0, 4);
  return JSON.stringify(out);
})()`;

const list = pages();
const problems = [];
const c = await launch();

for (const [w, h, label] of SIZES) {
  await setViewport(c, w, h, w < 900);
  for (const page of list) {
    await goto(c, BASE + page);
    await sleep(350);
    const r = JSON.parse(await evaluate(c, AUDIT));
    const where = `${w}x${h} ${label} ${page}`;
    if (r.overflow > 1) problems.push(`${where} H-SCROLL by ${r.overflow}px`);
    if (r.small.length) problems.push(`${where} SMALL-TAP: ${r.small.join(" | ")}`);
    if (r.tiny.length) problems.push(`${where} TINY-TEXT: ${r.tiny.join(" | ")}`);
    if (r.contrast.length) problems.push(`${where} CONTRAST: ${r.contrast.join(" | ")}`);
  }
}

console.log(`${SIZES.length} sizes x ${list.length} pages = ${SIZES.length * list.length} checks`);
console.log("PROBLEMS:", problems.length ? "\n" + [...new Set(problems)].slice(0, 30).join("\n") : "none");
c.close();
process.exit(problems.length ? 1 : 0);
