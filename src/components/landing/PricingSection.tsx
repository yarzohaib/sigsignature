"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "motion/react";
import SectionBadge from "./SectionBadge";
import Reveal from "@/components/motion/Reveal";
import { EASE_OUT_CUBIC, MOTION_VIEWPORT } from "@/components/motion/motionConfig";

const freeFeatures = [
  "Create up to 3 professional signatures",
  "Access starter templates",
  "Production-ready HTML export",
  "High-quality image export",
  "Real-time live preview",
];

const premiumFeatures = [
  "Unlimited signature creation",
  "Exclusive premium templates",
  "Manage your entire team in one place",
  "Priority support & faster assistance",
  "Advanced customization tools",
];

// Premium enters first in the stagger
const premiumCardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
    scale: 1,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.55,
      delay: 0.08,
      ease: EASE_OUT_CUBIC,
    },
  },
};

// Recommended plan (Free) enters last with a slight scale up (1.02)
const freeCardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1.02,
    transition: {
      duration: 0.55,
      delay: 0.22,
      ease: EASE_OUT_CUBIC,
    },
  },
};

// Recommended badge fades in after the card enters
const recommendedBadgeVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.85,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.35,
      delay: 0.45,
      ease: EASE_OUT_CUBIC,
    },
  },
};

const listVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.12,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: EASE_OUT_CUBIC,
    },
  },
};

export default function PricingSection() {
  const [waitlistJoined, setWaitlistJoined] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="pricing" className="scroll-mt-24 bg-[#FCFCFC] py-14 sm:py-16 lg:py-24 3xl:py-28">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 xl:px-12 3xl:max-w-[1600px]">
        {/* Section Header */}
        <div className="text-center">
          <Reveal y={16} blur={6} className="mb-3 sm:mb-4 inline-block">
            <SectionBadge label="PRICING" />
          </Reveal>
          <Reveal y={24} blur={8} delay={0.1}>
            <h2 className="font-heading text-[clamp(1.625rem,1.1rem+2.3vw,3.375rem)] lg:text-[54px] lg:leading-[1.12] 3xl:text-[60px] font-semibold tracking-tight text-slate-900 leading-tight [text-wrap:balance]">
              Transparent Pricing,{" "}
              <span className="text-[#1243A3]">Start Free.</span>
            </h2>
          </Reveal>
        </div>

        {/* Pricing Cards: Portrait rectangles, reduced heights, Premium taller than Free */}
        <div className="mx-auto mt-10 sm:mt-14 lg:mt-16 flex flex-col items-center justify-center gap-7 md:flex-row md:items-stretch lg:gap-8">
          {/* Free Plan Card: Vertical rectangle (min-h-[460px], max-w-[350px]) */}
          <motion.div
            initial={shouldReduceMotion ? false : "hidden"}
            whileInView={shouldReduceMotion ? undefined : "visible"}
            viewport={MOTION_VIEWPORT}
            variants={shouldReduceMotion ? undefined : freeCardVariants}
            className="flex w-full max-w-[480px] md:max-w-[350px] mx-auto md:mx-0 justify-center md:self-stretch"
          >
            <div
              className="relative flex w-full min-h-[460px] md:h-full flex-col justify-between rounded-[20px] md:rounded-[12px] border border-[#C1C1C1] bg-pricing-free p-5 sm:p-7 shadow-xs transition-[transform,box-shadow,border-color] duration-200 ease-out [@media(hover:hover)]:hover:-translate-y-1.5 [@media(hover:hover)]:hover:shadow-[0_20px_40px_-12px_rgba(36,95,212,0.18)] [@media(hover:hover)]:hover:border-brand/40"
              style={{
                background:
                  "linear-gradient(146.72deg, #FFFFFF 1.16%, rgba(196, 223, 251, 0.5) 50.81%, #FFFFFF 99.33%)",
              }}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-heading text-lg 3xl:text-xl font-semibold text-slate-900">
                    Free Plan
                  </span>
                  {shouldReduceMotion ? (
                    <span className="rounded-full bg-blue-100 px-3 py-1 font-body text-xs font-semibold text-brand">
                      Recommended
                    </span>
                  ) : (
                    <motion.span
                      variants={recommendedBadgeVariants}
                      className="rounded-full bg-blue-100 px-3 py-1 font-body text-xs font-semibold text-brand"
                    >
                      Recommended
                    </motion.span>
                  )}
                </div>

                {/* Price */}
                <div className="mt-5 flex items-baseline gap-1">
                  <span className="font-heading text-4xl sm:text-5xl 3xl:text-[56px] font-semibold tracking-tight text-slate-900">
                    $0
                  </span>
                  <span className="font-body text-sm font-normal text-[#878787]">
                    / Forever
                  </span>
                </div>

                {/* Features List */}
                <motion.ul
                  variants={shouldReduceMotion ? undefined : listVariants}
                  className="mt-6 space-y-3 font-body text-sm 3xl:text-[15px] text-[#878787]"
                >
                  {freeFeatures.map((feat) => (
                    <motion.li
                      key={feat}
                      variants={shouldReduceMotion ? undefined : itemVariants}
                      className="flex items-center gap-3"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-brand shrink-0" />
                      <span>{feat}</span>
                    </motion.li>
                  ))}
                </motion.ul>
              </div>

              {/* CTA Button */}
              <div className="mt-6 pt-2">
                <Link
                  href="/signup"
                  className="flex min-h-[48px] h-12 w-full items-center justify-center rounded-xl bg-cta-gradient bg-gradient-to-r from-[#245FD4] to-[#022977] font-body text-sm font-semibold text-white shadow-none transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 [@media(hover:hover)]:hover:opacity-95 active:scale-[0.98]"
                >
                  Lets Start
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Premium Plan Card: Taller vertical rectangle (min-h-[520px], max-w-[370px]), glowing shadow */}
          <motion.div
            initial={shouldReduceMotion ? false : "hidden"}
            whileInView={shouldReduceMotion ? undefined : "visible"}
            viewport={MOTION_VIEWPORT}
            variants={shouldReduceMotion ? undefined : premiumCardVariants}
            className="flex w-full max-w-[480px] md:max-w-[370px] mx-auto md:mx-0 justify-center md:self-stretch"
          >
            <div
              className="relative flex w-full min-h-[520px] md:h-full flex-col justify-between rounded-[20px] md:rounded-[12px] border border-[#8A95F2]/40 bg-pricing-premium p-5 sm:p-8 shadow-pricing-premium transition-[transform,box-shadow,border-color] duration-200 ease-out [@media(hover:hover)]:hover:-translate-y-1.5 [@media(hover:hover)]:hover:!shadow-[0_24px_48px_-12px_rgba(138,149,242,0.45),0_0_20px_0_rgba(138,149,242,0.35)] [@media(hover:hover)]:hover:border-[#8A95F2]/70"
              style={{
                background:
                  "linear-gradient(146.72deg, #FFFFFF 1.16%, rgba(138, 149, 242, 0.15) 50.81%, #FFFFFF 99.33%)",
                boxShadow: "0px 0px 14.3px 0px rgba(138, 149, 242, 0.35)",
              }}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-heading text-xl 3xl:text-2xl font-semibold text-slate-900">
                    Premium Plan
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 font-body text-xs font-semibold text-slate-600">
                    Coming Soon
                  </span>
                </div>

                {/* Price */}
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="font-heading text-4xl sm:text-5xl 3xl:text-[56px] font-semibold tracking-tight text-slate-900">
                    $10
                  </span>
                  <span className="font-body text-sm font-normal text-[#878787]">
                    / project
                  </span>
                </div>

                {/* Features List */}
                <motion.ul
                  variants={shouldReduceMotion ? undefined : listVariants}
                  className="mt-7 space-y-3.5 font-body text-sm 3xl:text-[15px] text-[#878787]"
                >
                  {premiumFeatures.map((feat) => (
                    <motion.li
                      key={feat}
                      variants={shouldReduceMotion ? undefined : itemVariants}
                      className="flex items-center gap-3"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-400 shrink-0" />
                      <span>{feat}</span>
                    </motion.li>
                  ))}
                </motion.ul>
              </div>

              {/* Waitlist Button */}
              <div className="mt-6 pt-2">
                <button
                  type="button"
                  onClick={() => setWaitlistJoined(true)}
                  className="flex min-h-[48px] h-12 w-full items-center justify-center rounded-xl bg-cta-gradient bg-gradient-to-r from-[#245FD4] to-[#022977] font-body text-sm font-semibold text-white shadow-none transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 [@media(hover:hover)]:hover:opacity-95 active:scale-[0.98]"
                >
                  {waitlistJoined ? "Added to Waitlist!" : "Join the Waitlist"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

