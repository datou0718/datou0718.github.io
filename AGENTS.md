# Website development

React + TypeScript + Vite academic website, statically rendered for GitHub Pages.

## Commands

- `npm ci` installs the locked dependencies.
- `npm run dev` starts Vite on port 8080 (override with `PORT`).
- `npm run check` runs lint, travel resolver tests, type checking, and the production build. Use Node.js 24 or later.
- `npm run preview` serves the built site.
- If Node is unavailable on PATH, use `conda run --no-capture-output -n website npm …`.

## Structure

- `content/` contains all owner-edited data, Markdown, and public files. Preserve it during refactors; `content/README.md` is the editing guide.
- `src/content.ts` provides the typed profile; data shapes live in `src/types/content.ts`.
- `src/App.tsx` owns routing, theme, and the shared page layout.
- `src/components/` contains profile, navigation, timeline, publication, and tag components.
- `src/index.css` owns styling; reuse existing classes and variables.
- `src/seo.ts`, `src/entry-server.tsx`, and `scripts/prerender.mjs` generate static pages and metadata.
- `content/public/` is Vite's public directory. Its files retain root-relative URLs such as `/assets/CV.pdf` and `/logos/duke.svg`.

## Design constraints

- Preserve the light/navy and dark/gold themes, content, and current layout unless asked to redesign.
- Desktop starts at 1200px; pair it with `max-width: 1199.98px`. Other breakpoints are 768px and 480px.
- The desktop page uses up to 1600px at 96vw; the sidebar stays 320px wide so additional width goes to the main content.
- The desktop Duke CEI wordmark shares `--sidebar-profile-width` with the avatar, profile links, and visitor map.
- Put responsive overrides after their base rules; use `--glass-padding` for cards and list rows.
- Only `.page-glass` uses backdrop blur. Sticky bars use the opaque `--nav-solid-bg`.
- Preserve measured mobile header/avatar sizes and the desktop sidebar's scrollable table of contents.
- The visitor map stays below the desktop profile links on every page, with no visible heading and compact widget text. Keep one map instance mounted across navigation; on mobile it follows the main content. The post table of contents sits below the map and scrolls independently. Keep all sidebar content reachable in short desktop windows.
- Research Interests and the table of contents are hidden on mobile; Reviewer remains visible.
- Selected publications use one card per row, with a figure on the left and text on the right. At 768px and below, figures stack above the text. Allow full text and expanded abstracts to grow naturally. Figures are non-interactive; authors are visible. Titles, author lists, and expanded details/abstracts are justified; research questions stay left-aligned. The full publication list remains separate.
- Reviewer and Research Interests share `TagList`. Reviewer data is `content.reviewer`.
- The Travel map is the last homepage section, after Reviewer. Edit `content/travel.json` as a newest-first array of location strings (for example, `"Durham, North Carolina"` and `"Taipei, Taiwan"`). Use the full string for geocoding/cache keys, but display only the authored city name before the first comma, without separate city/country/region fields or appended provider wording; the route and visit counter are chronological and the latest visit is initially selected. Use compact previous/next controls with a visit counter instead of a city list. Map points are unnumbered; emphasize the current city, its outgoing leg, and the next destination, with other routes and points subdued. Measure and position the two city labels together so they stay separated and inside the map during selection, zoom, pan, resizing, and font loading. `scripts/travel.ts` resolves new cities during Vite builds/dev updates and caches coordinates in `src/generated/travel-geocodes.json`; keep lookups out of visitors' browsers. Both maps share `src/mapTheme.ts`; preserve the travel map’s original curved Equal Earth outline and subtle latitude/longitude grid. Keep explanatory copy and attribution links out of the travel UI; retain source credits in the repository documentation. Preserve repeat visits, antimeridian wrapping, and keyboard controls.
- Keep browser APIs in effects so static rendering and initial hydration agree. Preserve legacy hash links, SEO metadata, sitemap, and verification files.

## Validation

Run `npm run check`. For layout changes, inspect 375px, 768px, and 1440px in both themes; also check the 1200px boundary when changing responsive rules. Exercise navigation, publication details, and post anchors when affected. Keep temporary debugging files outside the repository.
