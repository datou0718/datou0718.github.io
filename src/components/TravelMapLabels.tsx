import { useLayoutEffect, useRef } from 'react';
import { placeTravelLabels } from '../travelLabels';

interface MapLabel {
  key: string;
  label: string;
  x: number;
  y: number;
  active: boolean;
  upcoming: boolean;
}

export default function TravelMapLabels({ labels }: { labels: MapLabel[] }) {
  const layerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const layer = layerRef.current!;
    const elements = Array.from(layer.children) as HTMLElement[];
    const positionLabels = () => {
      const { width, height } = layer.getBoundingClientRect();
      if (!width || !height) return;
      const boxes = labels.map((label, index) => {
        const size = elements[index].getBoundingClientRect();
        return { x: label.x / 100 * width, y: label.y / 100 * height, width: size.width, height: size.height };
      });
      placeTravelLabels(boxes, width, height).forEach((position, index) => {
        Object.assign(elements[index].style, {
          left: `${position.left}px`, top: `${position.top}px`, visibility: 'visible',
        });
      });
    };
    positionLabels();
    const observer = new ResizeObserver(positionLabels);
    observer.observe(layer);
    elements.forEach(element => observer.observe(element));
    return () => observer.disconnect();
  }, [labels]);

  return (
    <div ref={layerRef} className="travel-map-labels" aria-hidden="true">
      {labels.map(label => (
        <span key={label.key} className={`travel-marker-label${label.active ? ' is-selected' : ''}${label.upcoming ? ' is-next' : ''}`}>
          {label.label}
        </span>
      ))}
    </div>
  );
}
