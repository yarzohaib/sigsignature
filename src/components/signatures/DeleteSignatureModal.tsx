"use client";

import { useEffect } from "react";

interface DeleteSignatureModalProps {
  isOpen: boolean;
  signatureName: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteSignatureModal({
  isOpen,
  signatureName,
  onClose,
  onConfirm,
}: DeleteSignatureModalProps) {
  // Close on Escape key press
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
      onClick={onClose}
    >
      {/* Modal card: 420px width, 16px radius, drop shadow 0 25px 50px -12px rgba(0,0,0,0.25) per Figma */}
      <div
        className="w-full max-w-[420px] rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 transition-all transform scale-100 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        }}
      >
        {/* Header row with trash icon badge, title and close button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Trash icon badge: soft red background */}
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#FEF2F2] text-[#DC2626]">
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                <line x1="10" y1="11" x2="10" y2="17" />
                <line x1="14" y1="11" x2="14" y2="17" />
              </svg>
            </div>
            <h3
              id="delete-dialog-title"
              className="text-[17px] font-bold text-[#1E293B]"
              style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
            >
              Delete Signature
            </h3>
          </div>

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-[#94A3B8] transition hover:bg-slate-100 hover:text-[#64748B]"
            aria-label="Close dialog"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal message body */}
        <div className="mt-4 space-y-1 text-left">
          <p
            className="text-[14px] leading-relaxed text-[#64748B]"
            style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
          >
            Are you sure you want to delete &ldquo;<span className="font-semibold text-[#1E293B]">{signatureName}</span>&rdquo;?
          </p>
          <p
            className="text-[13px] text-[#94A3B8]"
            style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
          >
            This action cannot be undone.
          </p>
        </div>

        {/* Modal actions: Cancel and Delete */}
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-[14px] font-medium text-[#64748B] transition hover:bg-slate-100 hover:text-[#1E293B]"
            style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-lg bg-[#DC2626] px-6 py-2 text-[14px] font-semibold text-white shadow-xs transition hover:bg-[#B91C1C] active:scale-98"
            style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
