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

then open <http://localhost:8000>. Asset paths are root-relative, so opening
`index.html` straight off the filesystem will not load the CSS — use a server.

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
- **Logo.** `assets/img/barh-logo.svg` is a placeholder wordmark; drop in the
  real asset.
- **Photography.** The dock-series and founder tiles are gradient placeholders.
- **Series / accessories / careers pages.** Those links currently point at the
  quote section.
- **`og:image`** at `assets/img/og-cover.jpg` does not exist yet.
