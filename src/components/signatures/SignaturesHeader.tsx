"use client";

import Link from "next/link";

interface SignaturesHeaderProps {
  onCreateClick?: () => void;
}

export default function SignaturesHeader({ onCreateClick }: SignaturesHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between shrink-0">
      {/* Title & Subtitle */}
      <div>
        <h1
          className="text-[24px] sm:text-[28px] font-bold text-[#1E293B] leading-tight"
          style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
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

      {/* Create New Signature Button (275px x 46px with landing page gradient per Figma) */}
      <Link
        href="/templates"
        onClick={onCreateClick}
        className="flex h-[46px] w-full sm:w-[275px] items-center justify-center rounded-full bg-cta-gradient bg-gradient-to-r from-[#245FD4] to-[#022977] px-6 text-center text-[15px] font-medium text-white shadow-xs transition hover:opacity-95 active:scale-98 shrink-0"
        style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
      >
        Create New Signature
      </Link>
    </div>
  );
}
