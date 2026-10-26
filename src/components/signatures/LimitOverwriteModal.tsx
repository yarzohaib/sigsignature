"use client";

import { useEffect } from "react";
import Link from "next/link";
import { SavedSignature } from "@/types/signature";

export interface LimitOverwriteModalProps {
  isOpen: boolean;
  onClose: () => void;
  signatures?: SavedSignature[];
  onSelectOverwrite?: (targetSignature: SavedSignature) => Promise<void>;
}

export default function LimitOverwriteModal({
  isOpen,
  onClose,
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
        className="w-full max-w-[440px] max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 transition-all transform scale-100 animate-in zoom-in-95 duration-150 text-center"
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        }}
      >
        {/* Header Icon */}
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-100">
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>

        <h3
          id="limit-dialog-title"
          className="text-lg font-bold text-[#1E293B]"
          style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
        >
          Signature Limit Reached (3/3)
        </h3>

        <p
          className="mt-2 text-xs leading-relaxed text-[#64748B]"
          style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
        >
          Free accounts can create up to 3 email signatures in total. You have used all 3 free signature slots. Deleting signatures does not restore creation slots.
        </p>

        <div className="mt-4 rounded-xl bg-slate-50 border border-slate-200/70 p-3 text-left">
          <p
            className="text-[11px] text-slate-600 leading-normal"
            style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
          >
            💡 <span className="font-semibold text-slate-800">You can continue editing your existing signatures</span> at any time. To create additional signatures or share with your team, upgrade to Pro.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col gap-2.5">
          <Link
            href="/pricing"
            onClick={onClose}
            className="w-full rounded-xl bg-gradient-to-r from-[#245FD4] to-[#022977] py-2.5 px-4 text-xs font-semibold text-white shadow-xs transition hover:opacity-95 text-center"
            style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
          >
            Upgrade to Pro
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/signatures"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50 text-center"
              style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
            >
              My Signatures
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs font-semibold text-slate-500 shadow-2xs transition hover:bg-slate-50 hover:text-slate-700 text-center"
              style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
