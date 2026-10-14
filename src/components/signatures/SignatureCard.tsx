"use client";

import Image from "next/image";

import { TemplateSignatureData } from "@/types/template";

export interface SignatureItem {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  company: string;
  tagline: string;
  updatedAt: string;
  templateType: "sophia" | "john" | "support" | "custom" | "minimal";
  avatarUrl?: string;
  address?: string;
  website?: string;
  themeColor?: string;
  fontFamily?: string;
  templateId?: string;
  rawTemplateData?: TemplateSignatureData;
}

interface SignatureCardProps {
  signature: SignatureItem;
  onEdit: (id: string) => void;
  onDuplicate: (id: string) => void;
  onExport: (id: string) => void;
  onDelete: (signature: SignatureItem) => void;
}

export default function SignatureCard({
  signature,
  onEdit,
  onDuplicate,
  onExport,
  onDelete,
}: SignatureCardProps) {
  const themeColor = signature.themeColor || "#245FD4";

  return (
    <div className="group flex flex-col justify-between rounded-xl border border-[#E2E8F0] bg-white shadow-xs transition-all hover:shadow-md hover:border-slate-300">
      {/* Top Preview Section */}
      <div className="relative overflow-hidden rounded-t-xl bg-[#F8FAFC] p-3 sm:p-3.5 min-h-[148px] flex items-center justify-center">
        {/* Sophia Clark template preview */}
        {signature.templateType === "sophia" && (
          <div className="w-full rounded-lg bg-gradient-to-r from-[#FFF5F7] via-[#FAF5FF] to-[#F5F3FF] p-3 border border-purple-50/80 shadow-2xs">
            <div className="flex items-start justify-between gap-2.5">
              {/* Avatar + Personal info */}
              <div className="flex items-start gap-2.5 min-w-0">
                <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border-2 border-white shadow-xs">
                  <Image
                    src={signature.avatarUrl || "/sophia-clark.png"}
                    alt={signature.name}
                    width={44}
                    height={44}
                    className="h-full w-full object-cover"
                    unoptimized={signature.avatarUrl?.startsWith("data:")}
                  />
                </div>
                <div className="min-w-0 space-y-0.5">
                  <h5 className="text-[12px] font-bold text-[#1E293B] leading-tight truncate">
                    {signature.name}
                  </h5>
                  <p className="text-[10px] font-medium text-[#64748B] leading-tight">
                    {signature.role}
                  </p>
                  <p className="text-[9px] text-[#94A3B8] leading-tight truncate">
                    {signature.email}
                  </p>
                  <p className="text-[9px] text-[#94A3B8] leading-tight">
                    {signature.phone}
                  </p>
                  {/* Social pills */}
                  <div className="flex items-center gap-1 pt-0.5">
                    <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#8B5CF6] text-[7px] text-white font-bold">f</span>
                    <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#A855F7] text-[7px] text-white font-bold">in</span>
                    <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#C084FC] text-[7px] text-white font-bold">ig</span>
                  </div>
                </div>
              </div>

              {/* Company Branding */}
              <div className="flex flex-col items-end shrink-0 text-right">
                <div className="flex h-5 w-5 items-center justify-center rounded-md text-[#8B5CF6]">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <span className="mt-1 text-[10px] font-bold text-[#1E293B]">Company</span>
                <span className="text-[8px] text-[#94A3B8]">Tagline goes here</span>
              </div>
            </div>
          </div>
        )}

        {/* John Doe template preview */}
        {signature.templateType === "john" && (
          <div className="w-full overflow-hidden rounded-lg bg-white border border-slate-100 shadow-2xs flex items-stretch">
            {/* Left section: info */}
            <div className="flex-1 p-2.5 min-w-0">
              <div className="flex items-start gap-2">
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-slate-900 border border-slate-200">
                  <Image
                    src={signature.avatarUrl || "/john-doe.png"}
                    alt={signature.name}
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                    unoptimized={signature.avatarUrl?.startsWith("data:")}
                  />
                </div>
                <div className="min-w-0 space-y-0.5">
                  <h5 className="text-[12px] font-bold text-[#1E293B] leading-tight truncate">
                    {signature.name}
                  </h5>
                  <p className="text-[10px] font-medium text-[#64748B] leading-tight">
                    {signature.role}
                  </p>
                  <p className="text-[8.5px] text-[#94A3B8] leading-tight truncate">
                    {signature.email}
                  </p>
                  <p className="text-[8.5px] text-[#94A3B8] leading-tight">
                    {signature.phone}
                  </p>
                  <div className="flex items-center gap-1 pt-0.5 text-[#245FD4]">
                    <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-blue-50 text-[7px] font-bold">in</span>
                    <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-blue-50 text-[7px] font-bold">f</span>
                    <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-blue-50 text-[7px] font-bold">𝕏</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right block: Dark blue banner */}
            <div className="w-[105px] shrink-0 bg-[#1D4ED8] p-2 flex flex-col justify-center text-white space-y-1.5">
              <div className="flex items-start gap-1">
                <svg className="h-3 w-3 shrink-0 text-blue-200 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span className="text-[7.5px] text-white/90 leading-tight">123 Business Ave, New York, NY 10001</span>
              </div>
              <div className="flex items-center gap-1">
                <svg className="h-3 w-3 shrink-0 text-blue-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                </svg>
                <span className="text-[7.5px] text-white/90 leading-tight">www.company.com</span>
              </div>
            </div>
          </div>
        )}

        {/* Support Team template preview */}
        {signature.templateType === "support" && (
          <div className="w-full rounded-lg bg-white p-3 border border-slate-100 shadow-2xs">
            <div className="flex items-start justify-between gap-2.5">
              {/* Headset badge */}
              <div className="flex items-start gap-2.5 min-w-0">
                <div className="flex h-12 w-10 shrink-0 items-center justify-center rounded-lg bg-[#0F172A] text-[#38BDF8] shadow-xs">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
                  </svg>
                </div>
                <div className="min-w-0 space-y-0.5">
                  <h5 className="text-[12px] font-bold text-[#1E293B] leading-tight truncate">
                    {signature.name}
                  </h5>
                  <p className="text-[10px] font-medium text-[#64748B] leading-tight">
                    {signature.role}
                  </p>
                  <p className="text-[9px] text-[#94A3B8] leading-tight truncate">
                    {signature.email}
                  </p>
                  <p className="text-[9px] text-[#94A3B8] leading-tight">
                    {signature.phone}
                  </p>
                  <div className="flex items-center gap-1 pt-0.5">
                    <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-blue-600 text-[7px] text-white font-bold">f</span>
                    <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-blue-700 text-[7px] text-white font-bold">in</span>
                    <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-cyan-600 text-[7px] text-white font-bold">𝕏</span>
                  </div>
                </div>
              </div>

              {/* Company Branding */}
              <div className="flex flex-col items-end shrink-0 text-right">
                <div className="flex h-5 w-5 items-center justify-center rounded-md text-[#2563EB]">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <span className="mt-1 text-[10px] font-bold text-[#1E293B]">Company</span>
                <span className="text-[8px] text-[#94A3B8]">Tagline goes here</span>
              </div>
            </div>
          </div>
        )}

        {/* Custom / Minimal template preview */}
        {(signature.templateType === "custom" || signature.templateType === "minimal") && (
          <div className="w-full rounded-lg bg-white p-3 border border-slate-100 shadow-2xs">
            <div className="flex items-center justify-between gap-3">
              {/* Left: Avatar + Socials */}
              <div className="flex flex-col items-center gap-1 shrink-0">
                <div className="relative h-11 w-11 overflow-hidden rounded-lg bg-slate-100 border border-slate-200 shadow-2xs">
                  {signature.avatarUrl ? (
                    <Image
                      src={signature.avatarUrl}
                      alt={signature.name}
                      width={44}
                      height={44}
                      className="h-full w-full object-cover"
                      unoptimized={signature.avatarUrl.startsWith("data:")}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-blue-50 text-[11px] font-bold text-[#245FD4]">
                      {signature.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
                {/* Social icons */}
                <div className="flex items-center gap-0.5">
                  <span className="flex h-3 w-3 items-center justify-center rounded-xs bg-[#0077B5] text-[6px] font-bold text-white">in</span>
                  <span className="flex h-3 w-3 items-center justify-center rounded-xs bg-[#000000] text-[6px] font-bold text-white">𝕏</span>
                  <span className="flex h-3 w-3 items-center justify-center rounded-xs bg-[#1877F2] text-[6px] font-bold text-white">f</span>
                </div>
              </div>

              {/* Middle: Details */}
              <div className="min-w-0 flex-1 space-y-0.5">
                <h5 className="text-[12px] font-bold text-[#1E293B] leading-tight truncate">
                  {signature.name}
                </h5>
                <p className="text-[10px] font-medium text-[#64748B] leading-tight truncate">
                  {signature.role}
                </p>
                <div className="pt-0.5 space-y-0.5 text-[8.5px] text-[#64748B]">
                  {signature.phone && (
                    <div className="flex items-center gap-1 truncate">
                      <span style={{ color: themeColor }} className="font-bold">&#9742;</span>
                      <span className="truncate">{signature.phone}</span>
                    </div>
                  )}
                  {signature.email && (
                    <div className="flex items-center gap-1 truncate">
                      <span style={{ color: themeColor }} className="font-bold">&#9993;</span>
                      <span className="truncate">{signature.email}</span>
                    </div>
                  )}
                  {signature.website && (
                    <div className="flex items-center gap-1 truncate">
                      <span style={{ color: themeColor }} className="font-bold">&#9873;</span>
                      <span className="truncate">{signature.website}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Vertical divider */}
              <div className="h-12 w-px bg-slate-200 shrink-0" />

              {/* Right: Company */}
              <div className="flex flex-col items-center justify-center text-center shrink-0 w-[72px]">
                <svg width="22" height="22" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 8H26C28.2091 8 30 9.79086 30 12V20C30 22.2091 28.2091 24 26 24H22" stroke={themeColor} strokeWidth="4" strokeLinecap="round" />
                  <path d="M26 30H12C9.79086 30 8 28.2091 8 26V18C8 15.7909 9.79086 14 12 14H16" stroke={themeColor} strokeWidth="4" strokeLinecap="round" />
                </svg>
                <span className="mt-1 text-[8.5px] font-bold text-[#1E293B] leading-tight truncate max-w-full">
                  {signature.company || "Company"}
                </span>
                {signature.tagline && (
                  <span className="text-[7.5px] text-[#94A3B8] leading-tight truncate max-w-full">
                    {signature.tagline}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Middle Info Row */}
      <div className="flex items-center justify-between p-3.5 pb-2.5">
        <div>
          <h4
            className="text-[14px] font-bold text-[#1E293B]"
            style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
          >
            {signature.name}
          </h4>
          <p
            className="text-[12px] text-[#94A3B8]"
            style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
          >
            {signature.updatedAt}
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
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          <span>Duplicate</span>
        </button>

        {/* Export */}
        <button
          type="button"
          onClick={() => onExport(signature.id)}
          className="flex items-center gap-1.5 font-medium text-[#64748B] transition hover:text-[#1E293B]"
          style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <span>Export</span>
        </button>

        {/* Delete */}
        <button
          type="button"
          onClick={() => onDelete(signature)}
          className="flex items-center gap-1.5 font-medium text-[#DC2626] transition hover:text-[#B91C1C]"
          style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
