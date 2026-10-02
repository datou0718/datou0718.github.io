import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getSeoTags } from '../seo';

// The same metadata is written into static HTML at build time. Keep it in sync
// when React Router changes the page without a full browser navigation.
export default function Seo() {
  const { pathname } = useLocation();
  useEffect(() => {
    const tags = getSeoTags(pathname);
    document.head.querySelectorAll<HTMLElement>('[data-site-seo]').forEach(element => {
      if (!tags.some(tag => tag.key === element.dataset.siteSeo)) element.remove();
    });
    tags.forEach(({ key, tag, attrs, text }) => {
      let element = document.head.querySelector<HTMLElement>(`[data-site-seo="${key}"]`);
      if (!element) {
        element = document.createElement(tag);
        element.dataset.siteSeo = key;
        document.head.appendChild(element);
      }
      Object.entries(attrs ?? {}).forEach(([name, value]) => element.setAttribute(name, value));
      if (text !== undefined) element.textContent = text;
    });
  }, [pathname]);
  return null;
}
