# Yi-Chun Liao's website

React + TypeScript + Vite academic website, statically rendered for GitHub Pages.

## Updating the website

Everything for routine content updates lives in **[content/](content/README.md)**:
profile, biography, news, publications, posts, CV, images, and institution logos.
Start with its editing guide; application code lives separately in `src/`.

## Development

```sh
npm ci
npm run dev      # http://localhost:8080; override with PORT
npm run check    # lint, type checking, and production build
npm run preview # preview the generated site
```

If Node is not on PATH, prefix commands with
`conda run --no-capture-output -n website`.

## Structure and deployment

- `content/`: owner-edited content and assets; `content/public/` is served at `/`.
- `src/`: React components, pages, styles, and content types.
- `src/content.ts`: typed profile data shared by the UI and metadata.
- `src/seo.ts`: page metadata and route list; posts are included automatically.
- `src/entry-server.tsx` and `scripts/prerender.mjs`: static HTML generation.
- `AGENTS.md`: repository guidance for coding agents.

The build generates pages, a 404 page, `sitemap.xml`, and `robots.txt` in `dist/`.
`dist-ssr/` is a temporary build artifact. On pushes to `main`, GitHub Actions
runs lint and build, uploads `dist/` as `github-pages`, then deploys it in a
dependent job. The artifact is retained for seven days so a failed deployment
can be retried without rebuilding. If it has expired, start a new run from the
Actions tab. No runtime server is required.
React hydrates the static pages; old `/#/…` links are migrated to page paths.
