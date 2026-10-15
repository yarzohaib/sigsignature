"use client";

import { useEffect, useState } from "react";
import SignaturePreviewFrame from "./SignaturePreviewFrame";

interface PreviewSignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  html: string;
}

export default function PreviewSignatureModal({
  isOpen,
  onClose,
  html,
}: PreviewSignatureModalProps) {
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="preview-modal-title"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-[800px] flex-col rounded-2xl bg-white shadow-2xl border border-slate-200 transition-all transform scale-100 animate-in zoom-in-95 duration-150 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Title, Device Toggle, and Close */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E8F0] px-4 sm:px-6 py-3 sm:py-4 bg-slate-50/70 relative">
          <div className="pr-8 sm:pr-0">
            <h3
              id="preview-modal-title"
              className="text-base font-bold text-[#1E293B]"
              style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
            >
              Preview Signature
            </h3>
            <p
              className="text-xs text-[#64748B] mt-0.5"
              style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
            >
              Check how your signature appears in email clients
            </p>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
            {/* Device Switcher */}
            <div className="flex items-center rounded-xl bg-slate-200/70 p-1 flex-1 sm:flex-none justify-center">
              <button
                type="button"
                onClick={() => setDevice("desktop")}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-lg px-2.5 sm:px-3 py-1.5 text-xs font-semibold transition ${
                  device === "desktop"
                    ? "bg-white text-[#245FD4] shadow-xs"
                    : "text-[#64748B] hover:text-[#1E293B]"
                }`}
                style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
                <span className="whitespace-nowrap">Desktop (600px)</span>
              </button>

              <button
                type="button"
                onClick={() => setDevice("mobile")}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-lg px-2.5 sm:px-3 py-1.5 text-xs font-semibold transition ${
                  device === "mobile"
                    ? "bg-white text-[#245FD4] shadow-xs"
                    : "text-[#64748B] hover:text-[#1E293B]"
                }`}
                style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                  <line x1="12" y1="18" x2="12.01" y2="18" />
                </svg>
                <span className="whitespace-nowrap">Mobile (360px)</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="absolute top-3 right-3 sm:static flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-200/50 hover:text-slate-600 transition"
              aria-label="Close preview"
            >
              &times;
            </button>
          </div>
        </div>

        {/* Scrollable Email Body Canvas */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-[#F8FAFC] flex justify-center items-start">
          <div
            className="w-full bg-white rounded-xl border border-[#E2E8F0] shadow-xs transition-all duration-200 overflow-hidden"
            style={{
              maxWidth: device === "desktop" ? "600px" : "360px",
            }}
          >
            {/* Mock Email Message Header */}
            <div className="border-b border-[#F1F5F9] px-4 py-3 bg-white">
              <div className="flex items-center gap-2 text-xs text-[#64748B]">
                <span className="font-semibold text-[#1E293B]">To:</span>
                <span>client@example.com</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#64748B] mt-1.5">
                <span className="font-semibold text-[#1E293B]">Subject:</span>
                <span>Project Proposal & Next Steps</span>
              </div>
            </div>

            {/* Email Sample Text */}
            <div className="px-5 py-5 text-xs leading-relaxed text-[#475569]">
              <p>Hi there,</p>
              <p className="mt-2">
                Thank you for your time earlier today. Please find the attached details regarding our project timeline.
              </p>
              <p className="mt-2">
                Let me know if you have any questions!
              </p>
              <p className="mt-3">Best regards,</p>

              {/* Rendered Signature */}
              <div className="mt-4 pt-4 border-t border-slate-100">
                <SignaturePreviewFrame html={html} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
