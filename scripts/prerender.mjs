import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { render, pagePaths, renderSeoHead, siteUrl, escapeHtml } from '../dist-ssr/entry-server.js';

const template = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
const outputDir = new URL('../dist/', import.meta.url);
const seoPattern = /<!--seo:start-->[\s\S]*?<!--seo:end-->/;
const appPlaceholder = '<div id="root"></div>';

if (!seoPattern.test(template) || !template.includes(appPlaceholder)) {
  throw new Error('Static rendering placeholders are missing from dist/index.html');
}

for (const path of [...pagePaths, '/404/']) {
  // Reuse the actual page components: no separate, hidden copy for crawlers.
  const html = template
    .replace(seoPattern, () => `<!--seo:start-->\n  ${renderSeoHead(path)}\n  <!--seo:end-->`)
    .replace(appPlaceholder, () => `<div id="root" data-page="${escapeHtml(path)}">${render(path)}</div>`);
  const output = new URL(path === '/404/' ? '404.html' : `${path.slice(1)}index.html`, outputDir);
  await mkdir(dirname(output.pathname), { recursive: true });
  await writeFile(output, html);
}

// Only real, statically served pages belong in the sitemap, never # fragments.
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pagePaths.map(path => `  <url><loc>${escapeHtml(new URL(path, siteUrl).href)}</loc></url>`).join('\n')}\n</urlset>\n`;
await writeFile(new URL('sitemap.xml', outputDir), sitemap);
await writeFile(new URL('robots.txt', outputDir), `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}sitemap.xml\n`);
await writeFile(new URL('.nojekyll', outputDir), '');
console.log(`Prerendered ${pagePaths.length} pages, a 404 page, robots.txt, and sitemap.xml in ${resolve('dist')}`);
