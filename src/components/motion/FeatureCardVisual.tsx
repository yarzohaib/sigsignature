"use client";

import React from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { EASE_OUT_CUBIC } from "./motionConfig";

export interface FeatureCardVisualProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

/**
 * FeatureCardVisual:
 * Wraps mini previews or illustrations inside a FeatureCard.
 * Fades in 0.2 seconds after its card begins revealing.
 * Respects user's reduced-motion preference.
 */
export function FeatureCardVisual({
  children,
  delay = 0.25,
  duration = 0.6,
  className,
}: FeatureCardVisualProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <div className={className} data-reveal-visual>
        {children}
      </div>
    );
  }

  const visualVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 6,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration,
        delay,
        ease: EASE_OUT_CUBIC,
      },
    },
  };

  return (
    <motion.div
      variants={visualVariants}
      className={className}
      data-reveal-visual
    >
      {children}
    </motion.div>
  );
}

export default FeatureCardVisual;
