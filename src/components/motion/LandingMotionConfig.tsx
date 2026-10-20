"use client";

import React from "react";
import { MotionConfig } from "motion/react";

export interface LandingMotionConfigProps {
  children: React.ReactNode;
}

/**
 * Client wrapper establishing global MotionConfig for the landing page.
 * Enforces reducedMotion="user" to respect system accessibility preferences.
 */
export function LandingMotionConfig({ children }: LandingMotionConfigProps) {
  return (
    <MotionConfig reducedMotion="user">
      {children}
    </MotionConfig>
  );
}

export default LandingMotionConfig;
