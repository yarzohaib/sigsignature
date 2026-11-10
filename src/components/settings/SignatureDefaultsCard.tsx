"use client";

import type { SavedSignature } from "@/types/signature";
import Select from "@/components/ui/Select";
import ColorPickerPopover from "@/components/ui/ColorPickerPopover";

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
  savedSignatures: SavedSignature[];
  brandColorError?: string;
  onTemplateChange: (val: string) => void;
  onExportFormatChange: (val: "html" | "plain") => void;
  onFontChange: (val: string) => void;
  onBrandColorChange: (val: string) => void;
  onIncludePhotoChange: (val: boolean) => void;
}

export default function SignatureDefaultsCard({
  defaultTemplateId: selectedDefaultId,
  defaultExportFormat,
  signatureFont,
  brandColor,
  includePhoto,
  savedSignatures,
  brandColorError,
  onTemplateChange,
  onExportFormatChange,
  onFontChange,
  onBrandColorChange,
  onIncludePhotoChange,
}: SignatureDefaultsCardProps) {
  const currentTemplateId = selectedDefaultId && savedSignatures.some(
    (signature) => signature.id === selectedDefaultId
  )
    ? selectedDefaultId
    : "photo-pop";

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
            Default signature
          </label>
          <Select
            id="default-template-select"
            value={currentTemplateId}
            onValueChange={onTemplateChange}
            options={[
              { value: "photo-pop", label: "Photo Pop (Default)" },
              ...savedSignatures.map((signature) => ({ value: signature.id, label: signature.name })),
            ]}
            className="w-full"
            style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
          />
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
          <Select
            id="default-export-select"
            value={defaultExportFormat}
            onValueChange={(value) => onExportFormatChange(value as "html" | "plain")}
            options={[
              { value: "html", label: "HTML" },
              { value: "plain", label: "Plain text" },
            ]}
            className="w-full"
            style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
          />
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
          <Select
            id="signature-font-select"
            value={signatureFont}
            onValueChange={onFontChange}
            options={EMAIL_SAFE_FONTS.map((font) => ({ value: font, label: font }))}
            className="w-full"
            style={{ fontFamily: signatureFont }}
          />
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
            {/* Color swatch & in-page popover */}
            <ColorPickerPopover
              value={brandColor || "#245FD4"}
              onChange={(hex) => onBrandColorChange(hex)}
              label="Brand color"
              size="default"
            />

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
