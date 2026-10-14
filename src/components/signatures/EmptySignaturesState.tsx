"use client";

import Link from "next/link";

interface EmptySignaturesStateProps {
  onCreateClick?: () => void;
}

export default function EmptySignaturesState({
  onCreateClick,
}: EmptySignaturesStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-[#E2E8F0] bg-white px-6 py-16 sm:py-20 text-center shadow-xs">
      {/* Icon badge */}
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EFF6FF] text-[#245FD4]">
        <svg
          className="h-7 w-7"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="12" y1="18" x2="12" y2="12" />
          <line x1="9" y1="15" x2="15" y2="15" />
        </svg>
      </div>

      {/* Heading */}
      <h3
        className="text-[20px] font-bold text-[#1E293B]"
        style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
      >
        No signatures yet.
      </h3>

      {/* Subtext */}
      <p
        className="mt-1.5 text-[14px] text-[#64748B]"
        style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
      >
        Create your first one to get started.
      </p>

      {/* Action CTA Button */}
      <div className="mt-6 flex items-center justify-center">
        <Link
          href="/templates"
          onClick={onCreateClick}
          className="flex h-[46px] items-center justify-center gap-2 rounded-full bg-cta-gradient bg-gradient-to-r from-[#245FD4] to-[#022977] px-7 text-center text-[15px] font-medium text-white shadow-xs transition hover:opacity-95 active:scale-98"
          style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
        >
          <span>Create Your First Signature</span>
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
