/**
 * Serialise structured data for a `<script type="application/ld+json">` tag.
 *
 * JSON.stringify alone is not safe inside a script element: a string value
 * containing `</script>` would close the tag early and whatever followed would
 * be parsed as HTML. Every value here comes from our own config today, but the
 * escape costs nothing and keeps that true if a value ever comes from a CMS.
 *
 * `<`, `>` and `&` become JSON unicode escapes, which any JSON parser reads
 * back as the same characters. So do U+2028 and U+2029, which older engines
 * treat as line breaks inside a script.
 */
const UNSAFE = new Set([0x3c, 0x3e, 0x26, 0x2028, 0x2029]);

export function jsonLd(data: unknown): { __html: string } {
  let html = "";
  for (const char of JSON.stringify(data)) {
    const code = char.codePointAt(0) ?? 0;
    html += UNSAFE.has(code)
      ? "\\" + "u" + code.toString(16).padStart(4, "0")
      : char;
  }
  return { __html: html };
}
