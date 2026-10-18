"use client";

import Link from "next/link";

interface AddMemberCardProps {
  memberCount: number;
  memberLimit: number;
  onAddMember: () => void;
}

export default function AddMemberCard({
  memberCount,
  memberLimit,
  onAddMember,
}: AddMemberCardProps) {
  const freeLeft = Math.max(0, memberLimit - memberCount);
  const isLimitReached = freeLeft <= 0;

  if (isLimitReached) {
    return (
      <div className="flex min-h-[260px] flex-col items-center justify-center rounded-[24px] border-2 border-dashed border-[#CBD5E1] bg-[#F8FAFC]/60 p-6 text-center transition">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500 shadow-2xs">
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <h4
          className="mt-3 text-[15px] font-bold text-[#0B1A3D]"
          style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
        >
          Signatures limit reached
        </h4>
        <p
          className="mt-1 text-xs text-[#64748B] max-w-[200px]"
          style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
        >
          Upgrade your plan to add more team members.
        </p>
        <Link
          href="/pricing"
          className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[#245FD4] hover:underline"
        >
          <span>Upgrade Plan</span>
          <span>&rarr;</span>
        </Link>
      </div>
    );
  }

  const freeLeftText =
    freeLeft === 1
      ? "1 free signature left"
      : `${freeLeft} free signatures left`;

  return (
    <button
      type="button"
      onClick={onAddMember}
      className="group flex min-h-[260px] flex-col items-center justify-center rounded-[24px] border-2 border-dashed border-[#CBD5E1] bg-[#F8FAFC]/40 hover:bg-[#F8FAFC] hover:border-[#245FD4]/50 p-6 text-center transition cursor-pointer"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white border border-[#CBD5E1] text-[#64748B] group-hover:border-[#245FD4] group-hover:text-[#245FD4] shadow-2xs transition">
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </div>
      <h4
        className="mt-3 text-[15px] font-bold text-[#0B1A3D] group-hover:text-[#245FD4] transition"
        style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
      >
        New signature
      </h4>
      <p
        className="mt-1 text-xs text-[#64748B]"
        style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
      >
        {freeLeftText}
      </p>
    </button>
  );
}
