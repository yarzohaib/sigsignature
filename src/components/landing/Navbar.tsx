"use client";

import { useState,useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Background layer: invisible at the top, fades in (with border and blur) once the page scrolls */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 -z-10 border-b border-[#C1C1C1]/60 bg-[#FCFCFC]/90 backdrop-blur-md transition-opacity duration-300 ease-out motion-reduce:transition-none ${
          scrolled ? "opacity-100" : "opacity-0"
        }`}
      />

      <div className="mx-auto flex h-16 sm:h-18 max-w-[1400px] items-center justify-between px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Brand Logo pointing back to landing page */}
        <Link
          href="/"
          className="flex items-center gap-2.5 transition hover:opacity-90"
        >
          <Image
            src="/logo.svg"
            alt="Sig Signature logo"
            width={48}
            height={26}
            className="h-7 w-auto sm:h-8"
            priority
          />
          <span className="font-heading text-lg font-semibold text-brand-dark sm:text-xl">
            Sig Signature
          </span>
        </Link>

        {/* Desktop Navigation Links (Lighter shade matching Figma) */}
        <nav className="hidden items-center gap-10 md:flex">
          <Link
            href="/#features"
            className="font-body text-[15px] font-normal text-[#2D2D2D] transition hover:text-brand"
          >
            Features
          </Link>
          <Link
            href="/#how-it-works"
            className="font-body text-[15px] font-normal text-[#2D2D2D] transition hover:text-brand"
          >
            How It Works
          </Link>
          <Link
            href="/#pricing"
            className="font-body text-[15px] font-normal text-[#2D2D2D] transition hover:text-brand"
          >
            Pricing
          </Link>
        </nav>

        {/* Desktop Action Buttons */}
        <div className="hidden items-center gap-6 md:flex">
          <Link
            href="/login"
            className="font-body text-[15px] font-normal text-[#000000] transition hover:text-brand"
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-cta-gradient bg-gradient-to-r from-[#245FD4] to-[#022977] px-6 py-2.5 font-body text-sm font-semibold text-white shadow-none transition hover:opacity-95"
          >
            Start Free
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#C1C1C1] text-slate-700 hover:bg-slate-50 md:hidden"
        >
          {mobileMenuOpen ? (
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="border-b border-[#C1C1C1] bg-[#FCFCFC] px-4 pt-3 pb-6 shadow-md md:hidden">
          <nav className="flex flex-col gap-3">
            <Link
              href="/#features"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-md px-3 py-2 font-body text-base font-normal text-[#5A5A5A] hover:bg-slate-50 hover:text-brand"
            >
              Features
            </Link>
            <Link
              href="/#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-md px-3 py-2 font-body text-base font-normal text-[#5A5A5A] hover:bg-slate-50 hover:text-brand"
            >
              How It Works
            </Link>
            <Link
              href="/#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-md px-3 py-2 font-body text-base font-normal text-[#5A5A5A] hover:bg-slate-50 hover:text-brand"
            >
              Pricing
            </Link>
            <div className="mt-3 flex flex-col gap-2 border-t border-slate-200 pt-4">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex h-11 items-center justify-center rounded-xl border border-[#C1C1C1] font-body text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="flex h-11 items-center justify-center rounded-xl bg-cta-gradient bg-gradient-to-r from-[#245FD4] to-[#022977] font-body text-sm font-semibold text-white transition hover:opacity-95"
              >
                Start Free
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}