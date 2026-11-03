"use client";

import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export interface StepItem {
  step: string;
  title: string;
  description: string;
}

export interface HowItWorksTimelineProps {
  steps: StepItem[];
  children?: React.ReactNode;
}

/**
 * HowItWorksTimeline (GSAP ScrollTrigger version)
 * - Section is pinned while scroll progress is scrubbed.
 * - Desktop: horizontal line fills (scaleX); the active step lifts and scales.
 * - Mobile: steps activate as the user scrolls through the unpinned timeline.
 * - Active step = round(progress * (steps - 1)).
 * - Reduced motion: no pin, all steps active.
 */
export default function HowItWorksTimeline({ steps, children }: HowItWorksTimelineProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const hLineRef = useRef<HTMLDivElement>(null);
  const circleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!section || !viewport || !track) return;

    const setActive = (active: number) => {
      circleRefs.current.forEach((el, i) => {
        if (el) el.dataset.active = i === active ? "true" : "false";
      });
      stepRefs.current.forEach((el, i) => {
        if (el) el.dataset.active = i <= active ? "true" : "false";
      });
    };

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          desktop: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
          mobile: "(max-width: 1023px) and (prefers-reduced-motion: no-preference)",
          reduce: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { desktop, mobile, reduce } = context.conditions as {
            desktop: boolean;
            mobile: boolean;
            reduce: boolean;
          };

          if (reduce) {
            gsap.set(hLineRef.current, { scale: 1 });
            circleRefs.current.forEach((el) => {
              if (el) el.dataset.active = "true";
            });
            stepRefs.current.forEach((el) => {
              if (el) el.dataset.active = "true";
            });
            return;
          }

          const isDesktop = desktop && !mobile;

          // initial state
          gsap.set(hLineRef.current, { scaleX: 0 });
          gsap.set(track, { x: 0 });
          setActive(0);

          let lastActive = 0;

          gsap
            .timeline({
              scrollTrigger: {
                trigger: section,
                start: isDesktop ? "top top" : "top 70%",
                end: () => {
                  if (!isDesktop) return "bottom 65%";
                  const distance = Math.max(track.scrollWidth - viewport.clientWidth, 0);
                  return `+=${Math.max(Math.round(distance * 1.2), window.innerHeight * 0.8)}`;
                },
                scrub: 0.8,
                pin: isDesktop,
                anticipatePin: isDesktop ? 1 : 0,
                invalidateOnRefresh: true,
                onUpdate: (self) => {
                  const active = isDesktop
                    ? Math.round(self.progress * (steps.length - 1))
                    : stepRefs.current.reduce((current, element, index) => {
                        if (element && element.getBoundingClientRect().top < window.innerHeight * 0.6) {
                          return index;
                        }
                        return current;
                      }, 0);
                  if (active !== lastActive) {
                    lastActive = active;
                    setActive(active);
                  }
                },
              },
            })
            .to(isDesktop ? track : {}, isDesktop ? {
              x: () => -Math.max(track.scrollWidth - viewport.clientWidth, 0),
              ease: "none",
            } : { duration: 1 })
            .to(
              isDesktop ? hLineRef.current : {},
              isDesktop ? { scaleX: 1, ease: "none" } : { duration: 1 },
              0
            );

          return () => {
            const stepElements = stepRefs.current.filter(
              (element): element is HTMLDivElement => element !== null
            );
            if (stepElements.length > 0) {
              gsap.set(stepElements, { clearProps: "all" });
            }
          };
        }
      );
    }, section);

    return () => ctx.revert();
  }, [steps.length]);

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="relative flex scroll-mt-24 flex-col overflow-x-clip bg-[#FCFCFC] py-12 sm:py-16 lg:py-20"
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Section Header */}
        {children}

        {/* Steps */}
        <div ref={viewportRef} className="relative mt-6 w-full overflow-x-clip overflow-y-visible sm:mt-10 md:mt-16 lg:overflow-hidden">
          {/* Desktop horizontal line */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-[44px] hidden h-[2px] w-screen -translate-x-1/2 bg-[#C1C1C1] lg:block"
          >
            <div
              ref={hLineRef}
              className="absolute inset-0 origin-left bg-[#245FD4]"
              style={{ transform: "scaleX(0)" }}
            />
          </div>

          <div
            ref={trackRef}
            className="grid grid-cols-1 gap-9 sm:grid-cols-2 sm:gap-8 lg:flex lg:w-max lg:flex-nowrap lg:gap-[clamp(120px,9vw,176px)] lg:py-4 lg:pl-[9vw] lg:pr-[9vw]"
          >
            {steps.map((item, index) => (
              <div
                key={item.step}
                ref={(el) => {
                  stepRefs.current[index] = el;
                }}
                data-active="false"
                className="relative flex w-full flex-col items-start gap-3 opacity-100 transition-[opacity,transform] duration-500 ease-out data-[active=true]:translate-x-0 data-[active=false]:translate-x-1 lg:w-[min(480px,38vw)] lg:shrink-0 lg:gap-0 lg:transition-none lg:transform-none"
              >
                <div className="relative z-10 flex h-[48px] w-[48px] shrink-0 items-center justify-center lg:h-[56px] lg:w-[56px]">
                  <div
                    ref={(el) => {
                      circleRefs.current[index] = el;
                    }}
                    data-active="false"
                    className="flex h-[40px] w-[40px] items-center justify-center rounded-full border border-[#C1C1C1] bg-gradient-to-b from-[#245FD4] to-[#022977] text-white shadow-xs transition-[background,color,box-shadow,transform] duration-300 ease-out data-[active=true]:scale-105 data-[active=true]:border-transparent data-[active=true]:shadow-[0_0_0_5px_rgba(36,95,212,0.16),0_0_14px_rgba(36,95,212,0.22)] lg:h-[56px] lg:w-[56px] lg:data-[active=true]:scale-110 lg:data-[active=true]:shadow-[0_0_0_6px_rgba(36,95,212,0.2),0_0_18px_rgba(36,95,212,0.28)]"
                  >
                    <span className="font-heading text-[13px] font-bold text-white lg:text-[21px]">
                      {item.step}
                    </span>
                  </div>
                </div>

                <div className="flex-1 pr-12 lg:pr-0 lg:flex-none lg:text-left">
                  <h3 className="font-heading mt-0 text-base font-semibold text-slate-900 sm:text-lg lg:mt-8 lg:text-base xl:text-lg 2xl:text-lg 3xl:text-xl leading-snug">
                    {item.title}
                  </h3>
                  <p className="font-body mt-2 max-w-[480px] text-[13px] leading-relaxed text-[#878787] sm:mt-2.5 sm:text-sm lg:text-sm xl:text-[15px]">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}



// "use client";

// import React, { useRef, useState, useEffect } from "react";
// import {
//   motion,
//   useScroll,
//   useTransform,
//   useSpring,
//   useMotionValueEvent,
//   useReducedMotion,
//   type MotionValue,
// } from "motion/react";

// export interface StepItem {
//   step: string;
//   title: string;
//   description: string;
// }

// export interface HowItWorksTimelineProps {
//   steps: StepItem[];
//   children?: React.ReactNode;
// }

// interface StepItemViewProps {
//   item: StepItem;
//   index: number;
//   smoothProgress: MotionValue<number>;
//   activeStep: number;
//   mobileActiveStep: number;
//   isMobile: boolean;
//   shouldReduceMotion: boolean | null;
//   circleRef?: React.Ref<HTMLDivElement>;
// }

// /**
//  * StepItemView:
//  * Renders an individual step container.
//  * Moves forward (scale: 1.06, y: -10px) on desktop when the bar reaches this step.
//  * On mobile below md: gets a soft glow ring as it passes the vertical middle of the screen.
//  * Reduced motion shows the final state.
//  */
// function StepItemView({
//   item,
//   index,
//   smoothProgress,
//   activeStep,
//   mobileActiveStep,
//   isMobile,
//   shouldReduceMotion,
//   circleRef,
// }: StepItemViewProps) {
//   // Move forward and backward in direct physical synchronization with the progress bar on desktop
//   const desktopScale = useTransform(
//     smoothProgress,
//     index === 0
//       ? [0, 0.45, 1]
//       : index === 1
//       ? [0, 0.5, 1]
//       : [0, 0.55, 1],
//     index === 0
//       ? [1.06, 0.96, 0.96]
//       : index === 1
//       ? [0.96, 1.06, 0.96]
//       : [0.96, 0.96, 1.06]
//   );

//   const desktopY = useTransform(
//     smoothProgress,
//     index === 0
//       ? [0, 0.45, 1]
//       : index === 1
//       ? [0, 0.5, 1]
//       : [0, 0.55, 1],
//     index === 0
//       ? [-10, 0, 0]
//       : index === 1
//       ? [0, -10, 0]
//       : [0, 0, -10]
//   );

//   const isActive = shouldReduceMotion
//     ? true
//     : isMobile
//     ? index <= mobileActiveStep
//     : index === activeStep;

//   return (
//     <motion.div
//       style={
//         shouldReduceMotion || isMobile
//           ? { scale: 1, y: 0 }
//           : { scale: desktopScale, y: desktopY, transformOrigin: "center top" }
//       }
//       className="relative flex flex-row md:flex-col items-start gap-4 md:gap-0"
//     >
//       {/* 40x40 on mobile, 74x74 on desktop Number Circle container */}
//       <div
//         ref={circleRef}
//         className="relative z-10 flex h-[40px] w-[40px] md:h-[74px] md:w-[74px] items-center justify-center shrink-0"
//       >
//         <motion.div
//           data-timeline-circle
//           style={{
//             background:
//               "linear-gradient(180deg, #245FD4 0%, #022977 100%)",
//           }}
//           animate={
//             isActive
//               ? {
//                   boxShadow:
//                     "0 0 0 8px rgba(36, 95, 212, 0.2), 0 0 24px rgba(36, 95, 212, 0.28)",
//                 }
//               : {
//                   boxShadow: "0 0 0 0px rgba(36, 95, 212, 0)",
//                 }
//           }
//           transition={{
//             duration: 0.35,
//             ease: "easeOut",
//           }}
//           className="flex h-[40px] w-[40px] md:h-[74px] md:w-[74px] items-center justify-center rounded-full border border-[#C1C1C1] shadow-xs"
//         >
//           <span className="font-heading text-[15px] font-bold text-white md:text-2xl md:text-[28px]">
//             {item.step}
//           </span>
//         </motion.div>
//       </div>

//       {/* Title & Description: solid 100% opacity, no fade */}
//       <div data-timeline-content className="opacity-100 flex-1 md:flex-none">
//         <h3 className="font-heading mt-0 md:mt-11 text-lg sm:text-xl md:text-xl lg:text-2xl font-semibold text-slate-900">
//           {item.title}
//         </h3>
//         <p className="font-body mt-2 text-sm leading-relaxed text-[#878787] sm:mt-3 sm:text-base">
//           {item.description}
//         </p>
//       </div>
//     </motion.div>
//   );
// }

// /**
//  * HowItWorksTimeline:
//  * Sticky scroll-driven interactive timeline.
//  * - Screen remains pinned at the How It Works section while the progress bar completes.
//  * - Containers move forward and backward in direct physical sync with the progress bar.
//  * - No opacity fade: all content remains 100% crisp and readable.
//  * - Desktop: continuous horizontal progress line at top 96px (gray track + brand blue fill).
//  * - Mobile: vertical progress line on the left connecting step circles from top to bottom.
//  * - Step activation: step 1 active on entry, step 2 at ~0.5 progress, step 3 at ~0.9 progress.
//  * - Active circle: soft brand blue glow ring.
//  * - Reduced motion fallback: unpinned standard height, fully filled line, all steps active.
//  */
// export default function HowItWorksTimeline({
//   steps,
//   children,
// }: HowItWorksTimelineProps) {
//   const outerTrackRef = useRef<HTMLDivElement>(null);
//   const containerRef = useRef<HTMLDivElement>(null);
//   const circle0Ref = useRef<HTMLDivElement>(null);
//   const circle1Ref = useRef<HTMLDivElement>(null);
//   const circle2Ref = useRef<HTMLDivElement>(null);

//   const shouldReduceMotion = useReducedMotion();
//   const [activeStep, setActiveStep] = useState(0);
//   const [mobileActiveStep, setMobileActiveStep] = useState(0);
//   const [isMobile, setIsMobile] = useState(false);

//   useEffect(() => {
//     const checkMobile = () => setIsMobile(window.innerWidth < 768);
//     checkMobile();
//     window.addEventListener("resize", checkMobile);
//     return () => window.removeEventListener("resize", checkMobile);
//   }, []);

//   useEffect(() => {
//     if (!isMobile) return;

//     const onScroll = () => {
//       const midY = window.innerHeight * 0.5;
//       const refs = [circle0Ref, circle1Ref, circle2Ref];
//       let active = 0;
//       refs.forEach((r, idx) => {
//         if (r.current) {
//           const rect = r.current.getBoundingClientRect();
//           const circleCenter = rect.top + rect.height / 2;
//           if (circleCenter <= midY) {
//             active = idx;
//           }
//         }
//       });
//       setMobileActiveStep(active);
//     };

//     onScroll();
//     window.addEventListener("scroll", onScroll, { passive: true });
//     return () => window.removeEventListener("scroll", onScroll);
//   }, [isMobile]);

//   // Vertical line coordinates for mobile stacked layout
//   const [verticalLine, setVerticalLine] = useState<{
//     top: number;
//     height: number;
//   }>({ top: 20, height: 420 });

//   useEffect(() => {
//     const updateVerticalLine = () => {
//       if (circle0Ref.current && circle2Ref.current && containerRef.current) {
//         const firstCircle = circle0Ref.current;
//         const lastCircle = circle2Ref.current;
//         const container = containerRef.current;

//         const firstRect = firstCircle.getBoundingClientRect();
//         const lastRect = lastCircle.getBoundingClientRect();
//         const containerRect = container.getBoundingClientRect();

//         const top = firstRect.top - containerRect.top + firstRect.height / 2;
//         const bottom = lastRect.top - containerRect.top + lastRect.height / 2;

//         setVerticalLine({
//           top,
//           height: Math.max(0, bottom - top),
//         });
//       }
//     };

//     updateVerticalLine();
//     window.addEventListener("resize", updateVerticalLine);
//     return () => window.removeEventListener("resize", updateVerticalLine);
//   }, []);

//   // Track progress while the section is sticky-pinned in the viewport (from start to completion)
//   const { scrollYProgress } = useScroll({
//     target: outerTrackRef,
//     offset: ["start start", "end end"],
//   });

//   const clampedProgress = useTransform(scrollYProgress, (v) =>
//     Math.max(0, Math.min(1, v))
//   );

//   // Soft spring with critically damped physics -> 0 overshoot
//   const smoothProgress = useSpring(clampedProgress, {
//     stiffness: 100,
//     damping: 30,
//     restDelta: 0.001,
//   });

//   // Step activation: step 1 on entry, step 2 at ~0.5, step 3 at ~0.9
//   useMotionValueEvent(smoothProgress, "change", (latest) => {
//     if (latest < 0.5) {
//       setActiveStep(0);
//     } else if (latest < 0.9) {
//       setActiveStep(1);
//     } else {
//       setActiveStep(2);
//     }
//   });

//   return (
//     <section
//       id="how-it-works"
//       ref={outerTrackRef}
//       className={`scroll-mt-24 overflow-x-clip bg-[#FCFCFC] ${
//         shouldReduceMotion ? "py-14 sm:py-16 lg:py-24 3xl:py-28" : "relative h-[220svh]"
//       }`}
//     >
//       <div
//         className={
//           shouldReduceMotion
//             ? "mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-12 2xl:max-w-[1536px] 3xl:max-w-[1720px]"
//             : "sticky top-0 flex min-h-0 [@media(min-height:700px)]:min-h-[100svh] flex-col justify-center overflow-hidden py-6 sm:py-10 md:py-16"
//         }
//       >
//         <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-12 2xl:max-w-[1536px] 3xl:max-w-[1720px]">
//           {/* Section Header */}
//           {children}

//           {/* 3 Step Flow with Scroll-Driven Timeline */}
//           <div
//             ref={containerRef}
//             className="relative mx-auto mt-10 max-w-[1200px] sm:mt-14 md:mt-16"
//           >
//             {/* 1. Desktop Horizontal Line (top 96px, md:block) */}
//             {/* Gray Track */}
//             <div
//               aria-hidden="true"
//               className="pointer-events-none absolute left-0 right-0 top-[96px] hidden h-[2px] bg-[#C1C1C1] md:block"
//             />
//             {/* Brand Blue Fill */}
//             <motion.div
//               aria-hidden="true"
//               data-timeline-line
//               className="pointer-events-none absolute left-0 right-0 top-[96px] hidden h-[2px] bg-[#245FD4] origin-left md:block"
//               style={{
//                 scaleX: shouldReduceMotion ? 1 : smoothProgress,
//               }}
//             />

//             {/* 2. Mobile Vertical Line (left of steps, md:hidden) */}
//             {/* Gray Track */}
//             <div
//               aria-hidden="true"
//               className="pointer-events-none absolute left-[19px] w-[2px] bg-[#C1C1C1] md:hidden"
//               style={{
//                 top: verticalLine.top,
//                 height: verticalLine.height,
//               }}
//             />
//             {/* Brand Blue Fill */}
//             <motion.div
//               aria-hidden="true"
//               data-timeline-line
//               className="pointer-events-none absolute left-[19px] w-[2px] bg-[#245FD4] origin-top md:hidden transition-[transform] duration-500 ease-out"
//               style={{
//                 top: verticalLine.top,
//                 height: verticalLine.height,
//                 scaleY: shouldReduceMotion
//                   ? 1
//                   : isMobile
//                   ? mobileActiveStep === 0
//                     ? 0.05
//                     : mobileActiveStep === 1
//                     ? 0.5
//                     : 1
//                   : smoothProgress,
//               }}
//             />

//             {/* 3 Steps Grid */}
//             <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3 md:gap-8 lg:gap-14 xl:gap-16">
//               {steps.map((item, index) => {
//                 const circleRef =
//                   index === 0
//                     ? circle0Ref
//                     : index === 1
//                     ? circle1Ref
//                     : circle2Ref;

//                 return (
//                   <StepItemView
//                     key={item.step}
//                     item={item}
//                     index={index}
//                     smoothProgress={smoothProgress}
//                     activeStep={activeStep}
//                     mobileActiveStep={mobileActiveStep}
//                     isMobile={isMobile}
//                     shouldReduceMotion={shouldReduceMotion}
//                     circleRef={circleRef}
//                   />
//                 );
//               })}
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }
