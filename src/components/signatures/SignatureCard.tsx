"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { SavedSignature } from "@/types/signature";
import SavedSignatureThumbnail from "./SavedSignatureThumbnail";

export function formatRelativeTime(isoDate: string): string {
  const timestamp = new Date(isoDate).getTime();
  if (isNaN(timestamp)) {
    return "Updated recently";
  }
  const diffInSeconds = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));

  if (diffInSeconds < 60) {
    return "Updated just now";
  }
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `Updated ${diffInMinutes} minute${diffInMinutes === 1 ? "" : "s"} ago`;
  }
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `Updated ${diffInHours} hour${diffInHours === 1 ? "" : "s"} ago`;
  }
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `Updated ${diffInDays} day${diffInDays === 1 ? "" : "s"} ago`;
  }
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `Updated ${diffInMonths} month${diffInMonths === 1 ? "" : "s"} ago`;
  }
  const diffInYears = Math.floor(diffInDays / 365);
  return `Updated ${diffInYears} year${diffInYears === 1 ? "" : "s"} ago`;
}

interface SignatureCardProps {
  signature: SavedSignature;
  onEdit: (id: string) => void;
  onDuplicate: (id: string) => void;
  onExport: (id: string) => void;
  onDelete: (signature: SavedSignature) => void;
  onCopyToTeam?: (signature: SavedSignature) => void;
}

export default function SignatureCard({
  signature,
  onEdit,
  onDuplicate,
  onExport,
  onDelete,
  onCopyToTeam,
}: SignatureCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        menuBtnRef.current &&
        !menuBtnRef.current.contains(event.target as Node)
      ) {
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

  function handleToggleMenu() {
    if (!menuOpen && menuBtnRef.current) {
      const rect = menuBtnRef.current.getBoundingClientRect();
      setMenuPos({
        top: rect.bottom + window.scrollY + 4,
        left: Math.max(10, rect.right + window.scrollX - 176),
      });
      setMenuOpen(true);
    } else {
      setMenuOpen(false);
    }
  }

  const relativeTime = formatRelativeTime(signature.updatedAt);

  return (
    <div className="group flex flex-col justify-between rounded-[14px] border border-[#EEF0F4] bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
      style={{ boxShadow: "0px 1px 3px rgba(16, 24, 40, 0.04)" }}
    >
      {/* Top Preview Section — Standard 350×174 aspect ratio */}
      <div className="relative aspect-[350/174] min-h-[174px] max-h-[220px] w-full overflow-hidden rounded-t-[14px] bg-[#F8FAFC]">
        <SavedSignatureThumbnail signature={signature} />

        {/* Hover Action Overlay */}
        <div className="absolute inset-0 z-10 flex items-center justify-center gap-2.5 bg-slate-900/40 p-4 opacity-0 backdrop-blur-2xs transition-opacity duration-150 group-hover:opacity-100">
          <button
            type="button"
            onClick={() => onEdit(signature.id)}
            className="flex h-9 items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-[#245FD4] to-[#022977] px-4 text-xs font-semibold text-white shadow-xs transition hover:opacity-95 active:scale-95 cursor-pointer"
            style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
            <span>Edit</span>
          </button>
        </div>
      </div>

      {/* Middle Info Row */}
      <div className="flex items-center justify-between border-t border-[#EEF0F4] px-4 py-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h4
              className="text-[13px] font-bold text-[#1E293B] truncate"
              style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
            >
              {signature.name}
            </h4>
            <span
              className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                signature.kind === "studio"
                  ? "bg-[#EFF6FF] text-[#245FD4] border border-[#BFDBFE]"
                  : "bg-slate-100 text-[#475569] border border-slate-200"
              }`}
              style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
            >
              {signature.kind === "studio" ? "Studio" : "Template"}
            </span>
          </div>
          <p
            className="text-[11px] text-[#94A3B8]"
            style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
          >
            {relativeTime}
          </p>
        </div>

        {/* More options 3-dot button with portaled dropdown */}
        <div className="relative shrink-0 ml-2">
          <button
            ref={menuBtnRef}
            type="button"
            onClick={handleToggleMenu}
            className="rounded-lg p-1.5 text-[#94A3B8] transition hover:bg-slate-100 hover:text-[#64748B] cursor-pointer"
            aria-label="More options"
            aria-expanded={menuOpen}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="5" r="1.5" />
              <circle cx="12" cy="12" r="1.5" />
              <circle cx="12" cy="19" r="1.5" />
            </svg>
          </button>

          {menuOpen &&
            menuPos &&
            typeof document !== "undefined" &&
            createPortal(
              <div
                ref={dropdownRef}
                style={{
                  position: "absolute",
                  top: `${menuPos.top}px`,
                  left: `${menuPos.left}px`,
                  zIndex: 9999,
                }}
                className="w-44 rounded-xl border border-[#E2E8F0] bg-white p-1.5 shadow-xl animate-fade-in"
                role="menu"
              >
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false);
                    onEdit(signature.id);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                >
                  <svg className="h-3.5 w-3.5 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                  </svg>
                  <span>Edit</span>
                </button>

                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false);
                    onDuplicate(signature.id);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                >
                  <svg className="h-3.5 w-3.5 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  <span>Duplicate</span>
                </button>

                <div className="my-1 border-t border-[#F1F5F9]" />

                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete(signature);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                >
                  <svg className="h-3.5 w-3.5 text-rose-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6h18" />
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                  </svg>
                  <span>Delete</span>
                </button>
              </div>,
              document.body
            )}
        </div>
      </div>

      {/* Bottom Action Buttons Row */}
      <div className="border-t border-[#EEF0F4] px-4 py-2.5 flex items-center justify-between text-[12px]">
        {/* Edit */}
        <button
          type="button"
          onClick={() => onEdit(signature.id)}
          className="flex items-center gap-1.5 font-semibold text-[#2563EB] transition hover:text-[#1D4ED8] cursor-pointer"
          style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
          <span>Edit</span>
        </button>

        {/* Duplicate */}
        <button
          type="button"
          onClick={() => onDuplicate(signature.id)}
          className="flex items-center gap-1.5 font-semibold text-[#64748B] transition hover:text-[#1E293B] cursor-pointer"
          style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          <span>Duplicate</span>
        </button>

        {/* Copy (Export HTML) */}
        <button
          type="button"
          onClick={() => onExport(signature.id)}
          className="flex items-center gap-1.5 font-semibold text-[#64748B] transition hover:text-[#1E293B] cursor-pointer"
          style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
            <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
          </svg>
          <span>Copy</span>
        </button>

        {/* Team — copies to team (replaces Delete in the bottom bar) */}
        {onCopyToTeam ? (
          <button
            type="button"
            onClick={() => onCopyToTeam(signature)}
            className="flex items-center gap-1.5 font-semibold text-[#245FD4] transition hover:text-[#1D4ED8] cursor-pointer"
            style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <span>Team</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onDelete(signature)}
            className="flex items-center gap-1.5 font-semibold text-[#DC2626] transition hover:text-[#B91C1C] cursor-pointer"
            style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            </svg>
            <span>Delete</span>
          </button>
        )}
      </div>
    </div>
  );
}
