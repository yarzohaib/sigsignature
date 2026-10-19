"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import { deleteUserAccount, getFriendlySecurityErrorMessage } from "@/app/lib/api";
import { clearAuthSession } from "@/app/lib/auth";

interface DeleteAccountModalProps {
  isOpen: boolean;
  hasPassword: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

export default function DeleteAccountModal({
  isOpen,
  hasPassword,
  onClose,
  onSuccess,
}: DeleteAccountModalProps) {
  const [password, setPassword] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Focus on open
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 50);
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

  const isFormValid = hasPassword
    ? password.trim().length > 0
    : confirmText.trim() === "DELETE";

  const handleDelete = async (e: FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isLoading) return;

    setIsLoading(true);
    setApiError(null);

    try {
      if (hasPassword) {
        await deleteUserAccount({ password });
      } else {
        await deleteUserAccount({ confirm: "DELETE" });
      }

      clearAuthSession();
      onSuccess("Your account was deleted");
    } catch (err: unknown) {
      const friendlyMessage = getFriendlySecurityErrorMessage(err);
      setApiError(friendlyMessage);
      setIsLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-account-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoading) {
          onClose();
        }
      }}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-[440px] rounded-2xl border border-red-100 bg-white p-5 sm:p-6 shadow-2xl animate-in zoom-in-95 duration-200"
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
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <div>
            <h3
              id="delete-account-title"
              className="text-[17px] font-bold text-red-700 leading-tight"
              style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
            >
              Delete account
            </h3>
            <p
              className="text-[12px] text-[#6B7280]"
              style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
            >
              This action is permanent and cannot be undone.
            </p>
          </div>
        </div>

        {/* Warning & List of deleted data */}
        <div className="mt-3.5 rounded-xl bg-red-50/60 p-3.5 border border-red-100 text-xs text-red-900">
          <p className="font-semibold mb-2">The following will be permanently erased:</p>
          <ul className="list-disc pl-4 space-y-1 text-red-800">
            <li>Your account profile, credentials, and settings</li>
            <li>All saved personal email signatures</li>
            <li>Your team workspace, templates, and invited members</li>
            <li>All active sessions and API authorizations</li>
          </ul>
        </div>

        {/* Global Error Banner */}
        {apiError && (
          <div className="mt-3.5 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 flex items-start gap-2">
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

        {/* Confirmation Form */}
        <form onSubmit={handleDelete} className="mt-4 flex flex-col gap-3.5">
          {hasPassword ? (
            <div>
              <label
                htmlFor="delete-password"
                className="block text-[13px] font-semibold text-[#1E293B] mb-1"
                style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
              >
                Confirm your password
              </label>
              <div className="relative">
                <input
                  ref={inputRef}
                  id="delete-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  placeholder="Enter your account password"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 pr-10 text-sm text-[#1E293B] placeholder-slate-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-100 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
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
          ) : (
            <div>
              <label
                htmlFor="delete-confirm-text"
                className="block text-[13px] font-semibold text-[#1E293B] mb-1"
                style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
              >
                Type <span className="font-mono text-red-600 font-bold">DELETE</span> to confirm
              </label>
              <input
                ref={inputRef}
                id="delete-confirm-text"
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                required
                disabled={isLoading}
                placeholder="DELETE"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 font-mono text-sm text-[#1E293B] placeholder-slate-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-100 transition"
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-2 flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
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
              className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
            >
              {isLoading ? (
                <>
                  <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Deleting...</span>
                </>
              ) : (
                <span>Delete Account</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
