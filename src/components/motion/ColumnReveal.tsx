"use client";

import React, { useSyncExternalStore } from "react";
import { motion, useReducedMotion } from "motion/react";
import { EASE_OUT_CUBIC, MOTION_VIEWPORT } from "./motionConfig";

function subscribeDesktop(callback: () => void) {
  const mq = window.matchMedia("(min-width: 1024px)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getDesktopSnapshot(): boolean {
  return window.matchMedia("(min-width: 1024px)").matches;
}

function getServerSnapshot(): boolean {
  return false;
}

export interface ColumnRevealProps {
  children: React.ReactNode;
  direction?: "left" | "right";
  x?: number;
  y?: number;
  blur?: number;
  duration?: number;
  delay?: number;
  className?: string;
}

/**
 * Responsive column reveal component.
 * On desktop (>=1024px): slides in along the X axis (from left: -x -> 0, or right: x -> 0).
 * On mobile (<1024px): simply rises along the Y axis (y -> 0).
 * Both modes apply smooth opacity and blur clearing.
 * Respects user's reduced motion preference.
 */
export function ColumnReveal({
  children,
  direction = "left",
  x = 32,
  y = 24,
  blur = 8,
  duration = 0.6,
  delay = 0,
  className,
}: ColumnRevealProps) {
  const shouldReduceMotion = useReducedMotion();
  const isDesktop = useSyncExternalStore(subscribeDesktop, getDesktopSnapshot, getServerSnapshot);

  if (shouldReduceMotion) {
    return (
      <div className={className} data-reveal>
        {children}
      </div>
    );
  }

  const initialX = isDesktop ? (direction === "left" ? -x : x) : 0;
  const initialY = isDesktop ? 0 : y;

  return (
    <motion.div
      initial={{
        opacity: 0,
        x: initialX,
        y: initialY,
        filter: blur > 0 ? `blur(${blur}px)` : "blur(0px)",
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
        filter: "blur(0px)",
      }}
      viewport={MOTION_VIEWPORT}
      transition={{
        duration,
        delay,
        ease: EASE_OUT_CUBIC,
      }}
      className={className}
      data-reveal
    >
      {children}
    </motion.div>
  );
}

export default ColumnReveal;
