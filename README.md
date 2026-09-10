# Bar H Solutions

Static rebuild of the [barhsolutions.com](https://barhsolutions.com/) homepage — plain HTML, CSS and JavaScript, no build step.

## Structure

```
index.html              homepage
assets/css/styles.css   all styles (design tokens at the top)
assets/js/main.js       mobile nav, quote-form handler, footer year
assets/img/             logo, favicon, photography
```

## Running locally

Any static server works, e.g.:

```
python3 -m http.server 8000
```

then open <http://localhost:8000>. Asset paths are document-relative, so the
page also renders correctly when opened straight off the filesystem or served
from a subdirectory (e.g. a GitHub Pages project site).

## Sections

Hero (Vimeo background video) → three dock series → where we build →
how a dock gets built → founders → quote form → footer.

Design tokens (brand navy/blue, fonts, max width) live in `:root` at the top of
`styles.css`; change them there rather than in individual rules.

## Before this goes live

Search the source for `TODO` — the placeholders are:

- **Phone and email** in the quote section. The live site was unreachable from
  the build environment, so `(270) 000-0000` / `info@barhsolutions.com` are
  stand-ins.
- **Quote form endpoint.** `#quote-form` has no `action`. Until one is set,
  `main.js` intercepts submit and shows an inline confirmation — leads are not
  sent anywhere. Point `action` at the real handler (Jotform, Formspree,
  Netlify Forms, etc.) and `main.js` steps aside automatically.
- **Logo.** The header uses the real logo at `assets/img/qt=q_95.webp` (368x200).
  `assets/img/barh-logo.svg` is the old placeholder wordmark, kept unused.
- **Photography.** The dock-series and founder tiles are gradient placeholders.
- **Series / accessories / careers pages.** Those links currently point at the
  quote section.
- **`og:image`** at `assets/img/og-cover.jpg` does not exist yet.
