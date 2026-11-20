import { useLayoutEffect, useRef } from 'react';

export default function TravelMapLabel({ label, x, y }: { label: string; x: number; y: number }) {
  const layerRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const layer = layerRef.current!;
    const element = labelRef.current!;
    const positionLabel = () => {
      const { width, height } = layer.getBoundingClientRect();
      const size = element.getBoundingClientRect();
      if (!width || !height) return;
      const px = x / 100 * width;
      const py = y / 100 * height;
      const above = py - size.height - 14;
      Object.assign(element.style, {
        left: `${Math.max(8, Math.min(px - size.width / 2, width - size.width - 8))}px`,
        top: `${Math.max(8, Math.min(above >= 8 ? above : py + 14, height - size.height - 8))}px`,
        visibility: 'visible',
      });
    };
    positionLabel();
    const observer = new ResizeObserver(positionLabel);
    observer.observe(layer);
    observer.observe(element);
    return () => observer.disconnect();
  }, [label, x, y]);

  return (
    <div ref={layerRef} className="travel-map-label-layer" aria-hidden="true">
      <span ref={labelRef} className="travel-marker-label">{label}</span>
    </div>
  );
}
