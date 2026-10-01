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
| `copy-rules.mjs` | No earnings figures, fake scarcity or discount anchors; the price appears only in the reveal; the guarantee's terms match across the sales page, terms and refund policy. |

```bash
node scripts/audit/payment-crypto.test.mjs
node scripts/audit/payment-handlers.test.mjs
node scripts/audit/jsonld-escaper.test.mjs
npm run build && node scripts/audit/headers-and-secrets.mjs
```

## Known, accepted

- **`style-src 'unsafe-inline'`.** React writes `style` attributes for animation
  delays and positions. CSS injection is a far smaller risk than script
  injection, and `script-src` carries no such allowance.
- **No SRI on the Razorpay script.** `checkout.razorpay.com/v1/checkout.js` is
  unversioned and changes under the same URL, so a hash would break checkout on
  their next release. It is pinned by host in `script-src` instead.
- **The rate limiter fails open.** A storage blip must never stop a real buyer
  from paying. It exists to slow a script, not to stop a distributed attack.
- **`order-status` answers for any valid order id.** Order ids are high-entropy
  and travel only in a same-origin redirect, and `Referrer-Policy` keeps the
  query string from leaking cross-origin. Knowing one yields a link to the same
  product; knowing none yields nothing.
- **`COOP: same-origin`** severs `window.opener` for cross-origin popups. The
  iframe checkout is unaffected; watch it on the first live bank-redirect
  payment.
