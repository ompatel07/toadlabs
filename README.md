# Toad Labs

Marketing site for Toad Labs — an IT services and cybersecurity studio in
Ahmedabad, Gujarat.

Next.js (App Router) · TypeScript · Tailwind v4 · shadcn/ui · fully static export.

---

## Running locally

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static export to ./out
```

Node 20+ required (CI uses 22).

---

## ⚠️ Before this goes live

Four things are deliberately placeholder. The site is safe to deploy as a
preview, but not to launch.

| What | Where | Status |
|------|-------|--------|
| Email, WhatsApp number, domain | `src/config/site.ts` | Placeholder values |
| Contact form submission | `src/lib/contact.ts` | **Stub — does not send** |
| The three case studies | `src/config/work.ts` | Placeholder, `noindex` |
| `noindex` preview guard | `netlify.toml` | Remove at launch |

The contact form logs a console warning (never the visitor's details) so a
broken form cannot go unnoticed. Wire `submitContact()` to a Netlify Function
or an email API before launch. If that endpoint is on another origin, add it to
`CONNECT_SRC` in `scripts/security-headers.mjs`, or the Content-Security-Policy
will block the request.

---

## Deploying to Netlify

`netlify.toml` is already configured:

```toml
command = "npm run build"
publish = "out"
```

Connect the repo in Netlify and it should build with no further setup. Because
`next.config.ts` uses `output: "export"`, **no Next.js runtime plugin is
needed** — it deploys as plain static files.

Two consequences of static export worth knowing:

1. **No API routes.** `app/api/*` will not work. Use a Netlify Function for the
   contact form instead.
2. **No Next image optimiser.** `images.unoptimized` is required. The hero
   image ships pre-generated AVIF/WebP/PNG at four widths instead — see below.

---

## Project layout

```
src/
  app/                 routes (home, services, cybersecurity, work, about, contact, security)
  components/
    brand/             wordmark, hero object, interactive toad, particle field
    layout/            header, footer, section + page-header primitives
    sections/          composable page sections
    ui/                shadcn accordion (FAQ)
    ui-brand/          brand buttons/links
  config/              all copy lives here as typed TS — no CMS
  hooks/               reduced motion, scroll velocity
  lib/                 contact form submission, JSON-LD escaping, card tones
scripts/
  generate-hero-assets.mjs   hero image sizes from assets/toad-3d.png
  security-headers.mjs       CSP + security headers (runs after build)
assets/                source masters, not deployed
public/.well-known/security.txt   vulnerability disclosure contact (RFC 9116)
```

**All content is in `src/config/`.** Editing copy does not require touching a
component.

---

## Hero assets

The hero image derivatives are committed, but if you replace the master at
`assets/toad-3d.png` (kept out of `public/` so it is never deployed), regenerate
them:

```bash
node scripts/generate-hero-assets.mjs
```

Emits AVIF, WebP and PNG at 400/600/900/1254px. Uses `sharp`, which ships with
Next — no extra dependency. The master PNG is 1.5MB; the AVIF at full width is
96KB.

---

## Conventions worth keeping

- **Static export.** Every route prerenders. Keep it that way unless there's a
  strong reason.
- **No invented proof.** No fake client logos, testimonials, certifications or
  statistics anywhere. Track-record figures are the owner's own and live only
  in `src/config/proof.ts`; compliance is always "readiness", never
  certification. Add logos or testimonials only with written permission.
- **Reveal animations are CSS-only** (`animation-timeline: view()`), so content
  ships visible and is never left hidden if JS fails.
- **Contrast floor is 4.5:1**, verified against rendered output rather than
  assumed from the palette.
- **Dark-only.** One theme ("Instrument Dark", tokens at the top of
  `globals.css`); there is no theme switch.
- **Security headers are generated.** See "Security headers" above — never
  hand-edit `out/_headers` or duplicate those headers in `netlify.toml`.
