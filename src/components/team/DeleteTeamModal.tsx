"use client";

import { useEffect, useRef } from "react";
import type { Team } from "@/types/team";

interface DeleteTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  team: Team | null;
  onConfirm: () => void;
  isDeleting: boolean;
}

export default function DeleteTeamModal({
  isOpen,
  onClose,
  team,
  onConfirm,
  isDeleting,
}: DeleteTeamModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && !isDeleting) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isDeleting, onClose]);

  if (!isOpen || !team) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-team-title"
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl transition"
      >
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-600">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
          </div>

          <div className="flex-1">
            <h3
              id="delete-team-title"
              className="text-base font-bold text-[#0B1A3D]"
              style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
            >
              Delete team signature?
            </h3>
            <p
              className="mt-1 text-xs sm:text-sm text-[#64748B] leading-relaxed"
              style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
            >
              This will permanently delete the team signature template and remove all {team.members.length} team members. This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-[#F1F5F9]">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-xl border border-[#CBD5E1] bg-white px-4 py-2 text-xs sm:text-sm font-medium text-[#475569] hover:bg-slate-50 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex items-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-700 px-4 py-2 text-xs sm:text-sm font-semibold text-white transition shadow-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isDeleting ? (
              <>
                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Deleting...</span>
              </>
            ) : (
              <span>Delete team signature</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
