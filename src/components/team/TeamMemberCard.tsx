"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import type { Team, TeamMember } from "@/types/team";
import { renderTeamMemberHtml } from "@/lib/team/render";
import SignaturePreviewFrame from "@/components/studio/SignaturePreviewFrame";

interface TeamMemberCardProps {
  team: Team;
  member: TeamMember;
  onEdit: (member: TeamMember) => void;
  onCopy: (member: TeamMember) => void;
  onSend: (member: TeamMember) => void;
  onRevoke: (member: TeamMember) => void;
  onDelete: (member: TeamMember) => void;
}

function formatRelativeTime(dateString?: string | null): string {
  if (!dateString) return "just now";
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return "yesterday";
  if (diffInDays < 7) return `${diffInDays} days ago`;
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) return `${diffInWeeks}w ago`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function TeamMemberCard({
  team,
  member,
  onEdit,
  onCopy,
  onSend,
  onRevoke,
  onDelete,
}: TeamMemberCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click or escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  // Render HTML preview
  const previewHtml = useMemo(() => {
    try {
      return renderTeamMemberHtml(team, member, { preview: true });
    } catch (e) {
      console.error("Failed to render team member preview:", e);
      return `<div style="padding:16px;color:#94a3b8;font-size:12px;">Failed to render preview</div>`;
    }
  }, [team, member]);

  const templateName =
    team.kind === "studio"
      ? "Studio"
      : team.templateId
      ? team.templateId.charAt(0).toUpperCase() + team.templateId.slice(1)
      : "Template";

  const relativeTime = formatRelativeTime(member.updatedAt || member.createdAt);

  const isResend =
    member.status === "sent" ||
    member.status === "expired" ||
    member.status === "accepted";
  const isRevoked = member.status === "revoked";

  return (
    <div className="flex flex-col justify-between rounded-[24px] border border-[#E4E9F4] bg-white p-4 shadow-2xs hover:shadow-md transition-shadow">
      {/* Top area: preview frame */}
      <div className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-b from-[#F8FAFC] to-[#F1F5F9] border border-[#EBF0F7] p-2 flex items-center justify-center">
        <SignaturePreviewFrame html={previewHtml} />
      </div>

      {/* Middle info row */}
      <div className="pt-3.5 pb-2">
        <div className="flex items-center justify-between gap-2">
          <h4
            className="text-[15px] font-bold text-[#0B1A3D] truncate"
            style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
          >
            {member.name}
          </h4>

          {/* Status badge matching Figma */}
          {member.status === "sent" && (
            <span className="inline-flex items-center rounded-full bg-[#ECFDF5] px-2 py-0.5 text-[10px] font-semibold text-[#059669] border border-[#A7F3D0] shrink-0">
              SENT
            </span>
          )}
          {member.status === "draft" && (
            <span className="inline-flex items-center rounded-full bg-[#F1F5F9] px-2 py-0.5 text-[10px] font-semibold text-[#475569] border border-[#E2E8F0] shrink-0">
              DRAFT
            </span>
          )}
          {member.status === "accepted" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF5] px-2 py-0.5 text-[10px] font-semibold text-[#059669] border border-[#A7F3D0] shrink-0">
              <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              ACCEPTED
            </span>
          )}
          {member.status === "expired" && (
            <span className="inline-flex items-center rounded-full bg-[#FFFBEB] px-2 py-0.5 text-[10px] font-semibold text-[#D97706] border border-[#FDE68A] shrink-0">
              EXPIRED
            </span>
          )}
          {member.status === "revoked" && (
            <span className="inline-flex items-center rounded-full bg-[#FEF2F2] px-2 py-0.5 text-[10px] font-semibold text-[#DC2626] border border-[#FECACA] shrink-0">
              REVOKED
            </span>
          )}
        </div>

        <p
          className="mt-0.5 text-[12px] text-[#94A3B8] truncate"
          style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
        >
          {templateName} · Edited {relativeTime}
        </p>
      </div>

      {/* Bottom actions row */}
      <div className="flex items-center justify-between gap-1.5 pt-2 border-t border-[#F1F5F9]">
        <div className="flex items-center gap-1.5">
          {/* Edit button */}
          <button
            type="button"
            onClick={() => onEdit(member)}
            className="flex items-center gap-1 rounded-lg border border-[#E2E8F0] bg-white px-2.5 py-1.5 text-xs font-medium text-[#475569] hover:bg-slate-50 transition cursor-pointer"
            style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
          >
            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            <span>Edit</span>
          </button>

          {/* Copy button */}
          <button
            type="button"
            onClick={() => onCopy(member)}
            className="flex items-center gap-1 rounded-lg border border-[#E2E8F0] bg-white px-2.5 py-1.5 text-xs font-medium text-[#475569] hover:bg-slate-50 transition cursor-pointer"
            style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
          >
            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            <span>Copy</span>
          </button>

          {/* Send / Resend button */}
          <button
            type="button"
            onClick={() => onSend(member)}
            disabled={isRevoked}
            className={`flex items-center gap-1 rounded-lg border border-[#E2E8F0] bg-white px-2.5 py-1.5 text-xs font-medium transition cursor-pointer ${
              isRevoked
                ? "opacity-50 cursor-not-allowed text-slate-400"
                : "text-[#245FD4] hover:bg-blue-50"
            }`}
            style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
          >
            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
            <span>{isResend ? "Resend" : "Send"}</span>
          </button>
        </div>

        {/* 3 dots More menu */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-lg p-1.5 text-[#94A3B8] hover:bg-slate-100 hover:text-[#475569] transition cursor-pointer"
            aria-label="More member options"
            aria-expanded={menuOpen}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="5" r="1.5" />
              <circle cx="12" cy="12" r="1.5" />
              <circle cx="12" cy="19" r="1.5" />
            </svg>
          </button>

          {menuOpen && (
            <div className="absolute right-0 bottom-full mb-1 w-40 rounded-xl border border-[#E2E8F0] bg-white p-1.5 shadow-lg z-30">
              {member.status === "sent" && (
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onRevoke(member);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-50 transition cursor-pointer"
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                  </svg>
                  <span>Revoke link</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onDelete(member);
                }}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 transition cursor-pointer"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 6h18" />
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                </svg>
                <span>Delete member</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
