"use client";

import Link from "next/link";

interface SignaturesHeaderProps {
  onCreateClick?: () => void;
  isLimitReached?: boolean;
}

export default function SignaturesHeader({
  onCreateClick,
  isLimitReached = false,
}: SignaturesHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between shrink-0">
      {/* Title & Subtitle */}
      <div>
        <h1
          className="page-heading text-[#1E293B]"
        >
          My Signatures
        </h1>
        <p
          className="mt-1 text-[14px] sm:text-[15px] text-[#64748B]"
          style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
        >
          Manage, edit, duplicate and export your email signatures.
        </p>
      </div>

      {/* Button: Upgrade to Pro if 3/3 signatures reached, otherwise Create New Signature */}
      {isLimitReached ? (
        <Link
          href="/pricing"
          className="flex h-[46px] w-full sm:w-[275px] items-center justify-center gap-2 rounded-full bg-cta-gradient bg-gradient-to-r from-[#245FD4] to-[#022977] px-6 text-center text-[15px] font-semibold text-white shadow-xs transition hover:opacity-95 active:scale-98 shrink-0"
          style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
        >
          <svg
            className="h-4 w-4 text-amber-300 shrink-0"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <span>Upgrade to Pro</span>
        </Link>
      ) : (
        <Link
          href="/templates"
          onClick={onCreateClick}
          className="flex h-[46px] w-full sm:w-[275px] items-center justify-center rounded-full bg-cta-gradient bg-gradient-to-r from-[#245FD4] to-[#022977] px-6 text-center text-[15px] font-medium text-white shadow-xs transition hover:opacity-95 active:scale-98 shrink-0"
          style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
        >
          Create New Signature
        </Link>
      )}
    </div>
  );
}
