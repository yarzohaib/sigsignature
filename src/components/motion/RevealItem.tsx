"use client";

import React from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import {
  EASE_OUT_CUBIC,
  MOTION_DEFAULTS,
} from "./motionConfig";
import { motionTagMap, type MotionElementTag } from "./motionElements";

export interface RevealItemProps {
  children: React.ReactNode;
  y?: number;
  blur?: number;
  duration?: number;
  as?: MotionElementTag | (string & {});
  className?: string;
}

/**
 * Child item designed to be used inside RevealGroup.
 * Animate opacity, vertical offset (y), and filter blur.
 */
export function RevealItem({
  children,
  y = MOTION_DEFAULTS.y,
  blur = MOTION_DEFAULTS.blur,
  duration = MOTION_DEFAULTS.duration,
  as = "div",
  className,
}: RevealItemProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    const Component = as as keyof React.JSX.IntrinsicElements;
    return (
      <Component className={className} data-reveal-item>
        {children}
      </Component>
    );
  }

  const MotionComponent = (motionTagMap[as as MotionElementTag] || motion.div) as typeof motion.div;

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      y,
      filter: blur > 0 ? `blur(${blur}px)` : "blur(0px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration,
        ease: EASE_OUT_CUBIC,
      },
    },
  };

  return (
    <MotionComponent
      variants={itemVariants}
      className={className}
      data-reveal-item
    >
      {children}
    </MotionComponent>
  );
}

export default RevealItem;
