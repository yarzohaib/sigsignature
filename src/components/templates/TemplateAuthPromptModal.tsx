"use client";

import React, { useEffect, useCallback } from "react";
import Link from "next/link";

interface TemplateAuthPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  templateId?: string;
}

export default function TemplateAuthPromptModal({
  isOpen,
  onClose,
  templateId,
}: TemplateAuthPromptModalProps) {
  // Handle Escape key to close modal
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) return;
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const redirectParam = encodeURIComponent(
    `/templates?template=${templateId || ""}&restore=true`
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[440px] rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl transition-all animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top-right cross icon */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute right-4 top-4 rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer"
        >
          <svg
            className="h-5 w-5"
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

        {/* Brand Icon Header */}
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-[#245FD4] mb-4">
          <svg
            className="h-7 w-7"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>

        {/* Modal Title & Description */}
        <div className="text-center">
          <h3
            id="auth-modal-title"
            className="text-xl sm:text-2xl font-bold text-slate-900"
            style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
          >
            Sign in to save your signature
          </h3>
          <p
            className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed"
            style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
          >
            Create a free account or log in to save your email signature, export production-ready HTML, and access your designs anytime.
          </p>
        </div>

        {/* Auth Action Buttons */}
        <div className="mt-6 flex flex-col gap-3">
          <Link
            href={`/signup?redirect=${redirectParam}`}
            className="flex h-11 sm:h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#245FD4] to-[#022977] px-6 text-xs sm:text-sm font-semibold text-white shadow-xs transition hover:opacity-95 active:scale-98"
            style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
          >
            <span>Create Free Account</span>
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>

          <Link
            href={`/login?redirect=${redirectParam}`}
            className="flex h-11 sm:h-12 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 text-xs sm:text-sm font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50 active:scale-98"
            style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
          >
            <span>Log In</span>
          </Link>
        </div>

        {/* Trust Badges Footer */}
        <p className="mt-4 text-center text-[11px] sm:text-xs text-slate-400">
          Free forever &bull; Up to 3 signatures &bull; No credit card required
        </p>
      </div>
    </div>
  );
}
