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
 * Finds a free spot on the canvas for a new or duplicated element.
 *
 * Universal Center Insertion & Smart Vertical Stacking:
 * 1. Computes the target horizontal center: `x = snap((canvas.width - w) / 2, 4)`.
 * 2. If the canvas is empty, places the element vertically centered on the canvas.
 * 3. If elements exist, tests candidate positions in order:
 *    a. Stacking cleanly below existing elements with a consistent 16px gap (below lowest element or colliding elements).
 *    b. The exact canvas vertical center `(canvas.height - h) / 2` if free and non-colliding.
 *    c. Stacking cleanly above existing elements with a consistent 16px gap (if room allows).
 * 4. If priority vertical positions are blocked, scans vertically at center X.
 * 5. If center column is fully occupied, searches outward horizontally from the center (`dx = 0, +8, -8, +16, -16...`).
 * 6. Fallback: clamps to canvas shape and stacks below the lowest element centered horizontally.
 */
export function findFreeSpot(
  size: { w: number; h: number },
  elements: FreeElement[],
  canvas: CanvasSize,
  shape?: string
): { x: number; y: number } {
  const GAP = 16;
  const step = 8;
  const w = Math.max(8, Math.min(canvas.width, size.w));
  const h = Math.max(8, size.h);
  const targetX = Math.round((canvas.width - w) / 2);
  const maxAllowedY = Math.max(canvas.height, 480) - h;
  const effectiveCanvas: CanvasSize = {
    width: canvas.width,
    height: Math.max(canvas.height, 480),
  };

  function isValid(x: number, y: number): boolean {
    if (y < 8 || y > maxAllowedY) return false;
    const candidate: Rect = { x, y, w, h };
    const clamped = clampToCanvas(candidate, effectiveCanvas, shape);
    if (clamped.x !== candidate.x || clamped.y !== candidate.y) {
      return false;
    }
    return !elements.some((el) => rectsOverlap(candidate, el));
  }

  // If no elements exist, place centered on canvas
  if (elements.length === 0) {
    const centerY = snap((canvas.height - h) / 2, 4);
    const clamped = clampToCanvas(
      { x: targetX, y: centerY, w, h },
      effectiveCanvas,
      shape
    );
    return { x: clamped.x, y: clamped.y };
  }

  // Candidate generation for smart vertical stacking at center X:
  const lowestBottom = elements.reduce((max, el) => Math.max(max, el.y + el.h), 0);
  const highestTop = elements.reduce((min, el) => Math.min(min, el.y), canvas.height);
  const centerY = snap((canvas.height - h) / 2, 4);

  // Collect candidate Y coordinates in priority order
  const yCandidates: number[] = [];

  // Priority 1: Below the lowest element on the canvas (clean 16px gap)
  yCandidates.push(snap(lowestBottom + GAP, 4));

  // Priority 2: Below individual elements that intersect with the center column
  const centerIntersecting = elements
    .filter((el) => el.x < targetX + w && el.x + el.w > targetX)
    .sort((a, b) => b.y + b.h - (a.y + a.h)); // Start from lower elements

  for (const el of centerIntersecting) {
    yCandidates.push(snap(el.y + el.h + GAP, 4));
  }

  // Priority 3: The exact center of the canvas if free
  yCandidates.push(centerY);

  // Priority 4: Above individual elements in the center column
  for (const el of centerIntersecting) {
    yCandidates.push(snap(el.y - h - GAP, 4));
  }

  // Priority 5: Above the highest element on canvas
  yCandidates.push(snap(highestTop - h - GAP, 4));

  // Check unique candidate Y positions at targetX
  const testedY = new Set<number>();
  for (const y of yCandidates) {
    if (testedY.has(y)) continue;
    testedY.add(y);
    if (isValid(targetX, y)) {
      return { x: targetX, y };
    }
  }

  // If priority candidates are blocked, scan vertically at targetX in 8px increments
  for (let y = 8; y <= maxAllowedY; y += step) {
    if (!testedY.has(y) && isValid(targetX, y)) {
      return { x: targetX, y };
    }
  }

  // If center column is completely blocked, search outward horizontally from center
  const maxX = Math.max(0, canvas.width - w);
  const maxOffset = Math.max(targetX, maxX - targetX);
  for (let offset = step; offset <= maxOffset; offset += step) {
    const xRight = targetX + offset;
    if (xRight <= maxX) {
      for (let y = 8; y <= maxAllowedY; y += step) {
        if (isValid(xRight, y)) {
          return { x: xRight, y };
        }
      }
    }
    const xLeft = targetX - offset;
    if (xLeft >= 0) {
      for (let y = 8; y <= maxAllowedY; y += step) {
        if (isValid(xLeft, y)) {
          return { x: xLeft, y };
        }
      }
    }
  }

  // Final fallback: place below lowest element centered horizontally
  const fallback = clampToCanvas(
    {
      x: targetX,
      y: snap(lowestBottom + GAP, 4),
      w,
      h,
    },
    effectiveCanvas,
    shape
  );
  return { x: fallback.x, y: fallback.y };
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
