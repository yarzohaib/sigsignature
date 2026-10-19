"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import { changeAccountPassword, getFriendlySecurityErrorMessage } from "@/app/lib/api";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

export default function ChangePasswordModal({
  isOpen,
  onClose,
  onSuccess,
}: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const currentInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Focus on open
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => currentInputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Handle Escape key and focus trapping
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) {
        onClose();
        return;
      }

      // Basic focus trap within modal
      if (e.key === "Tab" && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length > 0) {
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  // Validation rules
  const hasMinLength = newPassword.length >= 8;
  const hasNumberOrSpecial = /[0-9!@#$%^&*(),.?":{}|<>]/.test(newPassword);
  const isDifferentFromCurrent = !currentPassword || currentPassword !== newPassword;
  const isConfirmed = newPassword !== "" && newPassword === confirmPassword;

  const isFormValid =
    currentPassword.length > 0 &&
    hasMinLength &&
    hasNumberOrSpecial &&
    isDifferentFromCurrent &&
    isConfirmed;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isLoading) return;

    setIsLoading(true);
    setApiError(null);

    try {
      await changeAccountPassword({
        currentPassword,
        newPassword,
      });
      onSuccess("Password changed. Other sessions were signed out.");
      onClose();
    } catch (err: unknown) {
      const friendlyMessage = getFriendlySecurityErrorMessage(err);
      setApiError(friendlyMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="change-password-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoading) {
          onClose();
        }
      }}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-[440px] rounded-2xl border border-slate-100 bg-white p-5 sm:p-6 shadow-2xl animate-in zoom-in-95 duration-200"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition disabled:opacity-50"
          aria-label="Close dialog"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#245FD4]">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <div>
            <h3
              id="change-password-title"
              className="text-[17px] font-bold text-[#172238] leading-tight"
              style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
            >
              Change password
            </h3>
            <p
              className="text-[12px] text-[#6B7280]"
              style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
            >
              Choose a secure password for your account.
            </p>
          </div>
        </div>

        {/* Global Error Banner */}
        {apiError && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 flex items-start gap-2">
            <svg className="h-4 w-4 shrink-0 text-red-500 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}>
              {apiError}
            </span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3.5">
          {/* Current Password */}
          <div>
            <label
              htmlFor="current-password"
              className="block text-[13px] font-semibold text-[#1E293B] mb-1"
              style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
            >
              Current password
            </label>
            <div className="relative">
              <input
                ref={currentInputRef}
                id="current-password"
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                disabled={isLoading}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 pr-10 text-sm text-[#1E293B] placeholder-slate-400 focus:border-[#245FD4] focus:outline-none focus:ring-2 focus:ring-blue-100 transition"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                aria-label={showCurrent ? "Hide current password" : "Show current password"}
              >
                {showCurrent ? (
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label
              htmlFor="new-password"
              className="block text-[13px] font-semibold text-[#1E293B] mb-1"
              style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
            >
              New password
            </label>
            <div className="relative">
              <input
                id="new-password"
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                disabled={isLoading}
                placeholder="At least 8 characters"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 pr-10 text-sm text-[#1E293B] placeholder-slate-400 focus:border-[#245FD4] focus:outline-none focus:ring-2 focus:ring-blue-100 transition"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                aria-label={showNew ? "Hide new password" : "Show new password"}
              >
                {showNew ? (
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>

            {/* Password strength hints */}
            <div className="mt-2 flex flex-col gap-1 text-[11px] text-[#6B7280]">
              <span className={`flex items-center gap-1.5 ${hasMinLength ? "text-emerald-600" : ""}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${hasMinLength ? "bg-emerald-600" : "bg-slate-300"}`} />
                At least 8 characters
              </span>
              <span className={`flex items-center gap-1.5 ${hasNumberOrSpecial ? "text-emerald-600" : ""}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${hasNumberOrSpecial ? "bg-emerald-600" : "bg-slate-300"}`} />
                Includes a number or special character
              </span>
              {currentPassword && newPassword && !isDifferentFromCurrent && (
                <span className="text-red-500">
                  New password must differ from current password
                </span>
              )}
            </div>
          </div>

          {/* Confirm New Password */}
          <div>
            <label
              htmlFor="confirm-password"
              className="block text-[13px] font-semibold text-[#1E293B] mb-1"
              style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
            >
              Confirm new password
            </label>
            <div className="relative">
              <input
                id="confirm-password"
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
                placeholder="Re-enter new password"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 pr-10 text-sm text-[#1E293B] placeholder-slate-400 focus:border-[#245FD4] focus:outline-none focus:ring-2 focus:ring-blue-100 transition"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
              >
                {showConfirm ? (
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
            {confirmPassword && !isConfirmed && (
              <p className="mt-1 text-[11px] text-red-500">
                Passwords do not match.
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition"
              style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isFormValid || isLoading}
              className="flex items-center gap-2 rounded-xl bg-[#022977] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-opacity-95 disabled:opacity-50 disabled:cursor-not-allowed transition"
              style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
            >
              {isLoading ? (
                <>
                  <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Updating...</span>
                </>
              ) : (
                <span>Change password</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
