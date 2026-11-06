// "use client";

// import React, { useRef, useEffect } from "react";
// import { gsap } from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";

// gsap.registerPlugin(ScrollTrigger);

// export interface StepItem {
//   step: string;
//   title: string;
//   description: string;
// }

// export interface HowItWorksTimelineProps {
//   steps: StepItem[];
//   children?: React.ReactNode;
// }

// /**
//  * HowItWorksTimeline (GSAP ScrollTrigger version)
//  * - Section is pinned while scroll progress is scrubbed.
//  * - Desktop: horizontal line fills (scaleX); the active step lifts and scales.
//  * - Mobile: steps activate as the user scrolls through the unpinned timeline.
//  * - Active step = round(progress * (steps - 1)).
//  * - Reduced motion: no pin, all steps active.
//  */
// export default function HowItWorksTimeline({ steps, children }: HowItWorksTimelineProps) {
//   const sectionRef = useRef<HTMLElement>(null);
//   const viewportRef = useRef<HTMLDivElement>(null);
//   const trackRef = useRef<HTMLDivElement>(null);
//   const hLineRef = useRef<HTMLDivElement>(null);
//   const circleRefs = useRef<(HTMLDivElement | null)[]>([]);
//   const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

//   useEffect(() => {
//     const section = sectionRef.current;
//     const viewport = viewportRef.current;
//     const track = trackRef.current;
//     if (!section || !viewport || !track) return;

//     const setActive = (active: number) => {
//       circleRefs.current.forEach((el, i) => {
//         if (el) el.dataset.active = i === active ? "true" : "false";
//       });
//       stepRefs.current.forEach((el, i) => {
//         if (el) el.dataset.active = i <= active ? "true" : "false";
//       });
//     };

//     const ctx = gsap.context(() => {
//       const mm = gsap.matchMedia();

//       mm.add(
//         {
//           desktop: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
//           mobile: "(max-width: 1023px) and (prefers-reduced-motion: no-preference)",
//           reduce: "(prefers-reduced-motion: reduce)",
//         },
//         (context) => {
//           const { desktop, mobile, reduce } = context.conditions as {
//             desktop: boolean;
//             mobile: boolean;
//             reduce: boolean;
//           };

//           if (reduce) {
//             gsap.set(hLineRef.current, { scale: 1 });
//             circleRefs.current.forEach((el) => {
//               if (el) el.dataset.active = "true";
//             });
//             stepRefs.current.forEach((el) => {
//               if (el) el.dataset.active = "true";
//             });
//             return;
//           }

//           const isDesktop = desktop && !mobile;

//           // initial state
//           gsap.set(hLineRef.current, { scaleX: 0 });
//           gsap.set(track, { x: 0 });
//           setActive(0);

//           let lastActive = 0;

//           const getDistance = () => {
//             const lastStep = stepRefs.current[steps.length - 1];
//             if (!lastStep) {
//               return Math.max(track.scrollWidth - viewport.clientWidth, 0);
//             }
//             const rightPadding = Math.max(32, Math.round(viewport.clientWidth * 0.08));
//             const stepContentWidth = Math.min(lastStep.offsetWidth, 420);
//             const targetX = lastStep.offsetLeft + stepContentWidth - (viewport.clientWidth - rightPadding);
//             return Math.max(targetX, track.scrollWidth - viewport.clientWidth, 0);
//           };

//           gsap
//             .timeline({
//               scrollTrigger: {
//                 trigger: section,
//                 start: isDesktop ? "top top" : "top 70%",
//                 end: () => {
//                   if (!isDesktop) return "bottom 65%";
//                   const distance = getDistance();
//                   return `+=${Math.max(Math.round(distance * 1.3), Math.round(window.innerHeight * 1.1))}`;
//                 },
//                 scrub: 1.2,
//                 pin: isDesktop,
//                 anticipatePin: isDesktop ? 1 : 0,
//                 invalidateOnRefresh: true,
//                 onUpdate: (self) => {
//                   const active = isDesktop
//                     ? Math.min(steps.length - 1, Math.round(self.progress * (steps.length - 1)))
//                     : stepRefs.current.reduce((current, element, index) => {
//                         if (element && element.getBoundingClientRect().top < window.innerHeight * 0.6) {
//                           return index;
//                         }
//                         return current;
//                       }, 0);
//                   if (active !== lastActive) {
//                     lastActive = active;
//                     setActive(active);
//                   }
//                 },
//               },
//             })
//             .to(isDesktop ? track : {}, isDesktop ? {
//               x: () => -getDistance(),
//               ease: "none",
//             } : { duration: 1 })
//             .to(
//               isDesktop ? hLineRef.current : {},
//               isDesktop ? { scaleX: 1, ease: "none" } : { duration: 1 },
//               0
//             );

//           return () => {
//             const stepElements = stepRefs.current.filter(
//               (element): element is HTMLDivElement => element !== null
//             );
//             if (stepElements.length > 0) {
//               gsap.set(stepElements, { clearProps: "all" });
//             }
//           };
//         }
//       );
//     }, section);

//     return () => ctx.revert();
//   }, [steps.length]);

//   return (
//     <section
//       id="how-it-works"
//       ref={sectionRef}
//       className="relative flex scroll-mt-24 flex-col overflow-x-clip bg-[#FCFCFC] py-12 sm:py-16 lg:py-20"
//     >
//       <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
//         {/* Section Header */}
//         {children}

//         {/* Steps */}
//         <div ref={viewportRef} className="relative mt-6 w-full overflow-x-clip overflow-y-visible sm:mt-10 md:mt-16 lg:overflow-hidden">
//           {/* Desktop horizontal line */}
//           <div
//             aria-hidden="true"
//             className="pointer-events-none absolute left-1/2 top-[44px] hidden h-[2px] w-screen -translate-x-1/2 bg-[#C1C1C1] lg:block"
//           >
//             <div
//               ref={hLineRef}
//               className="absolute inset-0 origin-left bg-[#245FD4]"
//               style={{ transform: "scaleX(0)" }}
//             />
//           </div>

//           <div
//             ref={trackRef}
//             className="grid grid-cols-1 gap-9 sm:grid-cols-2 sm:gap-8 lg:flex lg:w-max lg:flex-nowrap lg:gap-[clamp(120px,9vw,176px)] lg:py-4 lg:pl-[9vw] lg:pr-[9vw]"
//           >
//             {steps.map((item, index) => (
//               <div
//                 key={item.step}
//                 ref={(el) => {
//                   stepRefs.current[index] = el;
//                 }}
//                 data-active="false"
//                 className="relative flex w-full flex-col items-start gap-3 opacity-100 transition-[opacity,transform] duration-500 ease-out data-[active=true]:translate-x-0 data-[active=false]:translate-x-1 lg:w-[min(480px,38vw)] lg:shrink-0 lg:gap-0 lg:transition-none lg:transform-none"
//               >
//                 <div className="relative z-10 flex h-[48px] w-[48px] shrink-0 items-center justify-center lg:h-[56px] lg:w-[56px]">
//                   <div
//                     ref={(el) => {
//                       circleRefs.current[index] = el;
//                     }}
//                     data-active="false"
//                     className="flex h-[40px] w-[40px] items-center justify-center rounded-full border border-[#C1C1C1] bg-gradient-to-b from-[#245FD4] to-[#022977] text-white shadow-xs transition-[background,color,box-shadow,transform] duration-300 ease-out data-[active=true]:scale-105 data-[active=true]:border-transparent data-[active=true]:shadow-[0_0_0_5px_rgba(36,95,212,0.16),0_0_14px_rgba(36,95,212,0.22)] lg:h-[56px] lg:w-[56px] lg:data-[active=true]:scale-110 lg:data-[active=true]:shadow-[0_0_0_6px_rgba(36,95,212,0.2),0_0_18px_rgba(36,95,212,0.28)]"
//                   >
//                     <span className="font-heading text-[13px] font-bold text-white lg:text-[21px]">
//                       {item.step}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="flex-1 pr-12 lg:pr-0 lg:flex-none lg:text-left">
//                   <h3 className="font-heading mt-0 text-base font-semibold text-slate-900 sm:text-lg lg:mt-8 lg:text-base xl:text-lg 2xl:text-lg 3xl:text-xl leading-snug">
//                     {item.title}
//                   </h3>
//                   <p className="font-body mt-2 max-w-[480px] text-[13px] leading-relaxed text-[#878787] sm:mt-2.5 sm:text-sm lg:text-sm xl:text-[15px]">
//                     {item.description}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }




"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
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

const DESKTOP_QUERY = "(min-width: 1024px)";

const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));

/** The dot nearest to the line head, so exactly one step is highlighted at a time. */
function activeIndexFromProgress(progress: number, count: number): number {
  if (count <= 1) return 0;
  return Math.round(clamp01(progress) * (count - 1));
}

/**
 * HowItWorksTimeline
 *
 * Desktop (1024px and up): the section pins to the screen and the whole flow fits on one screen.
 * While you scroll, a wide track of steps slides sideways, a progress line fills and each
 * step lights up when the line reaches it. Everything is driven by one spring smoothed
 * progress value, so movement is continuous and never overshoots.
 *
 * Mobile and tablet: normal page flow with a vertical line. A step lights up when it
 * crosses the middle of the screen.
 *
 * Reduced motion: no pinning, no movement, every step shown as active.
 */
export default function HowItWorksTimeline({
  steps,
  children,
}: HowItWorksTimelineProps) {
  const outerRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<Array<HTMLLIElement | null>>([]);
  const reachedRef = useRef<Set<number>>(new Set([0]));

  const shouldReduceMotion = useReducedMotion();
  const [isDesktop, setIsDesktop] = useState(false);
  const [active, setActive] = useState(0);
  const count = steps.length;

  // Which layout is in use
  useEffect(() => {
    const media = window.matchMedia(DESKTOP_QUERY);
    const update = () => setIsDesktop(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  // Scroll progress across the pinned section, with a short rest at both ends
  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ["start start", "end end"],
  });
  const lineProgress = useTransform(scrollYProgress, (value) =>
    clamp01((value - 0.06) / 0.86)
  );
  const smooth = useSpring(lineProgress, {
    stiffness: 140,
    damping: 32,
    mass: 0.5,
    restDelta: 0.0005,
  });

  // How far the track has to travel sideways to bring the last step fully into view
  const overflow = useMotionValue(0);
  useEffect(() => {
    if (!isDesktop) {
      overflow.set(0);
      return;
    }
    const measure = () => {
      const viewport = viewportRef.current;
      const track = trackRef.current;
      if (!viewport || !track) return;
      overflow.set(Math.max(0, track.scrollWidth - viewport.clientWidth));
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (viewportRef.current) observer.observe(viewportRef.current);
    if (trackRef.current) observer.observe(trackRef.current);
    return () => observer.disconnect();
  }, [isDesktop, overflow, count]);

  const trackX = useTransform(() => -smooth.get() * overflow.get());

  // Desktop: active step follows the progress line
  useMotionValueEvent(smooth, "change", (latest) => {
    if (!isDesktop || shouldReduceMotion) return;
    setActive(activeIndexFromProgress(latest, count));
  });

  // Mobile and tablet: a step is active once it has crossed the middle of the screen
  useEffect(() => {
    if (isDesktop || shouldReduceMotion) return;
    const reached = reachedRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number((entry.target as HTMLElement).dataset.index);
          if (Number.isNaN(index)) return;
          if (entry.isIntersecting) {
            reached.add(index);
          } else if (entry.boundingClientRect.top > 0) {
            reached.delete(index);
          }
        });
        setActive(Math.max(0, ...Array.from(reached)));
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    stepRefs.current.forEach((element) => {
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, [isDesktop, shouldReduceMotion, count]);

  const activeStep = shouldReduceMotion ? count - 1 : active;

  const trackVars = { "--n": count } as React.CSSProperties;

  return (
    <section
      id="how-it-works"
      ref={outerRef}
      className={`scroll-mt-24 overflow-x-clip bg-[#FCFCFC] ${
        shouldReduceMotion
          ? "py-10 sm:py-12 lg:py-12"
          : "relative py-10 sm:py-12 lg:h-[160svh] lg:py-0"
      }`}
    >
      <div
        className={
          shouldReduceMotion
            ? ""
            : "lg:sticky lg:top-16 lg:flex lg:h-[calc(100svh-4rem)] lg:flex-col lg:justify-center lg:overflow-hidden xl:top-[72px] xl:h-[calc(100svh-4.5rem)]"
        }
      >
        <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8 xl:px-12">
          {/* Section Header */}
          {children}
        </div>

        {/* Steps */}
        <div
          ref={viewportRef}
          className="mx-auto mt-10 w-full max-w-[1280px] px-4 sm:px-6 lg:mt-12 lg:max-w-none lg:overflow-hidden lg:px-0 xl:mt-14"
        >
          <motion.div
            ref={trackRef}
            style={{
              ...trackVars,
              x: shouldReduceMotion || !isDesktop ? 0 : trackX,
            }}
            className="relative lg:flex lg:w-max lg:[--dot:36px] lg:[--gap:72px] lg:[--pad:max(24px,calc((100vw-1200px)/2))] lg:[--step-w:340px] lg:py-4 lg:pl-[var(--pad)] lg:pr-[var(--pad)]"
          >
            {/* Desktop progress rail across the whole track: it slides with the cards, the fill follows scroll */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-0 top-[33px] hidden h-[2px] w-full bg-[#D5DAE3]/70 lg:block"
            >
              <motion.div
                data-timeline-line
                className="relative h-full w-full origin-left"
                style={{ scaleX: shouldReduceMotion ? 1 : smooth }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#5B8DEF] via-[#245FD4] to-[#022977]" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#5B8DEF] via-[#245FD4] to-[#022977] opacity-60 blur-[4px]" />
                <div className="absolute right-0 top-1/2 h-[8px] w-[8px] -translate-y-1/2 translate-x-1/2 rounded-full bg-[#8DB0F5] opacity-90 blur-[2px]" />
                <div className="absolute right-0 top-1/2 h-[4px] w-[4px] -translate-y-1/2 translate-x-1/2 rounded-full bg-white" />
              </motion.div>
            </div>

            <ol className="flex flex-col gap-9 lg:flex-row lg:gap-[var(--gap)]">
              {steps.map((item, index) => {
                const isActive = index <= activeStep;
                const isCurrent = index === activeStep;
                const isLast = index === count - 1;

                return (
                  <li
                    key={item.step}
                    ref={(element) => {
                      stepRefs.current[index] = element;
                    }}
                    data-index={index}
                    className="relative pl-[56px] lg:w-[var(--step-w)] lg:shrink-0 lg:pl-0"
                  >
                    {/* Mobile connector to the next step */}
                    {!isLast && (
                      <>
                        <div
                          aria-hidden="true"
                          className="absolute left-[19px] top-[40px] -bottom-9 w-[2px] rounded-full bg-[#D5DAE3] lg:hidden"
                        />
                        <div
                          aria-hidden="true"
                          className="absolute left-[19px] top-[40px] -bottom-9 w-[2px] origin-top rounded-full bg-[#245FD4] transition-transform duration-500 ease-out lg:hidden"
                          style={{
                            transform: `scaleY(${index < activeStep ? 1 : 0})`,
                          }}
                        />
                      </>
                    )}

                    {/* Number circle: always blue, the current one grows and glows */}
                    <motion.div
                      data-timeline-circle
                      animate={{
                        scale: isCurrent && !shouldReduceMotion ? 1.18 : 1,
                        boxShadow: isCurrent
                          ? "0 0 0 6px rgba(36, 95, 212, 0.16), 0 6px 18px rgba(36, 95, 212, 0.35)"
                          : "0 0 0 0px rgba(36, 95, 212, 0), 0 2px 6px rgba(2, 41, 119, 0.18)",
                      }}
                      transition={{ type: "spring", stiffness: 260, damping: 24 }}
                      className={`absolute left-0 top-0 z-10 flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-300 lg:static lg:h-9 lg:w-9 ${
                        isActive
                          ? "bg-gradient-to-b from-[#245FD4] to-[#022977] text-white"
                          : "border-2 border-[#C9CFDA] bg-white text-[#64748B] lg:border-0 lg:bg-gradient-to-b lg:from-[#245FD4] lg:to-[#022977] lg:text-white"
                      }`}
                    >
                      <span className="font-heading text-[13px] font-bold">
                        {item.step}
                      </span>
                    </motion.div>

                    <div className="lg:mt-5">
                      <h3 className="font-heading text-[15px] font-bold leading-snug tracking-[-0.01em] text-slate-900">
                        {item.title}
                      </h3>
                      <p className="font-body mt-2 max-w-[300px] text-[13px] leading-[1.7] text-[#6B7280] lg:text-[14px]">
                        {item.description}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
