"use client";

import React from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import {
  MOTION_DEFAULTS,
  MOTION_VIEWPORT,
} from "./motionConfig";
import { motionTagMap, type MotionElementTag } from "./motionElements";

export interface RevealGroupProps {
  children: React.ReactNode;
  stagger?: number;
  delay?: number;
  as?: MotionElementTag | (string & {});
  className?: string;
}

/**
 * Parent container that staggers RevealItem children as they scroll into view.
 * Default stagger interval: 0.08 seconds.
 */
export function RevealGroup({
  children,
  stagger = MOTION_DEFAULTS.stagger,
  delay = 0,
  as = "div",
  className,
}: RevealGroupProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    const Component = as as keyof React.JSX.IntrinsicElements;
    return (
      <Component className={className} data-reveal-group>
        {children}
      </Component>
    );
  }

  const MotionComponent = (motionTagMap[as as MotionElementTag] || motion.div) as typeof motion.div;

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  return (
    <MotionComponent
      initial="hidden"
      whileInView="visible"
      viewport={MOTION_VIEWPORT}
      variants={containerVariants}
      className={className}
      data-reveal-group
    >
      {children}
    </MotionComponent>
  );
}

export default RevealGroup;
