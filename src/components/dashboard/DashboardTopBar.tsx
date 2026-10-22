"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getStoredAvatarUrl, getStoredRefreshToken, clearAuthSession, getStoredUser } from "@/app/lib/auth";
import { logoutUser, UserProfile } from "@/app/lib/api";
import { useOptionalUser } from "@/contexts/UserContext";
import { Skeleton } from "@/components/ui/Skeleton";

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
  userName,
  userEmail,
  avatarUrl = null,
  notificationCount = 0,
  onOpenMobileMenu,
  onLogout,
  isLoggingOut = false,
  searchValue,
  onSearchChange,
}: TopBarProps) {
  const router = useRouter();
  const optionalUser = useOptionalUser();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [internalLoggingOut, setInternalLoggingOut] = useState(false);
  const [internalSearch, setInternalSearch] = useState("");
  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  // Stored user profile for fallback name and email
  const [storedUser] = useState<UserProfile | null>(() => getStoredUser());

  const resolvedUserName =
    userName ||
    optionalUser?.displayName ||
    (storedUser
      ? [storedUser.firstName, storedUser.lastName].filter(Boolean).join(" ") ||
        storedUser.email?.split("@")[0]
      : "") ||
    "Member";

  const resolvedUserEmail = userEmail || optionalUser?.displayEmail || storedUser?.email || "";

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

  const resolvedAvatar = avatarUrl || optionalUser?.avatarUrl || storedAvatar;
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

  const handleInternalLogout = async () => {
    if (onLogout) {
      onLogout();
      return;
    }
    if (optionalUser?.logout) {
      setProfileDropdownOpen(false);
      await optionalUser.logout();
      return;
    }
    setInternalLoggingOut(true);
    try {
      const refreshToken = getStoredRefreshToken();
      await logoutUser(refreshToken || undefined);
    } catch (err) {
      console.warn("Logout error:", err);
    } finally {
      clearAuthSession();
      setProfileDropdownOpen(false);
      setInternalLoggingOut(false);
      router.replace("/login");
      router.refresh();
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (notificationsRef.current && !notificationsRef.current.contains(target)) {
        setNotificationsOpen(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(target)) {
        setProfileDropdownOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setNotificationsOpen(false);
        setProfileDropdownOpen(false);
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
    <header className="sticky top-0 z-30 flex h-[66px] 3xl:h-[clamp(74px,4vw,96px)] w-full items-center justify-between border-b border-[#E2E8F0] bg-white px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 3xl:px-14 shrink-0 transition-all">
      {/* Left: Mobile hamburger + Search input */}
      <div className="flex items-center gap-3 3xl:gap-[clamp(16px,1vw,28px)] flex-1 max-w-[500px] 3xl:max-w-[clamp(500px,30vw,900px)]">
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
          className="relative flex h-[41.33px] 3xl:h-[clamp(50px,2.8vw,70px)] w-full max-w-[384px] 3xl:max-w-none items-center rounded-xl 3xl:rounded-2xl border border-[#E2E8F0] bg-white px-3.5 3xl:px-[clamp(16px,1vw,24px)] transition focus-within:border-[#245FD4] focus-within:ring-2 focus-within:ring-blue-100"
        >
          <svg
            className="h-4 w-4 3xl:h-[clamp(18px,1vw,26px)] 3xl:w-[clamp(18px,1vw,26px)] shrink-0 text-[#94A3B8]"
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
            className="ml-2.5 3xl:ml-3.5 w-full bg-transparent text-[14px] 3xl:text-[clamp(16px,0.9vw,22px)] text-[#1E293B] placeholder-[#94A3B8] focus:outline-none"
            style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
          />
          {/* <div className="hidden items-center sm:flex">
             <kbd className="flex items-center rounded 3xl:rounded-lg border border-[#E2E8F0] bg-slate-50 px-1.5 py-0.5 3xl:px-2.5 3xl:py-1 text-[11px] 3xl:text-[clamp(13px,0.75vw,17px)] font-medium text-[#94A3B8]">
              ⌘ K
            </kbd> 
          </div> */}
        </div>
      </div>

      {/* Right: Notifications & User Profile */}
      <div className="flex items-center gap-4 sm:gap-6 3xl:gap-[clamp(24px,1.5vw,44px)]">
        {/* Notification Bell with Dropdown */}
        <div className="relative" ref={notificationsRef}>
          <button
            type="button"
            onClick={() => {
              setNotificationsOpen((prev) => !prev);
            }}
            className={`relative flex h-10 w-10 3xl:h-[clamp(48px,2.8vw,68px)] 3xl:w-[clamp(48px,2.8vw,68px)] items-center justify-center rounded-full transition ${
              notificationsOpen
                ? "bg-slate-100 text-[#1E293B]"
                : "text-[#64748B] hover:bg-slate-100 hover:text-[#1E293B]"
            }`}
            aria-label="Notifications"
            aria-expanded={notificationsOpen}
            aria-haspopup="true"
          >
            <svg className="h-5 w-5 3xl:h-[clamp(24px,1.3vw,34px)] 3xl:w-[clamp(24px,1.3vw,34px)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {/* Active notification indicator: appears only when there is a new notification */}
            {notificationCount > 0 && (
              <span className="absolute top-2.5 right-2.5 3xl:top-3.5 3xl:right-3.5 h-2 w-2 3xl:h-3 3xl:w-3 rounded-full bg-[#245FD4] ring-2 ring-white" />
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

        {/* User Profile Dropdown */}
        <div className="relative" ref={profileDropdownRef}>
          {optionalUser?.isLoadingUser && !optionalUser.user ? (
            <div className="flex items-center gap-2.5 3xl:gap-[clamp(12px,0.8vw,20px)] rounded-full py-1 pr-2.5 pl-1" aria-hidden="true">
              <Skeleton className="h-9 w-9 3xl:h-[clamp(46px,2.6vw,66px)] 3xl:w-[clamp(46px,2.6vw,66px)] rounded-full shrink-0" />
              <Skeleton className="hidden sm:inline-block h-4 3xl:h-5 w-20 3xl:w-28 rounded-md" />
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setProfileDropdownOpen((prev) => !prev)}
              aria-expanded={profileDropdownOpen}
              aria-haspopup="true"
              className="group flex items-center gap-2.5 3xl:gap-[clamp(12px,0.8vw,20px)] rounded-full py-1 pr-2.5 pl-1 3xl:py-2 3xl:pr-4 3xl:pl-2 transition hover:bg-slate-100 focus:outline-none cursor-pointer"
              title="User menu"
              aria-label="User menu"
            >
              {/* User Avatar: uses uploaded avatar preview or placeholder */}
              <div className="relative h-9 w-9 3xl:h-[clamp(46px,2.6vw,66px)] 3xl:w-[clamp(46px,2.6vw,66px)] shrink-0 overflow-hidden rounded-full ring-1 ring-slate-200 bg-slate-100 transition group-hover:ring-[#245FD4]">
                <Image
                  src={displaySrc}
                  alt={resolvedUserName || "Profile avatar"}
                  width={66}
                  height={66}
                  unoptimized
                  onError={() => resolvedAvatar && setFailedUrl(resolvedAvatar)}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* User Name matching typography from Figma */}
              <span
                className="hidden sm:inline-block text-[#1E293B] font-bold text-[14px] 3xl:text-[clamp(16px,0.95vw,22px)] transition group-hover:text-[#245FD4]"
                style={{
                  fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                  letterSpacing: "0%",
                  verticalAlign: "middle",
                }}
              >
                {resolvedUserName}
              </span>

              {/* Chevron indicator */}
              <svg
                className={`h-4 w-4 3xl:h-[clamp(18px,1vw,26px)] 3xl:w-[clamp(18px,1vw,26px)] text-slate-400 transition-transform duration-200 ${
                  profileDropdownOpen ? "rotate-180 text-[#245FD4]" : "group-hover:text-slate-600"
                }`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
          )}

          {/* Profile Dropdown Menu */}
          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-60 rounded-2xl border border-slate-200/90 bg-white/98 shadow-[0_12px_32px_-4px_rgba(15,23,42,0.1),0_4px_12px_-2px_rgba(15,23,42,0.05)] backdrop-blur-md z-50 text-left overflow-hidden animate-in fade-in zoom-in-95">
              {/* User Header */}
              <div className="px-3.5 py-3 border-b border-slate-100 bg-slate-50/60">
                <div className="flex items-center gap-2.5">
                  <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full ring-1 ring-slate-200/80 bg-white">
                    <Image
                      src={displaySrc}
                      alt={resolvedUserName || "Profile photo"}
                      width={32}
                      height={32}
                      unoptimized
                      onError={() => resolvedAvatar && setFailedUrl(resolvedAvatar)}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p
                      className="font-heading text-xs font-bold text-slate-900 truncate leading-snug"
                      style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                    >
                      {resolvedUserName}
                    </p>
                    {resolvedUserEmail && (
                      <p
                        className="font-body text-[11px] text-slate-500 truncate mt-0.5 leading-snug"
                        style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                        title={resolvedUserEmail}
                      >
                        {resolvedUserEmail}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* My Profile */}
              <div className="p-1.5">
                <Link
                  href="/settings"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100/80 hover:text-brand"
                  style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                >
                  <svg
                    className="h-4 w-4 text-slate-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <span>My Profile</span>
                </Link>
              </div>

              {/* Divider */}
              <div className="border-t border-slate-100" />

              {/* Log out */}
              <div className="p-1.5">
                <button
                  type="button"
                  onClick={handleInternalLogout}
                  disabled={isLoggingOut || internalLoggingOut}
                  className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-50/80 disabled:opacity-60 cursor-pointer text-left"
                  style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                >
                  <svg
                    className="h-4 w-4 text-rose-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  <span>{isLoggingOut || internalLoggingOut ? "Logging out..." : "Log out"}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
