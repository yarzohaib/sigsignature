"use client";

import { useState, useEffect, useRef } from "react";

/**
 * Prevents skeleton flash on fast network responses (< 150ms).
 * Once shown, preserves the skeleton for at least minDurationMs (default 300ms)
 * to avoid abrupt layout jarring / micro-stutters.
 */
export function useDelayedLoading(
  isLoading: boolean,
  delayMs: number = 150,
  minDurationMs: number = 300
): boolean {
  const [showSkeleton, setShowSkeleton] = useState(false);
  const shownAtRef = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isLoading) {
      // If already visible, don't restart delay
      if (showSkeleton) return;

      // Start delay timer before showing skeleton
      timerRef.current = setTimeout(() => {
        shownAtRef.current = Date.now();
        setShowSkeleton(true);
      }, delayMs);
    } else {
      // If we never showed the skeleton, cancel the show timer
      if (!showSkeleton) {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
        return;
      }

      // If skeleton is already shown, ensure it stays for at least minDurationMs
      const elapsed = shownAtRef.current ? Date.now() - shownAtRef.current : minDurationMs;
      const remaining = Math.max(0, minDurationMs - elapsed);

      if (remaining > 0) {
        timerRef.current = setTimeout(() => {
          setShowSkeleton(false);
          shownAtRef.current = null;
        }, remaining);
      } else {
        setShowSkeleton(false);
        shownAtRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isLoading, delayMs, minDurationMs, showSkeleton]);

  return showSkeleton;
}

export default useDelayedLoading;
