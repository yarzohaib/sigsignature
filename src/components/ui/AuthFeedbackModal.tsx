"use client";

import { useEffect } from "react";
import Link from "next/link";

export type AuthFeedbackModalProps = {
  isOpen: boolean;
  onClose?: () => void;
  icon?: "mail" | "check" | "key";
  badge?: string;
  title: string;
  description: React.ReactNode;
  primaryAction: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  secondaryAction?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
};

export default function AuthFeedbackModal({
  isOpen,
  onClose,
  icon = "mail",
  badge,
  title,
  description,
  primaryAction,
  secondaryAction,
}: AuthFeedbackModalProps) {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen || !onClose) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose?.();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#021334]/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-[460px] overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl transition-all sm:p-8">
        {/* Subtle decorative background glow matching website UI */}
        <div className="pointer-events-none absolute -top-24 left-1/2 h-56 w-72 -translate-x-1/2 rounded-full bg-brand/10 blur-3xl" />

        {/* Close Button */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close dialog"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}

        {/* Content Box */}
        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Brand Icon */}
          <div className="bg-brand-gradient mb-5 flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg shadow-brand/25">
            {icon === "mail" && (
              <svg
                className="h-8 w-8 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            )}
            {icon === "check" && (
              <svg
                className="h-8 w-8 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
            {icon === "key" && (
              <svg
                className="h-8 w-8 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="7.5" cy="15.5" r="5.5" />
                <path d="m21 2-9.6 9.6" />
                <path d="m15.5 7.5 3 3L22 7l-3-3" />
              </svg>
            )}
          </div>

          {/* Badge */}
          {badge && (
            <span className="mb-2 inline-flex items-center rounded-full bg-blue-50 px-3 py-1 font-body text-xs font-semibold tracking-wider text-brand">
              {badge}
            </span>
          )}

          {/* Title */}
          <h2 className="text-brand-gradient font-heading text-2xl font-bold leading-tight sm:text-[26px]">
            {title}
          </h2>

          {/* Description */}
          <div className="font-body mt-3 text-sm leading-relaxed text-slate-600 sm:text-[15px]">
            {description}
          </div>

          {/* Primary Action Button */}
          <div className="mt-7 flex w-full flex-col gap-3">
            {primaryAction.href ? (
              <Link
                href={primaryAction.href}
                onClick={primaryAction.onClick}
                className="bg-brand-gradient flex h-12 w-full items-center justify-center rounded-xl font-body text-base font-semibold text-white shadow-md shadow-brand/20 transition hover:opacity-95 active:scale-[0.99] sm:h-[50px]"
              >
                {primaryAction.label}
              </Link>
            ) : (
              <button
                type="button"
                onClick={primaryAction.onClick}
                className="bg-brand-gradient flex h-12 w-full items-center justify-center rounded-xl font-body text-base font-semibold text-white shadow-md shadow-brand/20 transition hover:opacity-95 active:scale-[0.99] sm:h-[50px]"
              >
                {primaryAction.label}
              </button>
            )}

            {/* Secondary Action Link / Button */}
            {secondaryAction &&
              (secondaryAction.href ? (
                <Link
                  href={secondaryAction.href}
                  onClick={secondaryAction.onClick}
                  className="font-body text-sm font-semibold text-[#6889C9] transition hover:text-brand-dark"
                >
                  {secondaryAction.label}
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={secondaryAction.onClick}
                  className="font-body text-sm font-semibold text-[#6889C9] transition hover:text-brand-dark"
                >
                  {secondaryAction.label}
                </button>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
