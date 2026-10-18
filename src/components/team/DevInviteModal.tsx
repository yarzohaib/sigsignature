"use client";

import { useState } from "react";

interface DevInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  devInviteUrl: string;
  memberEmail: string;
}

export default function DevInviteModal({
  isOpen,
  onClose,
  devInviteUrl,
  memberEmail,
}: DevInviteModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(devInviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // ignore
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl transition">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600 font-bold text-sm">
            DEV
          </div>
          <div>
            <h3 className="text-base font-bold text-[#0B1A3D]">
              Local Test Mode: Member Invite Link
            </h3>
            <p className="text-xs text-[#64748B]">
              Email sending was suppressed in dev mode for {memberEmail}.
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
          <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Generated Invite Link
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={devInviteUrl}
              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-mono select-all focus:outline-none"
            />
            <button
              type="button"
              onClick={handleCopy}
              className="rounded-lg bg-[#245FD4] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#1D4ED8] transition shrink-0 cursor-pointer"
            >
              {copied ? "Copied!" : "Copy Link"}
            </button>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-[#CBD5E1] bg-white px-4 py-2 text-xs sm:text-sm font-medium text-[#475569] hover:bg-slate-50 transition cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
