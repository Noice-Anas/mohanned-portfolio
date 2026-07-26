# Mohanned Albosh — Portfolio

A fast, single-page, **bilingual (English + Arabic / RTL)** business portfolio for
**Mohanned Albosh** — Business Analyst, Product Operations, BI, CRM architecture,
automation, and e-commerce operations.

Built as a zero-dependency static site (hand-written HTML/CSS/JS, hand-built SVG charts)
so it drops straight onto **GitHub Pages** with no build step.

🔗 **Live:** <https://noice-anas.github.io/mohanned-portfolio/>

---

## Features

- **Bilingual EN / عربية** with a one-click language toggle, full **RTL mirroring**, and
  persisted preference (`localStorage`). Numbers and charts stay left-to-right in Arabic;
  the timeline and process arrows reverse.
- **Interactive, animated SVG charts** — hero sparkline, animated bar chart, donut with
  legend, count-up KPIs, and a live "Executive Dashboard" capability demo. No chart library.
- **Motion** — scroll-reveal, animated counters and charts, all gated behind
  `prefers-reduced-motion`.
- **Responsive** — desktop, tablet, and mobile (hamburger nav, single-column collapse).
- **SEO / social ready** — Open Graph + Twitter Card, `sitemap.xml`, `robots.txt`,
  JSON-LD `Person` structured data, canonical URL, PWA `site.webmanifest`, full favicon set,
  and a branded `404.html`.

---

## Project structure

```
mohanned-portfolio/
├── index.html              # Markup + meta/OG/JSON-LD (no inline CSS/JS)
├── 404.html                # Branded not-found page (GitHub Pages)
├── robots.txt              # Crawler rules + sitemap pointer
├── sitemap.xml             # Single-page sitemap
├── site.webmanifest        # PWA manifest
├── README.md
├── CLAUDE.md               # Project conventions / notes
├── .gitignore
└── assets/
    ├── css/
    │   └── styles.css      # All styles + design tokens
    ├── js/
    │   ├── i18n.js         # Bilingual copy (EN + AR) — one object
    │   └── main.js         # Language toggle, reveal, counters, SVG charts
    ├── icons/
    │   ├── favicon.svg     # Primary icon (MA monogram)
    │   ├── favicon-32.png
    │   ├── favicon-16.png
    │   ├── apple-touch-icon.png   # 180×180
    │   └── icon-512.png           # PWA / maskable
    └── og-image.png        # 1200×630 social preview
```

> `_source/` (raw résumé `.docx` + planning notes) is **git-ignored** on purpose — it stays
> local and is never published.

---

## Run locally

The site is fully static. Any static server works:

```bash
python3 -m http.server 8000
# then open http://localhost:8000/index.html
```

> Use a server, not `file://` — relative asset paths and `fetch`-free scripts behave
> correctly over HTTP.

---

## Deploy to GitHub Pages

This repo is already configured for `https://noice-anas.github.io/mohanned-portfolio/`
and deploys from the `main` branch root:

1. Push to `main`.
2. **Settings → Pages → Build and deployment → Source: _Deploy from a branch_**,
   branch **`main`**, folder **`/ (root)`**. Save. (Done once; already enabled.)
3. Wait ~1 minute for the build; the site is live at the URL above.

### Changing the URL later

The absolute site URL is hard-set to `noice-anas.github.io/mohanned-portfolio` in
`index.html`, `robots.txt`, and `sitemap.xml`. If the username or repo name changes,
update it there (and the `/mohanned-portfolio/` path in `404.html`). Using a
**custom domain**? Add a `CNAME` file containing the domain and swap the base URL to
`https://yourdomain.com`.

---

## Customize

- **Text & translations** live in `assets/js/i18n.js` — every visible string has an
  `en` and `ar` entry keyed by `data-i18n` attributes in `index.html`. Edit both languages
  together. (Arabic is idiomatic MSA — keep it that way.)
- **Colors / spacing / fonts** are CSS custom properties at the top of
  `assets/css/styles.css` (`--accent`, `--ink`, `--radius`, …).
- **Charts** are drawn in `assets/js/main.js` (`buildBars`, `buildDonut`, `buildSpark`).
- **Real screenshots:** the CRM Gallery and QA Portfolio in the Skills section are labeled
  placeholder slots — drop real Zoho CRM / Jira screenshots into those frames when ready.

### Regenerating the icons & OG image

The raster images were rendered from HTML/SVG templates. To regenerate after a design change,
re-render `assets/icons/favicon.svg` (and the OG layout) to PNG at the sizes above
(512 → downscaled to 180 / 32 / 16; OG at 1200×630) using any headless-browser screenshot tool.

---

## Content integrity

Every metric on the page traces to Mohanned's résumé (4+ years, 500+ onboarding sessions,
2 brands, 500+ services, 10+ systems, 50+ staff trained; clients Najm & SASCO). The
"Executive Dashboard" section uses clearly-labeled **illustrative sample data** — it
demonstrates dashboard-building capability and is **not** real client data.

---

## Tech

Plain HTML5, CSS (custom properties, logical properties for RTL), vanilla JS
(`IntersectionObserver`, SVG). External requests: Google Fonts only
(IBM Plex Sans / IBM Plex Sans Arabic / IBM Plex Mono).

© 2026 Mohanned Albosh. All rights reserved.
