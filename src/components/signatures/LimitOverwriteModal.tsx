"use client";

import { useEffect } from "react";
import Link from "next/link";
import { SavedSignature } from "@/types/signature";

export interface LimitOverwriteModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  infoText?: string;
  secondaryLinkText?: string;
  secondaryLinkHref?: string;
  signatures?: SavedSignature[];
  onSelectOverwrite?: (targetSignature: SavedSignature) => Promise<void>;
}

export default function LimitOverwriteModal({
  isOpen,
  onClose,
  title = "You've used your 3 free signatures",
  description = "Unlock Premium to create signatures for your whole team. Your current three stay fully editable.",
  infoText,
  secondaryLinkText,
  secondaryLinkHref,
}: LimitOverwriteModalProps) {
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
      aria-labelledby="limit-dialog-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[440px] max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-100 transition-all transform scale-100 animate-in zoom-in-95 duration-150 text-center"
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        }}
      >
        {/* Header Icon: Crown badge container with soft blue glow */}
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EFF6FF] text-[#245FD4] border border-blue-100 shadow-sm">
          <svg
            className="h-7 w-7 text-[#245FD4]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
          </svg>
        </div>

        <h3
          id="limit-dialog-title"
          className="text-xl font-bold text-[#0F172A]"
          style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
        >
          {title}
        </h3>

        {description && (
          <p
            className="mt-2 text-sm leading-relaxed text-[#64748B]"
            style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
          >
            {description}
          </p>
        )}

        {/* Features Box: Muted card with checkmarks matching Figma */}
        <div className="mt-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 p-4 text-left">
          <ul className="space-y-2.5 text-[13.5px] font-medium text-slate-700">
            <li className="flex items-center gap-2.5">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#EFF6FF] text-[#245FD4]">
                <svg className="h-3.5 w-3.5 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </span>
              <span>Unlimited team signatures</span>
            </li>
            <li className="flex items-center gap-2.5">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#EFF6FF] text-[#245FD4]">
                <svg className="h-3.5 w-3.5 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </span>
              <span>Premium templates</span>
            </li>
            <li className="flex items-center gap-2.5">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#EFF6FF] text-[#245FD4]">
                <svg className="h-3.5 w-3.5 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </span>
              <span>Priority support</span>
            </li>
          </ul>

          {infoText && (
            <p className="mt-3 pt-3 border-t border-slate-200/60 text-xs text-slate-500">
              {infoText}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col gap-3">
          <Link
            href="/pricing?from=sidebar"
            onClick={onClose}
            className="flex h-11 w-full items-center justify-center rounded-xl bg-cta-gradient bg-gradient-to-r from-[#245FD4] to-[#022977] px-6 text-center text-sm font-semibold text-white shadow-xs transition hover:opacity-95 cursor-pointer"
            style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
          >
            Unlock Premium
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="text-xs sm:text-sm font-medium text-slate-500 hover:text-slate-800 transition py-1 cursor-pointer"
            style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
          >
            {secondaryLinkText || "Maybe later"}
          </button>
        </div>
      </div>
    </div>
  );
}
