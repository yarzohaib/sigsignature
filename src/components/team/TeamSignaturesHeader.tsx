"use client";

import Link from "next/link";

interface TeamSignaturesHeaderProps {
  memberCount: number;
  memberLimit: number;
  onNewSignature: () => void;
  isLimitReached: boolean;
}

export default function TeamSignaturesHeader({
  memberCount,
  memberLimit,
  onNewSignature,
  isLimitReached,
}: TeamSignaturesHeaderProps) {
  const percentage = Math.min(100, Math.round((memberCount / (memberLimit || 3)) * 100));

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6">
      {/* Title & Subtitle */}
      <div>
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EFF6FF] text-[#245FD4]">
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <h1
            className="page-heading text-[#0B1A3D]"
          >
            Team Signature
          </h1>
        </div>
        <p
          className="mt-1 text-sm text-[#64748B]"
          style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
        >
          Create and manage signatures for the people on your team.
        </p>
      </div>

      {/* Right controls: Progress pill & New Signature button */}
      <div className="flex items-center gap-3 self-start sm:self-auto">
        {/* Progress pill matching Figma */}
        <div className="flex items-center gap-2.5 rounded-full border border-[#E2E8F0] bg-white px-3.5 py-1.5 text-xs text-[#64748B] shadow-2xs">
          <span className="font-medium text-[#475569]">Signatures</span>
          <div className="h-1.5 w-14 overflow-hidden rounded-full bg-[#E2E8F0]">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isLimitReached ? "bg-amber-500" : "bg-[#245FD4]"
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <span className="font-medium text-[#0F172A]">
            {memberCount} of {memberLimit}
          </span>
        </div>

        {/* Action Button */}
        {isLimitReached ? (
          <div className="relative group">
            <button
              type="button"
              disabled
              className="flex items-center gap-2 rounded-xl bg-slate-200 px-4 py-2.5 text-sm font-medium text-slate-400 cursor-not-allowed"
              style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span> New Signature</span>
            </button>
            <div className="absolute right-0 top-full mt-2 hidden group-hover:flex flex-col items-center z-20">
              <div className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs text-white shadow-lg whitespace-nowrap">
                Limit reached ({memberLimit} max).{" "}
                <Link href="/pricing" className="text-[#60A5FA] underline hover:text-white ml-1 font-semibold">
                  Upgrade
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={onNewSignature}
            className="flex items-center gap-2 rounded-xl bg-[#245FD4] hover:bg-[#1D4ED8] px-4 py-2.5 text-sm font-medium text-white shadow-xs transition hover:shadow-md cursor-pointer"
            style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>New signature</span>
          </button>
        )}
      </div>
    </div>
  );
}
