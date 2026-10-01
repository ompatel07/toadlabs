/**
 * Makes Next's segment-prefetch files reachable at the paths the client asks
 * for.
 *
 * THE MISMATCH
 * `output: "export"` writes a page's segment payload as a nested directory:
 *
 *   out/about/__next.!KHNpdGUp/about/__PAGE__.txt
 *
 * The router asks for the same thing with the separators flattened to dots:
 *
 *   /about/__next.!KHNpdGUp.about.__PAGE__.txt?_rsc=...
 *
 * So every `<Link>` prefetch 404s on a static host. Navigation still works —
 * the router falls back to a full fetch — but nothing is ever pre-warmed, and
 * every page load fires a handful of 404s that make a real failure harder to
 * spot in the logs.
 *
 * THE FIX
 * Copy each nested file to the flattened name beside it. Cheap (these are a
 * few KB each), reversible, and it makes prefetch do what it was meant to do
 * rather than just silencing the symptom. Runs after the export, before the
 * headers are written.
 *
 * Remove this when Next writes both shapes itself.
 */
import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "out");

if (!existsSync(OUT)) {
  throw new Error("flatten-prefetch: no out/ — did the build run?");
}

/** Every `__next.<something>` directory, wherever it sits. */
function prefetchDirs(dir) {
  const found = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const path = join(dir, entry.name);
    if (entry.name.startsWith("__next.")) found.push(path);
    else found.push(...prefetchDirs(path));
  }
  return found;
}

/** Every file under a directory, with its path relative to it. */
function filesUnder(dir, base = dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? filesUnder(path, base) : [relative(base, path)];
  });
}

let copied = 0;
let bytes = 0;

for (const dir of prefetchDirs(OUT)) {
  const parent = dirname(dir);
  // "__next.!KHNpdGUp" -> the prefix the flattened name keeps.
  const prefix = dir.split(sep).pop();

  for (const rel of filesUnder(dir)) {
    const flattened = `${prefix}.${rel.split(sep).join(".")}`;
    const target = join(parent, flattened);
    if (existsSync(target)) continue;
    mkdirSync(dirname(target), { recursive: true });
    copyFileSync(join(dir, rel), target);
    bytes += statSync(target).size;
    copied += 1;
  }
}

console.log(
  `flatten-prefetch: ${copied} segment file${copied === 1 ? "" : "s"} mirrored (${(bytes / 1024).toFixed(0)} KB)`,
);
