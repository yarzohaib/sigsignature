"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
  useReducedMotion,
  type MotionValue,
} from "motion/react";

export interface StepItem {
  step: string;
  title: string;
  description: string;
}

export interface HowItWorksTimelineProps {
  steps: StepItem[];
  children?: React.ReactNode;
}

interface StepItemViewProps {
  item: StepItem;
  index: number;
  smoothProgress: MotionValue<number>;
  activeStep: number;
  shouldReduceMotion: boolean | null;
  circleRef?: React.Ref<HTMLDivElement>;
}

/**
 * StepItemView:
 * Renders an individual step container.
 * Moves forward (scale: 1.06, y: -10px) when the bar reaches this step,
 * and backward (scale: 0.96, y: 0px) as the bar moves away.
 * No opacity fading: all text and circles remain 100% solid and crisp.
 */
function StepItemView({
  item,
  index,
  smoothProgress,
  activeStep,
  shouldReduceMotion,
  circleRef,
}: StepItemViewProps) {
  // Move forward and backward in direct physical synchronization with the progress bar
  const scale = useTransform(
    smoothProgress,
    index === 0
      ? [0, 0.45, 1]
      : index === 1
      ? [0, 0.5, 1]
      : [0, 0.55, 1],
    index === 0
      ? [1.06, 0.96, 0.96]
      : index === 1
      ? [0.96, 1.06, 0.96]
      : [0.96, 0.96, 1.06]
  );

  const y = useTransform(
    smoothProgress,
    index === 0
      ? [0, 0.45, 1]
      : index === 1
      ? [0, 0.5, 1]
      : [0, 0.55, 1],
    index === 0
      ? [-10, 0, 0]
      : index === 1
      ? [0, -10, 0]
      : [0, 0, -10]
  );

  const isActive = shouldReduceMotion || index === activeStep;

  return (
    <motion.div
      style={
        shouldReduceMotion
          ? { scale: 1, y: 0 }
          : { scale, y, transformOrigin: "center top" }
      }
      className="relative flex flex-col items-start"
    >
      {/* 74x74 Number Circle container */}
      <div
        ref={circleRef}
        className="relative z-10 flex h-[74px] w-[74px] items-center justify-center"
      >
        <motion.div
          data-timeline-circle
          style={{
            background:
              "linear-gradient(180deg, #245FD4 0%, #022977 100%)",
          }}
          animate={
            shouldReduceMotion
              ? { boxShadow: "none" }
              : isActive
              ? {
                  boxShadow:
                    "0 0 0 8px rgba(36, 95, 212, 0.2), 0 0 24px rgba(36, 95, 212, 0.28)",
                }
              : {
                  boxShadow: "0 0 0 0px rgba(36, 95, 212, 0)",
                }
          }
          transition={{
            duration: 0.3,
            ease: "easeOut",
          }}
          className="flex h-[74px] w-[74px] items-center justify-center rounded-full border border-[#C1C1C1] shadow-xs"
        >
          <span className="font-heading text-2xl font-bold text-white sm:text-[28px]">
            {item.step}
          </span>
        </motion.div>
      </div>

      {/* Title & Description: solid 100% opacity, no fade */}
      <div data-timeline-content className="opacity-100">
        <h3 className="font-heading mt-4 text-xl font-semibold text-slate-900 sm:mt-6 md:mt-11 sm:text-2xl">
          {item.title}
        </h3>
        <p className="font-body mt-2 text-sm leading-relaxed text-[#878787] sm:mt-3 sm:text-base">
          {item.description}
        </p>
      </div>
    </motion.div>
  );
}

/**
 * HowItWorksTimeline:
 * Sticky scroll-driven interactive timeline.
 * - Screen remains pinned at the How It Works section while the progress bar completes.
 * - Containers move forward and backward in direct physical sync with the progress bar.
 * - No opacity fade: all content remains 100% crisp and readable.
 * - Desktop: continuous horizontal progress line at top 96px (gray track + brand blue fill).
 * - Mobile: vertical progress line on the left connecting step circles from top to bottom.
 * - Step activation: step 1 active on entry, step 2 at ~0.5 progress, step 3 at ~0.9 progress.
 * - Active circle: soft brand blue glow ring.
 * - Reduced motion fallback: unpinned standard height, fully filled line, all steps active.
 */
export default function HowItWorksTimeline({
  steps,
  children,
}: HowItWorksTimelineProps) {
  const outerTrackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const firstCircleRef = useRef<HTMLDivElement>(null);
  const lastCircleRef = useRef<HTMLDivElement>(null);

  const shouldReduceMotion = useReducedMotion();
  const [activeStep, setActiveStep] = useState(0);

  // Vertical line coordinates for mobile stacked layout
  const [verticalLine, setVerticalLine] = useState<{
    top: number;
    height: number;
  }>({ top: 37, height: 420 });

  useEffect(() => {
    const updateVerticalLine = () => {
      if (firstCircleRef.current && lastCircleRef.current && containerRef.current) {
        const firstCircle = firstCircleRef.current;
        const lastCircle = lastCircleRef.current;
        const container = containerRef.current;

        const firstRect = firstCircle.getBoundingClientRect();
        const lastRect = lastCircle.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        const top = firstRect.top - containerRect.top + firstRect.height / 2;
        const bottom = lastRect.top - containerRect.top + lastRect.height / 2;

        setVerticalLine({
          top,
          height: Math.max(0, bottom - top),
        });
      }
    };

    updateVerticalLine();
    window.addEventListener("resize", updateVerticalLine);
    return () => window.removeEventListener("resize", updateVerticalLine);
  }, []);

  // Track progress while the section is sticky-pinned in the viewport (from start to completion)
  const { scrollYProgress } = useScroll({
    target: outerTrackRef,
    offset: ["start start", "end end"],
  });

  const clampedProgress = useTransform(scrollYProgress, (v) =>
    Math.max(0, Math.min(1, v))
  );

  // Soft spring with critically damped physics -> 0 overshoot
  const smoothProgress = useSpring(clampedProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Step activation: step 1 on entry, step 2 at ~0.5, step 3 at ~0.9
  useMotionValueEvent(smoothProgress, "change", (latest) => {
    if (latest < 0.5) {
      setActiveStep(0);
    } else if (latest < 0.9) {
      setActiveStep(1);
    } else {
      setActiveStep(2);
    }
  });

  return (
    <section
      id="how-it-works"
      ref={outerTrackRef}
      className={`scroll-mt-24 overflow-x-clip bg-[#FCFCFC] ${
        shouldReduceMotion ? "py-16 sm:py-24" : "relative h-[220vh]"
      }`}
    >
      <div
        className={
          shouldReduceMotion
            ? "mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 xl:px-12"
            : "sticky top-0 flex min-h-screen flex-col justify-center overflow-hidden py-8 sm:py-12 md:py-16"
        }
      >
        <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8 xl:px-12">
          {/* Section Header */}
          {children}

          {/* 3 Step Flow with Scroll-Driven Timeline */}
          <div
            ref={containerRef}
            className="relative mx-auto mt-10 max-w-[1200px] sm:mt-14 md:mt-16"
          >
            {/* 1. Desktop Horizontal Line (top 96px, md:block) */}
            {/* Gray Track */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-0 right-0 top-[96px] hidden h-[2px] bg-[#C1C1C1] md:block"
            />
            {/* Brand Blue Fill */}
            <motion.div
              aria-hidden="true"
              data-timeline-line
              className="pointer-events-none absolute left-0 right-0 top-[96px] hidden h-[2px] bg-[#245FD4] origin-left md:block"
              style={{
                scaleX: shouldReduceMotion ? 1 : smoothProgress,
              }}
            />

            {/* 2. Mobile Vertical Line (left of steps, md:hidden) */}
            {/* Gray Track */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-[36px] w-[2px] bg-[#C1C1C1] md:hidden"
              style={{
                top: verticalLine.top,
                height: verticalLine.height,
              }}
            />
            {/* Brand Blue Fill */}
            <motion.div
              aria-hidden="true"
              data-timeline-line
              className="pointer-events-none absolute left-[36px] w-[2px] bg-[#245FD4] origin-top md:hidden"
              style={{
                top: verticalLine.top,
                height: verticalLine.height,
                scaleY: shouldReduceMotion ? 1 : smoothProgress,
              }}
            />

            {/* 3 Steps Grid */}
            <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3 md:gap-8 lg:gap-14 xl:gap-16">
              {steps.map((item, index) => {
                const isFirst = index === 0;
                const isLast = index === steps.length - 1;

                return (
                  <StepItemView
                    key={item.step}
                    item={item}
                    index={index}
                    smoothProgress={smoothProgress}
                    activeStep={activeStep}
                    shouldReduceMotion={shouldReduceMotion}
                    circleRef={
                      isFirst
                        ? firstCircleRef
                        : isLast
                        ? lastCircleRef
                        : undefined
                    }
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
