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

// Underline link styling with 44px tap row below 1024 and expanding left-to-right underline
const linkHoverClasses =
  "group relative inline-flex min-h-[44px] min-w-[44px] items-center font-body text-[15px] sm:text-base lg:text-[18px] lg:min-h-0 lg:min-w-0 font-normal leading-[100%] tracking-normal text-[#353A3E] transition-colors hover:text-brand 3xl:text-[20px] after:absolute after:bottom-1.5 lg:after:bottom-[-2px] after:left-0 after:h-[1.5px] after:w-full after:origin-left after:scale-x-0 after:bg-brand after:transition-transform after:duration-250 after:ease-out hover:after:scale-x-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand";

const legalLinkHoverClasses =
  "group relative inline-flex min-h-[44px] min-w-[44px] lg:min-h-0 lg:min-w-0 items-center hover:text-brand transition-colors 3xl:text-[15px] after:absolute after:bottom-1 lg:after:bottom-[-2px] after:left-0 after:h-[1.5px] after:w-full after:origin-left after:scale-x-0 after:bg-brand after:transition-transform after:duration-250 after:ease-out hover:after:scale-x-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand";

export default function Footer() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <footer
      className="bg-[#FCFCFC] pt-14 sm:pt-16 lg:pt-20 font-body text-slate-600"
      style={{
        paddingBottom: "max(1.5rem, env(safe-area-inset-bottom, 1.5rem))",
      }}
    >
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 xl:px-12 3xl:max-w-[1600px]">
        {/* Brand Header: Left-aligned on mobile & tablet, centered on desktop (>=1024) */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={MOTION_VIEWPORT}
          transition={{ duration: 0.5, ease: EASE_OUT_CUBIC }}
          className="flex flex-col items-start text-left lg:items-center lg:text-center"
        >
          <Link
            href="/"
            className="inline-flex min-h-[44px] min-w-[44px] items-center gap-2.5 transition hover:opacity-90"
          >
            <Image
              src="/logo.svg"
              alt="Sig Signature logo"
              width={54}
              height={30}
              className="h-8 w-auto"
            />
            <span className="font-heading text-2xl font-semibold text-[#022977] 3xl:text-3xl">
              Sig Signature
            </span>
          </Link>
          <p className="mt-3 max-w-lg text-left font-body text-[14px] leading-normal text-[#878787] sm:max-w-xl lg:max-w-none lg:text-center lg:whitespace-nowrap 3xl:text-[16px]">
            Professional email signatures ensure every email reflects a consistent and professional brand identity.
          </p>
        </motion.div>

        {/* 3 Navigation Groups:
            - Below 640: 2 columns (Products, Company in row 1; Resources col-span-2 underneath)
            - 640 to 1023: 3 columns
            - 1024+: Desktop layout matching Figma exactly
         */}
        <motion.div
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView={shouldReduceMotion ? undefined : "visible"}
          viewport={MOTION_VIEWPORT}
          variants={shouldReduceMotion ? undefined : footerContainerVariants}
          className="mt-10 grid grid-cols-2 gap-8 sm:grid-cols-3 sm:gap-10 sm:mt-12 lg:flex lg:flex-row lg:items-start lg:justify-around lg:gap-14 3xl:gap-20"
        >
          {/* Products Group */}
          <motion.div
            variants={shouldReduceMotion ? undefined : columnVariants}
            className="flex flex-col items-start text-left lg:items-center lg:text-center"
          >
            <h4 className="font-body text-sm font-semibold tracking-tight text-black sm:text-base lg:text-[24px] lg:font-medium lg:leading-[100%] lg:tracking-normal 3xl:text-[27px]">
              Products
            </h4>
            <div className="mt-2 flex flex-col items-start sm:mt-3 lg:mt-5 lg:flex-row lg:flex-wrap lg:items-center lg:justify-center lg:gap-7">
              <Link href="/#features" className={linkHoverClasses}>
                Features
              </Link>
              <Link href="/#pricing" className={linkHoverClasses}>
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
            className="flex flex-col items-start text-left lg:items-center lg:text-center"
          >
            <h4 className="font-body text-sm font-semibold tracking-tight text-black sm:text-base lg:text-[24px] lg:font-medium lg:leading-[100%] lg:tracking-normal 3xl:text-[27px]">
              Company
            </h4>
            <div className="mt-2 flex flex-col items-start sm:mt-3 lg:mt-5 lg:flex-row lg:flex-wrap lg:items-center lg:justify-center lg:gap-7">
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
            className="col-span-2 flex flex-col items-start text-left sm:col-span-1 lg:items-center lg:text-center"
          >
            <h4 className="font-body text-sm font-semibold tracking-tight text-black sm:text-base lg:text-[24px] lg:font-medium lg:leading-[100%] lg:tracking-normal 3xl:text-[27px]">
              Resources
            </h4>
            <div className="mt-2 flex flex-col items-start sm:mt-3 lg:mt-5 lg:flex-row lg:flex-wrap lg:items-center lg:justify-center lg:gap-7">
              <Link href="/#features" className={linkHoverClasses}>
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

        {/* Social Media Icons (30px circles matching Figma) */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={MOTION_VIEWPORT}
          transition={{ duration: 0.45, delay: shouldReduceMotion ? 0 : 0.25, ease: EASE_OUT_CUBIC }}
          className="mt-8 flex justify-center gap-[10px] sm:mt-10"
        >
          {/* Facebook */}
          <a
            href="https://www.facebook.com/profile.php?id=61595216736684"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="footer-social-btn before:absolute before:-inset-2 before:content-[''] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            <span
              className="font-heading text-[13px] font-bold leading-none select-none text-[#022977]"
              style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
            >
              f
            </span>
          </a>

          {/* Instagram */}
          <a
            href="https://www.instagram.com/sigsignature_com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="footer-social-btn before:absolute before:-inset-2 before:content-[''] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            <svg
              className="h-3.5 w-3.5 text-[#022977]"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.8"
              stroke="currentColor"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1.25" fill="currentColor" stroke="none" />
            </svg>
          </a>

          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com/showcase/sig-signature"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="footer-social-btn before:absolute before:-inset-2 before:content-[''] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            <span
              className="font-heading text-[11px] font-bold leading-none tracking-tight select-none text-[#022977]"
              style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
            >
              in
            </span>
          </a>
        </motion.div>
      </div>

      {/* FULL WIDTH Horizontal Divider Line */}
      <div className="mt-10 sm:mt-12 w-full border-t border-[#D7D7D7]" />

      {/* Bottom Legal & Copyright Bar: stacked on phones, split on tablets & desktop */}
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 xl:px-12 py-6 3xl:max-w-[1600px]">
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


