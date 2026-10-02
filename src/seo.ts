import { content } from './data/content';
import posts from './data/posts.json';

export const siteUrl = 'https://datou0718.github.io/';
const name = `${content.name.english} (${content.name.chinese})`;
const homeDescription = `${name}, ${content.title}. Research in ${content.researchInterests.join(' and ').toLowerCase()}. Publications, experience, and posts.`;

export const pagePaths = ['/', '/experience/', '/publications/', '/posts/', ...posts.map(post => `/posts/${post.id}/`)];

export function normalizePath(path: string): string {
  return path === '/' ? '/' : `${path.replace(/\/+$/, '')}/`;
}

export interface SeoTag {
  key: string;
  tag: 'title' | 'meta' | 'link' | 'script';
  attrs?: Record<string, string>;
  text?: string;
}

export function getSeoTags(pathname: string): SeoTag[] {
  const path = normalizePath(pathname);
  const post = posts.find(post => path === `/posts/${post.id}/`);
  const pageNames: Record<string, string> = {
    '/experience/': 'Experience',
    '/publications/': 'Publications',
    '/posts/': 'Posts',
  };
  const descriptions: Record<string, string> = {
    '/experience/': `Education, research experience, awards, and teaching of ${name}, ${content.title}.`,
    '/publications/': `Research publications by ${name} on ${content.researchInterests.join(' and ').toLowerCase()}.`,
    '/posts/': `Posts and academic experiences shared by ${name}.`,
  };
  const knownPage = pagePaths.includes(path);
  const title = path === '/' ? `${name} | ${content.title}` : `${post?.title ?? pageNames[path] ?? 'Page not found'} | ${name}`;
  const description = post ? `${post.description} — ${name}` : descriptions[path] ?? homeDescription;
  const url = new URL(path, siteUrl).href;
  const image = new URL(content.headshot, siteUrl).href;
  const personId = `${siteUrl}#person`;
  const websiteId = `${siteUrl}#website`;
  const person = {
    '@type': 'Person',
    '@id': personId,
    name: content.name.english,
    alternateName: content.name.chinese,
    url: siteUrl,
    image,
    description: content.title,
    sameAs: Object.values(content.profiles),
    knowsAbout: content.researchInterests,
  };
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      person,
      {
        '@type': 'WebSite',
        '@id': websiteId,
        url: siteUrl,
        name: content.name.english,
        alternateName: content.name.chinese,
        publisher: { '@id': personId },
      },
      {
        '@type': path === '/' ? 'ProfilePage' : 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: title,
        description,
        isPartOf: { '@id': websiteId },
        ...(path === '/' ? { mainEntity: { '@id': personId } } : { author: { '@id': personId } }),
      },
    ],
  };
  return [
    { key: 'title', tag: 'title', text: title },
    { key: 'description', tag: 'meta', attrs: { name: 'description', content: description } },
    { key: 'author', tag: 'meta', attrs: { name: 'author', content: content.name.english } },
    { key: 'robots', tag: 'meta', attrs: { name: 'robots', content: knownPage ? 'index, follow' : 'noindex, follow' } },
    // Unknown URLs must not claim the homepage as their canonical page.
    ...(knownPage ? [{ key: 'canonical', tag: 'link' as const, attrs: { rel: 'canonical', href: url } }] : []),
    ...Object.entries({
      'og:type': 'website',
      'og:site_name': content.name.english,
      'og:title': title,
      'og:description': description,
      'og:url': url,
      'og:image': image,
      'og:image:alt': content.name.english,
    }).map(([property, value]): SeoTag => ({ key: property, tag: 'meta', attrs: { property, content: value } })),
    { key: 'twitter:card', tag: 'meta', attrs: { name: 'twitter:card', content: 'summary' } },
    ...(knownPage ? [{ key: 'schema', tag: 'script' as const, attrs: { type: 'application/ld+json' }, text: JSON.stringify(structuredData).replace(/</g, '\\u003c') }] : []),
  ];
}

export function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

export function renderSeoHead(pathname: string): string {
  return getSeoTags(pathname).map(({ key, tag, attrs, text }) => {
    const attributes = Object.entries({ 'data-site-seo': key, ...attrs })
      .map(([name, value]) => ` ${name}="${escapeHtml(value)}"`).join('');
    if (tag === 'meta' || tag === 'link') return `<${tag}${attributes}>`;
    return `<${tag}${attributes}>${tag === 'script' ? text : escapeHtml(text ?? '')}</${tag}>`;
  }).join('\n  ');
}
