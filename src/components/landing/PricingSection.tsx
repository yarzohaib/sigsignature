"use client";

import { useState } from "react";
import Link from "next/link";
import { getStoredToken } from "@/app/lib/auth";
import { motion, useReducedMotion, type Variants } from "motion/react";
import SectionBadge from "./SectionBadge";
import Reveal from "@/components/motion/Reveal";
import { EASE_OUT_CUBIC, MOTION_VIEWPORT } from "@/components/motion/motionConfig";

const freeFeatures = [
  "Create up to 3 professional signatures",
  "Access starter templates",
  "HTML signature export",
  "High-quality image export",
  "Real-time live preview",
];

const premiumFeatures = [
  "Unlimited signature creation",
  "Exclusive premium templates",
  "Manage your entire team in one place",
  "Priority support & faster assistance",
  "Advanced customization tools",
  "Multi-signature profile switching",
];

// Premium card: Featured hero card enters first in the stagger
const premiumCardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
    scale: 0.98,
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

// Free card enters with standard baseline scale
const freeCardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.55,
      delay: 0.2,
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
  const [premiumToast, setPremiumToast] = useState<string | null>(null);
  const [isAuthenticated] = useState(() => Boolean(getStoredToken()));
  const shouldReduceMotion = useReducedMotion();

  function handleGoPremium() {
    setPremiumToast("Premium tier checkout is launching soon! Stay tuned.");
    window.setTimeout(() => setPremiumToast(null), 4000);
  }

  return (
    <section id="pricing" className="scroll-mt-18 sm:scroll-mt-20 bg-[#FCFCFC] py-14 sm:py-16 lg:py-24 3xl:py-28">
      {premiumToast && (
        <div
          role="status"
          className="fixed right-6 top-6 z-[60] flex items-center gap-3 rounded-xl border border-blue-200 bg-white px-4 py-3 shadow-lg"
        >
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#EFF6FF] text-[#245FD4]" aria-hidden="true">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-xs font-medium text-[#1E293B] sm:text-sm">{premiumToast}</p>
          <button
            type="button"
            onClick={() => setPremiumToast(null)}
            className="ml-2 cursor-pointer text-slate-400 hover:text-slate-600"
            aria-label="Dismiss message"
          >
            &times;
          </button>
        </div>
      )}
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-12 2xl:max-w-[1536px] 3xl:max-w-[1720px]">
        {/* Section Header */}
        <div className="text-center">
          <Reveal y={16} blur={6} className="mb-2.5 sm:mb-3 inline-block">
            <SectionBadge label="PRICING" />
          </Reveal>
          <Reveal y={24} blur={8} delay={0.1}>
            <h2 className="font-heading text-[clamp(1.8rem,1.125rem+2.25vw,2.7rem)] lg:text-[43px] xl:text-[49px] 2xl:text-[56px] 3xl:text-[61px] lg:leading-[1.12] font-semibold tracking-tight text-slate-900 leading-tight [text-wrap:balance]">
              Start with a Free{" "}
              <span className="text-[#1243A3]">Email Signature Plan</span>
            </h2>
          </Reveal>
        </div>

        {/* Pricing Cards: Portrait rectangles, elevated Premium hero card */}
        <div
          id="pricing-cards"
          className="mx-auto mt-7 sm:mt-9 lg:mt-11 flex flex-col items-center justify-center gap-6 sm:gap-7 md:flex-row md:items-center lg:gap-8 xl:gap-10 scroll-mt-20 md:scroll-mt-24"
        >
          {/* Free Plan Card: Vertical rectangle (standard baseline height, max-w-[420px]) */}
          <motion.div
            initial={shouldReduceMotion ? false : "hidden"}
            whileInView={shouldReduceMotion ? undefined : "visible"}
            viewport={MOTION_VIEWPORT}
            variants={shouldReduceMotion ? undefined : freeCardVariants}
            className="flex w-full max-w-[495px] mx-auto md:mx-0 justify-center"
          >
            <div
              className="relative flex w-full min-h-[540px] flex-col justify-start rounded-[24px] border border-[#E2E8F0] bg-white p-[26px] shadow-none transition-colors duration-200 [@media(hover:hover)]:hover:border-[#C8D8FA]"
              style={{
                fontFamily: "var(--font-commissioner), Commissioner, sans-serif",
              }}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-heading text-[20px] font-semibold text-[#101828]">
                    Basic
                  </span>
                </div>

                {/* Price */}
                <div className="mt-2.5 flex items-baseline gap-1.5">
                  <span className="font-heading text-[42px] font-bold leading-none tracking-tight text-[#101828]">
                    $0
                  </span>
                  <span className="text-[14px] text-[#64748B]">
                    /month
                  </span>
                </div>

                <p className="mt-2 text-[14px] text-[#64748B]">Try us out first</p>

                <div className="mt-6">
                  <Link href={isAuthenticated ? "/dashboard" : "/signup"} className="flex h-[46px] w-full items-center justify-center rounded-full bg-[#F1F5F9] text-[14px] font-semibold text-[#101828] transition-colors hover:bg-[#E8EEF6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2">
                    {isAuthenticated ? "Go to Dashboard" : "Create Your Free Signature"}
                  </Link>
                </div>

                <div className="mt-6 w-full border-t border-[#F1F5F9]" />

                {/* Features List */}
                <motion.ul
                  variants={shouldReduceMotion ? undefined : listVariants}
                  className="mt-6 flex flex-col gap-3.5 sm:gap-[18px] text-[13.5px] sm:text-[14px] text-[#475467]"
                >
                  {freeFeatures.map((feat) => (
                    <motion.li
                      key={feat}
                      variants={shouldReduceMotion ? undefined : itemVariants}
                      className="flex items-center gap-3"
                    >
                      <svg className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="10" cy="10" r="9" stroke="#93C5FD" strokeWidth="1.5" /><path d="M6.5 10.2L8.8 12.5L13.5 7.8" stroke="#245FD4" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      <span>{feat}</span>
                    </motion.li>
                  ))}
                </motion.ul>
              </div>

            </div>
          </motion.div>

          {/* Premium Plan Card: Hero card elevated vertically, taller (min-h-[550px], max-w-[463px]), frosted glowing shadow */}
          <motion.div
            initial={shouldReduceMotion ? false : "hidden"}
            whileInView={shouldReduceMotion ? undefined : "visible"}
            viewport={MOTION_VIEWPORT}
            variants={shouldReduceMotion ? undefined : premiumCardVariants}
            className="flex w-full max-w-[495px] mx-auto md:mx-0 justify-center z-10"
          >
            <div
              className="relative flex w-full min-h-[540px] flex-col justify-start rounded-[24px] border-[3px] border-[#3565E8] bg-white p-[23px] shadow-none"
              style={{
                fontFamily: "var(--font-commissioner), Commissioner, sans-serif",
              }}
            >
              <div className="absolute -top-[14px] left-1/2 z-10 inline-flex -translate-x-1/2 items-center rounded-full bg-[#1A4FD8] px-5 py-1.5 shadow-xs whitespace-nowrap">
                <span className="text-[12px] font-semibold tracking-wide text-white" style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>Coming Soon</span>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-heading text-[20px] font-semibold text-[#101828]">
                    Professional
                  </span>
                </div>

                {/* Price */}
                <div className="mt-2.5 flex items-baseline gap-1.5">
                  <span className="font-heading text-[42px] font-bold leading-none tracking-tight text-[#101828]">
                    $10
                  </span>
                  <span className="text-[14px] text-[#64748B]">
                    /month
                  </span>
                </div>

                <p className="mt-2 text-[14px] text-[#64748B]">Good for small businesses and pro users</p>

                <div className="mt-6">
                  <button type="button" onClick={handleGoPremium} className="flex h-[46px] w-full items-center justify-center rounded-full bg-[#245FD4] text-[14px] font-semibold text-white transition-colors hover:bg-[#1A4FD8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2">Go Premium</button>
                </div>

                <div className="mt-6 w-full border-t border-[#F1F5F9]" />

                {/* Features List */}
                <motion.ul
                  variants={shouldReduceMotion ? undefined : listVariants}
                  className="mt-6 flex flex-col gap-3.5 sm:gap-[18px] text-[13.5px] sm:text-[14px] text-[#475467]"
                >
                  {premiumFeatures.map((feat) => (
                    <motion.li
                      key={feat}
                      variants={shouldReduceMotion ? undefined : itemVariants}
                      className="flex items-center gap-3"
                    >
                      <svg className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="10" cy="10" r="9" stroke="#93C5FD" strokeWidth="1.5" /><path d="M6.5 10.2L8.8 12.5L13.5 7.8" stroke="#245FD4" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      <span>{feat}</span>
                    </motion.li>
                  ))}
                </motion.ul>
              </div>

            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

