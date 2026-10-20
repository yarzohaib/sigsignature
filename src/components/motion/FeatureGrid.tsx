"use client";

import React, { createContext, useContext, useSyncExternalStore } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { MOTION_VIEWPORT } from "./motionConfig";

function subscribeDesktop(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia("(min-width: 1024px)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getDesktopSnapshot(): boolean {
  return typeof window !== "undefined"
    ? window.matchMedia("(min-width: 1024px)").matches
    : false;
}

function getServerSnapshot(): boolean {
  return false;
}

interface FeatureGridContextValue {
  isDesktop: boolean;
}

const FeatureGridContext = createContext<FeatureGridContextValue>({
  isDesktop: false,
});

export function useFeatureGridContext(): FeatureGridContextValue {
  return useContext(FeatureGridContext);
}

export interface FeatureGridProps {
  children: React.ReactNode;
  stagger?: number;
  className?: string;
}

/**
 * FeatureGrid:
 * On desktop (>=1024px): staggers its child cards by 0.12s in reading order when scrolled into view.
 * On mobile (<1024px): acts as a plain container so each card reveals individually as it enters view.
 * Respects user's reduced-motion preference.
 */
export function FeatureGrid({
  children,
  stagger = 0.12,
  className = "mt-12 grid grid-cols-1 gap-6 sm:mt-16 lg:grid-cols-12 lg:gap-8",
}: FeatureGridProps) {
  const shouldReduceMotion = useReducedMotion();
  const isDesktop = useSyncExternalStore(
    subscribeDesktop,
    getDesktopSnapshot,
    getServerSnapshot
  );

  if (shouldReduceMotion) {
    return (
      <FeatureGridContext.Provider value={{ isDesktop }}>
        <div className={className} data-reveal-grid>
          {children}
        </div>
      </FeatureGridContext.Provider>
    );
  }

  // On desktop: stagger child cards when grid comes into view
  if (isDesktop) {
    const containerVariants: Variants = {
      hidden: {},
      visible: {
        transition: {
          staggerChildren: stagger,
        },
      },
    };

    return (
      <FeatureGridContext.Provider value={{ isDesktop: true }}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={MOTION_VIEWPORT}
          variants={containerVariants}
          className={className}
          data-reveal-grid
        >
          {children}
        </motion.div>
      </FeatureGridContext.Provider>
    );
  }

  // On mobile: plain container so cards reveal independently on scroll
  return (
    <FeatureGridContext.Provider value={{ isDesktop: false }}>
      <div className={className} data-reveal-grid>
        {children}
      </div>
    </FeatureGridContext.Provider>
  );
}

export default FeatureGrid;
