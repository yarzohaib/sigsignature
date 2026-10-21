import React from "react";
import Link from "next/link";
import { SUPPORT_INFO } from "@/lib/helpData";

export default function SupportBanner() {
  return (
    <section
      aria-labelledby="support-banner-heading"
      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-blue-100 bg-[#EFF6FF] p-5 sm:p-6 lg:p-7"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#245FD4] shadow-xs">
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </div>

        <div>
          <h2
            id="support-banner-heading"
            className="text-base sm:text-lg font-bold text-[#1E293B]"
            style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
          >
            {SUPPORT_INFO.title}
          </h2>
          <p
            className="mt-0.5 text-xs sm:text-sm text-[#64748B] leading-relaxed"
            style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
          >
            {SUPPORT_INFO.description}
          </p>
        </div>
      </div>

      <Link
        href={SUPPORT_INFO.href || "/contact"}
        className="inline-flex items-center justify-center rounded-xl bg-[#245FD4] hover:bg-[#1E4FB0] px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs transition shrink-0 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#245FD4]"
        style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
      >
        {SUPPORT_INFO.buttonText}
      </Link>
    </section>
  );
}
