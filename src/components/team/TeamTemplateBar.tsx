"use client";

import { useState, useRef, useEffect } from "react";
import type { Team } from "@/types/team";
import { getStudioUnlinkedWarning } from "@/lib/team/boundFields";

interface TeamTemplateBarProps {
  team: Team;
  onDeleteTeam: () => void;
}

export default function TeamTemplateBar({ team, onDeleteTeam }: TeamTemplateBarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const unlinkedWarning = getStudioUnlinkedWarning(team);

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

  const kindBadge = team.kind === "studio" ? "Design Studio" : `Template (${team.templateId})`;

  return (
    <div className="mb-6 space-y-2">
      <div className="flex items-center justify-between rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm">
        {/* Template info */}
        <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
          <span className="text-[#64748B]">Team template:</span>
          <span className="font-semibold text-[#0B1A3D] truncate">{team.name}</span>
          <span className="text-[#CBD5E1]">·</span>
          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
            {kindBadge}
          </span>
        </div>

        {/* Actions menu */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium text-[#64748B] hover:bg-slate-100 hover:text-[#1E293B] transition cursor-pointer"
            aria-label="Team template options"
            aria-expanded={menuOpen}
          >
            <span>Options</span>
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-48 rounded-xl border border-[#E2E8F0] bg-white p-1.5 shadow-lg z-30">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onDeleteTeam();
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition cursor-pointer"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 6h18" />
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                </svg>
                <span>Delete team signature</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {unlinkedWarning && (
        <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50/80 px-3.5 py-2.5 text-xs text-amber-900 shadow-2xs animate-in fade-in duration-150">
          <svg className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          </svg>
          <div className="leading-relaxed">
            {unlinkedWarning}
          </div>
        </div>
      )}
    </div>
  );
}
