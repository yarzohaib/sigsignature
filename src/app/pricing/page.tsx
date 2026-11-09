"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromSidebar = searchParams.get("from") === "sidebar";
  const [premiumToast, setPremiumToast] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isFreePlanUser, setIsFreePlanUser] = useState(false);

  useEffect(() => {
    function checkAuth() {
      const user = getStoredUser();
      const token = getStoredToken();
      setIsFreePlanUser(Boolean(user || token));
    }
    checkAuth();
    window.addEventListener("sig_user_update", checkAuth);
    window.addEventListener("storage", checkAuth);
    return () => {
      window.removeEventListener("sig_user_update", checkAuth);
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  function handleGoPremium() {
    const user = getStoredUser();
    const token = getStoredToken();
    if (!user && !token) {
      router.push("/signup?redirect=/pricing&plan=pro");
      return;
    }
    setPremiumToast("Premium tier checkout is launching soon! Stay tuned.");
    setTimeout(() => {
      setPremiumToast(null);
    }, 4000);
  }

  return (
    <div className="flex w-full flex-1 flex-col justify-start bg-[#F8FAFC]">
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

      <main
        className={`flex w-full flex-1 flex-col justify-start gap-6 px-4 py-6 sm:px-6 sm:py-7 sm:gap-8 lg:px-8 lg:py-8 ${
          fromSidebar
            ? "w-full xl:px-10 2xl:px-12"
            : "mx-auto max-w-[1440px] xl:px-12 2xl:max-w-[1536px] 3xl:max-w-[1720px]"
        }`}
      >
        {/* Top Heading Section */}
        <div className="w-full text-left shrink-0 mb-2 sm:mb-4">
          <h1
            className="text-2xl sm:text-3xl lg:text-[32px] font-semibold text-[#101828] tracking-tight"
            style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
          >
            Choose Your Package.
          </h1>
          <p
            className="mt-1.5 text-[14px] sm:text-[15px] text-[#64748B] max-w-xl leading-relaxed"
            style={{
              fontFamily: "var(--font-commissioner), Commissioner, sans-serif",
            }}
          >
            Choose a plan that fits your workflow for solo users or teams. Simple, flexible pricing with no hidden fees.
          </p>
        </div>

        {/* Plans Container: Fixed-size cards centered on wide screens */}
        <div className="mx-auto grid w-full max-w-[1080px] grid-cols-1 items-stretch gap-8 pt-1 lg:grid-cols-2 lg:gap-10 xl:gap-12">
              {/* Basic Plan Card */}
              <div
                className="mx-auto flex w-full max-w-[495px] flex-col justify-start rounded-[24px] border border-[#E2E8F0] bg-white"
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
                        href="/signup?redirect=/pricing"
                        className="w-full h-[46px] rounded-full bg-[#F1F5F9] text-[#101828] text-[14px] sm:text-[15px] font-semibold flex items-center justify-center transition-colors hover:bg-[#E2E8F0]"
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
                className="relative mx-auto flex w-full max-w-[495px] flex-col"
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
                {/* Best Value Price Badge matching Figma */}
                <div className="absolute -top-[14px] left-1/2 -translate-x-1/2 z-10 inline-flex items-center rounded-full bg-[#133E9A] px-5 py-1.5 shadow-md whitespace-nowrap">
                  <span
                    className="text-[12px] font-semibold text-white tracking-wide"
                    style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                  >
                    Best Value Price
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

            {/* Trust & Guarantee Icons below the pricing cards matching Figma design */}
            <div className="mx-auto mt-4 mb-4 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-slate-600 font-body text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 text-[#245FD4]" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
                </svg>
                <span className="font-medium text-slate-700">Money back guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 text-[#245FD4]" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a.75.75 0 01-.874-.993l.635-1.636A7.838 7.838 0 013 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                </svg>
                <span className="font-medium text-slate-700">24/7 Live support</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 text-[#245FD4]" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
                <span className="font-medium text-slate-700">10k+ users globally</span>
              </div>
            </div>

            {/* Questions, answered */}
            <section
              className="w-full shrink-0 mt-6 sm:mt-8 lg:mt-10 mb-8"
              aria-labelledby="pricing-faq-heading"
            >
              <div className="mb-6">
                <h2
                  id="pricing-faq-heading"
                  className="text-2xl sm:text-3xl lg:text-[32px] font-semibold text-[#101828] tracking-tight"
                  style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                >
                  Questions, answered.
                </h2>
                <p
                  className="mt-1.5 text-[14px] sm:text-[15px] text-[#64748B] max-w-xl leading-relaxed"
                  style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                >
                  Helpful details to make choosing your plan feel easy.
                </p>
              </div>

              <div className="border-t border-[#E2E8F0] divide-y divide-[#E2E8F0]">
                {[
                  {
                    number: "01",
                    question: "What payment methods do you accept?",
                    answer: (
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                        <svg className="h-4 w-4 text-slate-500 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                          <rect x="2" y="5" width="20" height="14" rx="2" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2 10h20" />
                        </svg>
                        <span>
                          Credit card, bank transfer, or invoice.{" "}
                          <Link href="/contact" className="text-[#245FD4] font-medium hover:underline">
                            Contact us
                          </Link>{" "}
                          if you need custom billing support.
                        </span>
                      </div>
                    ),
                  },
                  {
                    number: "02",
                    question: "How is pricing calculated?",
                    answer:
                      "Pricing is calculated simply and transparently based on the plan you choose, whether our free Basic tier with essential templates or our Professional tier for full template access and team signatures, billed monthly with no hidden fees.",
                  },
                  {
                    number: "03",
                    question: "What happens when my trial ends?",
                    answer:
                      "When your trial period ends, your signatures continue to work seamlessly in all your email clients. You can upgrade to a paid plan anytime to keep modifying templates and managing team signatures.",
                  },
                  {
                    number: "04",
                    question: "Who can manage account settings?",
                    answer:
                      "The account owner and designated administrators have full access to manage account settings, team seat assignments, template distribution, and billing information.",
                  },
                  {
                    number: "05",
                    question: "Can I pay only for active team members?",
                    answer:
                      "Yes. You only pay for active team members who have been assigned a seat. You can add, reassign, or remove seats directly from your dashboard at any time.",
                  },
                  {
                    number: "06",
                    question: "Do you offer a Startup Program?",
                    answer:
                      "Yes! We offer a dedicated Startup Program with discounted pricing for early stage companies and nonprofit organizations. Reach out via our Contact page to apply.",
                  },
                  {
                    number: "07",
                    question: "Are there discounts?",
                    answer:
                      "Yes! We offer volume pricing discounts for organizations with large teams, as well as special rates through our Startup and Nonprofit programs. Reach out to our team to learn more.",
                  },
                  {
                    number: "08",
                    question: "Which tools does Sig Signature integrate with?",
                    answer:
                      "Sig Signature integrates smoothly with Gmail, Microsoft Outlook (Web & Desktop), Apple Mail (macOS & iOS), Yahoo Mail, Mozilla Thunderbird, and any email client supporting HTML.",
                  },
                  {
                    number: "09",
                    question: "How do you protect my data?",
                    answer:
                      "We implement enterprise grade encryption for all customer data in transit and at rest. We never sell personal data and never inject tracking scripts or telemetry into user signatures.",
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
                            role="region"
                            aria-labelledby={answerId}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <div className="pt-3 sm:pt-3.5 pl-8 sm:pl-12 pr-4 text-xs sm:text-sm text-[#475467] leading-relaxed">
                              {item.answer}
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
        <div className="flex w-full flex-1 flex-col justify-start bg-[#F8FAFC]">
          <div className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 sm:py-7 lg:px-8 lg:py-8 xl:px-12 2xl:max-w-[1536px] 3xl:max-w-[1720px]">
            <PricingSkeleton />
          </div>
        </div>
      }
    >
      <PricingContent />
    </Suspense>
  );
}
