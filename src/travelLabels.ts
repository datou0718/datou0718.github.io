export interface LabelBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Position { left: number; top: number }

const padding = 8;
const gap = 8;
const offset = 14;
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(value, max));

// Solve the current/next pair together using measured text sizes in screen pixels.
export function placeTravelLabels(labels: LabelBox[], width: number, height: number): Position[] {
  const fit = (label: LabelBox, left: number, top: number): Position => ({
    left: clamp(left, padding, width - padding - label.width),
    top: clamp(top, padding, height - padding - label.height),
  });
  const candidates = labels.map((label, index) => {
    const { x, y, width: w, height: h } = label;
    const vertical = [[x - w / 2, y - h - offset], [x - w / 2, y + offset]];
    if (index) vertical.reverse();
    return [
      ...vertical,
      [x - w - offset, y - h / 2], [x + offset, y - h / 2],
      [x - w - offset, y - h - offset], [x + offset, y - h - offset],
      [x - w - offset, y + offset], [x + offset, y + offset],
    ].map(([left, top], preference) => {
      const position = fit(label, left, top);
      const coversPoint = labels.some(point =>
        position.left < point.x + 10 && position.left + w > point.x - 10
        && position.top < point.y + 10 && position.top + h > point.y - 10);
      return {
        ...position,
        score: Math.hypot(position.left + w / 2 - x, position.top + h / 2 - y)
          + (coversPoint ? 10_000 : 0) + preference * 0.1,
      };
    }).sort((a, b) => a.score - b.score);
  });
  if (labels.length < 2) return candidates.map(options => options[0]);

  const [first, second] = labels;
  let best: Position[] | undefined;
  let score = Infinity;
  for (const a of candidates[0]) for (const b of candidates[1]) {
    const separate = a.left + first.width + gap <= b.left || b.left + second.width + gap <= a.left
      || a.top + first.height + gap <= b.top || b.top + second.height + gap <= a.top;
    if (separate && a.score + b.score < score) {
      best = [a, b];
      score = a.score + b.score;
    }
  }
  if (best) return best;

  // Long names near an edge may need a shared stack instead of nearby candidates.
  const order = first.y <= second.y ? [0, 1] : [1, 0];
  const top = clamp((first.y + second.y) / 2 - (first.height + second.height + gap) / 2,
    padding, height - padding - first.height - second.height - gap);
  const positions: Position[] = [];
  positions[order[0]] = { ...fit(labels[order[0]], labels[order[0]].x - labels[order[0]].width / 2, top), top };
  positions[order[1]] = { ...fit(labels[order[1]], labels[order[1]].x - labels[order[1]].width / 2, top), top: top + labels[order[0]].height + gap };
  return positions;
}
