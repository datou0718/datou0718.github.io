# Academic Personal Website - Yi-Chun Liao

React + TypeScript + Vite, deployed as static HTML on GitHub Pages.

## Build and preview

```sh
npm run build
npm run preview
```

The build renders the existing React pages into `dist/index.html`,
`dist/experience/index.html`, `dist/publications/index.html`,
`dist/posts/index.html`, and a directory for each post in `src/data/posts.json`.
It also generates `404.html`, `robots.txt`, and `sitemap.xml`.
The GitHub Pages workflow already deploys `dist/`; no runtime server is needed.
`dist-ssr/` is a temporary build artifact and is not deployed.

Content and styles remain in their existing source files. The metadata in
`src/seo.ts` uses those same names, profile links, and post descriptions.
React hydrates the HTML to enable navigation and interactive features.
Old `/#/…` links are converted to the equivalent page path, preserving article
heading anchors. Internal links use real paths with trailing slashes.

## Google Search Console

1. Add `https://datou0718.github.io/` as a **URL-prefix property**.
2. For HTML-file verification, put the exact downloaded `google….html` file in
   `public/`. Keep its filename and contents unchanged. Vite copies it to the
   root of `dist/` automatically.
3. Deploy the changes and check that Google's specified verification URL
   returns the file, then click **Verify** in Search Console. Keep the file in
   the repository after verification.
4. Submit `https://datou0718.github.io/sitemap.xml` in **Sitemaps**.
5. Inspect `https://datou0718.github.io/` and choose **Request indexing**.

Search Console requires the site owner's Google account. The code cannot
verify ownership or request indexing by itself. Indexing and rankings are
controlled by search engines; metadata and a sitemap do not guarantee them.

When changing the site's domain, update `siteUrl` in `src/seo.ts` before
building. Add new page routes to `pagePaths` there as well; posts are included
automatically from `src/data/posts.json`. Do not add `#` routes to the sitemap.
