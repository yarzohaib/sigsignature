"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { EASE_OUT_CUBIC, MOTION_VIEWPORT } from "@/components/motion/motionConfig";

export default function CtaBanner() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      className="relative mx-4 my-6 sm:my-8 md:my-0 rounded-[20px] md:mx-0 md:rounded-none overflow-hidden px-4 py-12 text-center text-white sm:py-20 lg:py-24 3xl:py-28"
      style={{
        background: "linear-gradient(90deg, #245FD4 0%, #00359F 50%, #00143C 100%)",
        boxShadow: "inset 13px 12px 35.1px 0 rgba(0, 0, 0, 0.24)",
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
        className="mx-auto max-w-5xl 2xl:max-w-[1300px] 3xl:max-w-[1500px] px-4 sm:px-6 lg:px-8"
      >
        <h2 className="font-heading text-[clamp(1.375rem,1rem+1.8vw,2.375rem)] lg:text-[36px] xl:text-[38px] 2xl:text-[42px] 3xl:text-[48px] font-semibold tracking-tight leading-tight sm:leading-[1.2] [text-wrap:balance]">
          <span className="block whitespace-normal sm:whitespace-nowrap">
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
            delay: shouldReduceMotion ? 0 : 0.45,
            ease: EASE_OUT_CUBIC,
          }}
          className="font-body mt-4 text-sm text-blue-100 sm:text-base 3xl:text-[18px]"
        >
          Join professionals who&apos;ve stopped overpaying for email signatures.
          Create yours free in minutes.
        </motion.p>

        {/* Sleek, 275px x 46px pill button matching Figma Frame properties */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={MOTION_VIEWPORT}
          transition={{
            duration: 0.5,
            delay: shouldReduceMotion ? 0 : 0.65,
            ease: EASE_OUT_CUBIC,
          }}
          className="mt-8 flex justify-center"
        >
          <Link
            href="/signup"
            style={{
              background:
                "linear-gradient(180deg, #FFFFFF 0%, #D9F4FD 50%, #FDFEFF 100%)",
            }}
            className="group relative inline-flex h-[46px] w-full max-w-[360px] sm:w-[275px] sm:max-w-none items-center justify-center overflow-hidden rounded-full font-body text-sm sm:text-[15px] font-semibold text-[#00359F] animate-cta-idle-glow transition-[transform,box-shadow] duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#00359F] [@media(hover:hover)]:hover:-translate-y-[2px] [@media(hover:hover)]:hover:shadow-[0_8px_24px_rgba(255,255,255,0.4)] active:scale-[0.98]"
          >
            {/* Soft diagonal shine sweep across the button on hover */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -inset-y-2 -inset-x-12 -translate-x-full skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/50 to-transparent transition-transform duration-700 ease-out [@media(hover:hover)]:group-hover:translate-x-[360px]"
            />
            <span className="relative z-10">Create Your Free Signature</span>
          </Link>
        </motion.div>

        <motion.p
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1 }}
          viewport={MOTION_VIEWPORT}
          transition={{
            duration: 0.45,
            delay: shouldReduceMotion ? 0 : 0.75,
            ease: EASE_OUT_CUBIC,
          }}
          className="mt-3.5 font-body text-xs text-blue-200/90 sm:text-sm 3xl:text-base"
        >
          No credit card. No designer. No developer. Just you.
        </motion.p>
      </motion.div>
    </section>
  );
}

