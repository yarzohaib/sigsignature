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
 * If shape is 'pill', constrains the horizontal bounds according to the curved pill ends at the given y position.
 * Enforces minimum w and h of 8.
 */
export function clampToCanvas(
  rect: Rect,
  canvas: CanvasSize,
  shape?: string
): Rect {
  const w = Math.max(8, Math.min(canvas.width, rect.w));
  const h = Math.max(8, Math.min(canvas.height, rect.h));
  const rawMaxX = Math.max(0, canvas.width - w);
  const maxY = Math.max(0, canvas.height - h);
  const y = Math.max(0, Math.min(maxY, rect.y));

  let minX = 0;
  let maxX = rawMaxX;

  if (shape === "pill") {
    // Radius of circular pill caps
    const r = canvas.height / 2;
    if (r > 0) {
      // Top and bottom y coordinates of element relative to circle center (r)
      const dyTop = Math.abs(y - r);
      const dyBottom = Math.abs(y + h - r);
      const maxDy = Math.max(dyTop, dyBottom);

      if (maxDy < r) {
        // Curve offset: dx = r - sqrt(r^2 - dy^2)
        const dx = r - Math.sqrt(r * r - maxDy * maxDy);
        minX = Math.ceil(dx);
        maxX = Math.floor(canvas.width - dx - w);
      } else {
        // At the extreme top or bottom edge of the pill
        minX = Math.ceil(r);
        maxX = Math.floor(canvas.width - r - w);
      }

      if (minX > maxX) {
        minX = Math.max(0, (canvas.width - w) / 2);
        maxX = minX;
      }
    }
  }

  const x = Math.max(minX, Math.min(maxX, rect.x));
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
  canvas: CanvasSize,
  shape?: string
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
      const clamped = clampToCanvas(candidate, canvas, shape);
      if (clamped.x !== candidate.x || clamped.y !== candidate.y) {
        continue;
      }
      const hasOverlap = elements.some((el) => rectsOverlap(candidate, el));
      if (!hasOverlap) {
        return { x, y };
      }
    }
  }

  // Fallback: place below lowest element if no slot found in current area
  const lowestBottom = elements.reduce((max, el) => Math.max(max, el.y + el.h), 0);
  const fallbackPos = clampToCanvas(
    {
      x: 0,
      y: snap(lowestBottom + 8, step),
      w,
      h,
    },
    canvas,
    shape
  );
  return {
    x: fallbackPos.x,
    y: fallbackPos.y,
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
  original: { x: number; y: number },
  shape?: string
): { x: number; y: number } {
  // If no overlap at current position and inside canvas, it is valid
  const currentClamped = clampToCanvas(moved, canvas, shape);
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
    const clampedCand = clampToCanvas({ x: cand.x, y: cand.y, w: moved.w, h: moved.h }, canvas, shape);
    if (clampedCand.x !== cand.x || clampedCand.y !== cand.y) {
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
