"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import PricingSkeleton from "@/components/skeletons/PricingSkeleton";
import { getStoredUser, getStoredToken } from "@/app/lib/auth";

function CheckCircleIcon() {
  return (
    <svg
      className="h-5 w-5 shrink-0"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="10" cy="10" r="9" stroke="#93C5FD" strokeWidth="1.5" />
      <path
        d="M6.5 10.2L8.8 12.5L13.5 7.8"
        stroke="#245FD4"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PricingContent() {
  const [premiumToast, setPremiumToast] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [isFreePlanUser, setIsFreePlanUser] = useState(false);

  useEffect(() => {
    const user = getStoredUser();
    const token = getStoredToken();
    if (user || token) {
      setTimeout(() => {
        setIsFreePlanUser(true);
      }, 0);
    }
  }, []);

  function handleGoPremium() {
    setPremiumToast("Premium tier checkout is launching soon! Stay tuned.");
    setTimeout(() => {
      setPremiumToast(null);
    }, 4000);
  }

  return (
    <div className="flex w-full flex-1 flex-col justify-start overflow-y-auto bg-[#F8FAFC] px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-5 xl:px-10 2xl:px-12">
      {/* Toast Notification */}
      {premiumToast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 rounded-xl border border-blue-200 bg-white px-4 py-3 shadow-lg animate-in slide-in-from-top duration-200">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#EFF6FF] text-[#245FD4]">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p
            className="text-xs sm:text-sm font-medium text-[#1E293B]"
            style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
          >
            {premiumToast}
          </p>
          <button
            type="button"
            onClick={() => setPremiumToast(null)}
            className="text-slate-400 hover:text-slate-600 ml-2 cursor-pointer"
          >
            &times;
          </button>
        </div>
      )}

      <main className="flex w-full flex-1 flex-col justify-start gap-6 py-1 sm:gap-8">
            {/* Top Heading Section */}
            <div className="w-full text-left shrink-0 max-w-[1080px] xl:max-w-none">
              <h1 className="page-heading text-[#1E293B]">
                Simple Pricing.
                <span className="block text-[#245FD4]">Powerful Signatures.</span>
              </h1>
              <p
                className="mt-1 text-[14px] sm:text-[15px] text-[#64748B] max-w-2xl leading-relaxed"
                style={{
                  fontFamily: "var(--font-commissioner), Commissioner, sans-serif",
                }}
              >
                Start with the essentials or unlock a more powerful signature workflow. Straightforward plans, with room to grow when you&apos;re ready.
              </p>
            </div>

            {/* Plans Container: Balanced 495px cards with harmonious width and spacing */}
            <div className="grid w-full grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 xl:gap-[clamp(3rem,6vw,8rem)] max-w-[1080px] xl:mx-auto pt-1 items-stretch">
              {/* Basic Plan Card */}
              <div
                className="flex w-full max-w-[495px] flex-col justify-start rounded-[24px] border border-[#E2E8F0] bg-white mx-auto lg:mx-0 xl:mx-auto"
                style={{
                  width: "100%",
                  maxWidth: "495px",
                  minHeight: "540px",
                  padding: "26.5px",
                  borderRadius: "24.28px",
                }}
              >
                <div className="flex h-full w-full flex-col">
                  {/* Title */}
                  <h2
                    className="text-[20px] font-semibold text-[#101828]"
                    style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                  >
                    Basic
                  </h2>

                  {/* Price */}
                  <div className="mt-2.5 flex items-baseline gap-1.5">
                    <span
                      className="text-[42px] font-bold text-[#101828] leading-none tracking-tight"
                      style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                    >
                      $0
                    </span>
                    <span
                      className="text-[14px] text-[#64748B]"
                      style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                    >
                      /month
                    </span>
                  </div>

                  {/* Subtitle */}
                  <p
                    className="mt-2 text-[14px] text-[#64748B]"
                    style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                  >
                    Try us out first
                  </p>

                  {/* Button */}
                  <div className="mt-6">
                    {isFreePlanUser ? (
                      <Link
                        href="/dashboard"
                        className="w-full h-[46px] rounded-full bg-[#F1F5F9] text-[#101828] text-[14px] sm:text-[15px] font-semibold flex items-center justify-center transition-colors hover:bg-[#E2E8F0]"
                        style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                      >
                        Current Plan
                      </Link>
                    ) : (
                      <Link
                        href="/templates"
                        className="w-full h-[46px] rounded-full bg-[#F1F5F9] text-[#101828] text-[14px] sm:text-[15px] font-semibold flex items-center justify-center"
                        style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                      >
                        Get Started
                      </Link>
                    )}
                  </div>

                  {/* Horizontal Divider Line */}
                  <div className="w-full border-t border-[#F1F5F9] mt-6" />

                  {/* Bullets with slightly reduced, cohesive spacing */}
                  <ul
                    className="mt-6 flex flex-col gap-3.5 sm:gap-[18px]"
                    style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                  >
                    {[
                      "3 Personal email signatures",
                      "3 Team member signatures",
                      "Standard minimalist & corporate templates",
                      "1-Click HTML & webmail copy export",
                      "Gmail, Outlook & Apple Mail install support",
                      "Standard community & Help Center support",
                    ].map((feature) => (
                      <li key={feature} className="flex items-center gap-3">
                        <CheckCircleIcon />
                        <span className="text-[13.5px] sm:text-[14px] text-[#475467] leading-snug">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Professional Plan Card */}
              <div
                className="relative flex w-full max-w-[495px] flex-col mx-auto lg:mx-0 xl:mx-auto"
                style={{
                  width: "100%",
                  maxWidth: "495px",
                  minHeight: "540px",
                  padding: "3px",
                  borderRadius: "24.28px",
                  background:
                    "conic-gradient(from 225deg at 50% 50%, #245FD4 0%, #A8CDFC 12%, #2457F0 25%, #89ADFF 37%, #6B8BFF 50%, #2A74FF 62%, #6898F2 75%, #3F72D0 87%, #5389FF 95%, #245FD4 100%)",
                }}
              >
                {/* Coming Soon Badge */}
                <div className="absolute -top-[14px] left-1/2 -translate-x-1/2 z-10 inline-flex items-center rounded-full bg-[#1A4FD8] px-5 py-1.5 shadow-xs whitespace-nowrap">
                  <span
                    className="text-[12px] font-semibold text-white tracking-wide"
                    style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                  >
                    Coming Soon
                  </span>
                </div>

                <div
                  className="flex h-full w-full flex-col justify-start bg-white"
                  style={{
                    height: "100%",
                    minHeight: "534px",
                    padding: "23.5px",
                    borderRadius: "21.28px",
                  }}
                >
                  <div className="flex h-full w-full flex-col">
                    {/* Title */}
                    <h2
                      className="text-[20px] font-semibold text-[#101828]"
                      style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                    >
                      Professional
                    </h2>

                    {/* Price */}
                    <div className="mt-2.5 flex items-baseline gap-1.5">
                      <span
                        className="text-[42px] font-bold text-[#101828] leading-none tracking-tight"
                        style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                      >
                        $10
                      </span>
                      <span
                        className="text-[14px] text-[#64748B]"
                        style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                      >
                        /month
                      </span>
                    </div>

                    {/* Subtitle */}
                    <p
                      className="mt-2 text-[14px] text-[#64748B]"
                      style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                    >
                      Good for small businesses and pro users
                    </p>

                    {/* Button */}
                    <div className="mt-6">
                      <button
                        type="button"
                        onClick={handleGoPremium}
                        className="w-full h-[46px] rounded-full bg-[#245FD4] text-white text-[14px] sm:text-[15px] font-semibold flex items-center justify-center cursor-pointer"
                        style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                      >
                        Start with Plus
                      </button>
                    </div>

                    {/* Horizontal Divider Line */}
                    <div className="w-full border-t border-[#F1F5F9] mt-6" />

                    {/* Bullets with slightly reduced, cohesive spacing */}
                    <ul
                      className="mt-6 flex flex-col gap-3.5 sm:gap-[18px]"
                      style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                    >
                      {[
                        "Unlimited personal signatures",
                        "Unlimited team workspace signatures",
                        "Full access to all premium templates",
                        "2x Retina high-DPI logo CDN hosting",
                        "Outlook MSO Compiler (Zero distortion)",
                        "Priority email & dedicated fast support",
                      ].map((feature) => (
                        <li key={feature} className="flex items-center gap-3">
                          <CheckCircleIcon />
                          <span className="text-[13.5px] sm:text-[14px] text-[#475467] leading-snug">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Questions, answered */}
            <section className="w-full shrink-0 mt-6 sm:mt-8 lg:mt-10 mb-8 max-w-[1080px] xl:max-w-none" aria-labelledby="pricing-faq-heading">
              <div className="mb-6">
                <h2
                  id="pricing-faq-heading"
                  className="text-[26px] sm:text-[30px] lg:text-[34px] font-bold leading-tight tracking-tight text-[#101828]"
                  style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                >
                  Questions, answered.
                </h2>
                <p
                  className="mt-1.5 text-sm sm:text-base text-[#64748B]"
                  style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                >
                  Helpful details to make choosing your plan feel easy.
                </p>
              </div>

              <div className="border-t border-[#E2E8F0] divide-y divide-[#E2E8F0]">
                {[
                  {
                    number: "01",
                    question: "Is there a free plan to get started?",
                    answer:
                      "Yes. You can begin with the Free plan and explore the basic signature creation experience before deciding whether you need more features.",
                  },
                  {
                    number: "02",
                    question: "What changes when I move to Pro?",
                    answer:
                      "Upgrading to Pro unlocks unlimited signature creation, exclusive premium templates, team management capabilities, and priority deliverability support.",
                  },
                  {
                    number: "03",
                    question: "Can I change or cancel my subscription?",
                    answer:
                      "Yes, you can upgrade, downgrade, or cancel your subscription at any time directly from your billing settings. You will retain full access until the end of your billing cycle.",
                  },
                  {
                    number: "04",
                    question: "Can my team use Sig Signature too?",
                    answer:
                      "Yes! With team management on our paid plan, you can standardize corporate branding, assign templates, and manage signatures for your entire organization in one place.",
                  },
                ].map((item, index) => {
                  const isOpen = openFaq === index;
                  const answerId = `pricing-faq-answer-${index}`;

                  return (
                    <article key={item.number} className="py-4 sm:py-5">
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={answerId}
                        onClick={() => setOpenFaq(isOpen ? null : index)}
                        className="group flex w-full items-start justify-between gap-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#245FD4] focus-visible:ring-offset-2 rounded-lg cursor-pointer"
                      >
                        <div className="flex items-start gap-4 sm:gap-6 min-w-0 pr-2">
                          <span
                            className="text-[14px] sm:text-[15px] font-medium text-[#94A3B8] shrink-0 pt-0.5"
                            style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                          >
                            {item.number}
                          </span>
                          <h3
                            className="text-[15px] sm:text-[16px] lg:text-[17px] font-semibold text-[#101828] leading-snug"
                            style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                          >
                            {item.question}
                          </h3>
                        </div>

                        <div className="shrink-0 pt-0.5">
                          <div
                            className={`flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full transition-all duration-300 ease-out ${
                              isOpen
                                ? "bg-[#245FD4] text-white shadow-xs scale-100"
                                : "bg-white text-[#94A3B8] border border-[#E2E8F0] shadow-2xs group-hover:bg-[#EFF6FF] group-hover:text-[#245FD4] group-hover:border-[#C8D8FA]"
                            }`}
                          >
                            {isOpen ? (
                              <svg
                                className="h-3 w-3 stroke-[3]"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                              </svg>
                            ) : (
                              <svg
                                className="h-3 w-3 stroke-[2.5]"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                              </svg>
                            )}
                          </div>
                        </div>
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            id={answerId}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{
                              height: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
                              opacity: { duration: 0.22, ease: "linear" },
                            }}
                            className="overflow-hidden"
                          >
                            <div className="pl-8 sm:pl-10 pt-2 pb-1 pr-10">
                              <p
                                className="text-[13px] sm:text-[14px] leading-relaxed text-[#64748B]"
                                style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                              >
                                {item.answer}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </article>
                  );
                })}
              </div>
            </section>
          </main>
    </div>
  );
}

export default function PricingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex w-full flex-1 flex-col justify-start overflow-y-auto bg-[#F8FAFC] px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-5 xl:px-10 2xl:px-12">
          <PricingSkeleton />
        </div>
      }
    >
      <PricingContent />
    </Suspense>
  );
}
