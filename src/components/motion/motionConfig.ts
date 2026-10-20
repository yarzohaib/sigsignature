/**
 * Shared animation foundation configuration constants.
 * Cubic-bezier ease curves, durations, stagger intervals, and viewport options.
 */

// Custom cubic bezier ease-out curve for natural, responsive deceleration
export const EASE_OUT_CUBIC: [number, number, number, number] = [0.21, 0.47, 0.32, 0.98];

export const MOTION_DURATIONS = {
  fast: 0.3,
  default: 0.6,
  slow: 0.8,
  word: 0.4,
} as const;

export const MOTION_STAGGER = {
  default: 0.08,
  fast: 0.04,
  word: 0.035,
} as const;

export const MOTION_VIEWPORT = {
  once: true,
  margin: "-40px",
} as const;

export const MOTION_DEFAULTS = {
  y: 24,
  blur: 8,
  duration: MOTION_DURATIONS.default,
  stagger: MOTION_STAGGER.default,
  ease: EASE_OUT_CUBIC,
} as const;
