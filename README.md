# Bar H Solutions

Static rebuild of the [barhsolutions.com](https://barhsolutions.com/) site — plain HTML, CSS and
JavaScript, no build step.

## Structure

```
index.html                  homepage
premier-series-docks.html   Premier Series (steel, hip roof)
timber-series-docks.html    Timber Series (steel tube trusses, gable roof)
aluminum-series.html        Aluminum Series (extruded aluminum)
assets/css/styles.css       all styles (design tokens at the top)
assets/js/main.js           mobile nav, series dropdown, quote-form handler, footer year
assets/img/                 logo, favicon, photography
```

File names match the live site's URL slugs, so `/premier-series-docks` etc. keep working.

`styles.css` and `main.js` are linked with a `?v=` stamp (`?v=20260916`). There is no build step
to hash filenames, so browsers and CDNs will happily serve a cached stylesheet for days after a
deploy — which looks exactly like a change that never shipped. **Bump the stamp in all four pages
whenever you edit the CSS or JS**, or returning visitors keep the old layout.

## Running locally

Any static server works, e.g.:

```
python3 -m http.server 8000
```

then open <http://localhost:8000>. Asset paths are document-relative, so the
pages also render correctly when opened straight off the filesystem or served
from a subdirectory (e.g. a GitHub Pages project site).

## Page anatomy

**Homepage:** hero (Vimeo background video) → three dock series → where we build →
how a dock gets built → founders → quote form → footer.

**Series pages** all share one structure, so a change to the chrome needs making in all three:

hero (breadcrumb, spec chips, series photo) → what sets it apart → specifications →
slip layouts → add-ons → FAQ → the other two series → quote form → footer.

The Premier page is the exception: it also carries photography the other two do not yet have — a
detail trio inside "what sets it apart", a `#gallery` section of finished builds between the specs
and the slip layouts, and a labelled single/double slip pair under the layout cards. All three use
the one `.shots` grid (`.trio` / `.pair` / `.quad`), so Timber and Aluminum can take the same
treatment by dropping in the same markup once their photos exist.

Each carries its own `<title>`, meta description, canonical URL and three JSON-LD blocks
(`Product`, `BreadcrumbList`, `FAQPage`). The quote form arrives with that page's series
already selected.

The roof line art is inline SVG drawn with `stroke="currentColor"`, so the same markup reads
correctly on dark and on pale backgrounds — it is a front elevation, and the roofline is what
distinguishes the three (hip / gable / arched). It is still used in the spec aside and in the
"other two series" compare tiles; the heroes and the homepage tiles now carry photographs.

Design tokens (brand navy/blue, fonts, max width) live in `:root` at the top of
`styles.css`; change them there rather than in individual rules.

## Before this goes live

Search the source for `TODO`. In rough order of how much it matters:

- **The Premier starting price.** `premier-series-docks.html` says single-slip builds start at
  **$38,999**, and the figure is repeated in that page's `Product` JSON-LD. It came from a search
  result, not from the live page — confirm it or delete both copies before publishing.
- **Phone numbers and email.** The quote sections list `(270) 748-2525` (Jake Bartlett) and
  `(270) 869-5580` (Tristan Hagan). Also recovered from search results rather than read off
  `barhsolutions.com/contact` — confirm before publishing. The `info@barhsolutions.com` address
  is still a stand-in.
- **Series specifications.** The spec tables are written to stay true for any build ("chosen at
  order", "specified per site"). Replace them with the real numbers — roof panel gauge and
  finish, decking options, flotation, anchoring, warranty, lead time.
- **Add-ons.** The four add-on columns on each series page are the questions a buyer asks, not a
  confirmed catalogue. Trim them to what Bar H actually offers.
- **Quote form endpoint.** `#quote-form` has no `action`. Until one is set, `main.js` intercepts
  submit and shows an inline confirmation — leads are not sent anywhere. Point `action` at the
  real handler (Jotform, Formspree, Netlify Forms, etc.) and `main.js` steps aside automatically.
- **Photography.** Real photos are in on the homepage (the three series tiles in `#docks`, the two
  founder portraits in `#about`), in each series page hero, and throughout the Premier page. Still
  line drawings: the spec-aside art and the "other two series" compare tiles at the foot of each
  series page (`.art` / `.ph.art`), and every photo slot on the Timber and Aluminum pages.
- **Premier photo captions and alt text.** The detail trio is captioned "Hip roof", "Rot-free
  decking" and "Walkway", read off the filenames Bar H supplied rather than off the photographs,
  which were not viewable from the build environment. All the alt text on this page was written
  the same way. Someone who can see the images should confirm both.
- **Hot-linked images.** Every real photo except the logo is served from the Uploadcare CDN
  (`1cfzkm4ioa.ucarecd.net`) rather than committed to `assets/img/`, because that host is
  unreachable from the build environment and the files could not be downloaded. Pull them down and
  repoint the `<img class="ph">` tags at local paths if the site should be self-contained.
- **`og:image`** at `assets/img/og-cover.jpg` does not exist yet.
- **Accessories and careers pages.** Those nav and footer links still point at the quote section.
- **Logo.** The header uses the real logo at `assets/img/qt=q_95.webp` (368x200).
  `assets/img/barh-logo.svg` is the old placeholder wordmark, kept unused.

The copy on the three series pages was reconstructed from search-engine indexes of the live site,
because the site itself was unreachable from the build environment. The headline sentence on each
page is the real one; the supporting copy around it is new and should be read by someone at Bar H
before it ships.
