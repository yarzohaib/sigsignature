"use client";

import { useState } from "react";
import Link from "next/link";
import SectionBadge from "./SectionBadge";

export default function PricingSection() {
  const [waitlistJoined, setWaitlistJoined] = useState(false);

  return (
    <section id="pricing" className="scroll-mt-24 bg-[#FCFCFC] py-16 sm:py-24">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Section Header */}
        <div className="text-center">
          <SectionBadge label="PRICING" className="mb-4" />
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl lg:text-[54px] lg:leading-[1.12]">
            Transparent Pricing,{" "}
            <span className="text-[#1243A3]">Start Free.</span>
          </h2>
        </div>

        {/* Pricing Cards: Portrait rectangles, reduced heights, Premium taller than Free */}
        <div className="mx-auto mt-12 flex flex-col items-center justify-center gap-7 sm:mt-16 md:flex-row md:items-center lg:gap-8">
          {/* Free Plan Card: Vertical rectangle (min-h-[460px], max-w-[350px]) */}
          <div
            className="relative flex w-full max-w-[350px] min-h-[460px] flex-col justify-between rounded-[12px] border border-[#C1C1C1] bg-pricing-free p-6 sm:p-7 shadow-xs transition hover:border-brand/40"
            style={{
              background: "linear-gradient(146.72deg, #FFFFFF 1.16%, rgba(196, 223, 251, 0.5) 50.81%, #FFFFFF 99.33%)",
            }}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-heading text-lg font-semibold text-slate-900">
                  Free Plan
                </span>
                <span className="rounded-full bg-blue-100 px-3 py-1 font-body text-xs font-semibold text-brand">
                  Recommended
                </span>
              </div>

              {/* Price */}
              <div className="mt-5 flex items-baseline gap-1">
                <span className="font-heading text-4xl sm:text-5xl font-semibold tracking-tight text-slate-900">
                  $0
                </span>
                <span className="font-body text-sm font-normal text-[#878787]">
                  / Forever
                </span>
              </div>

              {/* Features List */}
              <ul className="mt-6 space-y-3 font-body text-sm text-[#878787]">
                <li className="flex items-center gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand shrink-0" />
                  <span>Create up to 3 professional signatures</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand shrink-0" />
                  <span>Access starter templates</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand shrink-0" />
                  <span>Production-ready HTML export</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand shrink-0" />
                  <span>High-quality image export</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand shrink-0" />
                  <span>Real-time live preview</span>
                </li>
              </ul>
            </div>

            {/* CTA Button */}
            <div className="mt-6 pt-2">
              <Link
                href="/signup"
                className="flex h-11 sm:h-12 w-full items-center justify-center rounded-xl bg-cta-gradient bg-gradient-to-r from-[#245FD4] to-[#022977] font-body text-sm font-semibold text-white shadow-none transition hover:opacity-95"
              >
                Lets Start
              </Link>
            </div>
          </div>

          {/* Premium Plan Card: Taller vertical rectangle (min-h-[520px], max-w-[370px]), glowing shadow */}
          <div
            className="relative flex w-full max-w-[370px] min-h-[520px] flex-col justify-between rounded-[12px] border border-[#8A95F2]/40 bg-pricing-premium p-7 sm:p-8 shadow-pricing-premium transition hover:border-[#8A95F2]/70"
            style={{
              background: "linear-gradient(146.72deg, #FFFFFF 1.16%, rgba(138, 149, 242, 0.15) 50.81%, #FFFFFF 99.33%)",
              boxShadow: "0px 0px 14.3px 0px rgba(138, 149, 242, 0.35)",
            }}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-heading text-xl font-semibold text-slate-900">
                  Premium Plan
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 font-body text-xs font-semibold text-slate-600">
                  Coming Soon
                </span>
              </div>

              {/* Price */}
              <div className="mt-6 flex items-baseline gap-1">
                <span className="font-heading text-4xl sm:text-5xl font-semibold tracking-tight text-slate-900">
                  $10
                </span>
                <span className="font-body text-sm font-normal text-[#878787]">
                  / project
                </span>
              </div>

              {/* Features List */}
              <ul className="mt-7 space-y-3.5 font-body text-sm text-[#878787]">
                <li className="flex items-center gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-400 shrink-0" />
                  <span>Unlimited signature creation</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-400 shrink-0" />
                  <span>Exclusive premium templates</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-400 shrink-0" />
                  <span>Manage your entire team in one place</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-400 shrink-0" />
                  <span>Priority support &amp; faster assistance</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-400 shrink-0" />
                  <span>Advanced customization tools</span>
                </li>
              </ul>
            </div>

            {/* Waitlist Button */}
            <div className="mt-6 pt-2">
              <button
                type="button"
                onClick={() => setWaitlistJoined(true)}
                className="flex h-11 sm:h-12 w-full items-center justify-center rounded-xl bg-cta-gradient bg-gradient-to-r from-[#245FD4] to-[#022977] font-body text-sm font-semibold text-white shadow-none transition hover:opacity-95"
              >
                {waitlistJoined ? "Added to Waitlist! ✓" : "Join the Waitlist"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
