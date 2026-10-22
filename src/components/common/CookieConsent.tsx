"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { updateConsentMode } from "@/lib/analytics/events";

const CONSENT_STORAGE_KEY = "sig_cookie_consent_v1";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!saved) {
      // Delay showing slightly so page content renders smoothly first
      const timer = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(timer);
    } else if (saved === "all") {
      updateConsentMode(true);
    }
  }, []);

  if (!visible) {
    return null;
  }

  const handleAcceptAll = () => {
    localStorage.setItem(CONSENT_STORAGE_KEY, "all");
    updateConsentMode(true);
    setVisible(false);
  };

  const handleEssentialOnly = () => {
    localStorage.setItem(CONSENT_STORAGE_KEY, "essential");
    updateConsentMode(false);
    setVisible(false);
  };

  return (
    <aside
      aria-label="Cookie consent banner"
      className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-xl animate-fade-in-up"
    >
      <div className="rounded-2xl border border-slate-200/90 bg-white/95 p-4 sm:p-5 shadow-[0_16px_40px_rgba(2,41,119,0.12)] backdrop-blur-md">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs sm:text-[13px] text-slate-700 leading-relaxed">
            <p className="font-semibold text-slate-900 mb-0.5">We respect your privacy</p>
            <p>
              We use functional and analytics cookies to optimize your email signature builder experience. See our{" "}
              <Link href="/privacy" className="text-[#245FD4] underline underline-offset-2 hover:text-[#022977]">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2 pt-1 sm:pt-0">
            <button
              type="button"
              onClick={handleEssentialOnly}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 cursor-pointer"
            >
              Essential
            </button>
            <button
              type="button"
              onClick={handleAcceptAll}
              className="rounded-xl bg-cta-gradient bg-gradient-to-r from-[#245FD4] to-[#022977] px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition hover:opacity-95 cursor-pointer"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
