"use client";

import { useMemo, useState } from "react";
import { AVAILABLE_TEMPLATES } from "@/lib/templatesData";
import { generateTemplateHtml } from "@/lib/templates/renderTemplateHtml";
import SignaturePreviewFrame from "@/components/studio/SignaturePreviewFrame";
import PreviewSignatureModal from "@/components/studio/PreviewSignatureModal";
import { renderSavedSignatureHtml } from "@/lib/signatures/render";
import type { SavedSignature } from "@/types/signature";
import type { TemplateSignatureData } from "@/types/template";

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
  savedSignatures: SavedSignature[];
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
  savedSignatures,
}: StartingPointCardProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const selectedSavedSignature = savedSignatures.find(
    (signature) => signature.id === defaultTemplateId
  );
  const currentTemplate =
    AVAILABLE_TEMPLATES.find((t) => t.id === defaultTemplateId) ||
    AVAILABLE_TEMPLATES.find((t) => t.id === "photo-pop") ||
    AVAILABLE_TEMPLATES[0];

  const fullName = `${firstName || ""} ${lastName || ""}`.trim() || "John Doe";
  const displayCompany = companyName || "Your company";
  const displayEmail = email || "john@example.com";
  const displayFormat = defaultExportFormat === "plain" ? "Plain" : "HTML";

  const previewHtml = useMemo(() => {
    if (selectedSavedSignature) {
      try {
        return renderSavedSignatureHtml(selectedSavedSignature, { preview: true });
      } catch {
        return "";
      }
    }

    const base = currentTemplate?.defaultData || AVAILABLE_TEMPLATES[0].defaultData;
    const data: TemplateSignatureData = {
      ...base,
      templateId: currentTemplate?.id || "photo-pop",
      fullName,
      email: displayEmail,
      companyName: displayCompany,
      avatarUrl: includePhoto ? (avatarUrl || base.avatarUrl || "") : "",
      themeColor: brandColor || base.themeColor,
      fontFamily: signatureFont || base.fontFamily,
    };
    try {
      return generateTemplateHtml(data);
    } catch {
      return "";
    }
  }, [
    selectedSavedSignature,
    currentTemplate,
    fullName,
    displayEmail,
    displayCompany,
    includePhoto,
    avatarUrl,
    brandColor,
    signatureFont,
  ]);

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
        <button
          type="button"
          onClick={() => setIsPreviewOpen(true)}
          className="rounded-lg p-1 text-slate-400 transition hover:bg-blue-50 hover:text-[#245FD4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#245FD4]"
          aria-label="Preview starting signature"
          title="Preview signature"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </button>
      </div>

      {/* Real Signature Preview Box */}
      <div className="mt-2 overflow-hidden rounded-xl border border-slate-100 bg-[#F8FAFC] p-2">
        <SignaturePreviewFrame html={previewHtml} />
      </div>

      {/* Footer Meta Label */}
      <div className="mt-3 text-center sm:text-left">
        <span
          className="text-[12px] font-medium text-[#94A3B8]"
          style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
        >
          {selectedSavedSignature
            ? `${selectedSavedSignature.name} · Saved signature`
            : `${currentTemplate.name} template · ${signatureFont} · ${displayFormat}`}
        </span>
      </div>

      <PreviewSignatureModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        html={previewHtml}
        showCanvasTab={false}
      />
    </div>
  );
}
