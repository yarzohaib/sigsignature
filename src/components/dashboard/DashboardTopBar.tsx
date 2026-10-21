"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { getStoredAvatarUrl } from "@/app/lib/auth";

type TopBarProps = {
  userName?: string;
  userEmail?: string;
  avatarUrl?: string | null;
  notificationCount?: number;
  onOpenMobileMenu: () => void;
  onLogout?: () => void;
  isLoggingOut?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
};

export default function DashboardTopBar({
  userName = "Member",
  avatarUrl = null,
  notificationCount = 0,
  onOpenMobileMenu,
  searchValue,
  onSearchChange,
}: TopBarProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [internalSearch, setInternalSearch] = useState("");
  const notificationsRef = useRef<HTMLDivElement>(null);

  // Avatar state resolved from props or localStorage, synchronized across pages
  const [storedAvatar, setStoredAvatar] = useState<string | null>(() => getStoredAvatarUrl());

  useEffect(() => {
    function handleAvatarUpdate(e: Event) {
      const customEvent = e as CustomEvent<string | null>;
      setStoredAvatar(customEvent.detail ?? getStoredAvatarUrl());
    }
    window.addEventListener("sig_avatar_update", handleAvatarUpdate);
    return () => window.removeEventListener("sig_avatar_update", handleAvatarUpdate);
  }, []);

  const resolvedAvatar = avatarUrl || storedAvatar;
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const displaySrc = resolvedAvatar && failedUrl !== resolvedAvatar ? resolvedAvatar : "/placeholder-avatar.svg";

  const currentSearch = searchValue !== undefined ? searchValue : internalSearch;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (onSearchChange) {
      onSearchChange(val);
    } else {
      setInternalSearch(val);
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (notificationsRef.current && !notificationsRef.current.contains(target)) {
        setNotificationsOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-[66px] w-full items-center justify-between border-b border-[#E2E8F0] bg-white px-4 sm:px-6 lg:px-8">
      {/* Left: Mobile hamburger + Search input */}
      <div className="flex items-center gap-3 flex-1 max-w-[500px]">
        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 lg:hidden"
          aria-label="Open navigation menu"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Search Bar: 384px width x 41.33px height as inspected in Figma */}
        <div
          className="relative flex h-[41.33px] w-full max-w-[384px] items-center rounded-xl border border-[#E2E8F0] bg-white px-3.5 transition focus-within:border-[#245FD4] focus-within:ring-2 focus-within:ring-blue-100"
        >
          <svg
            className="h-4 w-4 shrink-0 text-[#94A3B8]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            value={currentSearch}
            onChange={handleSearchChange}
            placeholder="Search anything..."
            className="ml-2.5 w-full bg-transparent text-[14px] text-[#1E293B] placeholder-[#94A3B8] focus:outline-none"
            style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
          />
          <div className="hidden items-center sm:flex">
            <kbd className="flex items-center rounded border border-[#E2E8F0] bg-slate-50 px-1.5 py-0.5 text-[11px] font-medium text-[#94A3B8]">
              ⌘ K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right: Notifications & User Profile */}
      <div className="flex items-center gap-4 sm:gap-6">
        {/* Notification Bell with Dropdown */}
        <div className="relative" ref={notificationsRef}>
          <button
            type="button"
            onClick={() => {
              setNotificationsOpen((prev) => !prev);
            }}
            className={`relative flex h-10 w-10 items-center justify-center rounded-full transition ${
              notificationsOpen
                ? "bg-slate-100 text-[#1E293B]"
                : "text-[#64748B] hover:bg-slate-100 hover:text-[#1E293B]"
            }`}
            aria-label="Notifications"
            aria-expanded={notificationsOpen}
            aria-haspopup="true"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {/* Active notification indicator: appears only when there is a new notification */}
            {notificationCount > 0 && (
              <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-[#245FD4] ring-2 ring-white" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {notificationsOpen && (
            <div className="absolute -right-14 sm:right-0 mt-2 w-[280px] sm:w-80 rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-xl animate-in fade-in zoom-in-95 z-50">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3
                  className="text-sm font-bold text-[#1E293B]"
                  style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                >
                  Notifications
                </h3>
                {notificationCount > 0 ? (
                  <span className="rounded-full bg-[#245FD4]/10 px-2 py-0.5 text-[11px] font-semibold text-[#245FD4]">
                    {notificationCount} new
                  </span>
                ) : (
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-[#64748B]">
                    0 new
                  </span>
                )}
              </div>

              {/* Empty state when zero notifications */}
              {notificationCount === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-[#94A3B8] mb-3">
                    <svg className="h-6 w-6 text-[#94A3B8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                    </svg>
                  </div>
                  <p
                    className="text-sm font-semibold text-[#1E293B]"
                    style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                  >
                    No notifications yet
                  </p>
                  <p
                    className="mt-1 text-xs text-[#64748B] max-w-[220px]"
                    style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                  >
                    We&apos;ll notify you when important updates, team activity, or alerts arrive.
                  </p>
                </div>
              ) : (
                <div className="py-4 text-center text-xs text-[#64748B]">
                  You have {notificationCount} unread {notificationCount === 1 ? "notification" : "notifications"}.
                </div>
              )}
            </div>
          )}
        </div>

        {/* User Profile Link directly to Settings */}
        <Link
          href="/settings"
          className="group flex items-center gap-2.5 rounded-full py-1 pr-2.5 pl-1 transition hover:bg-slate-100 focus:outline-none"
          title="Account Settings"
          aria-label="Account Settings"
        >
          {/* User Avatar: uses uploaded avatar preview or placeholder */}
          <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full ring-1 ring-slate-200 bg-slate-100 transition group-hover:ring-[#245FD4]">
            <Image
              src={displaySrc}
              alt={userName || "Profile avatar"}
              width={36}
              height={36}
              unoptimized
              onError={() => resolvedAvatar && setFailedUrl(resolvedAvatar)}
              className="h-full w-full object-cover"
            />
          </div>

          {/* User Name matching typography from Figma */}
          <span
            className="hidden sm:inline-block text-[#1E293B] transition group-hover:text-[#245FD4]"
            style={{
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              fontWeight: 700,
              fontSize: "14px",
              lineHeight: "18.67px",
              letterSpacing: "0%",
              verticalAlign: "middle",
            }}
          >
            {userName}
          </span>
        </Link>
      </div>
    </header>
  );
}
