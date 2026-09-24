# OFFSCRIPT

Marketing site for OFFSCRIPT — a digital marketing, software and cybersecurity
company in Ahmedabad, Gujarat.

Three parts to the offer, and the site is organised around them: **Grow**
(`/marketing`), **Build** (`/services`) and **Secure** (`/cybersecurity`).

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

Three things are still placeholder. The site is safe to deploy as a preview,
but not to launch.

| What | Where | Status |
|------|-------|--------|
| Domain and email | `src/config/site.ts` (`siteUrl`, `email`) | Placeholder values |
| The three case studies | `src/config/work.ts` | Placeholder, `noindex` |
| `noindex` preview guard | `netlify.toml` | Remove at launch |

Done: the phone / WhatsApp number (`whatsappNumber`, `phone`) is real, and the
contact form works.

**How the contact form delivers.** There is no server, so the form composes
the enquiry into a WhatsApp message to `whatsappNumber` and opens it
(`src/lib/contact.ts`); the visitor presses send in WhatsApp. If an email
endpoint is added later, validate and rate-limit there too, and add its origin
to `CONNECT_SRC` in `scripts/security-headers.mjs` or the Content-Security-Policy
will block the request.

------|-------|--------|
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
  app/                 routes (home, services, marketing, cybersecurity, work,
                       about, contact, security)
  components/
    brand/             wordmark + mark, hero object, interactive toad,
                       particle field
    layout/            header, footer, section + page-header primitives
    sections/          composable page sections
    ui/                shadcn accordion (FAQ)
    ui-brand/          brand buttons/links
  config/              all copy lives here as typed TS — no CMS
                       services.ts / marketing.ts / security.ts = the three
                       offers; service-pages.ts = their detail pages
  hooks/               reduced motion, scroll velocity
  lib/                 contact form submission, JSON-LD escaping, card tones
scripts/
  generate-hero-assets.mjs   hero image sizes from assets/toad-3d.png
  generate-og-images.mjs     link-preview cards, favicon and app icons
  security-headers.mjs       CSP + security headers (runs after build)
assets/                source masters, not deployed
public/.well-known/security.txt   vulnerability disclosure contact (RFC 9116)
```

**All content is in `src/config/`.** Editing copy does not require touching a
component.

---

## Brand

The site was renamed from Toad Labs to **OFFSCRIPT**. The mark lives at
`assets/brand/offscript-mark.svg` and is inlined by
`src/components/brand/wordmark.tsx`; `node scripts/generate-og-images.mjs`
rebuilds the favicon, app icons and link-preview cards from it.

The mark keeps its own colours (lime `#d3ff38`, ink `#111426`, coral
`#fa5b3d`) — a logo is fixed, not themed. The site itself keeps the
"Instrument Dark" system, so the accent in the UI is still the site green.

⚠️ The 3D object in the hero is still the old one and says "TOAD LABS" on its
chest. Replace `assets/toad-3d.png` and run
`node scripts/generate-hero-assets.mjs`.

---

## Security headers

`npm run build` is followed automatically by `scripts/security-headers.mjs`
(the `postbuild` script), which writes `out/_headers` for Netlify:

- **Content-Security-Policy per page**, listing SHA-256 hashes of that page's
  own inline scripts, so only the scripts Next.js generated for it can run. No
  `'unsafe-inline'` for scripts, no third-party script origins, no framing.
- HSTS, `nosniff`, `X-Frame-Options: DENY`, a strict referrer policy, a
  Permissions-Policy that disables camera/mic/location/payment and friends,
  and same-origin COOP/CORP.
- Long immutable caching for content-hashed `/_next/static/*` files.

The hashes are recomputed from the real output on every build, so there is
nothing to maintain by hand. Do not add the same header names to
`netlify.toml`: Netlify would send both, and two CSPs are both enforced.

The contact form also enforces field length limits, strips control
characters, allowlists dropdown values, and has a honeypot plus a minimum
fill time against basic bots. None of that replaces validation and rate
limiting on the real endpoint once it exists.

---

## SEO

- **One page per service.** `src/config/service-pages.ts` holds the content
  for `/services/[slug]` and `/cybersecurity/[slug]`: title, meta description,
  H1, sections and FAQs. Adding an entry creates the page, its sitemap entry,
  its structured data and its listing links.
- **Metadata** goes through `pageMetadata()` in `src/lib/seo.ts`, which sets
  the title, description, canonical URL (with trailing slash), Open Graph and
  Twitter card together. Always use it: Next.js replaces nested metadata
  objects rather than merging them.
- **Structured data:** Organization + WebSite on every page (layout), FAQPage
  on the home page, ItemList + BreadcrumbList on listing pages, and Service +
  BreadcrumbList + FAQPage on each service page.
- **Link previews and icons** are generated by
  `node scripts/generate-og-images.mjs` into `public/og/` and `src/app/`.
- **Sitemap** (`src/app/sitemap.ts`) uses the same absolute URLs as the
  canonical tags and leaves out anything marked `noindex`.

The `noindex` preview guard in `netlify.toml` blocks all search indexing until
it is removed (see "Before this goes live").

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
