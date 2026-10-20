"use client";

import React from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  EASE_OUT_CUBIC,
  MOTION_DEFAULTS,
  MOTION_VIEWPORT,
} from "./motionConfig";
import { motionTagMap, type MotionElementTag } from "./motionElements";

export interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  blur?: number;
  duration?: number;
  as?: MotionElementTag | (string & {});
  className?: string;
}

/**
 * Wrapper component that animates its children on first scroll into view.
 * Respects user's reduced-motion preference with zero-lag fallback.
 */
export function Reveal({
  children,
  delay = 0,
  y = MOTION_DEFAULTS.y,
  blur = MOTION_DEFAULTS.blur,
  duration = MOTION_DEFAULTS.duration,
  as = "div",
  className,
}: RevealProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    const Component = as as keyof React.JSX.IntrinsicElements;
    return (
      <Component className={className} data-reveal>
        {children}
      </Component>
    );
  }

  const MotionComponent = (motionTagMap[as as MotionElementTag] || motion.div) as typeof motion.div;

  return (
    <MotionComponent
      initial={{
        opacity: 0,
        y,
        filter: blur > 0 ? `blur(${blur}px)` : "blur(0px)",
      }}
      whileInView={{
        opacity: 1,
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
    </MotionComponent>
  );
}

export default Reveal;
