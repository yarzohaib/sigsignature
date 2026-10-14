"use client";

import { useEffect } from "react";

interface SignatureCopiedAlertProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  autoCloseMs?: number;
  className?: string;
}

export default function SignatureCopiedAlert({
  isOpen,
  onClose,
  title = "Signature copied!",
  subtitle = "Paste it into your email client settings.",
  autoCloseMs = 4500,
  className = "",
}: SignatureCopiedAlertProps) {
  useEffect(() => {
    if (!isOpen || autoCloseMs <= 0) return;
    const timer = setTimeout(() => {
      onClose();
    }, autoCloseMs);
    return () => clearTimeout(timer);
  }, [isOpen, autoCloseMs, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex items-center gap-3.5 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_10px_30px_rgba(0,0,0,0.08)] text-left ${className}`}
    >
      {/* Green Checkmark Circle Badge matching Image 2 */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EBF8EE] text-[#22C55E]">
        <svg
          className="h-6 w-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="9" />
          <polyline points="9 12 11 14 15 10" />
        </svg>
      </div>

      {/* Text Content */}
      <div className="flex-1 min-w-0 pr-2">
        <h4
          className="text-[15px] font-bold text-[#1E293B] leading-snug"
          style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
        >
          {title}
        </h4>
        <p
          className="text-[12.5px] font-normal text-[#64748B] leading-snug mt-0.5"
          style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
        >
          {subtitle}
        </p>
      </div>

      {/* Close "X" Button */}
      <button
        type="button"
        onClick={onClose}
        className="shrink-0 -mr-1 -mt-3.5 p-1 text-slate-400 hover:text-slate-600 transition rounded-lg hover:bg-slate-50"
        aria-label="Close notification"
      >
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}
