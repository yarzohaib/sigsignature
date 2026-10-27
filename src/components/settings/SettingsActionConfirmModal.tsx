"use client";

import { useEffect } from "react";

export type SettingsAction = "save" | "cancel";

interface SettingsActionConfirmModalProps {
  action: SettingsAction | null;
  onClose: () => void;
  onConfirm: (action: SettingsAction) => void;
}

export default function SettingsActionConfirmModal({
  action,
  onClose,
  onConfirm,
}: SettingsActionConfirmModalProps) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && action) onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [action, onClose]);

  if (!action) return null;

  const isSave = action === "save";
  const title = isSave ? "Save Changes" : "Cancel Changes";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-action-dialog-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[420px] rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-150"
        onClick={(event) => event.stopPropagation()}
        style={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                isSave ? "bg-blue-50 text-[#245FD4]" : "bg-amber-50 text-amber-600"
              }`}
            >
              {isSave ? (
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" />
                  <path d="M17 21v-8H7v8M7 3v5h8" />
                </svg>
              ) : (
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3 12a9 9 0 1 0 2.64-6.36L3 8" />
                  <path d="M3 3v5h5" />
                </svg>
              )}
            </div>
            <h3
              id="settings-action-dialog-title"
              className="text-[17px] font-bold text-[#1E293B]"
              style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
            >
              {title}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-[#94A3B8] transition hover:bg-slate-100 hover:text-[#64748B]"
            aria-label="Close dialog"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mt-4 space-y-1 text-left">
          <p
            className="text-[14px] leading-relaxed text-[#64748B]"
            style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
          >
            {isSave
              ? "Are you sure you want to save your changes?"
              : "Are you sure you want to cancel your changes?"}
          </p>
          {!isSave && (
            <p
              className="text-[13px] text-[#94A3B8]"
              style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
            >
              Your unsaved edits will be discarded.
            </p>
          )}
        </div>

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
            onClick={() => onConfirm(action)}
            className={`rounded-lg px-6 py-2 text-[14px] font-semibold text-white shadow-xs transition active:scale-98 ${
              isSave
                ? "bg-[#245FD4] hover:bg-[#1D4FB5]"
                : "bg-[#DC2626] hover:bg-[#B91C1C]"
            }`}
            style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
          >
            {isSave ? "Save Changes" : "Discard Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
