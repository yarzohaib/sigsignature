"use client";

import Image from "next/image";
import { TemplateItem } from "@/types/template";

interface TemplateSignatureThumbnailProps {
  template: TemplateItem;
}

export default function TemplateSignatureThumbnail({
  template,
}: TemplateSignatureThumbnailProps) {
  const { id, defaultData } = template;

  // 1. Minimal Clean (John Smith)
  if (id === "minimal-clean") {
    return (
      <div className="flex h-full w-full items-center justify-between bg-white p-5 select-none">
        <div className="flex items-start gap-3.5 min-w-0">
          <div className="relative h-[52px] w-[52px] shrink-0 overflow-hidden rounded-lg bg-slate-100 border border-slate-200/60 shadow-2xs">
            <Image
              src={defaultData.avatarUrl || "/damon-sterling.png"}
              alt={defaultData.fullName || "Avatar"}
              fill
              className="object-cover"
              sizes="52px"
            />
          </div>
          <div className="min-w-0">
            <h4
              className="text-[14px] font-bold text-[#1E293B] leading-tight truncate"
              style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
            >
              {defaultData.fullName || "John Smith"}
            </h4>
            <p
              className="text-[11px] font-medium text-[#245FD4] leading-tight mt-0.5 truncate"
              style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
            >
              {defaultData.jobTitle || "Marketing Manager"}
            </p>
            <div className="mt-2 space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                <svg className="h-3 w-3 shrink-0 text-[#245FD4]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span className="truncate">{defaultData.phone || "+1 (555) 123-4567"}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                <svg className="h-3 w-3 shrink-0 text-[#245FD4]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <span className="truncate">{defaultData.email || "john@company.com"}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                <svg className="h-3 w-3 shrink-0 text-[#245FD4]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                  <path d="M2 12h20" />
                </svg>
                <span className="truncate">{defaultData.website || "www.company.com"}</span>
              </div>
            </div>
            {/* Social Icons */}
            <div className="mt-2.5 flex items-center gap-1.5">
              <span className="flex h-4 w-4 items-center justify-center rounded bg-[#245FD4] text-[8px] font-bold text-white shadow-2xs">in</span>
              <span className="flex h-4 w-4 items-center justify-center rounded bg-[#245FD4] text-[8px] font-bold text-white shadow-2xs">𝕏</span>
              <span className="flex h-4 w-4 items-center justify-center rounded bg-[#245FD4] text-[8px] font-bold text-white shadow-2xs">f</span>
            </div>
          </div>
        </div>

        {/* Company block on right */}
        <div className="border-l border-slate-200 pl-4 py-2 text-center shrink-0 w-[95px]">
          <span
            className="block text-[11px] font-extrabold uppercase tracking-wider text-[#1E293B]"
            style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
          >
            {defaultData.companyName || "COMPANY"}
          </span>
          <span
            className="block text-[8px] text-slate-400 mt-0.5 leading-tight"
            style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
          >
            {defaultData.optional?.tagline || "Tagline goes here"}
          </span>
        </div>
      </div>
    );
  }

  // 2. Modern Dark (Olivia Rhye)
  if (id === "modern-dark") {
    return (
      <div className="flex h-full w-full items-center bg-[#0B132B] p-5 select-none text-white">
        <div className="flex items-center gap-4 min-w-0">
          <div className="relative h-[54px] w-[54px] shrink-0 rounded-full p-[2px] bg-gradient-to-tr from-[#3B82F6] via-[#8B5CF6] to-[#EC4899] shadow-[0_0_12px_rgba(139,92,246,0.5)]">
            <div className="relative h-full w-full overflow-hidden rounded-full bg-[#0B132B]">
              <Image
                src={defaultData.avatarUrl || "/sophia-reynolds.png"}
                alt={defaultData.fullName || "Avatar"}
                fill
                className="object-cover"
                sizes="54px"
              />
            </div>
          </div>
          <div className="min-w-0">
            <h4
              className="text-[14px] font-bold text-white leading-tight truncate"
              style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
            >
              {defaultData.fullName || "Olivia Rhye"}
            </h4>
            <p
              className="text-[11px] font-medium text-slate-400 leading-tight mt-0.5 truncate"
              style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
            >
              {defaultData.jobTitle || "Product Designer"}
            </p>
            <div className="mt-2 space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] text-slate-300">
                <svg className="h-3 w-3 shrink-0 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span className="truncate">{defaultData.phone || "+1 (555) 987-6543"}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-300">
                <svg className="h-3 w-3 shrink-0 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <span className="truncate">{defaultData.email || "olivia@company.com"}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-300">
                <svg className="h-3 w-3 shrink-0 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                  <path d="M2 12h20" />
                </svg>
                <span className="truncate">{defaultData.website || "www.company.com"}</span>
              </div>
            </div>
            {/* Social Icons */}
            <div className="mt-2.5 flex items-center gap-1.5">
              <span className="flex h-4 w-4 items-center justify-center rounded bg-slate-800 text-[8px] font-bold text-slate-200">in</span>
              <span className="flex h-4 w-4 items-center justify-center rounded bg-slate-800 text-[8px] font-bold text-slate-200">gh</span>
              <span className="flex h-4 w-4 items-center justify-center rounded bg-slate-800 text-[8px] font-bold text-slate-200">𝕏</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. Pastel Creative (Sophia Clark)
  if (id === "pastel-creative") {
    return (
      <div className="flex h-full w-full items-center justify-between bg-white p-5 select-none">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="relative h-[52px] w-[52px] shrink-0 overflow-hidden rounded-full border border-pink-100 shadow-2xs">
            <Image
              src={defaultData.avatarUrl || "/sophia-clark.png"}
              alt={defaultData.fullName || "Avatar"}
              fill
              className="object-cover"
              sizes="52px"
            />
          </div>
          <div className="min-w-0">
            <h4
              className="text-[14px] font-bold text-[#1E293B] leading-tight truncate"
              style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
            >
              {defaultData.fullName || "Sophia Clark"}
            </h4>
            <p
              className="text-[11px] font-semibold text-[#A855F7] leading-tight mt-0.5 truncate"
              style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
            >
              {defaultData.jobTitle || "HR Manager"}
            </p>
            <div className="mt-2 space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                <svg className="h-3 w-3 shrink-0 text-[#EC4899]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span className="truncate">{defaultData.phone || "+1 (555) 222-3344"}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                <svg className="h-3 w-3 shrink-0 text-[#EC4899]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <span className="truncate">{defaultData.email || "sophia@company.com"}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                <svg className="h-3 w-3 shrink-0 text-[#EC4899]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                  <path d="M2 12h20" />
                </svg>
                <span className="truncate">{defaultData.website || "www.company.com"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Circular pastel social badges */}
        <div className="flex flex-col items-end justify-between h-full py-1">
          <div className="flex items-center gap-1.5 text-[#EC4899]">
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            </svg>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FDF2F8] text-[9px] font-bold text-[#EC4899] border border-[#FBCFE8]">in</span>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FDF2F8] text-[9px] font-bold text-[#EC4899] border border-[#FBCFE8]">ig</span>
          </div>
        </div>
      </div>
    );
  }

  // 4. Corporate Elegant (Michael Brown) - Split card
  if (id === "corporate-elegant") {
    return (
      <div className="flex h-full w-full select-none overflow-hidden">
        {/* Left deep blue block */}
        <div className="w-[34%] bg-[#163BA4] flex items-center justify-center p-3 text-center">
          <span
            className="text-[10px] font-extrabold uppercase tracking-widest text-white leading-tight"
            style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
          >
            {defaultData.companyName || "ACME CORPORATION"}
          </span>
        </div>

        {/* Right white details block */}
        <div className="w-[66%] bg-white p-4 flex flex-col justify-center">
          <h4
            className="text-[14px] font-bold text-[#1E293B] leading-tight truncate"
            style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
          >
            {defaultData.fullName || "Michael Brown"}
          </h4>
          <p
            className="text-[11px] font-medium text-slate-500 leading-tight mt-0.5 truncate"
            style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
          >
            {defaultData.jobTitle || "CEO"}
          </p>
          <div className="mt-2 space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
              <svg className="h-3 w-3 shrink-0 text-[#163BA4]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span className="truncate">{defaultData.phone || "+1 (555) 326-5432"}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
              <svg className="h-3 w-3 shrink-0 text-[#163BA4]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              <span className="truncate">{defaultData.email || "michael@acme.com"}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
              <svg className="h-3 w-3 shrink-0 text-[#163BA4]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                <path d="M2 12h20" />
              </svg>
              <span className="truncate">{defaultData.website || "www.acme.com"}</span>
            </div>
          </div>
          {/* Social Icons */}
          <div className="mt-2 flex items-center gap-1.5">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#163BA4] text-[8px] font-bold text-white shadow-2xs">in</span>
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#163BA4] text-[8px] font-bold text-white shadow-2xs">𝕏</span>
          </div>
        </div>
      </div>
    );
  }

  // 5. Professional Minimal (Daniel Wilson)
  if (id === "professional-minimal") {
    return (
      <div className="relative flex h-full w-full items-center justify-between bg-white p-5 select-none">
        {/* Star Icon at Top Right */}
        <div className="absolute top-4 right-4 text-[#F59E0B]">
          <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </div>

        <div className="flex items-start gap-3.5 min-w-0">
          <div className="relative h-[52px] w-[52px] shrink-0 overflow-hidden rounded-lg bg-slate-100 border border-slate-200/60 shadow-2xs">
            <Image
              src={defaultData.avatarUrl || "/daniel-wilson.png"}
              alt={defaultData.fullName || "Avatar"}
              fill
              className="object-cover"
              sizes="52px"
            />
          </div>
          <div className="min-w-0">
            <h4
              className="text-[14px] font-bold text-[#1E293B] leading-tight truncate"
              style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
            >
              {defaultData.fullName || "Daniel Wilson"}
            </h4>
            <p
              className="text-[11px] font-medium text-slate-500 leading-tight mt-0.5 truncate"
              style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
            >
              {defaultData.jobTitle || "UX/UI Designer"}
            </p>
            <div className="mt-2 space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                <svg className="h-3 w-3 shrink-0 text-[#245FD4]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span className="truncate">{defaultData.phone || "+1 (555) 345-6789"}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                <svg className="h-3 w-3 shrink-0 text-[#245FD4]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <span className="truncate">{defaultData.email || "daniel@company.com"}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                <svg className="h-3 w-3 shrink-0 text-[#245FD4]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                  <path d="M2 12h20" />
                </svg>
                <span className="truncate">{defaultData.website || "www.company.com"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 6. Bold Gradient (James Anderson)
  if (id === "bold-gradient") {
    return (
      <div className="flex h-full w-full items-center bg-gradient-to-br from-[#0B132B] via-[#0F172A] to-[#1E293B] p-5 select-none text-white">
        <div className="flex items-center gap-4 min-w-0">
          <div className="relative h-[52px] w-[52px] shrink-0 overflow-hidden rounded-lg bg-slate-800 border border-slate-700/60 shadow-2xs">
            <Image
              src={defaultData.avatarUrl || "/julian-montgomery.png"}
              alt={defaultData.fullName || "Avatar"}
              fill
              className="object-cover"
              sizes="52px"
            />
          </div>
          <div className="min-w-0">
            <h4
              className="text-[14px] font-bold text-white leading-tight truncate"
              style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
            >
              {defaultData.fullName || "James Anderson"}
            </h4>
            <p
              className="text-[11px] font-medium text-[#38BDF8] leading-tight mt-0.5 truncate"
              style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
            >
              {defaultData.jobTitle || "Sales Director"}
            </p>
            <div className="mt-2 space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] text-slate-300">
                <svg className="h-3 w-3 shrink-0 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span className="truncate">{defaultData.phone || "+1 (555) 654-3210"}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-300">
                <svg className="h-3 w-3 shrink-0 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <span className="truncate">{defaultData.email || "james@company.com"}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-300">
                <svg className="h-3 w-3 shrink-0 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                  <path d="M2 12h20" />
                </svg>
                <span className="truncate">{defaultData.website || "www.company.com"}</span>
              </div>
            </div>
            {/* Social Icons */}
            <div className="mt-2.5 flex items-center gap-1.5">
              <span className="flex h-4 w-4 items-center justify-center rounded bg-slate-800 text-[8px] font-bold text-slate-200">in</span>
              <span className="flex h-4 w-4 items-center justify-center rounded bg-slate-800 text-[8px] font-bold text-slate-200">gh</span>
              <span className="flex h-4 w-4 items-center justify-center rounded bg-slate-800 text-[8px] font-bold text-slate-200">f</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fallback layout for any other template
  return (
    <div className="flex h-full w-full items-center justify-between bg-white p-5 select-none">
      <div className="flex items-start gap-3.5 min-w-0">
        {defaultData.avatarUrl ? (
          <div className="relative h-[50px] w-[50px] shrink-0 overflow-hidden rounded-lg bg-slate-100 border border-slate-200/60 shadow-2xs">
            <Image
              src={defaultData.avatarUrl}
              alt={defaultData.fullName || "Avatar"}
              fill
              className="object-cover"
              sizes="50px"
            />
          </div>
        ) : (
          <div className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#245FD4] to-[#022977] text-white font-bold text-base shadow-2xs">
            {(defaultData.fullName || "U").slice(0, 2).toUpperCase()}
          </div>
        )}
        <div className="min-w-0">
          <h4
            className="text-[14px] font-bold text-[#1E293B] leading-tight truncate"
            style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
          >
            {defaultData.fullName || "Full Name"}
          </h4>
          <p
            className="text-[11px] font-medium text-slate-500 leading-tight mt-0.5 truncate"
            style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
          >
            {defaultData.jobTitle || "Job Title"}
          </p>
          <div className="mt-2 space-y-1">
            {defaultData.phone && (
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                <span className="font-bold text-[#245FD4] text-[9px]">T</span>
                <span className="truncate">{defaultData.phone}</span>
              </div>
            )}
            {defaultData.email && (
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                <span className="font-bold text-[#245FD4] text-[9px]">E</span>
                <span className="truncate">{defaultData.email}</span>
              </div>
            )}
            {defaultData.website && (
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                <span className="font-bold text-[#245FD4] text-[9px]">W</span>
                <span className="truncate">{defaultData.website}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
