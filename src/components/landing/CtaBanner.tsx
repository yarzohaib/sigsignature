"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getStoredToken } from "@/app/lib/auth";
import { motion, useReducedMotion } from "motion/react";
import { EASE_OUT_CUBIC, MOTION_VIEWPORT } from "@/components/motion/motionConfig";

export default function CtaBanner() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    setIsAuthenticated(Boolean(getStoredToken()));
  }, []);

  return (
    <section
      className="relative mx-4 my-6 sm:my-8 md:my-0 rounded-[20px] md:mx-0 md:rounded-none overflow-hidden px-4 py-14 sm:py-18 lg:py-20 text-center text-white"
      style={{
        background:
          "radial-gradient(120% 120% at 50% 20%, #245FD4 0%, #09379B 55%, #00143C 100%)",
        boxShadow: "inset 0 1px 0 0 rgba(255, 255, 255, 0.15)",
      }}
    >
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.96 }}
        whileInView={shouldReduceMotion ? undefined : { opacity: 1, scale: 1 }}
        viewport={MOTION_VIEWPORT}
        transition={{
          duration: 0.6,
          ease: EASE_OUT_CUBIC,
        }}
        className="mx-auto flex flex-col items-center text-center max-w-4xl 2xl:max-w-[1100px] px-4 sm:px-6 lg:px-8"
      >
        <h2 className="font-heading text-center mx-auto text-[clamp(1.75rem,1.1rem+2vw,2.5rem)] lg:text-[34px] xl:text-[40px] 2xl:text-[48px] font-semibold tracking-tight leading-tight sm:leading-[1.2] [text-wrap:balance]">
          <span className="block lg:whitespace-nowrap">
            Your Email Signature Is the Last Thing People See,
          </span>
          <span className="block mt-1 sm:mt-1.5">
            Make It Count.
          </span>
        </h2>

        <motion.p
          initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={MOTION_VIEWPORT}
          transition={{
            duration: 0.45,
            delay: shouldReduceMotion ? 0 : 0.25,
            ease: EASE_OUT_CUBIC,
          }}
          className="font-body mt-4 max-w-xl mx-auto text-center text-sm text-blue-100/90 sm:text-base leading-relaxed"
        >
          Join professionals who&apos;ve stopped overpaying for email signatures. Create yours free in minutes.
        </motion.p>

        {/* Primary CTA button with Figma gradient sheen, shadow depth and hover elevation */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={MOTION_VIEWPORT}
          transition={{
            duration: 0.5,
            delay: shouldReduceMotion ? 0 : 0.4,
            ease: EASE_OUT_CUBIC,
          }}
          className="mt-8 flex w-full justify-center"
        >
          <Link
            href={isAuthenticated ? "/dashboard" : "/signup"}
            style={{
              background:
                "linear-gradient(180deg, #FFFFFF 0%, #EFF6FF 100%)",
            }}
            className="group relative inline-flex h-[48px] w-full max-w-[320px] sm:w-[280px] sm:max-w-none items-center justify-center overflow-hidden rounded-full px-6 font-body text-sm sm:text-[15px] font-semibold text-[#0B2568] shadow-[0_8px_24px_rgba(0,0,0,0.22)] transition-all duration-200 ease-out hover:shadow-[0_12px_28px_rgba(0,0,0,0.3)] hover:scale-[1.02] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#00359F]"
          >
            {/* Soft diagonal shine sweep across the button on hover */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -inset-y-2 -inset-x-12 -translate-x-full skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/50 to-transparent transition-transform duration-700 ease-out [@media(hover:hover)]:group-hover:translate-x-[360px]"
            />
            <span className="relative z-10">{isAuthenticated ? "Go to Dashboard" : "Create Your Free Signature"}</span>
          </Link>
        </motion.div>

        <motion.p
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1 }}
          viewport={MOTION_VIEWPORT}
          transition={{
            duration: 0.45,
            delay: shouldReduceMotion ? 0 : 0.55,
            ease: EASE_OUT_CUBIC,
          }}
          className="mt-4 text-center mx-auto font-body text-xs text-blue-200/80 sm:text-[13px]"
        >
          No credit card. No designer. No developer. Just you.
        </motion.p>
      </motion.div>
    </section>
  );
}

