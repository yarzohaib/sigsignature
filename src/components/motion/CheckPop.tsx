"use client";

import React from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";

const popVariants: Variants = {
  hidden: { scale: 0.5, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 450,
      damping: 22,
    },
  },
};

export interface CheckPopProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Child icon wrapper designed to pop with scale when its parent list item reveals.
 * Respects reduced-motion preference.
 */
export function CheckPop({ children, className = "" }: CheckPopProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <span className={className}>{children}</span>;
  }

  return (
    <motion.span variants={popVariants} className={className}>
      {children}
    </motion.span>
  );
}

export default CheckPop;
