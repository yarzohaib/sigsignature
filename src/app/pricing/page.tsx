"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardTopBar from "@/components/dashboard/DashboardTopBar";
import { UserProfile, getCurrentUser, logoutUser } from "@/app/lib/api";
import {
  clearAuthSession,
  getStoredRefreshToken,
  getStoredUser,
} from "@/app/lib/auth";

export default function PricingPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [premiumToast, setPremiumToast] = useState<string | null>(null);

  useEffect(() => {
    async function verifyAuth() {
      const cachedUser = getStoredUser();
      if (cachedUser) {
        setUser(cachedUser);
      }

      try {
        const freshUser = await getCurrentUser();
        setUser(freshUser);
      } catch (err) {
        console.warn("Session expired or invalid, redirecting to login:", err);
        clearAuthSession();
        router.replace("/login?redirect=/pricing");
        return;
      } finally {
        setIsLoading(false);
      }
    }

    verifyAuth();
  }, [router]);

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      const refreshToken = getStoredRefreshToken();
      await logoutUser(refreshToken || undefined);
    } finally {
      clearAuthSession();
      router.replace("/login");
      router.refresh();
    }
  }

  function handleGoPremium() {
    setPremiumToast("Premium tier checkout is launching soon! Stay tuned.");
    setTimeout(() => {
      setPremiumToast(null);
    }, 4000);
  }

  const displayName = user?.firstName
    ? `${user.firstName} ${user.lastName || ""}`.trim()
    : "Member";

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8FAFC] p-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-3 border-[#245FD4] border-t-transparent" />
          <p
            className="text-base font-bold text-[#1E293B]"
            style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
          >
            Loading pricing...
          </p>
        </div>
      </main>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC]">
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
            className="text-slate-400 hover:text-slate-600 ml-2"
          >
            &times;
          </button>
        </div>
      )}

      {/* 256px Fixed Sidebar */}
      <DashboardSidebar
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Navigation Bar with Search and Profile */}
        <DashboardTopBar
          userName={displayName}
          userEmail={user?.email}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onLogout={handleLogout}
          isLoggingOut={isLoggingOut}
        />

        {/* Canvas: Single page without scroll on LG screens, vertically balanced and bounded on XL/2XL */}
        <div className="flex flex-1 flex-col justify-center overflow-y-auto lg:overflow-hidden px-4 py-3 sm:px-6 sm:py-4 lg:px-8 xl:px-12 2xl:px-16 bg-white">
          <main className="mx-auto flex flex-1 flex-col justify-between w-full max-w-[1084px] xl:max-w-[1140px] 2xl:max-w-[1200px] lg:max-h-[750px] xl:max-h-[800px] 2xl:max-h-[850px] my-auto py-1">
            {/* Top Heading Section */}
            <div className="w-full text-left shrink-0">
              <h1
                className="text-[#000000] text-[28px] sm:text-[32px] xl:text-[34px]"
                style={{
                  fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                  fontWeight: 600,
                  lineHeight: "1.2",
                  letterSpacing: "0%",
                  color: "#000000",
                }}
              >
                Simple Pricing. Powerful Signatures.
              </h1>
              <p
                className="mt-1.5 text-[#000000] text-[14px] sm:text-[15px] xl:text-[16px]"
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

            {/* Plans Container: Free & Premium side-by-side with reduced card height */}
            <div className="my-2 xl:my-3 flex flex-col lg:flex-row items-stretch justify-between gap-4 xl:gap-6 w-full shrink-0">
              {/* Free Plan Card */}
              <div
                className="flex flex-col justify-between w-full max-w-[530px] xl:max-w-[550px] 2xl:max-w-[580px] h-auto lg:h-[345px] xl:h-[365px] 2xl:h-[375px] shadow-2xs transition hover:shadow-xs"
                style={{
                  width: "100%",
                  borderRadius: "12px",
                  borderWidth: "0.5px",
                  borderColor: "#E2E8F0",
                  padding: "24px 28px",
                  gap: "10px",
                  opacity: 1,
                  background:
                    "linear-gradient(124.58deg, #FBFDFE 0%, rgba(196, 223, 251, 0.5) 47.18%, #F9FCFE 93.27%)",
                }}
              >
                <div>
                  {/* Header Row: Title & Current Plan badge */}
                  <div className="flex items-center justify-between">
                    <h2
                      className="text-[17px] xl:text-[19px] font-semibold text-[#0F172A]"
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
                      className="text-[28px] sm:text-[32px] xl:text-[34px] font-bold text-[#0F172A]"
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
                    className="mt-0.5 text-[12px] xl:text-[13px] text-[#64748B]"
                    style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                  >
                    Signature builder (templates + from scratch)
                  </p>

                  {/* Features List */}
                  <ul
                    className="mt-2.5 xl:mt-3 flex flex-col gap-1.5 xl:gap-2 text-[12.5px] xl:text-[13.5px] text-[#334155]"
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
                  className="mt-3 block w-full rounded-xl bg-cta-gradient bg-gradient-to-r from-[#245FD4] to-[#022977] py-2 xl:py-2.5 text-center text-[13px] xl:text-[14px] font-semibold text-white shadow-xs transition hover:opacity-95"
                  style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                >
                  Get Started
                </Link>
              </div>

              {/* Premium Plan Card */}
              <div
                className="flex flex-col justify-between w-full max-w-[530px] xl:max-w-[550px] 2xl:max-w-[580px] h-auto lg:h-[345px] xl:h-[365px] 2xl:h-[375px] shadow-2xs transition hover:shadow-xs"
                style={{
                  width: "100%",
                  borderRadius: "12px",
                  borderWidth: "0.5px",
                  borderColor: "#E2E8F0",
                  padding: "24px 28px",
                  gap: "10px",
                  opacity: 1,
                  background:
                    "linear-gradient(124.58deg, #FBFDFE 0%, rgba(138, 149, 242, 0.2) 47.18%, #F9FCFE 93.27%)",
                }}
              >
                <div>
                  {/* Header Row: Title */}
                  <div className="flex items-center justify-between">
                    <h2
                      className="text-[17px] xl:text-[19px] font-semibold text-[#0F172A]"
                      style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                    >
                      Premium Plan
                    </h2>
                  </div>

                  {/* Price Row */}
                  <div className="mt-1.5 flex items-baseline gap-1.5">
                    <span
                      className="text-[28px] sm:text-[32px] xl:text-[34px] font-bold text-[#0F172A]"
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
                    className="mt-2.5 xl:mt-3 flex flex-col gap-1.5 xl:gap-2 text-[12.5px] xl:text-[13.5px] text-[#334155]"
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
                  className="mt-3 w-full rounded-xl bg-cta-gradient bg-gradient-to-r from-[#245FD4] to-[#022977] py-2 xl:py-2.5 text-center text-[13px] xl:text-[14px] font-semibold text-white shadow-xs transition hover:opacity-95"
                  style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                >
                  Go Premium
                </button>
              </div>
            </div>

            {/* Got Questions? We've Got Answers Section (Expanded for readability) */}
            <div className="w-full text-left shrink-0 mt-1">
              <h2
                className="text-[#000000] text-[26px] sm:text-[30px] xl:text-[34px]"
                style={{
                  fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                  fontWeight: 600,
                  lineHeight: "1.2",
                  letterSpacing: "0%",
                  color: "#000000",
                }}
              >
                Got Questions? We&apos;ve Got Answers.
              </h2>
              <p
                className="mt-1 text-[#000000] text-[13.5px] sm:text-[14.5px] xl:text-[16px]"
                style={{
                  fontFamily: "var(--font-commissioner), Commissioner, sans-serif",
                  fontWeight: 400,
                  lineHeight: "20px",
                  letterSpacing: "0%",
                  color: "#000000",
                }}
              >
                Learn everything you need to know about Sig Signature, from getting started to exporting your email signature.
              </p>

              {/* 2x2 FAQ Cards Grid - comfortable height & padding */}
              <div className="mt-2.5 xl:mt-3.5 grid grid-cols-1 md:grid-cols-2 gap-3 xl:gap-3.5">
                {/* FAQ 1 */}
                <div className="rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 xl:px-5 xl:py-3.5 flex flex-col justify-center shadow-2xs hover:border-slate-300 transition">
                  <h3
                    className="text-[#000000] text-[13.5px] xl:text-[14.5px]"
                    style={{
                      fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                      fontWeight: 600,
                      lineHeight: "20px",
                      letterSpacing: "0%",
                    }}
                  >
                    Q: Is it really free?
                  </h3>
                  <p
                    className="mt-1 text-[#334155] text-[11px] xl:text-[12px]"
                    style={{
                      fontFamily: "var(--font-commissioner), Commissioner, sans-serif",
                      fontWeight: 400,
                      lineHeight: "16px",
                      letterSpacing: "0%",
                    }}
                  >
                    A: Yes. No credit card or hidden fees. You can create and save up to 3 signatures for free, then upgrade for the rest anytime, for unlimited signatures and premium features.
                  </p>
                </div>

                {/* FAQ 2 */}
                <div className="rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 xl:px-5 xl:py-3.5 flex flex-col justify-center shadow-2xs hover:border-slate-300 transition">
                  <h3
                    className="text-[#000000] text-[13.5px] xl:text-[14.5px]"
                    style={{
                      fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                      fontWeight: 600,
                      lineHeight: "20px",
                      letterSpacing: "0%",
                    }}
                  >
                    Q: Can I edit my signature after saving it?
                  </h3>
                  <p
                    className="mt-1 text-[#334155] text-[11px] xl:text-[12px]"
                    style={{
                      fontFamily: "var(--font-commissioner), Commissioner, sans-serif",
                      fontWeight: 400,
                      lineHeight: "16px",
                      letterSpacing: "0%",
                    }}
                  >
                    A: Yes, edit anytime and re-export instantly.
                  </p>
                </div>

                {/* FAQ 3 */}
                <div className="rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 xl:px-5 xl:py-3.5 flex flex-col justify-center shadow-2xs hover:border-slate-300 transition">
                  <h3
                    className="text-[#000000] text-[13.5px] xl:text-[14.5px]"
                    style={{
                      fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                      fontWeight: 600,
                      lineHeight: "20px",
                      letterSpacing: "0%",
                    }}
                  >
                    Q: What email clients does the HTML work with?
                  </h3>
                  <p
                    className="mt-1 text-[#334155] text-[11px] xl:text-[12px]"
                    style={{
                      fontFamily: "var(--font-commissioner), Commissioner, sans-serif",
                      fontWeight: 400,
                      lineHeight: "16px",
                      letterSpacing: "0%",
                    }}
                  >
                    A: Gmail, Outlook (2016, 2019, 365), Apple Mail, Yahoo Mail and more.
                  </p>
                </div>

                {/* FAQ 4 */}
                <div className="rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 xl:px-5 xl:py-3.5 flex flex-col justify-center shadow-2xs hover:border-slate-300 transition">
                  <h3
                    className="text-[#000000] text-[13.5px] xl:text-[14.5px]"
                    style={{
                      fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                      fontWeight: 600,
                      lineHeight: "20px",
                      letterSpacing: "0%",
                    }}
                  >
                    Q: Do I need to know how to code?
                  </h3>
                  <p
                    className="mt-1 text-[#334155] text-[11px] xl:text-[12px]"
                    style={{
                      fontFamily: "var(--font-commissioner), Commissioner, sans-serif",
                      fontWeight: 400,
                      lineHeight: "16px",
                      letterSpacing: "0%",
                    }}
                  >
                    A: Not at all. Everything is visual and drag-and-drop friendly.
                  </p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
