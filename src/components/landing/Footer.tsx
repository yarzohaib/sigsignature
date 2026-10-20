"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { EASE_OUT_CUBIC, MOTION_VIEWPORT } from "@/components/motion/motionConfig";

const footerContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const columnVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: EASE_OUT_CUBIC,
    },
  },
};

// Underline link styling that expands smoothly from left to right on hover without layout shift
const linkHoverClasses =
  "group relative inline-block font-body text-sm sm:text-base lg:text-[18px] font-normal leading-[100%] tracking-normal text-center text-[#353A3E] transition-colors hover:text-brand after:absolute after:bottom-[-2px] after:left-0 after:h-[1.5px] after:w-full after:origin-left after:scale-x-0 after:bg-brand after:transition-transform after:duration-250 after:ease-out hover:after:scale-x-100";

const legalLinkHoverClasses =
  "group relative inline-block hover:text-brand transition-colors after:absolute after:bottom-[-2px] after:left-0 after:h-[1.5px] after:w-full after:origin-left after:scale-x-0 after:bg-brand after:transition-transform after:duration-250 after:ease-out hover:after:scale-x-100";

export default function Footer() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <footer className="bg-[#FCFCFC] pt-16 font-body text-slate-600">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Brand Header */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={MOTION_VIEWPORT}
          transition={{ duration: 0.5, ease: EASE_OUT_CUBIC }}
          className="flex flex-col items-center text-center"
        >
          <Link
            href="#"
            className="inline-flex items-center gap-2.5 transition hover:opacity-90"
          >
            <Image
              src="/logo.svg"
              alt="Sig Signature logo"
              width={54}
              height={30}
              className="h-8 w-auto"
            />
            <span className="font-heading text-2xl font-semibold text-[#022977]">
              Sig Signature
            </span>
          </Link>
          <p className="mt-3 max-w-none text-center font-body text-[14px] leading-normal text-[#878787] sm:whitespace-nowrap">
            Professional email signatures ensure every email reflects a consistent and professional brand identity.
          </p>
        </motion.div>

        {/* 3 Horizontal Navigation Groups Matching Figma */}
        <motion.div
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView={shouldReduceMotion ? undefined : "visible"}
          viewport={MOTION_VIEWPORT}
          variants={shouldReduceMotion ? undefined : footerContainerVariants}
          className="mt-12 flex flex-col items-center justify-center gap-10 md:flex-row md:items-start md:justify-around lg:gap-14"
        >
          {/* Products Group */}
          <motion.div
            variants={shouldReduceMotion ? undefined : columnVariants}
            className="flex flex-col items-center text-center"
          >
            <h4 className="font-body text-xl sm:text-2xl lg:text-[24px] font-medium leading-[100%] tracking-normal text-black">
              Products
            </h4>
            <div className="mt-4 sm:mt-5 flex flex-wrap items-center justify-center gap-4 sm:gap-6 lg:gap-7">
              <Link href="#features" className={linkHoverClasses}>
                Features
              </Link>
              <Link href="#pricing" className={linkHoverClasses}>
                Pricing
              </Link>
              <Link href="/login" className={linkHoverClasses}>
                Login
              </Link>
              <Link href="/signup" className={linkHoverClasses}>
                Sign Up
              </Link>
            </div>
          </motion.div>

          {/* Company Group */}
          <motion.div
            variants={shouldReduceMotion ? undefined : columnVariants}
            className="flex flex-col items-center text-center"
          >
            <h4 className="font-body text-xl sm:text-2xl lg:text-[24px] font-medium leading-[100%] tracking-normal text-black">
              Company
            </h4>
            <div className="mt-4 sm:mt-5 flex flex-wrap items-center justify-center gap-4 sm:gap-6 lg:gap-7">
              <Link href="/about" className={linkHoverClasses}>
                About
              </Link>
              <Link href="/team" className={linkHoverClasses}>
                Team
              </Link>
              <Link href="/contact" className={linkHoverClasses}>
                Contact Us
              </Link>
              <Link href="/updates" className={linkHoverClasses}>
                Updates
              </Link>
            </div>
          </motion.div>

          {/* Resources Group */}
          <motion.div
            variants={shouldReduceMotion ? undefined : columnVariants}
            className="flex flex-col items-center text-center"
          >
            <h4 className="font-body text-xl sm:text-2xl lg:text-[24px] font-medium leading-[100%] tracking-normal text-black">
              Resources
            </h4>
            <div className="mt-4 sm:mt-5 flex flex-wrap items-center justify-center gap-4 sm:gap-6 lg:gap-7">
              <Link href="#features" className={linkHoverClasses}>
                Email Signature
              </Link>
              <Link href="/templates" className={linkHoverClasses}>
                Templates
              </Link>
              <Link href="/signup" className={linkHoverClasses}>
                Free Signature
              </Link>
            </div>
          </motion.div>
        </motion.div>

        {/* Social Media Icons */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={MOTION_VIEWPORT}
          transition={{ duration: 0.45, delay: shouldReduceMotion ? 0 : 0.25, ease: EASE_OUT_CUBIC }}
          className="mt-10 flex justify-center gap-4"
        >
          {/* Facebook */}
          <a
            href="https://www.facebook.com/profile.php?id=61595216736684"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#C1C1C1] text-slate-700 transition hover:border-brand hover:text-brand hover:scale-110 active:scale-95"
          >
            <span className="font-heading text-xs font-bold">f</span>
          </a>

          {/* Instagram */}
          <a
            href="https://www.instagram.com/sigsignature_com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#C1C1C1] text-slate-700 transition hover:border-brand hover:text-brand hover:scale-110 active:scale-95"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.8"
              stroke="currentColor"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
          </a>

          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com/showcase/sig-signature"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#C1C1C1] text-slate-700 transition hover:border-brand hover:text-brand hover:scale-110 active:scale-95"
          >
            <span className="font-heading text-xs font-bold">in</span>
          </a>
        </motion.div>
      </div>

      {/* FULL WIDTH Horizontal Divider Line */}
      <div className="mt-12 w-full border-t border-[#D7D7D7]" />

      {/* Bottom Legal & Copyright Bar */}
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 xl:px-12 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-xs sm:text-sm text-[#878787]">
          <p>© 2026 Sig Signature. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/terms" className={legalLinkHoverClasses}>
              Terms of Service
            </Link>
            <Link href="/privacy" className={legalLinkHoverClasses}>
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

