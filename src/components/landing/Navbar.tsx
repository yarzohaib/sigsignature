"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidePill, setHidePill] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const prevOpenRef = useRef(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          setScrolled(currentScrollY > 8);

          // Fast scroll down detection below md
          const deltaY = currentScrollY - lastScrollY;
          if (deltaY > 10 && currentScrollY > 60) {
            setHidePill(true);
          } else if (deltaY < -4 || currentScrollY <= 20) {
            setHidePill(false);
          }

          lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close when viewport expands past md breakpoint (768px)
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 768px)");
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setMobileMenuOpen(false);
      }
    };
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  // Close on Escape key press
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileMenuOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [mobileMenuOpen]);

  // Return focus to the hamburger button when mobile menu closes
  useEffect(() => {
    if (prevOpenRef.current && !mobileMenuOpen) {
      buttonRef.current?.focus();
    }
    prevOpenRef.current = mobileMenuOpen;
  }, [mobileMenuOpen]);

  return (
    <>
      {/* =========================================================================
          1. MOBILE FLOATING PILL (< 768px)
          - Inset 12px from top & sides (+ safe-area insets)
          - Fully rounded, translucent backdrop-blur pill
          - Subtle at top, opaque with soft shadow after >8px scroll
          - 44px tap target hamburger button (no border)
          - Animated fade/scale dropdown panel (180ms)
         ========================================================================= */}
      <div
        className={`fixed z-50 md:hidden pointer-events-none transition-transform duration-300 ease-out ${
          hidePill && !mobileMenuOpen ? "-translate-y-28" : "translate-y-0"
        }`}
        style={{
          top: "calc(12px + env(safe-area-inset-top, 0px))",
          left: "calc(12px + env(safe-area-inset-left, 0px))",
          right: "calc(12px + env(safe-area-inset-right, 0px))",
        }}
      >
        <div
          className={`pointer-events-auto flex h-[52px] w-full items-center justify-between rounded-full px-4 transition-all duration-300 ease-out ${
            scrolled || mobileMenuOpen
              ? "border border-slate-200/80 bg-white/95 shadow-[0_8px_24px_rgba(0,0,0,0.08)] backdrop-blur-md"
              : "border border-white/40 bg-white/50 shadow-none backdrop-blur-sm"
          }`}
        >
          {/* Mobile Logo & Wordmark */}
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex min-h-[44px] min-w-[44px] items-center gap-2 transition hover:opacity-90"
          >
            <Image
              src="/logo.svg"
              alt="Sig Signature logo"
              width={40}
              height={22}
              className="h-6 w-auto"
              priority
            />
            <span className="font-heading text-base font-semibold text-brand-dark">
              Sig Signature
            </span>
          </Link>

          {/* Mobile Hamburger Toggle (44px tap target, borderless) */}
          <button
            ref={buttonRef}
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-panel"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            className="flex h-11 w-11 items-center justify-center rounded-full text-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand hover:bg-black/5 active:bg-black/10"
          >
            {mobileMenuOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Dropdown Panel: 24px radius, soft shadow, 180ms fade & scale */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              id="mobile-nav-panel"
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: -6 }}
              animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: -6 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="pointer-events-auto mt-2.5 w-full rounded-[24px] border border-slate-200/80 bg-white/95 p-3.5 shadow-[0_16px_36px_rgba(0,0,0,0.12)] backdrop-blur-xl"
            >
              <nav className="flex flex-col">
                <Link
                  href="/#features"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex min-h-[48px] items-center rounded-xl px-3 font-body text-base font-medium text-slate-800 transition-colors hover:bg-slate-100/80 hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                >
                  Features
                </Link>
                <Link
                  href="/#how-it-works"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex min-h-[48px] items-center rounded-xl px-3 font-body text-base font-medium text-slate-800 transition-colors hover:bg-slate-100/80 hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                >
                  How It Works
                </Link>
                <Link
                  href="/#pricing"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex min-h-[48px] items-center rounded-xl px-3 font-body text-base font-medium text-slate-800 transition-colors hover:bg-slate-100/80 hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                >
                  Pricing
                </Link>

                <div className="mt-2.5 flex flex-col gap-2 border-t border-slate-200/80 pt-3">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex min-h-[48px] items-center justify-center rounded-xl border border-[#C1C1C1] font-body text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex min-h-[48px] items-center justify-center rounded-xl bg-cta-gradient bg-gradient-to-r from-[#245FD4] to-[#022977] font-body text-sm font-semibold text-white shadow-sm transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                  >
                    Start Free
                  </Link>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Backdrop for Outside Click */}
      {mobileMenuOpen && (
        <div
          aria-hidden="true"
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px] transition-opacity md:hidden"
        />
      )}

      {/* =========================================================================
          2. DESKTOP NAVBAR (>= 768px md)
          - HARD RULE: At 768px and up (and especially 1024+), matches existing desktop exactly!
         ========================================================================= */}
      <header className="sticky top-0 z-50 hidden w-full md:block">
        {/* Background layer: invisible at the top, fades in once scrolled */}
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-0 -z-10 border-b border-[#C1C1C1]/60 bg-[#FCFCFC]/90 backdrop-blur-md transition-opacity duration-300 ease-out motion-reduce:transition-none ${
            scrolled ? "opacity-100" : "opacity-0"
          }`}
        />

        <div className="mx-auto flex h-16 sm:h-18 max-w-[1400px] items-center justify-between px-4 sm:px-6 lg:px-8 xl:px-12 3xl:max-w-[1600px]">
          {/* Brand Logo pointing back to landing page */}
          <Link
            href="/"
            className="flex items-center gap-2.5 transition hover:opacity-90 min-h-[44px] min-w-[44px]"
          >
            <Image
              src="/logo.svg"
              alt="Sig Signature logo"
              width={48}
              height={26}
              className="h-7 w-auto sm:h-8"
              priority
            />
            <span className="font-heading text-lg font-semibold text-brand-dark sm:text-xl 3xl:text-2xl">
              Sig Signature
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="flex items-center gap-10">
            <Link
              href="/#features"
              className="font-body text-[15px] 3xl:text-[17px] font-normal text-[#2D2D2D] transition hover:text-brand min-h-[44px] flex items-center"
            >
              Features
            </Link>
            <Link
              href="/#how-it-works"
              className="font-body text-[15px] 3xl:text-[17px] font-normal text-[#2D2D2D] transition hover:text-brand min-h-[44px] flex items-center"
            >
              How It Works
            </Link>
            <Link
              href="/#pricing"
              className="font-body text-[15px] 3xl:text-[17px] font-normal text-[#2D2D2D] transition hover:text-brand min-h-[44px] flex items-center"
            >
              Pricing
            </Link>
          </nav>

          {/* Desktop Action Buttons */}
          <div className="flex items-center gap-6">
            <Link
              href="/login"
              className="font-body text-[15px] 3xl:text-[17px] font-normal text-[#000000] transition hover:text-brand min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-cta-gradient bg-gradient-to-r from-[#245FD4] to-[#022977] px-6 py-2.5 min-h-[44px] inline-flex items-center justify-center font-body text-sm 3xl:text-base font-semibold text-white shadow-none transition hover:opacity-95"
            >
              Start Free
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}