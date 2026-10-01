// Adversarial test of the JSON-LD escaper.
const UNSAFE = new Set([0x3c, 0x3e, 0x26, 0x2028, 0x2029]);
function jsonLd(data) {
  let html = "";
  for (const char of JSON.stringify(data)) {
    const code = char.codePointAt(0) ?? 0;
    html += UNSAFE.has(code) ? "\\" + "u" + code.toString(16).padStart(4, "0") : char;
  }
  return html;
}
const S = String.fromCharCode(60); // <
const payloads = [
  S + "/script>" + S + "script>alert(1)" + S + "/script>",
  S + "!--" + S + "script>alert(1)",
  "]]>" + S + "/script>",
  "\u2028alert(1)\u2029",
  "&lt;script&gt;",
  S + "img src=x onerror=alert(1)>",
  "\u003c/script>",
];
let bad = 0;
for (const p of payloads) {
  const out = jsonLd({ name: p });
  const leaks = [S, ">", "&"].filter((ch) => out.includes(ch));
  // Round-trip: a JSON parser must read back exactly what went in.
  const parsed = JSON.parse(out).name;
  const ok = leaks.length === 0 && parsed === p;
  if (!ok) bad++;
  console.log((ok ? "PASS" : "FAIL"), JSON.stringify(p).slice(0, 44).padEnd(46), "leaked:", leaks.join("") || "none", "| roundtrip:", parsed === p);
}
console.log(bad === 0 ? "\nescaper: all payloads contained and round-trip exactly" : "\nESCAPER FAILED " + bad);
