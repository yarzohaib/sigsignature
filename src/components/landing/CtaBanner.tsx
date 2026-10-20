"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import WordReveal from "@/components/motion/WordReveal";
import { EASE_OUT_CUBIC, MOTION_VIEWPORT } from "@/components/motion/motionConfig";

export default function CtaBanner() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      className="relative w-full overflow-hidden px-4 py-16 text-center text-white sm:py-20 lg:py-24"
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
        className="mx-auto max-w-5xl px-4"
      >
        <h2 className="font-heading text-xl font-semibold tracking-tight sm:text-2xl md:text-3xl lg:text-[36px] xl:text-[38px] leading-tight sm:leading-[1.2]">
          <span className="block whitespace-normal sm:whitespace-nowrap">
            <WordReveal
              text="Your Email Signature Is the Last Thing People See,"
              as="span"
              duration={0.35}
              stagger={0.035}
            />
          </span>
          <span className="block mt-1 sm:mt-1.5">
            <WordReveal
              text="Make It Count."
              as="span"
              delay={0.38}
              duration={0.35}
              stagger={0.05}
            />
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
          className="font-body mt-4 text-sm text-blue-100 sm:text-base"
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
            className="group relative inline-flex h-[46px] w-[275px] items-center justify-center overflow-hidden rounded-full font-body text-sm sm:text-[15px] font-semibold text-[#00359F] animate-cta-idle-glow transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-[2px] hover:shadow-[0_8px_24px_rgba(255,255,255,0.4)] active:scale-[0.98]"
          >
            {/* Soft diagonal shine sweep across the button on hover */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -inset-y-2 -inset-x-12 -translate-x-full skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/50 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[360px]"
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
          className="mt-3.5 font-body text-xs text-blue-200/90 sm:text-sm"
        >
          No credit card. No designer. No developer. Just you.
        </motion.p>
      </motion.div>
    </section>
  );
}

