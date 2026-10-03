# Audit scripts

Checks that are worth re-running rather than re-deriving. The three `.test.mjs`
files need no browser and no network; the other two expect a built `out/` and,
for `copy-rules`, a local server on :3211.

| Script | What it proves |
| --- | --- |
| `payment-crypto.test.mjs` | Download tokens are bound to one order, expire, reject tampering, and are **not** signed with `RAZORPAY_KEY_SECRET` directly. Webhook signatures verify over the raw body. |
| `payment-handlers.test.mjs` | Every function rejects the wrong method, malformed order ids, unsigned and wrongly-signed webhooks, oversized bodies, and missing parameters — and no response echoes a secret or the private download URL. |
| `jsonld-escaper.test.mjs` | `jsonLd()` contains `</script>`, comment and U+2028/9 payloads, and round-trips every one exactly. It is the only `dangerouslySetInnerHTML` sink on the site. |
| `headers-and-secrets.mjs` | Every route carries the required headers; no `unsafe-inline`/`unsafe-eval`/wildcard in `script-src`; Razorpay is allowed on payment routes **and nowhere else**; no key, secret or phone number anywhere in `out/`. |
| `performance.mjs` | Over-the-wire weight, requests and Core Web Vitals on a throttled phone. Text assets are brotli-compressed locally first, because the preview server sends none and raw bytes fail a wire budget that production meets comfortably. |
| `user-flow.mjs` | The journey: both CTAs land on their sections, no price before the reveal, the FAQ opens, the slider steps and stops at both ends, policy links resolve, the sticky bar appears only between hero and price, and the thank-you page claims nothing from the URL alone. |
| `responsive.mjs` | 10 screen sizes x every page: horizontal scroll, tap targets, unreadable text, and contrast against the painted background. |
| `page-security.mjs` | Every page for CSP violations and inline handlers, plus seven reflected payloads through the thank-you page's `order_id`. |
| `test-checkout.mjs` | The `?t=` test key is forwarded to `create-order` and never reaches the DOM: six payloads through the URL, none reflected, none executed, and the listed price still shown. |
| `copy-rules.mjs` | No earnings figures, fake scarcity or discount anchors; the price appears only in the reveal; the guarantee's terms match across the sales page, terms and refund policy. |

The browser-driven scripts need a headless Chrome (set `CHROME_PATH` if it is
not in the default place) and the preview server:

```bash
npm run build
node scripts/audit/preview-server.mjs   # serves out/ with the real _headers
```

```bash
# offline
node scripts/audit/payment-crypto.test.mjs
node scripts/audit/payment-handlers.test.mjs
node scripts/audit/jsonld-escaper.test.mjs
npm run build && node scripts/audit/headers-and-secrets.mjs

# browser-driven, with the preview server running
node scripts/audit/responsive.mjs
node scripts/audit/page-security.mjs
node scripts/audit/user-flow.mjs
node scripts/audit/copy-rules.mjs
node scripts/audit/test-checkout.mjs
node scripts/audit/performance.mjs
```

## Thresholds, and why they are where they are

Every one of these was moved at least once, because the first version reported
things that were not faults — and a check that cries wolf is a check that gets
ignored:

- **Contrast** is skipped where the painted background cannot be known (an
  ancestor with a gradient or image), on `aria-hidden` decoration, and on text
  clipped to a pixel. The first version reported 1.07 for every element on the
  site, including 80px display type that is plainly legible.
- **Tap targets** fail under WCAG 2.5.8's 24px in either direction, or when
  cramped in both. A footer link 34px wide but a full row tall is not a
  mis-tap risk; padding the word "CRM" out to 44px would be cosmetic. One pixel
  of tolerance, because `min-h-[44px]` measures 43.98 after line-height
  rounding.
- **Text size** fails under 10px. No standard sets a minimum, and the site's
  11px uppercase eyebrow labels are a deliberate, consistent device.
- **Secrets** are the values in `.env` whose names are not public by design.
  The domain, the support address and the Supabase anon key are published on
  purpose — the anon key sits in the dashboard bundle because row-level
  security is on with no policy and it can read nothing.

## Resolved

- **`order-status` no longer trades an order id for a download link.** It now
  requires Razorpay's signature over that exact order and payment
  (`HMAC(order_id|payment_id)`), which only Razorpay and this server can
  produce. A leaked or guessed order id confirms the payment and gets nothing
  else. `payment-crypto.test.mjs` holds it: a signature does not transfer to
  another order, another payment, or another secret.
- **The rate limiter no longer fails wide.** A blob-store outage drops to a
  per-instance counter instead of waving every request through. It still fails
  open in the sense that matters — an outage must never stop a real buyer.
- **COOP is relaxed only where it has to be.** Bank and UPI hand-offs that use
  a popup need `same-origin-allow-popups`; that value is now set on the ten
  payment routes alone, and every other route keeps `same-origin`.
- **Injected `<style>` blocks are refused** site-wide via `style-src-elem
  'self'`, while the `style` attributes React writes keep working.

## Known, accepted

- **The home page's LCP is its intro curtain**, ~4-5s on a 4x-throttled phone.
  It is the brand animation, it plays once per session, it is dismissed by any
  key or tap, and `/playbook` does not have it at all. A deliberate trade on
  the marketing site, not a fault.
- **LCP readings swing with machine load.** Three runs of `/playbook` on one
  unchanged build measured 3544ms, 2500ms and 564ms. Treat a single LCP
  failure as noise and re-run; the element there is a text paragraph, so
  nothing is waiting on an image. The numbers worth trusting from this script
  are the deterministic ones — bytes, request count, CLS, and whether an image
  is missing its dimensions.


- **`style-src 'unsafe-inline'` (attributes), and `style-src-elem
  'unsafe-inline'` on the payment routes.** React writes `style` attributes for
  animation delays and positions. Razorpay's widget injects a `<style>` element
  at runtime — found by driving the real checkout, not by scanning the build,
  because nothing in the build reveals it. A blocked stylesheet there is a
  broken checkout, so those ten routes keep the looser value. `script-src`
  carries no such allowance anywhere.
- **No SRI on the Razorpay script.** `checkout.razorpay.com/v1/checkout.js` is
  unversioned and changes under the same URL, so a hash would break checkout on
  their next release. It is pinned by host in `script-src` instead.
- **The rate limiter is per-IP and fixed-window.** It slows a script; it does
  not stop a distributed attack. Razorpay's own limits sit behind it.
- **`order-status` still confirms "paid" for any valid order id**, without the
  signature. That is deliberate: the thank-you page has to be able to say
  "payment confirmed" on a reload where the signature has been stripped. It
  discloses one bit about an id the caller already had, and no download.
