"use client";

import Image from "next/image";
import { SavedSignature } from "@/types/signature";

export function formatRelativeTime(isoDate: string): string {
  const timestamp = new Date(isoDate).getTime();
  if (isNaN(timestamp)) {
    return "Updated recently";
  }
  const diffInSeconds = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));

  if (diffInSeconds < 60) {
    return "Updated just now";
  }
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `Updated ${diffInMinutes} minute${diffInMinutes === 1 ? "" : "s"} ago`;
  }
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `Updated ${diffInHours} hour${diffInHours === 1 ? "" : "s"} ago`;
  }
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `Updated ${diffInDays} day${diffInDays === 1 ? "" : "s"} ago`;
  }
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `Updated ${diffInMonths} month${diffInMonths === 1 ? "" : "s"} ago`;
  }
  const diffInYears = Math.floor(diffInDays / 365);
  return `Updated ${diffInYears} year${diffInYears === 1 ? "" : "s"} ago`;
}

interface SignatureCardProps {
  signature: SavedSignature;
  onEdit: (id: string) => void;
  onDuplicate: (id: string) => void;
  onExport: (id: string) => void;
  onDelete: (signature: SavedSignature) => void;
}

export default function SignatureCard({
  signature,
  onEdit,
  onDuplicate,
  onExport,
  onDelete,
}: SignatureCardProps) {
  const name = signature.name || signature.data.fullName || "My Signature";
  const role = signature.data.jobTitle || "";
  const email = signature.data.email || "";
  const phone = signature.data.phone || "";
  const company = signature.data.companyName || "";
  const tagline = signature.data.optional?.tagline || "";
  const website = signature.data.website || "";
  const avatar = signature.data.avatarUrl || "";
  const themeColor = signature.data.themeColor || "#245FD4";
  const relativeTime = formatRelativeTime(signature.updatedAt);

  return (
    <div className="group flex flex-col justify-between rounded-xl border border-[#E2E8F0] bg-white shadow-xs transition-all hover:shadow-md hover:border-slate-300">
      {/* Top Preview Section */}
      <div className="relative overflow-hidden rounded-t-xl bg-[#F8FAFC] p-3 sm:p-3.5 min-h-[148px] flex items-center justify-center">
        <div className="w-full rounded-lg bg-white p-3 border border-slate-100 shadow-2xs">
          <div className="flex items-center justify-between gap-3">
            {/* Left: Avatar + Socials */}
            <div className="flex flex-col items-center gap-1 shrink-0">
              <div className="relative h-11 w-11 overflow-hidden rounded-lg bg-slate-100 border border-slate-200 shadow-2xs">
                {avatar ? (
                  <Image
                    src={avatar}
                    alt={name}
                    width={44}
                    height={44}
                    className="h-full w-full object-cover"
                    unoptimized={avatar.startsWith("data:")}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-blue-50 text-[11px] font-bold text-[#245FD4]">
                    {name.slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
              {/* Social icons */}
              <div className="flex items-center gap-0.5">
                <span className="flex h-3 w-3 items-center justify-center rounded-xs bg-[#0077B5] text-[6px] font-bold text-white">
                  in
                </span>
                <span className="flex h-3 w-3 items-center justify-center rounded-xs bg-[#000000] text-[6px] font-bold text-white">
                  𝕏
                </span>
                <span className="flex h-3 w-3 items-center justify-center rounded-xs bg-[#1877F2] text-[6px] font-bold text-white">
                  f
                </span>
              </div>
            </div>

            {/* Middle: Details */}
            <div className="min-w-0 flex-1 space-y-0.5">
              <h5 className="text-[12px] font-bold text-[#1E293B] leading-tight truncate">
                {name}
              </h5>
              <p className="text-[10px] font-medium text-[#64748B] leading-tight truncate">
                {role}
              </p>
              <div className="pt-0.5 space-y-0.5 text-[8.5px] text-[#64748B]">
                {phone && (
                  <div className="flex items-center gap-1 truncate">
                    <span style={{ color: themeColor }} className="font-bold">
                      &#9742;
                    </span>
                    <span className="truncate">{phone}</span>
                  </div>
                )}
                {email && (
                  <div className="flex items-center gap-1 truncate">
                    <span style={{ color: themeColor }} className="font-bold">
                      &#9993;
                    </span>
                    <span className="truncate">{email}</span>
                  </div>
                )}
                {website && (
                  <div className="flex items-center gap-1 truncate">
                    <span style={{ color: themeColor }} className="font-bold">
                      &#9873;
                    </span>
                    <span className="truncate">{website}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Vertical divider */}
            <div className="h-12 w-px bg-slate-200 shrink-0" />

            {/* Right: Company */}
            <div className="flex flex-col items-center justify-center text-center shrink-0 w-[72px]">
              <svg width="22" height="22" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 8H26C28.2091 8 30 9.79086 30 12V20C30 22.2091 28.2091 24 26 24H22"
                  stroke={themeColor}
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <path
                  d="M26 30H12C9.79086 30 8 28.2091 8 26V18C8 15.7909 9.79086 14 12 14H16"
                  stroke={themeColor}
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
              <span className="mt-1 text-[8.5px] font-bold text-[#1E293B] leading-tight truncate max-w-full">
                {company || "Company"}
              </span>
              {tagline && (
                <span className="text-[7.5px] text-[#94A3B8] leading-tight truncate max-w-full">
                  {tagline}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Middle Info Row */}
      <div className="flex items-center justify-between p-3.5 pb-2.5">
        <div>
          <div className="flex items-center gap-2">
            <h4
              className="text-[14px] font-bold text-[#1E293B]"
              style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
            >
              {signature.name}
            </h4>
            <span
              className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold ${
                signature.kind === "studio"
                  ? "bg-[#EFF6FF] text-[#245FD4] border border-[#BFDBFE]"
                  : "bg-slate-100 text-[#475569] border border-slate-200"
              }`}
              style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
            >
              {signature.kind === "studio" ? "Studio" : "Template"}
            </span>
          </div>
          <p
            className="text-[12px] text-[#94A3B8]"
            style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
          >
            {relativeTime}
          </p>
        </div>

        {/* More options 3 dots button */}
        <button
          type="button"
          onClick={() => onEdit(signature.id)}
          className="rounded-lg p-1.5 text-[#94A3B8] transition hover:bg-slate-100 hover:text-[#64748B]"
          aria-label="More options"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="5" r="1.5" />
            <circle cx="12" cy="12" r="1.5" />
            <circle cx="12" cy="19" r="1.5" />
          </svg>
        </button>
      </div>

      {/* Bottom Action Buttons Row */}
      <div className="border-t border-[#F1F5F9] px-3.5 py-2.5 flex items-center justify-between text-[13px]">
        {/* Edit */}
        <button
          type="button"
          onClick={() => onEdit(signature.id)}
          className="flex items-center gap-1.5 font-medium text-[#2563EB] transition hover:text-[#1D4ED8]"
          style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
        >
          <svg
            className="h-3.5 w-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
          <span>Edit</span>
        </button>

        {/* Duplicate */}
        <button
          type="button"
          onClick={() => onDuplicate(signature.id)}
          className="flex items-center gap-1.5 font-medium text-[#64748B] transition hover:text-[#1E293B]"
          style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
        >
          <svg
            className="h-3.5 w-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          <span>Duplicate</span>
        </button>

        {/* Copy */}
        <button
          type="button"
          onClick={() => onExport(signature.id)}
          className="flex items-center gap-1.5 font-medium text-[#64748B] transition hover:text-[#1E293B]"
          style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
        >
          <svg
            className="h-3.5 w-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
            <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
          </svg>
          <span>Copy</span>
        </button>

        {/* Delete */}
        <button
          type="button"
          onClick={() => onDelete(signature)}
          className="flex items-center gap-1.5 font-medium text-[#DC2626] transition hover:text-[#B91C1C]"
          style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
        >
          <svg
            className="h-3.5 w-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
          </svg>
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
}
