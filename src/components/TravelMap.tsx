import { useId, useRef, useState } from 'react';
import type { KeyboardEvent, PointerEvent } from 'react';
import { geoEqualEarth, geoGraticule10, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import type { GeometryCollection, Topology } from 'topojson-specification';
import world from '../assets/world-land.json';
import type { TravelStop } from '../types/content';
import TravelMapLabels from './TravelMapLabels';

const width = 1000;
const height = 520;
const sphere = { type: 'Sphere' } as const;
const projection = geoEqualEarth().fitExtent([[16, 16], [width - 16, height - 16]], sphere);
const path = geoPath(projection);
const topology = world as unknown as Topology<{ land: GeometryCollection }>;
const landPath = path(feature(topology, topology.objects.land)) ?? '';
const oceanPath = path(sphere) ?? '';
const gridPath = path(geoGraticule10()) ?? '';
const initialView = { scale: 1, x: 0, y: 0 };
type View = typeof initialView;

function constrain(view: View): View {
  return {
    ...view,
    x: Math.max(width * (1 - view.scale), Math.min(0, view.x)),
    y: Math.max(height * (1 - view.scale), Math.min(0, view.y)),
  };
}

function routePath(stops: TravelStop[]): string {
  const coordinates = stops.map(stop => [stop.longitude, stop.latitude]);
  return coordinates.length > 1 ? path({ type: 'LineString', coordinates }) ?? '' : '';
}

export default function TravelMap({ stops }: { stops: TravelStop[] }) {
  const id = useId();
  const [selectedIndex, setSelected] = useState(() => Math.max(0, stops.length - 1));
  const selected = Math.min(selectedIndex, Math.max(0, stops.length - 1));
  const [view, setView] = useState(initialView);
  const drag = useRef<{ id: number; x: number; y: number; view: View } | null>(null);
  const current = stops[selected];
  const next = stops[selected + 1];
  const nextRoute = next ? routePath(stops.slice(selected, selected + 2)) : '';
  const markers = new Map<string, number[]>();
  stops.forEach((stop, index) => {
    const key = `${stop.longitude},${stop.latitude}`;
    markers.set(key, [...(markers.get(key) ?? []), index]);
  });

  const visibleMarkers = [...markers.entries()].map(([key, indices]) => {
    const active = indices.includes(selected);
    const upcoming = !!next && indices.includes(selected + 1);
    const index = active ? selected : upcoming ? selected + 1 : indices[0];
    const stop = stops[index];
    const [px, py] = projection([stop.longitude, stop.latitude])!;
    const x = (px * view.scale + view.x) / width * 100;
    const y = (py * view.scale + view.y) / height * 100;
    return { key, indices, index, stop, x, y, active, upcoming };
  }).filter(marker => marker.x >= 0 && marker.x <= 100 && marker.y >= 0 && marker.y <= 100);
  const labels = visibleMarkers.filter(marker => marker.active || marker.upcoming)
    .map(({ key, stop, x, y, active, upcoming }) => ({ key, label: stop.label, x, y, active, upcoming }));

  function centerOn(stop: TravelStop | undefined, scale: number): View {
    const point = stop ? projection([stop.longitude, stop.latitude])! : [width / 2, height / 2];
    return constrain({ scale, x: width / 2 - point[0] * scale, y: height / 2 - point[1] * scale });
  }

  function selectStop(index: number) {
    setSelected(index);
    if (view.scale > 1) setView(centerOn(stops[index], view.scale));
  }

  function zoom(factor: number) {
    setView(centerOn(current, Math.max(1, Math.min(8, view.scale * factor))));
  }

  function startDrag(event: PointerEvent<HTMLDivElement>) {
    if (view.scale === 1 || event.button !== 0 || (event.target as Element).closest('button')) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY, view };
  }

  function moveDrag(event: PointerEvent<HTMLDivElement>) {
    const start = drag.current;
    if (!start || start.id !== event.pointerId) return;
    const ratio = width / event.currentTarget.getBoundingClientRect().width;
    setView(constrain({
      scale: start.view.scale,
      x: start.view.x + (event.clientX - start.x) * ratio,
      y: start.view.y + (event.clientY - start.y) * ratio,
    }));
  }

  function panWithKeyboard(event: KeyboardEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget) return;
    const moves: Record<string, [number, number]> = {
      ArrowLeft: [60, 0], ArrowRight: [-60, 0], ArrowUp: [0, 60], ArrowDown: [0, -60],
    };
    if (moves[event.key] && view.scale > 1) {
      event.preventDefault();
      const [x, y] = moves[event.key];
      setView(constrain({ ...view, x: view.x + x, y: view.y + y }));
    }
    if (event.key === 'Home') {
      event.preventDefault();
      setView(initialView);
    }
  }

  return (
    <div className="travel-map">
      <figure className="travel-figure glass-card">
        <div
          className={`travel-map-canvas${view.scale > 1 ? ' is-zoomed' : ''}`}
          role="group"
          aria-label="World travel map. Use the zoom buttons, then drag or use arrow keys to pan. Home resets the view."
          tabIndex={0}
          onPointerDown={startDrag}
          onPointerMove={moveDrag}
          onPointerUp={() => { drag.current = null; }}
          onPointerCancel={() => { drag.current = null; }}
          onLostPointerCapture={() => { drag.current = null; }}
          onKeyDown={panWithKeyboard}
        >
          <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-labelledby={`${id}-title ${id}-description`}>
            <title id={`${id}-title`}>World travel map</title>
            <desc id={`${id}-description`}>
              {stops.length ? 'The current city, next destination, and connecting route are highlighted. Use the previous and next visit buttons to follow the route chronologically.' : 'World outline. No visits have been added yet.'}
            </desc>
            <g transform={`translate(${view.x} ${view.y}) scale(${view.scale})`}>
              <path className="travel-ocean" d={oceanPath} />
              <path className="travel-graticule" d={gridPath} vectorEffect="non-scaling-stroke" />
              <path className="travel-land" d={landPath} vectorEffect="non-scaling-stroke" />
              <path className="travel-route" d={routePath(stops)} vectorEffect="non-scaling-stroke" />
              {next && <>
                <path className="travel-route travel-route-halo" d={nextRoute} vectorEffect="non-scaling-stroke" />
                <path className="travel-route travel-route-active" d={nextRoute} vectorEffect="non-scaling-stroke" />
              </>}
            </g>
          </svg>
          {visibleMarkers.map(({ key, indices, index, stop, x, y, active, upcoming }) => {
            const visits = indices.map(i => i + 1).join(', ');
            return (
              <button
                key={key}
                type="button"
                className={`travel-marker${active ? ' is-selected' : ''}${upcoming ? ' is-next' : ''}`}
                style={{ left: `${x}%`, top: `${y}%` }}
                aria-label={`${active ? 'Current stop. ' : ''}${upcoming ? 'Next destination. ' : ''}${stop.label}. ${indices.length > 1 ? `Visits ${visits}; activate to cycle through visits` : `Visit ${visits}`}.`}
                aria-pressed={active}
                onClick={() => selectStop(active ? indices[(indices.indexOf(selected) + 1) % indices.length] : index)}
              >
                <span className="travel-marker-dot" aria-hidden="true" />
              </button>
            );
          })}
          <TravelMapLabels labels={labels} />
        </div>
        <div className="travel-map-toolbar">
          <div className="travel-map-controls travel-visit-controls" role="group" aria-label="Travel visits" aria-describedby={`${id}-status`}>
            <button type="button" onClick={() => selectStop(selected - 1)} disabled={!current || selected === 0} aria-label="Previous visit" title="Previous visit">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 6-6 6 6 6" /></svg>
            </button>
            <span className="travel-visit-count" aria-hidden="true">{current ? selected + 1 : 0} / {stops.length}</span>
            <button type="button" onClick={() => selectStop(selected + 1)} disabled={!current || selected === stops.length - 1} aria-label="Next visit" title="Next visit">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 6 6-6 6" /></svg>
            </button>
          </div>
          <div className="travel-map-controls" role="group" aria-label="Map zoom">
            <button type="button" onClick={() => zoom(1 / 1.5)} disabled={view.scale === 1} aria-label="Zoom out">−</button>
            <button type="button" onClick={() => zoom(1.5)} disabled={view.scale === 8} aria-label="Zoom in">+</button>
            <button type="button" onClick={() => setView(initialView)} disabled={view.scale === 1}>Reset</button>
          </div>
        </div>
        <figcaption id={`${id}-status`} className="travel-map-status" aria-live="polite" aria-atomic="true">
          {current ? `Visit ${selected + 1} of ${stops.length} · ${current.label}${next ? ` · Next: ${next.label}` : ' · Final visit'}` : 'No visits added yet.'}
        </figcaption>
      </figure>
    </div>
  );
}
