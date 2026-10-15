"use client";

import { useEffect } from "react";
import Link from "next/link";

interface PremiumLockedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PremiumLockedModal({
  isOpen,
  onClose,
}: PremiumLockedModalProps) {
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
      aria-labelledby="premium-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[400px] max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 transition-all transform scale-100 animate-in zoom-in-95 duration-150 text-center"
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        }}
      >
        {/* Crown / Star icon */}
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EFF6FF] text-[#245FD4] shadow-xs">
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
          </svg>
        </div>

        <h3
          id="premium-modal-title"
          className="text-lg font-bold text-[#1E293B]"
          style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
        >
          Premium Feature
        </h3>

        <p
          className="mt-2 text-sm text-[#64748B] leading-relaxed"
          style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
        >
          This feature requires a premium plan. Upgrade to unlock custom fonts, shapes and themes.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row items-center gap-2.5">
          <Link
            href="/pricing"
            onClick={onClose}
            className="w-full sm:flex-1 rounded-xl bg-gradient-to-r from-[#245FD4] to-[#022977] py-2.5 px-4 text-xs font-semibold text-white shadow-xs transition hover:opacity-95 text-center whitespace-nowrap"
            style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
          >
            Upgrade to Pro
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:flex-1 rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50 text-center whitespace-nowrap"
            style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
