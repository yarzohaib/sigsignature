"use client";

import { useEffect, useRef } from "react";
import type { TeamMember } from "@/types/team";

interface RevokeInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: TeamMember | null;
  onConfirm: () => void;
  isRevoking: boolean;
}

export default function RevokeInviteModal({
  isOpen,
  onClose,
  member,
  onConfirm,
  isRevoking,
}: RevokeInviteModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && !isRevoking) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isRevoking, onClose]);

  if (!isOpen || !member) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="revoke-modal-title"
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl transition"
      >
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-600">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
            </svg>
          </div>

          <div className="flex-1">
            <h3
              id="revoke-modal-title"
              className="text-base font-bold text-[#0B1A3D]"
              style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
            >
              Revoke invite link?
            </h3>
            <p
              className="mt-1 text-xs sm:text-sm text-[#64748B] leading-relaxed"
              style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
            >
              Are you sure you want to revoke the invite for <span className="font-semibold text-[#0B1A3D]">{member.name}</span> ({member.email})? Anyone with the existing link will no longer be able to view or copy their signature.
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-[#F1F5F9]">
          <button
            type="button"
            onClick={onClose}
            disabled={isRevoking}
            className="rounded-xl border border-[#CBD5E1] bg-white px-4 py-2 text-xs sm:text-sm font-medium text-[#475569] hover:bg-slate-50 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isRevoking}
            className="flex items-center gap-2 rounded-xl bg-amber-600 hover:bg-amber-700 px-4 py-2 text-xs sm:text-sm font-semibold text-white transition shadow-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isRevoking ? (
              <>
                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Revoking...</span>
              </>
            ) : (
              <span>Revoke link</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
