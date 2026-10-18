"use client";

import Link from "next/link";

interface EmptyTeamStateProps {
  onCreateSignature: () => void;
}

export default function EmptyTeamState({ onCreateSignature }: EmptyTeamStateProps) {
  return (
    <div className="w-full rounded-3xl border border-[#E4E9F4] bg-white p-6 sm:p-10 md:p-14 shadow-2xs">
      {/* Hero section */}
      <div className="mx-auto max-w-3xl text-center">
        <h2
          className="text-3xl sm:text-4xl md:text-[44px] font-semibold text-[#0B1A3D] leading-[1.15] tracking-tight"
          style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
        >
          Create Your First Team
          <br className="hidden sm:inline" /> Signature
        </h2>

        <p
          className="mx-auto mt-4 max-w-2xl text-sm sm:text-base text-[#64748B] leading-relaxed"
          style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
        >
          Unify your brand across every message. Set up a standardized email signature
          for your team in minutes to ensure every email looks professional, polished,
          and on-brand
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
          <button
            type="button"
            onClick={onCreateSignature}
            className="flex items-center gap-2 rounded-xl bg-[#245FD4] hover:bg-[#1D4ED8] px-6 py-3 text-sm sm:text-base font-semibold text-white shadow-xs transition hover:shadow-md cursor-pointer"
            style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>Create signature</span>
          </button>

          <Link
            href="/templates"
            className="flex items-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-6 py-3 text-sm sm:text-base font-semibold text-[#1E293B] hover:bg-slate-50 transition shadow-2xs"
            style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
          >
            <svg
              className="h-4 w-4 text-[#64748B]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18" />
              <path d="M9 21V9" />
            </svg>
            <span>Browse templates</span>
          </Link>
        </div>
      </div>

      {/* Feature cards container */}
      <div className="mt-12 sm:mt-16 rounded-2xl border border-[#E4E9F4] bg-[#F8FAFC] p-6 sm:p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 divide-y md:divide-y-0 md:divide-x divide-[#E2E8F0]">
          {/* Feature 1: Design In Minutes */}
          <div className="flex flex-col items-center text-center px-4 pt-4 md:pt-0">
            {/* Visual illustration matching Figma */}
            <div className="flex flex-col items-center gap-3 mb-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#245FD4] to-[#1D4ED8] text-white shadow-md shadow-blue-500/20">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
              </div>

              {/* Mock template pills */}
              <div className="flex items-center gap-1.5 rounded-full bg-white px-2 py-1 border border-[#E2E8F0] shadow-2xs">
                <span className="rounded-full bg-[#245FD4] px-2.5 py-0.5 text-[10px] font-semibold text-white">
                  Classic
                </span>
                <span className="px-2 py-0.5 text-[10px] text-[#64748B]">Modern</span>
                <span className="px-2 py-0.5 text-[10px] text-[#64748B]">Minimal</span>
              </div>
            </div>

            <h3
              className="text-base font-semibold text-[#0B1A3D]"
              style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
            >
              Design In Minutes
            </h3>
            <p
              className="mt-1 text-xs sm:text-sm text-[#64748B]"
              style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
            >
              Pick a template, add your teammate&apos;s details.
            </p>
          </div>

          {/* Feature 2: Send It By Email */}
          <div className="flex flex-col items-center text-center px-4 pt-8 md:pt-0">
            {/* Visual illustration matching Figma */}
            <div className="flex flex-col items-center gap-3 mb-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#245FD4] to-[#1D4ED8] text-white shadow-md shadow-blue-500/20">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </div>

              {/* Mock send input pill */}
              <div className="flex items-center gap-2 rounded-full bg-white px-3 py-1 border border-[#E2E8F0] shadow-2xs">
                <span className="text-[10px] text-[#475569]">sara@company.com</span>
                <span className="rounded-full bg-[#245FD4] px-2 py-0.5 text-[9px] font-semibold text-white">
                  Send
                </span>
              </div>

              {/* Mini client tags */}
              <div className="flex items-center gap-1.5 text-[9px] text-[#94A3B8]">
                <span>Gmail</span>
                <span>•</span>
                <span>Outlook</span>
                <span>•</span>
                <span>Apple Mail</span>
              </div>
            </div>

            <h3
              className="text-base font-semibold text-[#0B1A3D]"
              style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
            >
              Send It By Email
            </h3>
            <p
              className="mt-1 text-xs sm:text-sm text-[#64748B]"
              style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
            >
              Your teammate gets it ready to paste into Gmail or Outlook.
            </p>
          </div>

          {/* Feature 3: Only You Manage It */}
          <div className="flex flex-col items-center text-center px-4 pt-8 md:pt-0">
            {/* Visual illustration matching Figma */}
            <div className="flex flex-col items-center gap-3 mb-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#245FD4] to-[#1D4ED8] text-white shadow-md shadow-blue-500/20">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>

              {/* Overlapping avatar circles */}
              <div className="flex items-center -space-x-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-[9px] font-bold text-white ring-2 ring-white">
                  SA
                </span>
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500 text-[9px] font-bold text-white ring-2 ring-white">
                  DC
                </span>
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-purple-500 text-[9px] font-bold text-white ring-2 ring-white">
                  MC
                </span>
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white ring-2 ring-white">
                  AM
                </span>
              </div>

              {/* Lock pill */}
              <div className="flex items-center gap-1 text-[10px] text-[#64748B]">
                <svg className="h-3 w-3 text-[#94A3B8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <span>No logins needed</span>
              </div>
            </div>

            <h3
              className="text-base font-semibold text-[#0B1A3D]"
              style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
            >
              Only You Manage It
            </h3>
            <p
              className="mt-1 text-xs sm:text-sm text-[#64748B]"
              style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
            >
              Your team never needs an account or a login.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
