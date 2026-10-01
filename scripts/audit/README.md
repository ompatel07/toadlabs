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
| `copy-rules.mjs` | No earnings figures, fake scarcity or discount anchors; the price appears only in the reveal; the guarantee's terms match across the sales page, terms and refund policy. |

Both browser-driven scripts expect the preview server on :3211.

```bash
node scripts/audit/payment-crypto.test.mjs
node scripts/audit/payment-handlers.test.mjs
node scripts/audit/jsonld-escaper.test.mjs
npm run build && node scripts/audit/headers-and-secrets.mjs
```

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
  key or tap, and `/playbook` does not have it at all — the page that takes
  money measures ~2.1s. A deliberate trade on the marketing site, not a fault.


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
