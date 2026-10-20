"use client";

import React, { useMemo } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import {
  EASE_OUT_CUBIC,
  MOTION_STAGGER,
  MOTION_VIEWPORT,
} from "./motionConfig";
import { motionTagMap, type MotionElementTag } from "./motionElements";

export interface WordRevealProps {
  text: string;
  delay?: number;
  duration?: number;
  stagger?: number;
  y?: number;
  blur?: number;
  as?: MotionElementTag | (string & {});
  className?: string;
  wordClassName?: string;
}

/**
 * Splits a string into words and reveals them sequentially with a blur-clearing fade up.
 * Accessible for screen readers: full text is provided via aria-label on the outer container,
 * while the split animated word spans are marked with aria-hidden="true".
 */
export function WordReveal({
  text,
  delay = 0,
  duration = 0.4,
  stagger = MOTION_STAGGER.word,
  y = 16,
  blur = 6,
  as = "span",
  className,
  wordClassName,
}: WordRevealProps) {
  const shouldReduceMotion = useReducedMotion();

  const words = useMemo(() => {
    return text.split(/\s+/).filter(Boolean);
  }, [text]);

  if (shouldReduceMotion) {
    const Component = as as keyof React.JSX.IntrinsicElements;
    return (
      <Component className={className} aria-label={text} data-word-reveal>
        {text}
      </Component>
    );
  }

  const MotionComponent = (motionTagMap[as as MotionElementTag] || motion.span) as typeof motion.span;

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  const wordVariants: Variants = {
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
      initial="hidden"
      whileInView="visible"
      viewport={MOTION_VIEWPORT}
      variants={containerVariants}
      className={className}
      aria-label={text}
      data-word-reveal
    >
      <span aria-hidden="true">
        {words.map((word, i) => (
          <React.Fragment key={`${word}-${i}`}>
            <motion.span
              variants={wordVariants}
              className={`inline-block ${wordClassName || ""}`}
            >
              {word}
            </motion.span>
            {i < words.length - 1 ? " " : null}
          </React.Fragment>
        ))}
      </span>
    </MotionComponent>
  );
}

export default WordReveal;
