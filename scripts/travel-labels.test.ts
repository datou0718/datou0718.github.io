import assert from 'node:assert/strict';
import { test } from 'node:test';
import { placeTravelLabels } from '../src/travelLabels.ts';
import type { LabelBox } from '../src/travelLabels.ts';

function verify(labels: LabelBox[], width: number, height: number) {
  const positions = placeTravelLabels(labels, width, height);
  assert.equal(positions.length, labels.length);
  positions.forEach((position, index) => {
    assert(position.left >= 8 && position.top >= 8);
    assert(position.left + labels[index].width <= width - 8 + 0.001);
    assert(position.top + labels[index].height <= height - 8 + 0.001);
  });
  if (labels.length === 2) {
    const [a, b] = positions;
    assert(a.left + labels[0].width + 8 <= b.left || b.left + labels[1].width + 8 <= a.left
      || a.top + labels[0].height + 8 <= b.top || b.top + labels[1].height + 8 <= a.top,
    `Overlapping labels: ${JSON.stringify({ labels, positions, width, height })}`);
  }
}

test('handles no label or one label at a map edge', () => {
  assert.deepEqual(placeTravelLabels([], 343, 178), []);
  verify([{ x: 340, y: 2, width: 140, height: 24 }], 343, 178);
});

test('keeps close, aligned, coincident, and long names separated at every edge', () => {
  for (const [width, height] of [[288, 150], [343, 178], [736, 383], [963, 501]]) {
    for (const x of [0, width / 2, width]) for (const y of [0, height / 2, height]) {
      for (const [dx, dy] of [[0, 0], [1, 1], [0, 12], [12, 0], [-8, 8]]) {
        verify([{ x, y, width: 200, height: 40 },
          { x: Math.max(0, Math.min(width, x + dx)), y: Math.max(0, Math.min(height, y + dy)), width: 220, height: 40 }], width, height);
      }
    }
  }
});

test('keeps labels in bounds and apart through varied screen positions and text sizes', () => {
  let seed = 2026;
  const random = () => ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 2 ** 32);
  for (let sample = 0; sample < 2000; sample++) {
    const width = 288 + random() * 800;
    const height = width * 0.52;
    const labels = Array.from({ length: 2 }, () => ({
      x: random() * width, y: random() * height, width: 40 + random() * 200, height: 23 + random() * 22,
    }));
    verify(labels, width, height);
  }
});
