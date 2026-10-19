"use client";

import { AVAILABLE_TEMPLATES } from "@/lib/templatesData";

export const EMAIL_SAFE_FONTS = [
  "Arimo",
  "Arial",
  "Georgia",
  "Verdana",
  "Tahoma",
  "Trebuchet MS",
  "Times New Roman",
] as const;

interface SignatureDefaultsCardProps {
  defaultTemplateId: string | null;
  defaultExportFormat: "html" | "plain";
  signatureFont: string;
  brandColor: string;
  includePhoto: boolean;
  brandColorError?: string;
  onTemplateChange: (val: string) => void;
  onExportFormatChange: (val: "html" | "plain") => void;
  onFontChange: (val: string) => void;
  onBrandColorChange: (val: string) => void;
  onIncludePhotoChange: (val: boolean) => void;
}

export default function SignatureDefaultsCard({
  defaultTemplateId,
  defaultExportFormat,
  signatureFont,
  brandColor,
  includePhoto,
  brandColorError,
  onTemplateChange,
  onExportFormatChange,
  onFontChange,
  onBrandColorChange,
  onIncludePhotoChange,
}: SignatureDefaultsCardProps) {
  // Normalize template selection to either valid id or the first template
  const currentTemplateId =
    defaultTemplateId || AVAILABLE_TEMPLATES[0]?.id || "professional-minimal";

  return (
    <div className="rounded-2xl border border-[#E1E6EF] bg-white p-6 shadow-xs">
      {/* Header */}
      <div className="flex items-start gap-3 pb-5 border-b border-[#F1F5F9]">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#245FD4]">
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="21" x2="4" y2="14" />
            <line x1="4" y1="10" x2="4" y2="3" />
            <line x1="12" y1="21" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12" y2="3" />
            <line x1="20" y1="21" x2="20" y2="16" />
            <line x1="20" y1="12" x2="20" y2="3" />
            <line x1="1" y1="14" x2="7" y2="14" />
            <line x1="9" y1="8" x2="15" y2="8" />
            <line x1="17" y1="16" x2="23" y2="16" />
          </svg>
        </div>
        <div>
          <h2
            className="text-[18px] font-semibold text-[#172238] leading-tight"
            style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
          >
            Signature defaults
          </h2>
          <p
            className="mt-0.5 text-[13px] text-[#6B7280]"
            style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
          >
            A consistent starting point for every new signature.
          </p>
        </div>
      </div>

      {/* 2x2 Grid of Settings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-5 pb-5 border-b border-[#F1F5F9]">
        {/* Default template */}
        <div>
          <label
            htmlFor="default-template-select"
            className="block text-[13px] font-semibold text-[#1E293B] mb-1.5"
            style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
          >
            Default template
          </label>
          <div className="relative">
            <select
              id="default-template-select"
              value={currentTemplateId}
              onChange={(e) => onTemplateChange(e.target.value)}
              className="w-full appearance-none rounded-xl border border-[#E2E8F0] bg-white px-3.5 py-2.5 text-sm text-[#1E293B] focus:border-[#245FD4] focus:outline-none focus:ring-2 focus:ring-blue-100 transition cursor-pointer pr-10"
              style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
            >
              {AVAILABLE_TEMPLATES.map((tmpl) => (
                <option key={tmpl.id} value={tmpl.id}>
                  {tmpl.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </div>
        </div>

        {/* Default export format */}
        <div>
          <label
            htmlFor="default-export-select"
            className="block text-[13px] font-semibold text-[#1E293B] mb-1.5"
            style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
          >
            Default export format
          </label>
          <div className="relative">
            <select
              id="default-export-select"
              value={defaultExportFormat}
              onChange={(e) => onExportFormatChange(e.target.value as "html" | "plain")}
              className="w-full appearance-none rounded-xl border border-[#E2E8F0] bg-white px-3.5 py-2.5 text-sm text-[#1E293B] focus:border-[#245FD4] focus:outline-none focus:ring-2 focus:ring-blue-100 transition cursor-pointer pr-10"
              style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
            >
              <option value="html">HTML</option>
              <option value="plain">Plain text</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </div>
        </div>

        {/* Signature font */}
        <div>
          <label
            htmlFor="signature-font-select"
            className="block text-[13px] font-semibold text-[#1E293B] mb-1.5"
            style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
          >
            Signature font
          </label>
          <div className="relative">
            <select
              id="signature-font-select"
              value={signatureFont}
              onChange={(e) => onFontChange(e.target.value)}
              className="w-full appearance-none rounded-xl border border-[#E2E8F0] bg-white px-3.5 py-2.5 text-sm text-[#1E293B] focus:border-[#245FD4] focus:outline-none focus:ring-2 focus:ring-blue-100 transition cursor-pointer pr-10"
              style={{ fontFamily: signatureFont }}
            >
              {EMAIL_SAFE_FONTS.map((font) => (
                <option key={font} value={font} style={{ fontFamily: font }}>
                  {font}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </div>
        </div>

        {/* Brand color */}
        <div>
          <label
            htmlFor="brand-color-input"
            className="block text-[13px] font-semibold text-[#1E293B] mb-1.5"
            style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
          >
            Brand color
          </label>
          <div className="relative flex items-center gap-2">
            {/* Color swatch & native color input */}
            <label
              htmlFor="brand-color-picker"
              className="relative flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-slate-200 shadow-2xs overflow-hidden transition hover:scale-105"
              style={{ backgroundColor: brandColor || "#245FD4" }}
              title="Pick a color"
            >
              <input
                id="brand-color-picker"
                type="color"
                value={brandColor?.startsWith("#") && brandColor.length === 7 ? brandColor : "#245FD4"}
                onChange={(e) => onBrandColorChange(e.target.value.toUpperCase())}
                className="absolute inset-0 h-full w-full opacity-0 cursor-pointer"
              />
            </label>

            {/* Hex input */}
            <input
              id="brand-color-input"
              type="text"
              value={brandColor}
              maxLength={7}
              onChange={(e) => onBrandColorChange(e.target.value)}
              placeholder="#245FD4"
              className={`w-full rounded-xl border px-3.5 py-2.5 text-sm font-mono uppercase text-[#1E293B] transition focus:outline-none focus:ring-2 ${
                brandColorError
                  ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                  : "border-[#E2E8F0] focus:border-[#245FD4] focus:ring-blue-100"
              }`}
            />
          </div>
          {brandColorError && (
            <p className="mt-1 text-xs text-red-600">{brandColorError}</p>
          )}
        </div>
      </div>

      {/* Include profile photo toggle row */}
      <div className="flex items-center justify-between py-4">
        <div>
          <h4
            className="text-sm font-medium text-[#172238]"
            style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
          >
            Include profile photo
          </h4>
          <p
            className="mt-0.5 text-xs text-[#6B7280]"
            style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
          >
            Add your photo to new signatures by default.
          </p>
        </div>

        {/* Toggle switch */}
        <button
          type="button"
          role="switch"
          aria-checked={includePhoto}
          onClick={() => onIncludePhotoChange(!includePhoto)}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#245FD4] focus:ring-offset-2 ${
            includePhoto ? "bg-[#245FD4]" : "bg-slate-200"
          }`}
        >
          <span
            aria-hidden="true"
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
              includePhoto ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* Note line */}
      {/* <div className="pt-2 flex items-center gap-2 text-[12px] text-[#64748B]">
        <svg className="h-4 w-4 shrink-0 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
        <span style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}>
          Defaults apply to new signatures. Existing designs stay unchanged.
        </span>
      </div> */}
    </div>
  );
}
