# Mohanned Albosh — Portfolio

A single-page bilingual (English + Arabic) business portfolio for Mohanned Albosh
(Business Analyst / Product Operations / BI / CRM / Automation / E-Commerce).

## Structure
```
index.html            markup + meta/OG/JSON-LD (no inline CSS/JS)
404.html              branded bilingual not-found page
robots.txt sitemap.xml site.webmanifest
assets/css/styles.css all styles + design tokens (:root)
assets/js/i18n.js     I18N object (EN + AR copy) — loaded first
assets/js/main.js     lang toggle, reveal, counters, SVG charts (uses I18N global)
assets/icons/         favicon.svg + PNGs (16/32/180/512), rendered from templates
assets/og-image.png   1200x630 social preview
card/                 shareable portrait business card (55x85mm)
  business-card.html  self-contained card, QR embedded inline as static SVG (no JS/deps)
  mohanned-card.png   832x1288 render (share/attach)   mohanned-card.pdf  print-ready
_source/              raw résumé .docx + planning notes — GIT-IGNORED, never published
```

## Stack & conventions
- **Static, zero-build, zero-dependency.** Plain HTML/CSS/JS + hand-built SVG charts.
  Hostable directly on **GitHub Pages**. Two classic scripts share global scope:
  `i18n.js` defines `const I18N`, `main.js` consumes it — keep that load order.
- **Only external request:** Google Fonts (IBM Plex Sans + IBM Plex Sans Arabic +
  IBM Plex Mono). Everything else is local and relative-pathed (works under the
  `/mohanned-portfolio/` project-pages subpath).
- **Live URL:** hard-set to `https://noice-anas.github.io/mohanned-portfolio/` in
  `index.html`, `robots.txt`, `sitemap.xml`. `404.html` uses the `/mohanned-portfolio/`
  root path. If the username/repo changes, update those files.
- **Regenerating images:** icons/OG were rendered from HTML/SVG templates via a headless
  browser screenshot, then `sips`-downscaled. See README "Regenerating the icons".
- **Business card (`card/`):** the QR is a static SVG path generated offline with `segno`
  (error level H) encoding the live URL, embedded inline in `business-card.html` — no
  runtime library. PNG/PDF are rendered from that HTML with headless Chrome
  (`--screenshot` at `--force-device-scale-factor=4`, and `--print-to-pdf` with a
  `@page{size:55mm 85mm}` rule). If contact details or the live URL change, regenerate
  the QR and re-render both. Verify the QR still decodes to the right URL after any edit.
- **Bilingual / RTL:** language is toggled by swapping `dir`/`lang` on `<html>` and
  replacing every `[data-i18n]` node from the `I18N` object in the script. Choice is
  persisted in `localStorage` (`mab-lang`). Default is English.
  - Use **CSS logical properties** (`margin-inline`, `inset-inline-start`, `text-align:start`)
    everywhere — never hard-coded `left`/`right` — so the layout mirrors cleanly.
  - **Numbers and charts stay LTR** even in Arabic (see the `direction:ltr` rule near the
    top of the stylesheet and the `.chart-svg`/`.spark` `direction:ltr`). Timeline and
    process-flow arrows *do* reverse in RTL.
  - Arabic copy is idiomatic MSA, not machine translation. Keep it that way when editing.
- **Design:** clean corporate light theme, single blue accent (`--accent:#1d4ed8`),
  locked page theme (no per-section inversion). Motion is scroll-reveal + animated
  charts/counters, all gated behind `prefers-reduced-motion`.

## Content integrity (important)
Every number on the page traces to the résumé / structure doc (4+ yrs, 500+ onboarding
sessions, 2 brands, 500+ services, 10+ systems, 50+ staff; clients Najm & SASCO).
**Do not invent metrics.** The dashboard section (`#dashboards`) uses *illustrative sample
data* and is labeled as such — it demonstrates dashboard-building capability, it is not
real client data. Keep that label if you touch it.

## Pending real assets (placeholders in `#skills`)
The CRM gallery and QA portfolio are labeled placeholder slots. Mohanned should drop real
screenshots (Zoho CRM pipelines/blueprints, Jira tickets/test cases) into those `.asset-slot`
frames when available.

## Local preview
`python3 -m http.server 8000` then open `http://localhost:8000/index.html`
(the browser extension can't load `file://` URLs directly).

## Deploy (GitHub Pages)
Push to the repo, enable Pages on the `main` branch root. `index.html` is served as-is.
