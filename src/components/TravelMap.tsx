import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent, PointerEvent } from 'react';
import { geoEqualEarth, geoGraticule10, geoInterpolate, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import type { GeometryCollection, Topology } from 'topojson-specification';
import world from '../assets/world-land.json';
import type { TravelStop } from '../types/content';
import TravelMapLabel from './TravelMapLabel';

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
type Coordinates = [number, number];
interface Motion { from: Coordinates; to: Coordinates; index: number; auto: boolean }
const coordinates = (stop: TravelStop): Coordinates => [stop.longitude, stop.latitude];
const samePosition = (a: Coordinates, b: Coordinates) => a[0] === b[0] && a[1] === b[1];
const ease = (t: number) => t * t * (3 - 2 * t);

function constrain(view: View): View {
  return {
    ...view,
    x: Math.max(width * (1 - view.scale), Math.min(0, view.x)),
    y: Math.max(height * (1 - view.scale), Math.min(0, view.y)),
  };
}

function routePath(points: Coordinates[]): string {
  return points.length > 1 ? path({ type: 'LineString', coordinates: points }) ?? '' : '';
}

function centerOn(position: Coordinates | null, scale: number): View {
  const point = position ? projection(position)! : [width / 2, height / 2];
  return constrain({ scale, x: width / 2 - point[0] * scale, y: height / 2 - point[1] * scale });
}

export default function TravelMap({ stops }: { stops: TravelStop[] }) {
  const id = useId();
  const [selectedIndex, setSelected] = useState(() => Math.max(0, stops.length - 1));
  const [playing, setPlaying] = useState(false);
  const [motion, setMotion] = useState<Motion | null>(null);
  const [position, setPosition] = useState<Coordinates | null>(() => stops[selectedIndex] ? coordinates(stops[selectedIndex]) : null);
  const positionRef = useRef(position);
  const frameRef = useRef(0);
  const [pausedVisit, setPausedVisit] = useState<number | null>(null);
  const selected = Math.min(selectedIndex, Math.max(0, stops.length - 1));
  const current = stops[selected];
  const displayedStop = stops[motion?.index ?? pausedVisit ?? selected];
  const atCurrent = !!current && !!position && samePosition(position, coordinates(current));
  const [view, setView] = useState(initialView);
  const viewRef = useRef(initialView);
  const updateView = useCallback((value: View) => {
    viewRef.current = value;
    setView(value);
  }, []);
  const updatePosition = useCallback((value: Coordinates) => {
    positionRef.current = value;
    setPosition(value);
  }, []);
  const drag = useRef<{ id: number; x: number; y: number; view: View } | null>(null);
  const fullRoute = useMemo(() => routePath(stops.map(coordinates)), [stops]);
  const point = position ? projection(position) : null;
  const x = point ? (point[0] * view.scale + view.x) / width * 100 : 0;
  const y = point ? (point[1] * view.scale + view.y) / height * 100 : 0;
  const visible = !!point && x >= 0 && x <= 100 && y >= 0 && y <= 100;

  useEffect(() => {
    if (!motion) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const duration = reducedMotion ? 0 : motion.auto ? 850 : 600;
    const cycle = motion.auto ? 1000 : duration;
    const interpolate = geoInterpolate(motion.from, motion.to);
    const started = performance.now();
    let cameraStart = viewRef.current;
    let cameraStarted = 0;
    const tick = (now: number) => {
      const elapsed = now - started;
      if (elapsed >= cycle) {
        updatePosition(motion.to);
        if (viewRef.current.scale > 1) updateView(centerOn(motion.to, viewRef.current.scale));
        if (motion.auto) setSelected(motion.index);
        const next = motion.auto ? stops[motion.index + 1] : undefined;
        if (next) {
          setMotion({ from: motion.to, to: coordinates(next), index: motion.index + 1, auto: true });
        } else {
          setMotion(null);
          setPlaying(false);
        }
        return;
      }
      if (!reducedMotion) {
        updatePosition(interpolate(ease(Math.min(elapsed / duration, 1))) as Coordinates);
        const view = viewRef.current;
        if (view.scale > 1) {
          if (view.scale !== cameraStart.scale) {
            cameraStart = view;
            cameraStarted = elapsed;
          }
          const end = centerOn(motion.to, view.scale);
          const t = ease(Math.min((elapsed - cameraStarted) / Math.max(1, duration - cameraStarted), 1));
          updateView({ scale: view.scale,
            x: cameraStart.x + (end.x - cameraStart.x) * t,
            y: cameraStart.y + (end.y - cameraStart.y) * t });
        }
      }
      frameRef.current = window.requestAnimationFrame(tick);
    };
    frameRef.current = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frameRef.current);
  }, [motion, stops, updatePosition, updateView]);

  function stopMotion() {
    if (motion) setPausedVisit(motion.index);
    window.cancelAnimationFrame(frameRef.current);
    setMotion(null);
    setPlaying(false);
  }

  function selectStop(index: number) {
    const target = stops[index];
    if (!target) return;
    stopMotion();
    setPausedVisit(null);
    setSelected(index);
    const to = coordinates(target);
    const from = positionRef.current;
    if (from && !samePosition(from, to)) {
      setMotion({ from, to, index, auto: false });
    } else {
      updatePosition(to);
      if (viewRef.current.scale > 1) updateView(centerOn(to, viewRef.current.scale));
    }
  }

  function togglePlayback() {
    stopMotion();
    if (playing || stops.length < 2) return;
    const restart = selected === stops.length - 1 && atCurrent;
    const index = restart ? 1 : motion?.index ?? pausedVisit ?? selected + 1;
    const target = stops[index];
    const from = restart ? coordinates(stops[0]) : positionRef.current;
    if (!target || !from) return;
    setPausedVisit(null);
    if (restart) {
      setSelected(0);
      updatePosition(from);
      if (viewRef.current.scale > 1) updateView(centerOn(from, viewRef.current.scale));
    }
    setPlaying(true);
    setMotion({ from, to: coordinates(target), index, auto: true });
  }

  function zoom(factor: number) {
    updateView(centerOn(positionRef.current, Math.max(1, Math.min(8, viewRef.current.scale * factor))));
  }

  function startDrag(event: PointerEvent<HTMLDivElement>) {
    if (view.scale === 1 || event.button !== 0) return;
    stopMotion();
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY, view: viewRef.current };
  }

  function moveDrag(event: PointerEvent<HTMLDivElement>) {
    const start = drag.current;
    if (!start || start.id !== event.pointerId) return;
    const ratio = width / event.currentTarget.getBoundingClientRect().width;
    updateView(constrain({
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
      stopMotion();
      const [x, y] = moves[event.key];
      const view = viewRef.current;
      updateView(constrain({ ...view, x: view.x + x, y: view.y + y }));
    }
    if (event.key === 'Home') {
      event.preventDefault();
      selectStop(0);
    }
  }

  return (
    <div className="travel-map">
      <figure className="travel-figure glass-card">
        <div
          className={`travel-map-canvas${view.scale > 1 ? ' is-zoomed' : ''}`}
          role="group"
          aria-label="World travel map. Use the zoom buttons, then drag or use arrow keys to pan. Home returns to the origin without changing zoom."
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
              {stops.length ? 'One marker shows the current position. Previous and next move smoothly between visits; Play follows the route chronologically.' : 'World outline. No visits have been added yet.'}
            </desc>
            <g transform={`translate(${view.x} ${view.y}) scale(${view.scale})`}>
              <path className="travel-ocean" d={oceanPath} />
              <path className="travel-graticule" d={gridPath} vectorEffect="non-scaling-stroke" />
              <path className="travel-land" d={landPath} vectorEffect="non-scaling-stroke" />
              <path className="travel-route" d={fullRoute} vectorEffect="non-scaling-stroke" />
            </g>
          </svg>
          {current && point && <span
            className="travel-position"
            aria-hidden="true"
            style={{ left: `${x}%`, top: `${y}%` }}
          />}
          {displayedStop && visible && <TravelMapLabel label={displayedStop.label} x={x} y={y} />}
        </div>
        <div className="travel-map-toolbar">
          <div className="travel-map-controls travel-visit-controls" role="group" aria-label="Travel visits" aria-describedby={`${id}-status`}>
            <button type="button" onClick={() => selectStop(selected - 1)} disabled={!current || selected === 0} aria-label="Previous visit" title="Previous visit">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 6-6 6 6 6" /></svg>
            </button>
            <span className="travel-visit-count" aria-hidden="true" style={{ width: `${Math.max(6, String(stops.length).length * 2 + 3)}ch` }}>
              {current && selected === 0 ? 'Origin' : `${current ? selected + 1 : 0} / ${stops.length}`}
            </span>
            <button type="button" onClick={() => selectStop(selected + 1)} disabled={!current || selected === stops.length - 1} aria-label="Next visit" title="Next visit">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 6 6-6 6" /></svg>
            </button>
            <button type="button" onClick={() => selectStop(stops.length - 1)} disabled={!current || (selected === stops.length - 1 && atCurrent && !motion)} title="Jump to the latest visit">Now</button>
            <button type="button" onClick={() => selectStop(0)} disabled={!current || (selected === 0 && atCurrent && !motion && !playing)} title="Return to origin">Reset</button>
            <button type="button" className="travel-play-button" onClick={togglePlayback} disabled={stops.length < 2} title={playing ? 'Stop playback' : selected === stops.length - 1 && atCurrent ? 'Play from origin' : selected === 0 && atCurrent && !motion && pausedVisit === null ? 'Play from origin' : 'Play from current position'}>
              {playing ? 'Stop' : 'Play'}
            </button>
          </div>
          <div className="travel-map-controls" role="group" aria-label="Map zoom">
            <button type="button" onClick={() => zoom(1 / 1.5)} disabled={view.scale === 1} aria-label="Zoom out">−</button>
            <button type="button" onClick={() => zoom(1.5)} disabled={view.scale === 8} aria-label="Zoom in">+</button>
          </div>
        </div>
        <figcaption id={`${id}-status`} className="travel-map-status" aria-live="polite" aria-atomic="true">
          {current ? `${selected === 0 ? 'Origin' : `Visit ${selected + 1} of ${stops.length}`} · ${current.label}${motion ? ` · Moving to ${displayedStop?.label ?? current.label}` : pausedVisit !== null ? ` · Paused; destination ${displayedStop?.label ?? current.label}` : ''}${selected === stops.length - 1 ? ' · Final visit' : ''}` : 'No visits added yet.'}
        </figcaption>
      </figure>
    </div>
  );
}
