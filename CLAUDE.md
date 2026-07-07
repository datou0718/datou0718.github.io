# Project notes: Yi-Chun Liao's academic homepage

Personal academic website. React + TypeScript + Vite, `HashRouter` (so it deploys
as a static site on GitHub Pages with no server-side routing). No test suite.

## Environment

- **Use the `academic_site` conda environment** — `node`/`npm` are not on the
  default PATH in a fresh shell. Either `conda run -n academic_site npm ...`,
  or use the wrapper script at `.claude/npm-academic-site.sh` (already set up;
  it exports `academic_site`'s bin dir onto PATH and execs `npm "$@"`), which is
  what `.claude/launch.json`'s `dev` config points `runtimeExecutable` at for
  the Preview tool.
- Dev server: `vite.config.ts` sets `server.port = Number(process.env.PORT) ||
  8080` with `strictPort: true` (the preview tool's `autoPort`/`PORT` env
  mechanism picks the actual port — check the tool's returned port rather than
  assuming 8080). The user sometimes has their own `npm run dev` already
  running on 8080 outside this session — don't kill it without asking.
- Build/verify: `.claude/npm-academic-site.sh run build` → `tsc -b && vite build`.
  Always treat a clean build as a required verification step after CSS/TSX
  edits, not just visual screenshot checks.
- No lint/test gate is enforced in this workflow beyond `tsc` type-checking as
  part of `build`.

## Preview-tool quirks (not project bugs — don't "fix" these in code)

- **Screenshot staleness**: `preview_screenshot` occasionally returns a stale
  frame (wrong route highlighted, blank content, mid-transition state) even
  though `window.location.hash` / DOM state is actually correct. If a
  screenshot looks wrong, re-verify with `preview_eval` (check `location.hash`,
  query real elements) before concluding something is broken. Stopping and
  restarting the preview server (`preview_stop` + `preview_start`) reliably
  clears this.
- **Viewport scaling bug**: occasionally `window.innerWidth` reports an
  inflated value (e.g. 558 or 624 instead of the requested 375) while
  `window.visualViewport.width` and the actual screenshot are correct at 375.
  This desyncs `getBoundingClientRect()` math from what's visually rendered.
  Fix: restart the preview server fresh before trusting pixel measurements.
- **Chained `location.hash = X; location.reload()` in one `preview_eval` call
  can race** — the reload sometimes fires before the hash write lands, so you
  end up back on the previous route. Split into two separate `preview_eval`
  calls, or click the actual nav link (`preview_click` on `a[href="#/x"]`)
  instead.

## Architecture

- `src/App.tsx` — root layout (`AppContent`): `.outer-padding` →
  `MobileProfile` (mobile-only sticky header) + `.container` →
  `.glass-card.page-glass` → `NavRow` (sticky tab bar, defined inline in
  `App.tsx`) + `.layout-grid` → `.sidebar-col` (desktop `Sidebar`, hidden
  `<1024px`) + `.content-col` (routed pages).
- Routes (`HashRouter`): `/` → About (`Bio`, `News`, `ResearchInterests`,
  `Publications selectedOnly`, `VisitorMap`, all from `Sections.tsx`),
  `/experience` → `ExperiencePage.tsx` (`Education`, `Experience`,
  `SelectedAwards`, `Teaching`), `/publications` → `PublicationsPage.tsx`
  (`Publications` full list), `/posts` and `/posts/:id` → `PostsList`/`PostView`.
- `src/components/Sections.tsx` is the biggest file — holds most About/
  Experience/Publications section components and the shared `TimelineRow`.
- `src/components/Sidebar.tsx` also exports `ProfileLinks` (CV/email/GitHub/
  Scholar/LinkedIn/Instagram icon row), shared between desktop `Sidebar` and
  `MobileProfile`.
- `src/data/content.ts` — hand-edited site content (name, bio, education,
  experience, awards, teaching, service, `profiles` links). `news.json`,
  `publications.json`, `posts.json` are separate data files.
- `src/context/LayoutContext.tsx` — lets a page (e.g. `PostView`) inject a
  table-of-contents into the desktop `Sidebar`. **Deliberately not shown on
  mobile** (explicit user decision — don't try to add a mobile TOC).
- All styling is one file: `src/index.css`. No CSS modules/styled-components.
  Tailwind-free, hand-written custom properties + BEM-ish class names.

## Breakpoints

Three, consistently: `max-width: 1024px` (sidebar hides, mobile header
appears), `max-width: 768px` (main mobile typography/spacing step-down),
`max-width: 480px` (narrow-phone further step-down). When adding a new
responsive rule, put it in the existing breakpoint block for that width rather
than inventing a new one.

## The one rule that caused the most bugs: CSS cascade order

Several rounds of "I added a mobile override but it didn't apply" turned out
to be the same mistake: **a later same-specificity rule wins, regardless of
whether it's inside a media query.** This file's structure is base-rule declared
first, then breakpoint overrides declared **after** it. If you add a mobile
override for `.foo` by editing/inserting into a media-query block that
happens to sit *before* `.foo`'s base rule textually, the base rule (coming
later in the file) silently wins and your override does nothing — even though
your rule matches a narrower/more specific-looking media query. **Always
place new responsive overrides after the base rule for that selector**, or
grep for every existing occurrence of the selector first (`grep -n
"\.your-class"`) and check ordering before assuming a new rule will apply.

Related gotcha: **inline `style={{...}}` in a `.tsx` file beats any plain CSS
rule**, media-query or not. If you need to override an inline style from CSS,
you need `!important` (e.g. `.theme-toggle-nav { display: none !important; }`
overriding `App.tsx`'s inline `style={{ display: 'inline-flex' }}`).

## Design-system conventions (deliberate, keep consistent)

- **`--glass-padding`** (`1rem` desktop, `0.75rem` at `≤768px`) is the *single
  source of truth* for glass-card padding, used via `var(--glass-padding)` —
  not just on the card itself but also on **every row-level list item inside
  it** (`.exp-row`, `.news-item`, `.pub-entry`, `.service-entry`). This was a
  real, user-reported bug: those row paddings used to be hardcoded (`1rem`,
  `0.85rem`) independently of the card's own padding, so they only happened to
  match at desktop width and drifted apart at `≤768px` — the card's own
  top/bottom padding shrank but the row's first/last-child inset didn't,
  producing visibly uneven spacing (e.g. 12px above the first item vs 16px
  below the last item, against the same card edge). **If you add a new
  row-style list item inside a glass card, its vertical padding must be
  `var(--glass-padding)`, not a hardcoded rem value.**
- **`.page-glass`** is the *only* glass element allowed `backdrop-filter`
  (desktop only — resets to fully transparent/no-padding/no-border at
  `≤1024px` for an edge-to-edge mobile look). Nested `backdrop-filter` breaks
  `position: sticky` z-ordering, so the sticky nav bar and mobile header
  instead use **`--nav-solid-bg`**: a `color-mix()` that manually recomputes
  what `--glass-bg` would look like *if* composited over `--bg-color` (i.e.
  fakes the glass look with an opaque color, since real translucency isn't an
  option there). If you ever change `--glass-bg`'s alpha or `--bg-color`, you
  must recompute `--nav-solid-bg`'s mix percentages to match, or the nav/header
  will visibly stop matching the cards again.
- **`--bg-color` (dark theme) is deliberately not the "obvious" dark navy.**
  It's set to `#001938` — the *already-composited* result of `--glass-bg` over
  a navy background — not the more saturated `#002147` you might reach for.
  Why: on mobile, `.page-glass` goes fully transparent, so raw `--bg-color`
  shows directly in the gaps around/between cards. If `--bg-color` were a
  different shade than the glass-composited cards sitting on it, the page
  reads as two different navies stitched together (a real bug the user
  caught). Treat "the whole page background" and "what glass cards look like"
  as the same color family by construction, not by coincidence.
- **Sidebar avatar width = profile-icon-row width**, by construction:
  `--icon-size` (`2.2rem`), `--icon-gap` (`0.5rem`), `--icon-count` (`6` —
  **must be kept in sync by hand** if you add/remove a `ProfileLinks` icon)
  feed a `calc()` for `.profile-avatar`'s width. Don't hardcode the avatar
  size.
- **Mobile header avatar size is JS-measured, not CSS `aspect-ratio` guessed.**
  `MobileProfile.tsx` has a `ResizeObserver` (`useLayoutEffect`) that measures
  `.mobile-profile-info`'s real rendered height and sets it as
  `--mobile-avatar-size` on `document.documentElement`; `.mobile-avatar`/
  `.mobile-avatar-placeholder` just read that var for both width and height.
  This was a deliberate choice over `align-self: stretch` + `aspect-ratio: 1`
  because an `<img>`'s own intrinsic dimensions can fight that trick in subtle
  ways — the explicit-measurement approach is exact and was verified
  pixel-perfect (avatar top/bottom == info-block top/bottom, always square).
  The same file also sets `--mobile-profile-height` (whole header's height) so
  `.page-nav-row` can position itself with `top: var(--mobile-profile-height)`
  instead of a **hardcoded guess that previously caused a real overlap/jump
  bug** when scrolling (nav row jumping ~10px under the header because the
  hardcoded `76px` undershot the header's true height). If you resize/redesign
  the mobile header, this wiring means the nav row repositions itself
  automatically — don't add a new hardcoded offset.
- **`.mobile-profile` and `.page-nav-row` bleed to the true viewport edge**
  via `margin: -1rem -1rem 0` + `width: calc(100% + 2rem)` at `≤1024px`,
  canceling `.outer-padding`'s `1rem` inset on all three outer sides (not just
  left/right — an earlier version only canceled left/right and left a visible
  gap/seam above the header at rest scroll position, another user-caught bug).
  Their own internal padding is bumped to `1rem` to match, so their *content*
  (avatar, tabs) still visually aligns with the card content below, which
  keeps the `1rem` inset.
- **Sticky nav bar on mobile shows only the 4 page tabs** — no title, no
  theme toggle (the mobile header already has its own theme toggle next to
  the name; showing it twice was explicitly called out as redundant). Tabs
  use `flex: 1; justify-content: space-evenly` so they fill the row and space
  themselves evenly, with `overflow-x: auto` as a scroll fallback (mirrors
  pbb.sh's `.page-nav-tabs` pattern) so a long active-tab label can never push
  a later tab fully off-screen with no way to reach it — that was a real
  regression before the scroll fallback existed.
- **Text alignment split**: paragraph/body copy stays `text-align: justify`
  (looks fine, more words per line dilutes the unevenness); `h1/h2/h3`
  (headings) are forced `text-align: left !important` on mobile specifically
  because justify on a large, few-words-per-line heading produces ugly uneven
  gaps — worst with wrapped CJK text (a real example: a Chinese post title
  visibly gapped between characters). Don't blanket-justify or blanket-left
  the whole page; the split is deliberate.
- **Experience/Education/Awards/Teaching timeline rows** (`.exp-row` →
  `.exp-icon-col` + `.exp-body`) are a *contained* flex row — both icon and
  text are normal-flow children fully inside the card. This replaced an
  earlier design where the institution-logo icon escaped the card via
  `position: absolute; left: -101px` to sit in the sidebar gutter — that
  design caused a real, confirmed bug where the icon visually bled through
  and rendered on top of the sticky nav bar (verified via
  `document.elementFromPoint`) because the nav bar's own box didn't extend
  far enough left to cover where the icon poked out to. **Don't reintroduce
  negative-offset "escape the card" positioning for these rows** — the fixed
  design's structural containment is what prevents the bug, not a z-index
  patch. Icon vertical centering is just `align-items: center` on `.exp-row`
  — verified pixel-exact (icon center == body center) across every row,
  including ones with a wrapped multi-line title.
- **`location` field on timeline rows is desktop-only.** It's still passed as
  a prop from all four sections (`Education`/`Experience`/`SelectedAwards`/
  `Teaching`) — don't remove the prop — but the rendered `<span>` carries an
  extra `.timeline-location` class that's `display: none` at `≤768px`. This
  was chosen over conditionally not-rendering it so desktop still shows it.
- **Mobile timeline rows stay inline (icon beside text), not stacked** —
  `--exp-icon-size` just shrinks (`4rem` → `2.5rem` at `≤768px`) to leave more
  width for text, rather than switching `.exp-row` to
  `flex-direction: column`. An earlier stacked-icon design was tried and
  reverted in favor of this, closer to pbb.sh's compact inline pattern.
  Relatedly, `.timeline-row` (the title+date and affiliation+location pairs
  inside `.exp-body`) switches from `justify-content: space-between` to
  `flex-direction: column` at `≤768px` — side-by-side broke visibly once the
  left side wrapped to 2+ lines (the short right-side text ended up stranded
  next to the wrong line); stacking each onto its own full-width line fixed
  real, reproduced wrapping bugs (e.g. "University of Notre Dame" wrapping
  mid-name).
- **`.news-item` centers its date against wrapped content**
  (`align-items: center`, not `flex-start`) — a real reported bug where a
  2-line news item left the date pinned to the top instead of the middle.

## Naming/cleanup already done (don't reintroduce)

- `content.socials` → `content.profiles` (GitHub/Scholar/LinkedIn/Instagram
  aren't "social media"). Component renamed `SocialLinks` → `ProfileLinks`.
- `src/components/Header.tsx` was dead code (unused, fully superseded by
  `Sidebar` + `MobileProfile` + the inline `NavRow`) — deleted.
- Three overlapping/duplicate "timeline" CSS systems existed
  (`.timeline-row-item`, `.timeline-item`/`.timeline-list`, `.tl-item`/
  `.tl-line-col`) from earlier redesign iterations; only the first was live,
  the other ~180 lines were dead and deleted. If you see any of those class
  names again, they're dead — don't resurrect them.

## Reference site

`https://pbb.sh` (repo: `github.com/sleepymalc/pbb.sh`, Astro — different
framework, used for visual/pattern inspiration only, not code reuse) was the
explicit design reference for: sticky-header opaque-color-instead-of-blur
technique, scrollable/evenly-spaced nav tabs, compact inline timeline icons.

## Verification workflow used throughout

For any CSS/layout change: start preview → resize to `mobile` (375×812) →
also check `tablet` (768×1024) and desktop (1440×900) → check both
`data-theme` values → screenshot + targeted `preview_eval` pixel measurements
(don't trust visual judgment alone for "is X centered/aligned" — measure
`getBoundingClientRect()` centers/edges directly) → `preview_stop` →
production build. Several bugs in this project were only caught by exact pixel
measurement after a visual check looked "probably fine."
