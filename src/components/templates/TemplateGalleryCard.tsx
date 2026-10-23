"use client";

import { TemplateItem } from "@/types/template";
import TemplateSignatureThumbnail from "./TemplateSignatureThumbnail";

interface TemplateGalleryCardProps {
  template: TemplateItem;
  isDefault?: boolean;
  onUseTemplate: (template: TemplateItem) => void;
  onPreview?: (template: TemplateItem) => void;
}

export default function TemplateGalleryCard({
  template,
  isDefault = false,
  onUseTemplate,
  onPreview,
}: TemplateGalleryCardProps) {
  // Category badge colors matching Figma
  const getCategoryBadgeClass = (category: string) => {
    switch (category.toLowerCase()) {
      case "creative":
        return "bg-pink-50 text-[#EC4899]";
      case "bold":
        return "bg-slate-100 text-slate-700";
      case "corporate":
        return "bg-blue-50 text-[#245FD4]";
      case "minimal":
      default:
        return "bg-blue-50 text-[#245FD4]";
    }
  };

  return (
    <div
      className="group relative flex flex-col justify-between overflow-hidden rounded-[14px] border border-[#EEF0F4] bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
      style={{
        boxShadow: "0px 1px 3px rgba(16, 24, 40, 0.04)",
      }}
    >
      {/* Signature Preview Area: Standard Dimension aspect-[350/174], min-h-[174px] */}
      <div className="relative aspect-[350/174] min-h-[174px] w-full overflow-hidden bg-[#F8FAFC]">
        <TemplateSignatureThumbnail template={template} />

        {/* Hover Action Overlay with "Use This Template >" and "Preview" buttons matching Figma */}
        <div className="absolute inset-0 z-10 flex items-center justify-center gap-2.5 bg-slate-900/40 p-4 opacity-0 backdrop-blur-2xs transition-opacity duration-150 group-hover:opacity-100">
          <button
            type="button"
            onClick={() => onUseTemplate(template)}
            className="flex h-9 items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-[#245FD4] to-[#022977] px-4 text-xs font-semibold text-white shadow-xs transition hover:opacity-95 active:scale-95 cursor-pointer"
            style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
          >
            <span>Use This Template</span>
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          {onPreview && (
            <button
              type="button"
              onClick={() => onPreview(template)}
              className="flex h-9 items-center justify-center rounded-lg border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 active:scale-95 cursor-pointer"
              style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
            >
              Preview
            </button>
          )}
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
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${getCategoryBadgeClass(template.category)}`}>
            {template.category}
          </span>
          {isDefault && (
            <span className="rounded-full bg-[#022977] px-2 py-0.5 text-[10px] font-bold text-white shadow-2xs">
              Default
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => (onPreview ? onPreview(template) : onUseTemplate(template))}
          className="rounded p-1 text-slate-400 hover:text-slate-600 transition cursor-pointer"
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
