"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SavedSignature } from "@/types/signature";

interface LimitOverwriteModalProps {
  isOpen: boolean;
  onClose: () => void;
  signatures: SavedSignature[];
  onSelectOverwrite: (targetSignature: SavedSignature) => Promise<void>;
}

export default function LimitOverwriteModal({
  isOpen,
  onClose,
  signatures,
  onSelectOverwrite,
}: LimitOverwriteModalProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen && !isSubmitting) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) return null;

  async function handleOverwrite(signature: SavedSignature) {
    setSelectedId(signature.id);
    setIsSubmitting(true);
    try {
      await onSelectOverwrite(signature);
    } finally {
      setIsSubmitting(false);
      setSelectedId(null);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="limit-dialog-title"
      onClick={() => {
        if (!isSubmitting) onClose();
      }}
    >
      <div
        className="w-full max-w-[480px] rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 transition-all transform scale-100 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <div>
              <h3
                id="limit-dialog-title"
                className="text-base sm:text-[17px] font-bold text-[#1E293B]"
                style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
              >
                Signature Limit Reached (3/3)
              </h3>
              <p
                className="text-xs text-[#64748B] mt-0.5"
                style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
              >
                Free accounts can keep up to 3 email signatures.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-lg p-1 text-[#94A3B8] transition hover:bg-slate-100 hover:text-[#64748B] disabled:opacity-50"
            aria-label="Close dialog"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Message */}
        <p
          className="mt-4 text-[13px] leading-relaxed text-[#475569]"
          style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
        >
          Select an existing signature below to <span className="font-semibold text-[#1E293B]">overwrite</span> with your new edits, or go to My Signatures to delete one you no longer need:
        </p>

        {/* Signatures List to Overwrite */}
        <div className="mt-4 flex flex-col gap-2.5 max-h-[220px] overflow-y-auto pr-1">
          {signatures.map((sig) => {
            const isThisSelected = selectedId === sig.id && isSubmitting;
            return (
              <div
                key={sig.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/60 p-3 transition hover:border-slate-300 hover:bg-slate-50"
              >
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs sm:text-[13px] font-bold text-[#1E293B] truncate">
                    {sig.name || "Untitled Signature"}
                  </h4>
                  <p className="text-[11px] text-[#64748B] truncate mt-0.5">
                    Template: <span className="font-medium text-[#475569]">{sig.templateId}</span> &bull; {sig.data?.jobTitle || sig.data?.email || "No details"}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleOverwrite(sig)}
                  disabled={isSubmitting}
                  className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg bg-[#245FD4] px-3 py-1.5 text-xs font-semibold text-white shadow-2xs transition hover:bg-blue-700 active:scale-95 disabled:opacity-60"
                  style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                >
                  {isThisSelected ? (
                    <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <span>Replace</span>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Action Buttons Footer */}
        <div className="mt-6 flex flex-col-reverse sm:flex-row items-center justify-between gap-2.5 pt-4 border-t border-slate-100">
          <Link
            href="/signatures"
            className="text-xs font-semibold text-[#245FD4] hover:underline"
            style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
          >
            Manage in My Signatures &rarr;
          </Link>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="w-full sm:w-auto rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-[#64748B] transition hover:bg-slate-50 hover:text-[#1E293B] disabled:opacity-50"
            style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
