import { useEffect, useRef } from 'react';
import type { Theme } from '../types/theme';

export default function VisitorMap({ theme }: { theme: Theme }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let timeout: ReturnType<typeof setTimeout>;
    const dark = theme === 'dark';
    const dotColor = dark ? 'ffffff' : 'd4af37';
    const params = new URLSearchParams({
      d: 'mo0RB99k6P3fYzjUxr00Is-1QQvHCH6gC-ZSKlyMPIQ',
      cl: dark ? 'd4af37' : '002147',
      w: 'a',
      co: dark ? '001938' : 'fefefe',
      ct: dark ? 'ffffff' : '002147',
      t: 'tt',
      cmn: dotColor,
      cmo: dotColor,
    });

    const renderMap = () => {
      const script = document.createElement('script');
      script.id = 'mapmyvisitors';
      script.src = `https://mapmyvisitors.com/map.js?${params}`;
      container.replaceChildren(script);
    };
    const handleResize = () => {
      clearTimeout(timeout);
      timeout = setTimeout(renderMap, 1000);
    };

    renderMap();
    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('resize', handleResize);
      container.replaceChildren();
    };
  }, [theme]);

  return (
    <section className="glass-card visitor-map" aria-label="Visitor map">
      <div id="map-container" ref={containerRef} />
    </section>
  );
}
