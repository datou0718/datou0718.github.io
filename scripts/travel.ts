import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import type { TravelStop } from '../src/types/content.ts';

interface Coordinates {
  id: number;
  latitude: number;
  longitude: number;
}
interface Cache {
  version: 2;
  locations: Record<string, Coordinates>;
}

const normalize = (value: string) => value.trim().normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase().replace(/\s+/g, ' ').replace(/\s*,\s*/g, ', ');
const isObject = (value: unknown): value is Record<string, unknown> => !!value && typeof value === 'object' && !Array.isArray(value);
const isCoordinate = (value: unknown, limit: number): value is number => typeof value === 'number' && Number.isFinite(value) && Math.abs(value) <= limit;

export function parseTravelRecords(value: unknown): string[] {
  if (!Array.isArray(value)) throw new Error('content/travel.json must be an array of location labels, with the newest visit first.');
  return value.map((label, index) => {
    if (typeof label !== 'string' || !label.split(',')[0].trim()) {
      throw new Error(`content/travel.json, entry ${index + 1}: use one nonempty location string, such as "Durham, North Carolina".`);
    }
    return label.trim();
  });
}

function validCoordinates(value: unknown): value is Coordinates {
  return isObject(value) && typeof value.id === 'number' && Number.isSafeInteger(value.id) && value.id > 0
    && isCoordinate(value.latitude, 90) && isCoordinate(value.longitude, 180);
}

async function readCache(file: string): Promise<Cache> {
  let data: unknown;
  try {
    data = JSON.parse(await readFile(file, 'utf8'));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return { version: 2, locations: Object.create(null) };
    throw new Error(`Cannot read ${file}. Restore the saved coordinate cache or remove it to resolve locations again.`, { cause: error });
  }
  if (!isObject(data) || data.version !== 2 || !isObject(data.locations) || !Object.values(data.locations).every(validCoordinates)) {
    throw new Error(`Invalid coordinate cache: ${file}. Restore it or remove it to resolve locations again.`);
  }
  return { version: 2, locations: Object.assign(Object.create(null), data.locations) };
}

async function lookup(label: string, fetcher: typeof fetch): Promise<Coordinates> {
  const url = new URL('https://geocoding-api.open-meteo.com/v1/search');
  // Treat the complete owner-written label as a search phrase, with no prescribed location hierarchy.
  url.search = new URLSearchParams({ name: label, count: '100', language: 'en', format: 'json' }).toString();
  let data: unknown;
  try {
    const response = await fetcher(url, { signal: AbortSignal.timeout(15_000) });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    data = await response.json();
  } catch (error) {
    throw new Error(`Could not look up "${label}". Check your connection and retry; previously saved locations work offline.`, { cause: error });
  }
  if (!isObject(data) || data.error || (data.results !== undefined && !Array.isArray(data.results))) {
    throw new Error(`Invalid geocoding response for "${label}". Please retry.`);
  }
  const candidates: { coordinates: Coordinates; name: string; description: string }[] = [];
  for (const result of (data.results ?? []) as unknown[]) {
    if (!isObject(result) || typeof result.name !== 'string' || typeof result.feature_code !== 'string'
      || !result.feature_code.startsWith('PPL') || result.feature_code === 'PPLX' || !validCoordinates(result)) continue;
    candidates.push({
      coordinates: { id: result.id, latitude: result.latitude, longitude: result.longitude },
      name: result.name,
      description: [result.name, result.admin1, result.country].filter(value => typeof value === 'string' && value).join(', '),
    });
  }
  const name = normalize(label.split(',')[0]);
  const exact = candidates.filter(candidate => normalize(candidate.name) === name);
  const matches = [...new Map((exact.length ? exact : candidates).map(candidate => [candidate.coordinates.id, candidate])).values()];
  if (matches.length === 1) return matches[0].coordinates;
  if (!matches.length) throw new Error(`No location found for "${label}". Check the spelling or use a more specific location label in content/travel.json.`);
  const suggestions = matches.slice(0, 5).map(candidate => candidate.description).join('; ');
  throw new Error(`Ambiguous location: "${label}". Use a more specific location label in content/travel.json. Matches: ${suggestions}.`);
}

export async function resolveTravel(root: string, fetcher: typeof fetch = fetch): Promise<TravelStop[]> {
  const labels = parseTravelRecords(JSON.parse(await readFile(join(root, 'content/travel.json'), 'utf8')));
  const cacheFile = join(root, 'src/generated/travel-geocodes.json');
  const cache = await readCache(cacheFile);
  const resolved: TravelStop[] = [];
  let changed = false;
  try {
    for (const label of labels) {
      const key = normalize(label);
      if (!Object.hasOwn(cache.locations, key)) {
        cache.locations[key] = await lookup(label, fetcher);
        changed = true;
      }
      const { latitude, longitude } = cache.locations[key];
      // The full location string is only for lookup; display the owner's city name.
      resolved.push({ label: label.split(',')[0].trim(), latitude, longitude });
    }
  } finally {
    if (changed) {
      cache.locations = Object.fromEntries(Object.entries(cache.locations).sort(([a], [b]) => a.localeCompare(b)));
      await mkdir(dirname(cacheFile), { recursive: true });
      await writeFile(`${cacheFile}.tmp`, `${JSON.stringify(cache, null, 2)}\n`);
      await rename(`${cacheFile}.tmp`, cacheFile);
    }
  }
  return resolved;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const root = fileURLToPath(new URL('../', import.meta.url));
  resolveTravel(root).then(records => console.log(`Resolved ${records.length} travel visits (newest first).`)).catch(error => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
