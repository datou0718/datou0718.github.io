import { useEffect, useRef } from 'react';
import type { Theme } from '../types/theme';
import { mapThemes } from '../mapTheme';

export default function VisitorMap({ theme }: { theme: Theme }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let timeout: ReturnType<typeof setTimeout>;
    const colors = mapThemes[theme];
    const params = new URLSearchParams({
      d: 'mo0RB99k6P3fYzjUxr00Is-1QQvHCH6gC-ZSKlyMPIQ',
      cl: colors.land.slice(1),
      w: 'a',
      co: colors.background.slice(1),
      ct: colors.text.slice(1),
      t: 'tt',
      cmn: colors.marker.slice(1),
      cmo: colors.marker.slice(1),
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
