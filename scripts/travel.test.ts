import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import type { TestContext } from 'node:test';
import { parseTravelRecords, resolveTravel } from './travel.ts';

const tokyo = { id: 1850147, name: 'Tokyo', admin1: 'Tokyo', country: 'Japan', feature_code: 'PPLC', latitude: 35.6895, longitude: 139.69171 };
const taipei = { id: 1668341, name: 'Taipei', admin1: 'Taiwan', country: 'Taiwan', feature_code: 'PPLC', latitude: 25.05306, longitude: 121.52639 };
const response = (results: unknown[]) => new Response(JSON.stringify({ results }));
const offline: typeof fetch = async () => { throw new Error('No network'); };

async function fixture(t: TestContext, records: unknown) {
  const root = await mkdtemp(join(tmpdir(), 'travel-test-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  await mkdir(join(root, 'content'));
  await writeFile(join(root, 'content/travel.json'), JSON.stringify(records));
  return root;
}

test('accepts one owner-written location string per visit', () => {
  for (const input of [null, {}, [null], [''], ['   '], [', Taiwan'], [123], [{ city: 'Tokyo', country: 'Japan' }]]) {
    assert.throws(() => parseTravelRecords(input), /content\/travel.json/);
  }
  assert.deepEqual(parseTravelRecords([' Durham, North Carolina ', 'taipei, taiwan', 'Hong Kong']), ['Durham, North Carolina', 'taipei, taiwan', 'Hong Kong']);
  assert.deepEqual(parseTravelRecords([]), []);
});

test('displays authored city names while preserving lookup strings, visit order, and cached coordinates', async t => {
  const labels = ['Tokyo, Japan', 'taipei, taiwan', 'TOKYO,Japan'];
  const root = await fixture(t, labels);
  const requests: string[] = [];
  const result = await resolveTravel(root, async input => {
    const url = new URL(String(input));
    assert.equal(url.searchParams.get('countryCode'), null);
    const label = url.searchParams.get('name')!;
    requests.push(label);
    return response(label === labels[0]
      ? [{ ...tokyo, id: 99, feature_code: 'AIRP' }, { ...tokyo, id: 100, feature_code: 'PPLX' }, tokyo]
      : [{ ...taipei, country: 'Provider wording must not be appended', admin1: 'Another provider classification' }]);
  });
  assert.deepEqual(requests, labels.slice(0, 2));
  assert.deepEqual(result.map(stop => stop.label), ['Tokyo', 'taipei', 'TOKYO']);
  assert.deepEqual(Object.keys(result[1]), ['label', 'latitude', 'longitude']);
  assert.equal(result[1].longitude, taipei.longitude);
  assert.deepEqual(await resolveTravel(root, offline), result);
  assert.deepEqual(JSON.parse(await readFile(join(root, 'content/travel.json'), 'utf8')), labels);
  const cache = JSON.parse(await readFile(join(root, 'src/generated/travel-geocodes.json'), 'utf8'));
  assert.equal(cache.version, 2);
  assert.deepEqual(Object.keys(cache.locations['taipei, taiwan']), ['id', 'latitude', 'longitude']);
});

test('uses the full city and state for lookup but displays only the city', async t => {
  const label = 'Durham, North Carolina';
  const root = await fixture(t, [label]);
  const result = await resolveTravel(root, async input => {
    const url = new URL(String(input));
    assert.equal(url.searchParams.get('name'), label);
    return response([{ id: 4464368, name: 'Durham', admin1: 'North Carolina', country: 'United States', feature_code: 'PPLA2', latitude: 35.99403, longitude: -78.89862 }]);
  });
  assert.deepEqual(result, [{ label: 'Durham', latitude: 35.99403, longitude: -78.89862 }]);
});

test('ambiguous locations need a more specific single label, not extra fields', async t => {
  const root = await fixture(t, ['Springfield']);
  const massachusetts = { ...tokyo, id: 1, name: 'Springfield', country: 'United States', admin1: 'Massachusetts', latitude: 42.1015, longitude: -72.5898 };
  const illinois = { ...massachusetts, id: 2, admin1: 'Illinois', latitude: 39.7817, longitude: -89.6501 };
  await assert.rejects(resolveTravel(root, async () => response([massachusetts, illinois])), /Ambiguous location.*Massachusetts.*Illinois/);
  await writeFile(join(root, 'content/travel.json'), JSON.stringify(['Springfield, Massachusetts']));
  const result = await resolveTravel(root, async () => response([massachusetts]));
  assert.equal(result[0].latitude, massachusetts.latitude);
});

test('a provider spelling is used only for matching, never as the visible label', async t => {
  const root = await fixture(t, ['Luzern, Switzerland']);
  const result = await resolveTravel(root, async () => response([{ ...tokyo, id: 2659811, name: 'Lucerne', latitude: 47.05048, longitude: 8.30635 }]));
  assert.equal(result[0].label, 'Luzern');
});

test('rejects unavailable, malformed, missing and invalid-coordinate results', async t => {
  const root = await fixture(t, ['Tokyo, Japan']);
  await assert.rejects(resolveTravel(root, offline), /Could not look up/);
  await assert.rejects(resolveTravel(root, async () => new Response('Unavailable', { status: 503 })), /Could not look up/);
  await assert.rejects(resolveTravel(root, async () => response([])), /No location found/);
  await assert.rejects(resolveTravel(root, async () => response([{ ...tokyo, latitude: 100 }])), /No location found/);
  await assert.rejects(resolveTravel(root, async () => new Response(JSON.stringify({ results: 'bad data' }))), /Invalid geocoding response/);
});

test('keeps successful lookups if a later location fails', async t => {
  const root = await fixture(t, ['Tokyo, Japan', 'Taipei, Taiwan']);
  await assert.rejects(resolveTravel(root, async input => {
    if (new URL(String(input)).searchParams.get('name') === 'Tokyo, Japan') return response([tokyo]);
    throw new Error('Offline');
  }), /Could not look up/);
  await writeFile(join(root, 'content/travel.json'), JSON.stringify(['Tokyo, Japan']));
  assert.equal((await resolveTravel(root, offline))[0].longitude, tokyo.longitude);
});

test('an empty itinerary needs no lookup', async t => {
  const root = await fixture(t, []);
  assert.deepEqual(await resolveTravel(root, offline), []);
});

test('location labels cannot accidentally resolve to object prototype properties', async t => {
  const root = await fixture(t, ['__proto__', 'constructor']);
  let requests = 0;
  const result = await resolveTravel(root, async input => {
    requests++;
    return response([{ ...tokyo, name: new URL(String(input)).searchParams.get('name') }]);
  });
  assert.equal(requests, 2);
  assert.deepEqual(await resolveTravel(root, offline), result);
});
