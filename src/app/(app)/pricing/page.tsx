"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import PricingSkeleton from "@/components/skeletons/PricingSkeleton";

function PricingContent() {
  const [premiumToast, setPremiumToast] = useState<string | null>(null);

  function handleGoPremium() {
    setPremiumToast("Premium tier checkout is launching soon! Stay tuned.");
    setTimeout(() => {
      setPremiumToast(null);
    }, 4000);
  }

  return (
    <div className="flex w-full flex-1 flex-col justify-start overflow-y-auto bg-white px-4 py-5 sm:px-6 sm:py-6 lg:px-8 xl:px-10 2xl:px-12">
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

      <main className="flex w-full flex-1 flex-col justify-start gap-6 py-1 sm:gap-8 3xl:gap-9">
            {/* Top Heading Section */}
            <div className="w-full text-left shrink-0">
              <h1
                className="page-heading text-[#000000]"
                style={{
                  color: "#000000",
                }}
              >
                Simple Pricing. Powerful Signatures.
              </h1>
              <p
                className="mt-1.5 text-[#000000] text-[14px] sm:text-[15px] xl:text-[16px] 3xl:text-[18px]"
                style={{
                  fontFamily: "var(--font-commissioner), Commissioner, sans-serif",
                  fontWeight: 400,
                  lineHeight: "21.33px",
                  letterSpacing: "0%",
                  color: "#000000",
                }}
              >
                Start free. Upgrade when you&apos;re ready to unlock unlimited signatures and premium features.
              </p>
            </div>

            {/* Plans Container: Free & Premium side-by-side with fluid auto-adjusting card height */}
            <div className="flex w-full shrink-0 flex-col items-stretch justify-between gap-4 lg:flex-row lg:gap-5 xl:gap-6">
              {/* Free Plan Card */}
              <div
                className="flex h-auto min-h-[300px] flex-1 flex-col justify-between rounded-2xl p-5 shadow-2xs transition hover:shadow-xs sm:p-6 lg:min-h-[320px] xl:min-h-[330px] 2xl:min-h-[340px] 3xl:min-h-[360px] 3xl:p-7"
                style={{
                  width: "100%",
                  borderWidth: "0.5px",
                  borderColor: "#E2E8F0",
                  opacity: 1,
                  background:
                    "linear-gradient(124.58deg, #FBFDFE 0%, rgba(196, 223, 251, 0.5) 47.18%, #F9FCFE 93.27%)",
                }}
              >
                <div>
                  {/* Header Row: Title & Current Plan badge */}
                  <div className="flex items-center justify-between">
                    <h2
                      className="text-[17px] font-semibold text-[#0F172A] xl:text-[19px] 3xl:text-[21px]"
                      style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                    >
                      Free Plan
                    </h2>
                    <span
                      className="inline-flex items-center rounded-full bg-[#C4DFFB]/60 px-3 py-0.5 text-[11px] xl:text-[12px] font-medium text-[#1D4ED8]"
                      style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                    >
                      Current Plan
                    </span>
                  </div>

                  {/* Price Row */}
                  <div className="mt-1.5 flex items-baseline gap-1.5">
                    <span
                      className="text-[28px] font-bold text-[#0F172A] sm:text-[32px] xl:text-[34px] 3xl:text-[38px]"
                      style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                    >
                      $0
                    </span>
                    <span
                      className="text-[13px] xl:text-[14px] text-[#94A3B8]"
                      style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                    >
                      /month
                    </span>
                  </div>

                  {/* Subtitle description */}
                  <p
                    className="mt-0.5 text-[12px] text-[#64748B] xl:text-[13px] 3xl:text-[14px]"
                    style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                  >
                    Signature builder (templates + from scratch)
                  </p>

                  {/* Features List */}
                  <ul
                    className="mt-2.5 flex flex-col gap-1.5 text-[12.5px] text-[#334155] xl:mt-3 xl:gap-2 xl:text-[13.5px] 3xl:text-[15px]"
                    style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                  >
                    <li className="flex items-center gap-2">
                      <span className="text-[#334155]">&bull;</span>
                      <span>Live preview</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#334155]">&bull;</span>
                      <span>HTML export</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#334155]">&bull;</span>
                      <span>Image export</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#334155]">&bull;</span>
                      <span>Save up to 3 signatures</span>
                    </li>
                  </ul>
                </div>

                {/* Bottom Action Button */}
                <Link
                  href="/templates"
                  className="mt-3 block w-full rounded-xl bg-cta-gradient bg-gradient-to-r from-[#245FD4] to-[#022977] py-2 text-center text-[13px] font-semibold text-white shadow-xs transition hover:opacity-95 xl:py-2.5 xl:text-[14px] 3xl:text-[15px]"
                  style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                >
                  Get Started
                </Link>
              </div>

              {/* Premium Plan Card */}
              <div
                className="flex h-auto min-h-[300px] flex-1 flex-col justify-between rounded-2xl p-5 shadow-2xs transition hover:shadow-xs sm:p-6 lg:min-h-[320px] xl:min-h-[330px] 2xl:min-h-[340px] 3xl:min-h-[360px] 3xl:p-7"
                style={{
                  width: "100%",
                  borderWidth: "0.5px",
                  borderColor: "#E2E8F0",
                  opacity: 1,
                  background:
                    "linear-gradient(124.58deg, #FBFDFE 0%, rgba(138, 149, 242, 0.2) 47.18%, #F9FCFE 93.27%)",
                }}
              >
                <div>
                  {/* Header Row: Title */}
                  <div className="flex items-center justify-between">
                    <h2
                      className="text-[17px] font-semibold text-[#0F172A] xl:text-[19px] 3xl:text-[21px]"
                      style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                    >
                      Premium Plan
                    </h2>
                  </div>

                  {/* Price Row */}
                  <div className="mt-1.5 flex items-baseline gap-1.5">
                    <span
                      className="text-[28px] font-bold text-[#0F172A] sm:text-[32px] xl:text-[34px] 3xl:text-[38px]"
                      style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                    >
                      $10
                    </span>
                    <span
                      className="text-[13px] xl:text-[14px] text-[#94A3B8]"
                      style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                    >
                      /month
                    </span>
                  </div>

                  {/* Features List */}
                  <ul
                    className="mt-2.5 flex flex-col gap-1.5 text-[12.5px] text-[#334155] xl:mt-3 xl:gap-2 xl:text-[13.5px] 3xl:text-[15px]"
                    style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                  >
                    <li className="flex items-center gap-2">
                      <span className="text-[#334155]">&bull;</span>
                      <span>Everything in the Free plan</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#334155]">&bull;</span>
                      <span>Unlimited signatures</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#334155]">&bull;</span>
                      <span>Premium templates</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#334155]">&bull;</span>
                      <span>Team signature management</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#334155]">&bull;</span>
                      <span>Priority support</span>
                    </li>
                  </ul>
                </div>

                {/* Bottom Action Button */}
                <button
                  type="button"
                  onClick={handleGoPremium}
                  className="mt-3 w-full cursor-pointer rounded-xl bg-cta-gradient bg-gradient-to-r from-[#245FD4] to-[#022977] py-2 text-center text-[13px] font-semibold text-white shadow-xs transition hover:opacity-95 xl:py-2.5 xl:text-[14px] 3xl:text-[15px]"
                  style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                >
                  Go Premium
                </button>
              </div>
            </div>

            {/* Questions and answers */}
            <section className="w-full shrink-0" aria-labelledby="pricing-faq-heading">
              <div className="mb-4 max-w-2xl">
                <span className="inline-flex items-center rounded-full bg-[#EFF6FF] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[#245FD4]">
                  FAQs
                </span>
                <h2
                  id="pricing-faq-heading"
                  className="mt-2 text-[24px] font-semibold leading-tight tracking-tight text-[#101828] sm:text-[28px] xl:text-[32px] 3xl:text-[36px]"
                  style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                >
                  Got questions? We&apos;ve got answers.
                </h2>
                <p
                  className="mt-2 text-[13px] leading-relaxed text-[#64748B] sm:text-sm 3xl:text-base"
                  style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                >
                  Helpful details about plans, editing, and getting your signature into email.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2 xl:gap-4 3xl:gap-5">
                {[
                  {
                    question: "Is it really free?",
                    answer: "Yes. No credit card or hidden fees. You can create and save up to 3 signatures for free, then upgrade whenever you need unlimited signatures and premium features.",
                  },
                  {
                    question: "Can I edit my signature after saving it?",
                    answer: "Yes. Reopen a saved signature, make your changes, and export the updated version whenever you need it.",
                  },
                  {
                    question: "Which email clients support the HTML signature?",
                    answer: "It works with Gmail, Outlook (2016, 2019, and 365), Apple Mail, Yahoo Mail, and many other email clients.",
                  },
                  {
                    question: "Do I need to know how to code?",
                    answer: "No. Build and customize your signature visually, then copy or download the finished version.",
                  },
                ].map((item, index) => (
                  <article
                    key={item.question}
                    className="flex min-h-[126px] gap-3.5 rounded-2xl border border-[#E5EAF2] bg-gradient-to-br from-white to-[#F8FAFF] p-4 shadow-[0_2px_8px_rgba(16,24,40,0.04)] sm:min-h-[132px] sm:p-5 3xl:min-h-[148px] 3xl:p-6"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#EAF1FF] text-xs font-bold text-[#245FD4]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0">
                      <h3
                        className="text-[14px] font-semibold leading-snug text-[#172238] sm:text-[15px] 3xl:text-base"
                        style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                      >
                        {item.question}
                      </h3>
                      <div className="mt-2.5 flex items-start gap-2.5 border-l-2 border-[#C8D8FA] pl-3">
                        <span className="mt-px text-[10px] font-bold uppercase tracking-wide text-[#245FD4]">A</span>
                        <p
                          className="text-[12px] leading-relaxed text-[#64748B] sm:text-[13px] 3xl:text-sm"
                          style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                        >
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
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
        <div className="flex w-full flex-1 flex-col justify-start overflow-y-auto bg-white px-4 py-5 sm:px-6 sm:py-6 lg:px-8 xl:px-10 2xl:px-12">
          <PricingSkeleton />
        </div>
      }
    >
      <PricingContent />
    </Suspense>
  );
}
