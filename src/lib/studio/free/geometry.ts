import { FreeElement } from "@/types/studio";

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface CanvasSize {
  width: number;
  height: number;
}

/**
 * Checks if two rectangles overlap with positive area.
 * Touching edges are allowed and do not count as overlapping.
 */
export function rectsOverlap(a: Rect, b: Rect): boolean {
  return !(
    a.x + a.w <= b.x ||
    b.x + b.w <= a.x ||
    a.y + a.h <= b.y ||
    b.y + b.h <= a.y
  );
}

/**
 * Clamps a rectangle within the canvas boundaries.
 * Enforces minimum w and h of 8.
 */
export function clampToCanvas(rect: Rect, canvas: CanvasSize): Rect {
  const w = Math.max(8, Math.min(canvas.width, rect.w));
  const h = Math.max(8, Math.min(canvas.height, rect.h));
  const maxX = Math.max(0, canvas.width - w);
  const maxY = Math.max(0, canvas.height - h);
  const x = Math.max(0, Math.min(maxX, rect.x));
  const y = Math.max(0, Math.min(maxY, rect.y));
  return { x, y, w, h };
}

/**
 * Snaps a coordinate or dimension to the given grid step (default 4px).
 */
export function snap(value: number, step = 4): number {
  return Math.round(value / step) * step;
}

/**
 * Scans top to bottom, left to right in 8px steps to find the first spot
 * where a new element can be placed without overlapping existing elements.
 */
export function findFreeSpot(
  size: { w: number; h: number },
  elements: FreeElement[],
  canvas: CanvasSize
): { x: number; y: number } {
  const step = 8;
  const w = Math.max(8, Math.min(canvas.width, size.w));
  const h = Math.max(8, size.h);
  const maxX = Math.max(0, canvas.width - w);
  // Scan up to canvas height, or extend if elements exceed height
  const maxScanY = Math.max(canvas.height, 480) - h;

  for (let y = 0; y <= maxScanY; y += step) {
    for (let x = 0; x <= maxX; x += step) {
      const candidate: Rect = { x, y, w, h };
      const hasOverlap = elements.some((el) => rectsOverlap(candidate, el));
      if (!hasOverlap) {
        return { x, y };
      }
    }
  }

  // Fallback: place below lowest element if no slot found in current area
  const lowestBottom = elements.reduce((max, el) => Math.max(max, el.y + el.h), 0);
  return {
    x: 0,
    y: snap(lowestBottom + 8, step),
  };
}

/**
 * Resolves an overlap after moving or resizing an element.
 * Tries candidate positions snapped just right of, left of, below and above each colliding element,
 * picks the nearest to the drop point that is inside the canvas and overlap-free,
 * and returns the original position if none exists.
 */
export function resolveOverlap(
  moved: FreeElement,
  others: FreeElement[],
  canvas: CanvasSize,
  original: { x: number; y: number }
): { x: number; y: number } {
  // If no overlap at current position and inside canvas, it is valid
  const currentClamped = clampToCanvas(moved, canvas);
  const isDirectlyValid =
    currentClamped.x === moved.x &&
    currentClamped.y === moved.y &&
    !others.some((b) => rectsOverlap(moved, b));

  if (isDirectlyValid) {
    return { x: moved.x, y: moved.y };
  }

  const colliding = others.filter((b) => rectsOverlap(moved, b));
  if (colliding.length === 0) {
    return { x: currentClamped.x, y: currentClamped.y };
  }

  const candidates: { x: number; y: number }[] = [];

  for (const b of colliding) {
    // 1. Right of b
    candidates.push({ x: snap(b.x + b.w, 4), y: snap(moved.y, 4) });
    // 2. Left of b
    candidates.push({ x: snap(b.x - moved.w, 4), y: snap(moved.y, 4) });
    // 3. Below b
    candidates.push({ x: snap(moved.x, 4), y: snap(b.y + b.h, 4) });
    // 4. Above b
    candidates.push({ x: snap(moved.x, 4), y: snap(b.y - moved.h, 4) });
  }

  // Filter candidates that are inside the canvas and overlap-free
  const validCandidates = candidates.filter((cand) => {
    // Must be inside canvas
    if (
      cand.x < 0 ||
      cand.x + moved.w > canvas.width ||
      cand.y < 0 ||
      cand.y + moved.h > canvas.height
    ) {
      return false;
    }
    const testRect: Rect = { x: cand.x, y: cand.y, w: moved.w, h: moved.h };
    return !others.some((other) => rectsOverlap(testRect, other));
  });

  if (validCandidates.length === 0) {
    return { x: original.x, y: original.y };
  }

  // Pick candidate nearest to moved (drop point)
  let bestCandidate = validCandidates[0];
  let minDistanceSq =
    (bestCandidate.x - moved.x) ** 2 + (bestCandidate.y - moved.y) ** 2;

  for (let i = 1; i < validCandidates.length; i++) {
    const cand = validCandidates[i];
    const distSq = (cand.x - moved.x) ** 2 + (cand.y - moved.y) ** 2;
    if (distSq < minDistanceSq) {
      minDistanceSq = distSq;
      bestCandidate = cand;
    }
  }

  return bestCandidate;
}
