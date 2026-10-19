"use client";

import Image from "next/image";
import { AVAILABLE_TEMPLATES } from "@/lib/templatesData";

interface StartingPointCardProps {
  firstName: string;
  lastName: string;
  email: string;
  companyName: string;
  avatarUrl: string | null;
  defaultTemplateId: string | null;
  defaultExportFormat: "html" | "plain";
  signatureFont: string;
  brandColor: string;
  includePhoto: boolean;
}

export default function StartingPointCard({
  firstName,
  lastName,
  email,
  companyName,
  avatarUrl,
  defaultTemplateId,
  defaultExportFormat,
  signatureFont,
  brandColor,
  includePhoto,
}: StartingPointCardProps) {
  const currentTemplate =
    AVAILABLE_TEMPLATES.find((t) => t.id === defaultTemplateId) ||
    AVAILABLE_TEMPLATES[0];

  const templateLabel =
    currentTemplate?.id === "executive-corporate" ? "Executive" : "Minimal";

  const fullName = `${firstName || ""} ${lastName || ""}`.trim() || "John Doe";
  const displayCompany = companyName || "Your company";
  const displayEmail = email || "john@example.com";
  const displayFormat = defaultExportFormat === "plain" ? "Plain" : "HTML";

  // Clean initials for avatar fallback if photo is enabled but no image
  const initials = (firstName ? firstName[0] : "J") + (lastName ? lastName[0] : "D");

  return (
    <div className="rounded-2xl border border-[#E1E6EF] bg-white p-6 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-3">
        <h2
          className="text-[18px] font-semibold text-[#172238]"
          style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
        >
          Your starting point
        </h2>
        <div className="text-slate-400">
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </div>
      </div>

      {/* Mini Preview Box */}
      <div className="mt-2 rounded-xl border border-slate-100 bg-[#F8FAFC] p-4">
        <div className="flex items-center gap-3.5">
          {/* Avatar Preview if includePhoto is enabled */}
          {includePhoto && (
            <div
              className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border-2 bg-slate-200"
              style={{ borderColor: brandColor || "#245FD4" }}
            >
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={fullName}
                  width={44}
                  height={44}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div
                  className="flex h-full w-full items-center justify-center font-bold text-white text-xs"
                  style={{ backgroundColor: brandColor || "#245FD4" }}
                >
                  {initials.toUpperCase()}
                </div>
              )}
            </div>
          )}

          {/* Details */}
          <div className="flex flex-col min-w-0" style={{ fontFamily: signatureFont || "Arial, sans-serif" }}>
            <span className="truncate text-sm font-bold text-[#1E293B] leading-tight">
              {fullName}
            </span>
            <span className="truncate text-[12px] text-[#64748B] leading-snug">
              {displayCompany}
            </span>
            <span
              className="truncate text-[12px] font-medium leading-snug"
              style={{ color: brandColor || "#245FD4" }}
            >
              {displayEmail}
            </span>
          </div>
        </div>
      </div>

      {/* Footer Meta Label */}
      <div className="mt-3 text-center sm:text-left">
        <span
          className="text-[12px] font-medium text-[#94A3B8]"
          style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
        >
          {templateLabel} template · {signatureFont} · {displayFormat}
        </span>
      </div>
    </div>
  );
}
