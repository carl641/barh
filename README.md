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

`styles.css` and `main.js` are linked with a `?v=` stamp (`?v=20260919`). There is no build step
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

All three also carry photography in the same three places — a detail strip inside "what sets it
apart", a `#gallery` section of finished builds between the specs and the slip layouts, and a
labelled single/double slip pair under the layout cards — built from the one `.shots` grid, whose
column count and frame shape are separate modifiers:

| row | markup |
| --- | --- |
| detail strip (all three) | `shots cols-3 square strip` |
| Premier gallery, four shots | `shots cols-4 wide` |
| Timber gallery, three shots | `shots cols-3 wide` |
| Aluminum gallery, six shots | `shots cols-3 square` |
| slip pair (all three) | `shots cols-2 wide` |

Pick the frame shape from what the set mostly is: `wide` is 4:3, `square` is 1:1, and a shot that
does not match its frame is centre-cropped to fill it. `strip` holds its columns at every width
instead of wrapping.

Each carries its own `<title>`, meta description, canonical URL and three JSON-LD blocks
(`Product`, `BreadcrumbList`, `FAQPage`). The quote form arrives with that page's series
already selected.

The roof line art is inline SVG drawn with `stroke="currentColor"`, so the same markup reads
correctly on dark and on pale backgrounds — it is a front elevation, and the roofline is what
distinguishes the three (hip / gable / arched). The spec aside on each series page is the last
place it appears — every other tile, hero and card now carries a photograph.

Design tokens (brand navy/blue, fonts, max width) live in `:root` at the top of
`styles.css`; change them there rather than in individual rules.

## Before this goes live

Search the source for `TODO`. In rough order of how much it matters:

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
  founder portraits in `#about`), in each series page hero, in the "other two series" compare cards
  at the foot of every series page, and throughout all three series pages. The three homepage
  series photos do double duty in those compare cards, so there is one image per series to swap if
  a better shot arrives. Still line drawings: the spec aside on each series page (`.art`), now the
  only place any remain.
- **Timber and Aluminum photo captions.** Their detail strips are captioned from the filenames Bar
  H supplied — "Steel tube truss frame", "Extruded aluminum frame", "Durability", "Rot-free
  decking", "Walkway" — rather than from the photographs, which were not viewable from the build
  environment. Premier's three are the real feature names off the live page. Alt text everywhere
  was written without seeing the images, so someone who can see them should read it through.
- **Hot-linked images.** Every real photo except the logo is served from the Uploadcare CDN
  (`1cfzkm4ioa.ucarecd.net`) rather than committed to `assets/img/`, because that host is
  unreachable from the build environment and the files could not be downloaded. Pull them down and
  repoint the `<img class="ph">` tags at local paths if the site should be self-contained.
- **`og:image`** at `assets/img/og-cover.jpg` does not exist yet.
- **Accessories and careers pages.** Those nav and footer links still point at the quote section.
- **Logo.** The header uses the real logo at `assets/img/qt=q_95.webp` (368x200).
  `assets/img/barh-logo.svg` is the old placeholder wordmark, kept unused.

## Which copy is real

The site itself was unreachable from the build environment, so the three series pages were first
written from search-engine indexes: the headline sentence on each was real, the supporting copy
around it was not.

Premier has since been corrected against the live page. Its `#built` section carries the real
"Standard features" — Hip Roof, Decorative Walkway, Rot-Free Construction — in Bar H's own words,
and both starting prices ($38,999 single slip, $46,999 double slip) are confirmed, as is the
closing mission statement under the slip cards.

**Timber and Aluminum have not been corrected.** Their `#built` headings and body copy are still
the reconstruction, and on both pages the detail photographs were filed against headings that do
not name them — Timber's photos are frame/rot-free/walkway against headings about trusses, the
gable and the look; Aluminum's are extruded frame/durability/rot-free against headings about rust,
extrusion and Flotation Systems. Paste the live copy for either page and they can be fixed the
same way Premier was.
