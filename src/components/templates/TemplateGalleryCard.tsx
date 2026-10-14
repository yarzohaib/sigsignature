"use client";

import Image from "next/image";
import { TemplateItem } from "@/types/template";

interface TemplateGalleryCardProps {
  template: TemplateItem;
  onUseTemplate: (template: TemplateItem) => void;
  onPreview?: (template: TemplateItem) => void;
}

export default function TemplateGalleryCard({
  template,
  onUseTemplate,
}: TemplateGalleryCardProps) {
  const { defaultData } = template;

  return (
    <div
      className="group relative flex flex-col justify-between overflow-hidden rounded-[14px] border border-[#EEF0F4] bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
      style={{
        boxShadow: "0px 1px 3px rgba(16, 24, 40, 0.04)",
      }}
    >
      {/* Featured Star Badge */}
      {template.isFeatured && (
        <div className="absolute top-3.5 right-3.5 z-20 flex h-6 w-6 items-center justify-center text-amber-400">
          <svg className="h-4 w-4 fill-amber-400" viewBox="0 0 24 24">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </div>
      )}

      {/* Signature Preview Area */}
      <div className="relative flex min-h-[160px] w-full items-center justify-center bg-white p-4 sm:p-5">
        <div className="flex w-full items-center justify-between gap-4">
          {/* Avatar + Socials */}
          <div className="flex flex-col items-center gap-1.5 shrink-0">
            <div className="relative h-14 w-14 overflow-hidden rounded-xl bg-slate-100 border border-slate-200 shadow-2xs">
              <Image
                src={defaultData.avatarUrl || "/daniel-wilson.png"}
                alt={defaultData.fullName}
                width={56}
                height={56}
                className="h-full w-full object-cover"
              />
            </div>
            {/* Social Icons row */}
            <div className="flex items-center gap-1">
              <span className="flex h-3.5 w-3.5 items-center justify-center rounded-sm bg-[#0077B5] text-[7px] font-bold text-white">in</span>
              <span className="flex h-3.5 w-3.5 items-center justify-center rounded-sm bg-[#000000] text-[7px] font-bold text-white">𝕏</span>
              <span className="flex h-3.5 w-3.5 items-center justify-center rounded-sm bg-[#1877F2] text-[7px] font-bold text-white">f</span>
            </div>
          </div>

          {/* Details */}
          <div className="min-w-0 flex-1 space-y-0.5">
            <h4 className="text-[13px] font-bold text-[#1E293B] leading-tight truncate">
              {defaultData.fullName}
            </h4>
            <p className="text-[10.5px] font-medium text-[#64748B] leading-tight">
              {defaultData.jobTitle}
            </p>
            <div className="pt-1 space-y-0.5 text-[9px] text-[#64748B]">
              <div className="flex items-center gap-1 truncate">
                <span className="text-[#245FD4] font-bold">&#9742;</span>
                <span>{defaultData.phone}</span>
              </div>
              <div className="flex items-center gap-1 truncate">
                <span className="text-[#245FD4] font-bold">&#9993;</span>
                <span className="truncate">{defaultData.email}</span>
              </div>
              <div className="flex items-center gap-1 truncate">
                <span className="text-[#245FD4] font-bold">&#9873;</span>
                <span className="truncate">{defaultData.website}</span>
              </div>
            </div>
          </div>

          {/* Vertical Divider */}
          <div className="h-14 w-px bg-slate-200" />

          {/* Company Logo and Name */}
          <div className="flex flex-col items-center justify-center text-center shrink-0 w-[80px]">
            <svg width="28" height="28" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 8H26C28.2091 8 30 9.79086 30 12V20C30 22.2091 28.2091 24 26 24H22" stroke="#245FD4" strokeWidth="4" strokeLinecap="round" />
              <path d="M26 30H12C9.79086 30 8 28.2091 8 26V18C8 15.7909 9.79086 14 12 14H16" stroke="#245FD4" strokeWidth="4" strokeLinecap="round" />
            </svg>
            <span className="mt-1 text-[9px] font-bold text-[#1E293B] leading-tight">Company Name</span>
          </div>
        </div>

        {/* Hover Action Overlay matching Figma */}
        <div className="absolute inset-0 z-10 flex items-center justify-center gap-2.5 bg-slate-900/40 p-4 opacity-0 backdrop-blur-2xs transition-opacity duration-150 group-hover:opacity-100">
          <button
            type="button"
            onClick={() => onUseTemplate(template)}
            className="flex h-9 items-center justify-center gap-1.5 rounded-lg bg-cta-gradient bg-gradient-to-r from-[#245FD4] to-[#022977] px-5 text-xs font-semibold text-white shadow-xs transition hover:opacity-95 active:scale-95"
            style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
          >
            <span>Use This Template</span>
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Card Footer Bar */}
      <div className="flex items-center justify-between border-t border-[#EEF0F4] bg-white px-4 py-3">
        <div className="flex items-center gap-2">
          <span
            className="text-[13px] font-bold text-[#1E293B]"
            style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
          >
            {template.name}
          </span>
          <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-[#245FD4]">
            {template.category}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onUseTemplate(template)}
          className="rounded p-1 text-slate-400 hover:text-slate-600"
          aria-label="Options"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="5" r="1.5" />
            <circle cx="12" cy="12" r="1.5" />
            <circle cx="12" cy="19" r="1.5" />
          </svg>
        </button>
      </div>
    </div>
  );
}
