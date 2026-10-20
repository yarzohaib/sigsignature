"use client";

import React, { useMemo } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { EASE_OUT_CUBIC, MOTION_VIEWPORT } from "./motionConfig";
import { useFeatureGridContext } from "./FeatureGrid";

export interface FeatureCardProps {
  children: React.ReactNode;
  colSpan?: string;
  direction?: "left" | "right";
  x?: number;
  duration?: number;
  className?: string;
  "aria-label"?: string;
}

/**
 * FeatureCard:
 * - On desktop: emerges from the left or right side of the screen with blur clearing,
 *   staggered in reading order within FeatureGrid.
 * - On mobile: emerges from the side individually as it scrolls into view.
 * - Hover / Focus-visible: moves right for left tiles and left for right tiles, soft shadow, faint brand blue border glow, focus-visible ring.
 * - Uses pure CSS transitions for hover and focus states.
 */
export function FeatureCard({
  children,
  colSpan = "",
  direction = "left",
  x = 64,
  duration = 0.9,
  className = "",
  "aria-label": ariaLabel,
}: FeatureCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const { isDesktop } = useFeatureGridContext();

  const hoverTranslate =
    direction === "left"
      ? "[@media(hover:hover)]:hover:translate-x-1.5 focus-visible:translate-x-1.5"
      : "[@media(hover:hover)]:hover:-translate-x-1.5 focus-visible:-translate-x-1.5";

  const cardClasses =
    `group flex h-full flex-col justify-between rounded-[20px] border border-[#C1C1C1] bg-white p-6 sm:p-8 shadow-none transition-[transform,box-shadow,border-color] duration-200 ease-out ${hoverTranslate} [@media(hover:hover)]:hover:border-[#245FD4]/60 [@media(hover:hover)]:hover:shadow-[0_16px_32px_-8px_rgba(2,41,119,0.12),0_0_16px_rgba(36,95,212,0.10)] focus-visible:border-[#245FD4]/60 focus-visible:shadow-[0_16px_32px_-8px_rgba(2,41,119,0.12),0_0_16px_rgba(36,95,212,0.10)] focus-visible:ring-2 focus-visible:ring-[#245FD4] focus-visible:ring-offset-2 focus-visible:outline-none cursor-default ` +
    className;

  const cardVariants: Variants = useMemo(() => {
    const targetDistance = isDesktop ? x : Math.min(x, 36);
    const initialX = direction === "left" ? -targetDistance : targetDistance;

    return {
      hidden: {
        opacity: 0,
        x: initialX,
        y: 0,
        filter: "blur(8px)",
      },
      visible: {
        opacity: 1,
        x: 0,
        y: 0,
        filter: "blur(0px)",
        transition: {
          duration,
          ease: EASE_OUT_CUBIC,
        },
      },
    };
  }, [direction, x, duration, isDesktop]);

  if (shouldReduceMotion) {
    return (
      <div className={`h-full ${colSpan}`} data-reveal-card>
        <div tabIndex={0} role="article" aria-label={ariaLabel} className={cardClasses}>
          {children}
        </div>
      </div>
    );
  }

  // On desktop: stagger is orchestrated by FeatureGrid parent
  if (isDesktop) {
    return (
      <motion.div
        variants={cardVariants}
        className={`h-full ${colSpan}`}
        data-reveal-card
      >
        <div tabIndex={0} role="article" aria-label={ariaLabel} className={cardClasses}>
          {children}
        </div>
      </motion.div>
    );
  }

  // On mobile: each card reveals individually as it enters the viewport
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={MOTION_VIEWPORT}
      variants={cardVariants}
      className={`h-full ${colSpan}`}
      data-reveal-card
    >
      <div tabIndex={0} role="article" aria-label={ariaLabel} className={cardClasses}>
        {children}
      </div>
    </motion.div>
  );
}

export default FeatureCard;
