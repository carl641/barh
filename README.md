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
assets/js/main.js           mobile nav, series dropdown, standard features, build rotator, quote form, footer year
assets/img/                 logo, favicon, photography
```

File names match the live site's URL slugs, so `/premier-series-docks` etc. keep working.

`styles.css` and `main.js` are linked with a `?v=` stamp (`?v=20261005`). There is no build step
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

All three are now built the same way. `#built` is a `.feature-split`: heading and description in
the left column, and in the right a `[data-feature-list]` of three rows, each opening to show its
shot and its copy together. Nothing is captioned, because the heading opening above a shot names
it. None of them has a `#gallery` section any more — every page's build photographs are the
`[data-rotator]` in its specifications aside.

Each row's heading is a real `<button>`: click, tap and keyboard focus open a row, and
`aria-expanded` tracks which is open. Opening one closes the others and nothing closes on its own,
so a row is always open and the column is never a set of bare headings.

**The section also pins.** `.feature-track` is 175vh tall and `.feature-pin` sticks inside it, so
once the section settles at the middle of the screen it holds while the scroll steps through the
three features — a third of the remaining track each — and then releases and the page carries on.
Clicking works while pinned, and moves the scroll to that feature's place in the track rather than
just opening it. While pinned the scroll position is what decides the open row, so opening one
without moving the scroll to match leaves the two disagreeing and the next scroll snaps the choice
away. The section is sticky, so travelling there does not move it on screen — only the rail and the
drift catch up. The row that was picked stays open on the way, instead of the features flicking past
as the page travels.

A held section reads as a stuck one if nothing in it moves, so two things move continuously while
it is held: the block drifts gently up through the pin, and the rail in the gutter beside the
features fills. `main.js` writes `--run` (0 to 1) on the section each frame and both are expressed
from it in CSS, so there is one source of truth for how far through the section you are. The rail
only exists while pinned — off a pinned viewport it would be measuring nothing.

Both rules wait on an `is-pinned` class that `main.js` adds above 900px wide, with motion allowed,
and only when the block will fit the viewport. Anything else — a narrow screen, a short one, a
`prefers-reduced-motion` setting, no JavaScript at all — collapses the track to its natural height
and leaves an ordinary accordion that scrolls past like any other section. Scroll-pinning is
disorienting enough that it should never be the only way through.

**The fit is measured, not assumed.** Pinning is exactly what makes anything off-screen
unreachable, so the block has to fit; but the block runs 623px at the narrow end of the pinned
range, where the shot sits above the copy, and only 436px once it floats into it. A fixed height
threshold picked for the worst case refuses laptops with room to spare — a 1366x768 screen leaves
about 620px of viewport, which holds the 436px block easily. `blockFits()` measures instead,
reading the tallest panel off `scrollHeight` so it need not open one to size it, and `settle()`
re-runs it on resize and load.

Phones and tablets in portrait never pin; they get the accordion. Tablets in landscape do — if that
reads badly under inertial scrolling, adding `and (hover: hover)` to the width query confines
pinning to pointer devices.

Two measurements drove the layout. The old three-column grid ran the copy at 40–45 characters a
line, under the readable band; giving the description its own column puts every width from 1440px
down to 600px between 48 and 76. And the shot only floats into the copy above 1140px, because
narrower than that the float squeezes the text back down to ~38. Below 1140px the shot sits above
the text instead and the copy keeps the whole column.

The shot carries `height:auto`. Without it the markup's `width`/`height` attributes supply a height,
`aspect-ratio` never applies, and a 1200px-tall image blows the panel out — which is exactly what
happened on the first pass.

The `.shots` grid — column count and frame shape as separate modifiers, `shots cols-3 wide` and so
on — now has no user left on the series pages, the strips and galleries it carried having become
accordion panels and rotator slides. It is kept because it is the one way this stylesheet lays out
a row of photographs, and the next page that needs one will want it.

Pick the frame shape from what the set mostly is: `wide` is 4:3, `square` is 1:1, and a shot that
does not match its frame is centre-cropped to fill it. `strip` holds its columns at every width
instead of wrapping. `.shots.cols-2` is currently unused but kept, so the modifier set has no gap
in it.

The slip layout shots are not a `.shots` row. `#configs` holds two bands, single and double slip,
stacked one above the other, each with its `img.slip-shot` filling a 38% column and the copy in a
`.slip-body` beside it. A shot carries no caption, because the band's `<h3>` already names it.

Nothing moves on hover. These are not links, and a card that lifts or zooms under the pointer reads
as one — which is why the earlier hover treatment came off. Below 760px each band stacks its shot
above its copy.

The compare row at the foot of each page is three columns, not two: the two other series, plus this
page's own photographs. `.to-gallery` is deliberately unlike the two beside it — the brand gradient
rather than white, no shot of its own, no spec list, and the whole card is a link — so the row
reads as "those two elsewhere, these ones here" rather than three equivalent things. Its rules are
scoped under `.series` so they outrank `.series article`, which sets the white card background the
gradient replaces. It points at `#gallery` on Timber and Aluminum; Premier has no gallery section
since its build photographs became the spec-aside rotator, so there it points at `#specs`.

Under 900px the row keeps the two series beside each other and drops the photos beneath them with
`grid-column: 1 / -1`, where it stops being a card and becomes a bar: laid on its side, about 100px
deep instead of 540, with the link at the far end. Under 560px the whole row is single file and every
line of the bar stacks — tag, heading, sentence, link — letting it grow taller rather than squeeze.
Note that stacking it means clearing the flex sizing the wide rule sets: in a column a `flex-basis`
is a height, so the tag's `flex: 1 0 100%` filled the bar and wrapping threw the rest into a second
column that ran off the edge.

Each carries its own `<title>`, meta description, canonical URL and three JSON-LD blocks
(`Product`, `BreadcrumbList`, `FAQPage`). The quote form arrives with that page's series
already selected.

The roof line art is inline SVG drawn with `stroke="currentColor"`, so the same markup reads
correctly on dark and on pale backgrounds — it is a front elevation, and the roofline is what
distinguishes the three (hip / gable / arched). It survives only in the Timber and Aluminum spec
asides; everywhere else now carries a photograph.

Premier's spec aside holds a `[data-rotator]` in its place: the four build photographs stacked in
one 4:3 frame and cross-faded, advancing every five seconds. `main.js` builds the dot controls, so
a page without JavaScript shows one still photograph rather than buttons that do nothing, and skips
the timer entirely under `prefers-reduced-motion`. Rotation also pauses while the rotator is
hovered or holds keyboard focus, and stops for good once a dot is clicked. Any page can take one:
drop a `.rotator > .rotator-frame` of `<img>` in, mark the first `is-active`, and `main.js` finds
it.

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
- **Timber's feature photographs do not match its headings.** This matters more now than it did.
  While the shots sat in a captioned strip the caption named each one; in the accordion a shot
  opens directly under a heading, and on Timber that heading is the reconstruction rather than Bar
  H's words. "The gable earns its keep" opens onto rot-free decking, and "Bold and timeless on the
  water" onto a walkway. Aluminum's three were reordered and do line up — rust/rot-free,
  extrusion/extruded frame, Flotation Systems/durability. Paste Timber's live copy and its section
  can be corrected the way Premier's was.
- **Alt text everywhere was written without seeing the images**, which the build environment cannot
  reach. Someone who can see them should read it through.
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

The invented third "Multi-slip" layout card is gone from all three pages, because the live site
prices single and double slip only. Two passing mentions of larger builds survive elsewhere on each
page and were left alone, since dropping a pricing card is not the same as saying Bar H will not
build one: the hero chip reading `Slips — Single, double, larger` and the specifications row
reading `Single, double and larger, drawn to the boats you own`. Delete both if the series really
does stop at two.

**Timber and Aluminum have not been corrected.** Their `#built` headings and body copy are still
the reconstruction, and on both pages the detail photographs were filed against headings that do
not name them — Timber's photos are frame/rot-free/walkway against headings about trusses, the
gable and the look; Aluminum's are extruded frame/durability/rot-free against headings about rust,
extrusion and Flotation Systems. Paste the live copy for either page and they can be fixed the
same way Premier was.
