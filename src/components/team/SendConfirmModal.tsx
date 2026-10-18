"use client";

import { useState, useEffect, useRef } from "react";
import type { TeamMember } from "@/types/team";
import { sendTeamMember, ApiError } from "@/app/lib/api";

interface SendConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: TeamMember | null;
  onSuccess: () => void;
  showToast: (msg: string) => void;
  onDevInviteGenerated?: (url: string, email: string) => void;
}

export default function SendConfirmModal({
  isOpen,
  onClose,
  member,
  onSuccess,
  showToast,
  onDevInviteGenerated,
}: SendConfirmModalProps) {
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && !isSending) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isSending, onClose]);

  if (!isOpen || !member) return null;

  const isResend =
    member.status === "sent" ||
    member.status === "expired" ||
    member.status === "accepted";

  async function handleSend() {
    if (!member) return;
    setIsSending(true);
    setError(null);

    try {
      const result = await sendTeamMember(member.id);

      if (result.suppressed && result.devInviteUrl) {
        showToast(`Test mode: Invite link generated for ${member.email}.`);
        if (onDevInviteGenerated) {
          onDevInviteGenerated(result.devInviteUrl, member.email);
        }
      } else {
        showToast(`Signature sent to ${member.email}`);
      }

      onSuccess();
      onClose();
    } catch (err: unknown) {
      console.error("Failed to send signature:", err);
      if (err instanceof ApiError) {
        if (err.code === "TEAM_EMAIL_REJECTED") {
          setError(
            err.message ||
              "The email could not be delivered. While email sending is in test mode only verified addresses can receive messages."
          );
        } else {
          setError(err.message || "Failed to send signature email.");
        }
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to send signature invite. Please try again.");
      }
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="send-modal-title"
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl transition"
      >
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[#245FD4]">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </div>

          <div className="flex-1">
            <h3
              id="send-modal-title"
              className="text-base font-bold text-[#0B1A3D]"
              style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
            >
              {isResend ? `Resend signature to ${member.name}?` : `Send signature to ${member.name}?`}
            </h3>
            <p
              className="mt-1 text-xs sm:text-sm text-[#64748B] leading-relaxed"
              style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
            >
              They will get an email at <span className="font-semibold text-[#0B1A3D]">{member.email}</span> with
              a private link to view and copy their signature. The link expires in 14 days.
            </p>
          </div>
        </div>

        {/* Error notification */}
        {error && (
          <div className="mt-4 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700 leading-relaxed">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-[#F1F5F9]">
          <button
            type="button"
            onClick={onClose}
            disabled={isSending}
            className="rounded-xl border border-[#CBD5E1] bg-white px-4 py-2 text-xs sm:text-sm font-medium text-[#475569] hover:bg-slate-50 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSend}
            disabled={isSending}
            className="flex items-center gap-2 rounded-xl bg-[#245FD4] hover:bg-[#1D4ED8] px-4 py-2 text-xs sm:text-sm font-semibold text-white transition shadow-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSending ? (
              <>
                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Sending...</span>
              </>
            ) : (
              <span>{isResend ? "Resend Invite" : "Send Invite"}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
