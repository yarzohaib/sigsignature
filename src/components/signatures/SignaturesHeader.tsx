"use client";

import Link from "next/link";

interface SignaturesHeaderProps {
  onCreateClick?: () => void;
  onUpgradeClick?: () => void;
  isLimitReached?: boolean;
}

export default function SignaturesHeader({
  onCreateClick,
  onUpgradeClick,
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

      {/* Button: Upgrade to Get More if 3/3 signatures reached, otherwise Create New Signature */}
      {isLimitReached ? (
        onUpgradeClick ? (
          <button
            type="button"
            onClick={onUpgradeClick}
            className="flex h-[46px] w-full sm:w-[275px] items-center justify-center rounded-full bg-cta-gradient bg-gradient-to-r from-[#245FD4] to-[#022977] px-6 text-center text-[15px] font-semibold text-white shadow-xs transition hover:opacity-95 active:scale-98 shrink-0 cursor-pointer"
            style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
          >
            <span>Upgrade to Get More</span>
          </button>
        ) : (
          <Link
            href="/pricing"
            className="flex h-[46px] w-full sm:w-[275px] items-center justify-center rounded-full bg-cta-gradient bg-gradient-to-r from-[#245FD4] to-[#022977] px-6 text-center text-[15px] font-semibold text-white shadow-xs transition hover:opacity-95 active:scale-98 shrink-0"
            style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
          >
            <span>Upgrade to Get More</span>
          </Link>
        )
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
