"use client";

import { useEffect, useState } from "react";
import type { MouseEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { getSignatureRepository } from "@/lib/signatures/repository";
import { getStoredRefreshToken, clearAuthSession, getStoredUser, getStoredToken } from "@/app/lib/auth";
import { logoutUser } from "@/app/lib/api";
import { useOptionalUser } from "@/contexts/UserContext";
import { useSidebar } from "@/contexts/SidebarContext";
import {
  getLifetimeSignatureCount,
  syncLifetimeSignatureCount,
} from "@/lib/signatures/lifetimeTracker";

type SidebarProps = {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
  onBeforeNavigate?: (href: string) => boolean;
};

const CACHED_SIGNATURE_COUNT_KEY = "sig_cached_signatures_count";

function getCachedSignatureCount(): number {
  if (typeof window === "undefined") return 0;

  try {
    const lifetime = getLifetimeSignatureCount();
    return Math.min(3, lifetime);
  } catch {
    return 0;
  }
}

export default function DashboardSidebar({ mobileOpen = false, onCloseMobile, onBeforeNavigate }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const optionalUser = useOptionalUser();
  const { isCollapsed, toggleSidebar, setCollapsed } = useSidebar();
  // Keep the server render and the browser's first hydration render identical.
  // Browser storage is read after mount in the effect below.
  const [signatureCount, setSignatureCount] = useState<number>(0);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  function handleLinkClick(event: MouseEvent<HTMLAnchorElement>, href: string) {
    const isRegularClick =
      event.button === 0 &&
      !event.metaKey &&
      !event.ctrlKey &&
      !event.shiftKey &&
      !event.altKey;

    if (isRegularClick && onBeforeNavigate?.(href)) {
      event.preventDefault();
    }
    onCloseMobile?.();
  }

  useEffect(() => {
    let isMounted = true;
    const cached = getCachedSignatureCount();
    if (cached > 0) {
      queueMicrotask(() => {
        if (isMounted) setSignatureCount(cached);
      });
    }

    async function loadCount() {
      const user = optionalUser?.user || getStoredUser();
      const token = getStoredToken();
      if (!user && !token) {
        if (isMounted) setSignatureCount(0);
        return;
      }

      try {
        const repo = getSignatureRepository();
        const list = await repo.list();
        if (isMounted) {
          const lifetime = syncLifetimeSignatureCount(list.length, optionalUser?.user?.id);
          const count = Math.min(3, Math.max(list.length, lifetime));
          setSignatureCount(count);
          try {
            localStorage.setItem(CACHED_SIGNATURE_COUNT_KEY, String(count));
          } catch {
            // Keep the live count even if browser storage is unavailable.
          }
        }
      } catch {
        // Silently keep default 0 on error / unauthenticated
      }
    }

    loadCount();

    function handleUpdate() {
      loadCount();
    }

    window.addEventListener("sig_count_update", handleUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener("sig_count_update", handleUpdate);
    };
  }, [pathname, optionalUser?.user?.id]);

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: (
        <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
        </svg>
      ),
    },
    {
      name: "My Signatures",
      href: "/signatures",
      icon: (
        <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
      ),
    },
    {
      name: "Team Signatures",
      href: "/team-signatures",
      icon: (
        <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      name: "Templates",
      href: "/templates",
      icon: (
        <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M3 9h18" />
          <path d="M9 21V9" />
        </svg>
      ),
    },
    {
      name: "Design Studio",
      href: "/design-studio",
      icon: (
        <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      ),
    },
    {
      name: "Pricing & Billing",
      href: "/pricing",
      icon: (
        <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
          <path d="M12 6v2m0 8v2" />
        </svg>
      ),
    },
    {
      name: "Settings",
      href: "/settings",
      icon: (
        <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      ),
    },
    {
      name: "Help & Support",
      href: "/help",
      icon: (
        <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      ),
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container: responsive width (256px expanded, 72px collapsed on desktop) */}
      <aside
        data-dashboard-sidebar="true"
        className={`fixed inset-y-0 left-0 z-50 flex h-full max-h-screen shrink-0 flex-col justify-between overflow-y-auto overflow-x-hidden border-r border-[#E2E8F0] bg-white transition-[width,padding,transform] duration-300 ease-in-out sidebar-scrollbar lg:static lg:translate-x-0 ${
          isCollapsed ? "lg:w-[72px] lg:px-2.5 py-4 w-[256px] px-5" : "w-[256px] px-5 py-4"
        } ${mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}`}
      >
        <div className="flex flex-col shrink-0">
          {/* Logo Section & Collapse Toggle */}
          <div className={`flex items-center pb-3.5 ${isCollapsed ? "lg:justify-center" : "justify-between"}`}>
            <Link
              href="/dashboard"
              className={`group relative flex items-center gap-2.5 transition hover:opacity-90 ${
                isCollapsed ? "lg:justify-center" : ""
              }`}
              onClick={(event) => {
                if (isCollapsed && window.matchMedia("(min-width: 1024px)").matches) {
                  event.preventDefault();
                  setCollapsed(false);
                  return;
                }
                handleLinkClick(event, "/dashboard");
              }}
              title={isCollapsed ? "Expand sidebar" : "Sig Signature Dashboard"}
              aria-label={isCollapsed ? "Expand sidebar" : "Sig Signature Dashboard"}
            >
              <Image
                src="/logo.svg"
                alt="Sig Signature"
                width={36}
                height={20}
                className={`h-6 w-auto shrink-0 transition-opacity duration-200 ${isCollapsed ? "lg:group-hover:opacity-0" : ""}`}
                priority
              />
              {isCollapsed && (
                <svg
                  className="pointer-events-none absolute left-1/2 top-1/2 hidden h-5 w-5 -translate-x-1/2 -translate-y-1/2 text-[#022977] opacity-0 transition-opacity duration-200 lg:block lg:group-hover:opacity-100"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="3" y="4" width="18" height="16" rx="2.5" />
                  <path d="M9 4v16m5-11 3 3-3 3" />
                </svg>
              )}
              <span
                className={`block overflow-hidden whitespace-nowrap font-semibold text-[#022977] text-[16px] transition-[max-width,opacity] duration-300 ease-in-out ${
                  isCollapsed ? "lg:max-w-0 lg:opacity-0" : "max-w-40 opacity-100"
                }`}
                style={{
                  fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                  letterSpacing: "0%",
                  verticalAlign: "middle",
                }}
              >
                Sig Signature
              </span>
            </Link>

            {/* Collapse/Expand Toggle Button (Desktop) */}
            {!isCollapsed && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleSidebar();
                }}
                className="hidden lg:flex items-center justify-center h-8 w-8 rounded-lg text-[#022977] hover:bg-slate-100 hover:text-[#022977] transition cursor-pointer"
                aria-label="Collapse sidebar (Cmd + B)"
                title="Collapse sidebar (Cmd + B / Ctrl + B)"
              >
                <svg className="h-4 w-4 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="16" rx="2.5" />
                  <path d="M9 4v16" />
                </svg>
              </button>
            )}

            {/* Mobile close button */}
            <button
              type="button"
              onClick={onCloseMobile}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 lg:hidden"
              aria-label="Close sidebar"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation Links */}
          <nav
            className={`mt-1 flex flex-col space-y-1 ${isCollapsed ? "lg:mx-0 -mx-2" : "-mx-2"}`}
            aria-label="Sidebar Navigation"
          >
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href === "/signatures" && pathname.startsWith("/signatures")) ||
                (item.href === "/team-signatures" && pathname.startsWith("/team-signatures")) ||
                (item.href === "/templates" && pathname.startsWith("/templates")) ||
                (item.href === "/pricing" && pathname.startsWith("/pricing")) ||
                (item.href === "/design-studio" && pathname.startsWith("/design-studio")) ||
                (item.href === "/help" && pathname.startsWith("/help")) ||
                (item.href === "/settings" && pathname.startsWith("/settings"));
              return (
                <div key={item.name} className="relative group">
                  <Link
                    href={item.href}
                    prefetch={true}
                    onClick={(event) => handleLinkClick(event, item.href)}
                    className={`flex items-center gap-3 rounded-xl px-2.5 py-2 transition-colors font-medium text-[15px] ${
                      isCollapsed ? "lg:justify-center lg:gap-0 lg:px-0 lg:py-0 lg:h-10 lg:w-10 lg:mx-auto" : ""
                    } ${
                      isActive
                        ? "bg-[#EFF6FF] text-[#245FD4]"
                        : "text-[#64748B] hover:bg-slate-50 hover:text-[#1E293B]"
                    }`}
                    style={{
                      fontFamily: "var(--font-commissioner), Commissioner, sans-serif",
                      letterSpacing: "0%",
                      verticalAlign: "middle",
                    }}
                    aria-label={item.name}
                  >
                    <span className={isActive ? "text-[#245FD4]" : "text-[#64748B]"}>
                      {item.icon}
                    </span>
                    <span className={`block overflow-hidden whitespace-nowrap transition-[max-width,opacity] duration-300 ease-in-out ${isCollapsed ? "lg:min-w-0 lg:max-w-0 lg:opacity-0" : "max-w-48 opacity-100"}`}>
                      {item.name}
                    </span>
                  </Link>

                  {/* Hover Tooltip when sidebar is collapsed on desktop */}
                  {isCollapsed && (
                    <div
                      role="tooltip"
                      className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3.5 z-50 hidden lg:group-hover:flex items-center rounded-lg bg-slate-900 px-2.5 py-1 text-xs font-semibold text-white shadow-xl whitespace-nowrap animate-in fade-in zoom-in-95 duration-150"
                      style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                    >
                      {item.name}
                      <span className="absolute -left-1 top-1/2 -translate-y-1/2 border-y-4 border-y-transparent border-r-4 border-r-slate-900" />
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Bottom Cards Section */}
        <div className="mt-auto flex flex-col gap-2.5 pt-3 shrink-0">
          {/* Card 1: Unlock Premium Features */}
          {isCollapsed ? (
            <div className="relative group lg:flex hidden justify-center">
              <Link
                href="/pricing"
                onClick={(event) => handleLinkClick(event, "/pricing")}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#245FD4] hover:bg-[#245FD4] hover:text-white transition shadow-2xs"
                aria-label="Unlock Premium Features"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
                </svg>
              </Link>
              <div
                role="tooltip"
                className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3.5 z-50 hidden group-hover:flex items-center rounded-lg bg-slate-900 px-2.5 py-1 text-xs font-semibold text-white shadow-xl whitespace-nowrap animate-in fade-in zoom-in-95 duration-150"
                style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
              >
                Unlock Premium Features
                <span className="absolute -left-1 top-1/2 -translate-y-1/2 border-y-4 border-y-transparent border-r-4 border-r-slate-900" />
              </div>
            </div>
          ) : (
            <div className="rounded-2xl bg-[#EFF6FF] p-3.5 text-center">
              <div className="mx-auto mb-2 flex h-6 w-6 items-center justify-center rounded-lg bg-[#245FD4] text-white shadow-xs">
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
                </svg>
              </div>
              <h4
                className="text-[13px] font-bold text-[#1E293B]"
                style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
              >
                Unlock Premium Features
              </h4>
              <p
                className="mt-0.5 text-[11px] leading-[16px] text-[#64748B]"
                style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
              >
                Upgrade to premium and access powerful features and advanced customization.
              </p>
              <Link
                href="/pricing"
                onClick={(event) => handleLinkClick(event, "/pricing")}
                className="mt-2.5 block w-full rounded-xl bg-cta-gradient bg-gradient-to-r from-[#245FD4] to-[#022977] py-2 text-center text-[12px] font-medium text-white shadow-xs transition hover:opacity-95"
                style={{
                  fontFamily: "var(--font-commissioner), Commissioner, sans-serif",
                  letterSpacing: "0%",
                }}
              >
                Upgrade Now
              </Link>
            </div>
          )}

          {/* Card 2: Free Plan 0/3 Signatures */}
          {isCollapsed ? (
            <div className="relative group lg:flex hidden justify-center">
              <Link
                href="/pricing"
                onClick={(event) => handleLinkClick(event, "/pricing")}
                className="flex h-10 w-10 flex-col items-center justify-center rounded-xl border border-[#E2E8F0] bg-white text-slate-700 hover:border-slate-300 transition shadow-2xs"
                aria-label={`Quota: ${signatureCount}/3`}
              >
                <span className="text-[11px] font-bold text-[#1E293B]">{signatureCount}/3</span>
              </Link>
              <div
                role="tooltip"
                className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3.5 z-50 hidden group-hover:flex items-center rounded-lg bg-slate-900 px-2.5 py-1 text-xs font-semibold text-white shadow-xl whitespace-nowrap animate-in fade-in zoom-in-95 duration-150"
                style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
              >
                {signatureCount} / 3 Signatures used
                <span className="absolute -left-1 top-1/2 -translate-y-1/2 border-y-4 border-y-transparent border-r-4 border-r-slate-900" />
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-[#E2E8F0] bg-white p-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-100 text-[#64748B]">
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span
                    className="text-[11px] font-normal text-[#64748B]"
                    style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                  >
                    Free Plan
                  </span>
                  <span
                    className="text-[12px] font-bold text-[#1E293B]"
                    style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                  >
                    {signatureCount} / 3 Signatures
                  </span>
                </div>
              </div>

              {/* Plan progress bar */}
              <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                <div
                  className={`h-full rounded-full bg-[#245FD4] transition-all duration-300 ${
                    signatureCount === 0 ? "w-0 opacity-0" : ""
                  }`}
                  style={{
                    width: `${Math.min(100, Math.max(0, (signatureCount / 3) * 100))}%`,
                  }}
                />
              </div>

              <div className="mt-2 flex items-center justify-between">
                <Link
                  href="/pricing"
                  onClick={(event) => handleLinkClick(event, "/pricing")}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#245FD4] transition hover:underline"
                  style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                >
                  <span>Upgrade Plan</span>
                  <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
          )}

          {/* Logout Button */}
          <div className="relative group">
            <button
              type="button"
              disabled={isLoggingOut}
              onClick={async () => {
                if (optionalUser?.logout) {
                  await optionalUser.logout();
                  return;
                }
                setIsLoggingOut(true);
                try {
                  const refreshToken = getStoredRefreshToken();
                  await logoutUser(refreshToken || undefined);
                } catch (err) {
                  console.warn("Logout error:", err);
                } finally {
                  clearAuthSession();
                  try {
                    sessionStorage.setItem("sig_flash_toast", "You have been logged out successfully.");
                  } catch {
                    // Ignore
                  }
                  setIsLoggingOut(false);
                  router.replace("/login");
                  router.refresh();
                }
              }}
              className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-50/80 disabled:opacity-60 cursor-pointer text-left ${
                isCollapsed ? "lg:justify-center lg:px-0 lg:h-10 lg:w-10 lg:mx-auto" : ""
              }`}
              style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
              aria-label="Log out"
            >
              <svg
                className="h-4 w-4 text-rose-500 shrink-0"
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
              <span className={isCollapsed ? "lg:hidden" : "block"}>
                {isLoggingOut ? "Logging out..." : "Log out"}
              </span>
            </button>

            {isCollapsed && (
              <div
                role="tooltip"
                className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3.5 z-50 hidden lg:group-hover:flex items-center rounded-lg bg-slate-900 px-2.5 py-1 text-xs font-semibold text-white shadow-xl whitespace-nowrap animate-in fade-in zoom-in-95 duration-150"
                style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
              >
                Log out
                <span className="absolute -left-1 top-1/2 -translate-y-1/2 border-y-4 border-y-transparent border-r-4 border-r-slate-900" />
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}


// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { usePathname, useRouter } from "next/navigation";
// import { getSignatureRepository } from "@/lib/signatures/repository";
// import { getStoredRefreshToken, clearAuthSession, getStoredUser, getStoredToken } from "@/app/lib/auth";
// import { logoutUser } from "@/app/lib/api";
// import { useOptionalUser } from "@/contexts/UserContext";

// type SidebarProps = {
//   mobileOpen?: boolean;
//   onCloseMobile?: () => void;
// };

// export default function DashboardSidebar({ mobileOpen = false, onCloseMobile }: SidebarProps) {
//   const pathname = usePathname();
//   const router = useRouter();
//   const optionalUser = useOptionalUser();
//   const [signatureCount, setSignatureCount] = useState<number>(0);
//   const [isLoggingOut, setIsLoggingOut] = useState(false);

//   useEffect(() => {
//     let isMounted = true;
//     async function loadCount() {
//       try {
//         const repo = getSignatureRepository();
//         const list = await repo.list();
//         if (isMounted) {
//           setSignatureCount(list.length);
//         }
//       } catch {
//         // Silently keep default 0 on error / unauthenticated
//       }
//     }

//     loadCount();

//     function handleUpdate() {
//       loadCount();
//     }

//     window.addEventListener("sig_count_update", handleUpdate);
//     return () => {
//       isMounted = false;
//       window.removeEventListener("sig_count_update", handleUpdate);
//     };
//   }, [pathname, optionalUser?.user?.id]);

//   const navItems = [
//     {
//       name: "Dashboard",
//       href: "/dashboard",
//       icon: (
//         <svg className="w-5 h-5 3xl:w-[clamp(22px,1.2vw,30px)] 3xl:h-[clamp(22px,1.2vw,30px)] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
//           <rect x="3" y="3" width="7" height="7" rx="1.5" />
//           <rect x="14" y="3" width="7" height="7" rx="1.5" />
//           <rect x="14" y="14" width="7" height="7" rx="1.5" />
//           <rect x="3" y="14" width="7" height="7" rx="1.5" />
//         </svg>
//       ),
//     },
//     {
//       name: "My Signatures",
//       href: "/signatures",
//       icon: (
//         <svg className="w-5 h-5 3xl:w-[clamp(22px,1.2vw,30px)] 3xl:h-[clamp(22px,1.2vw,30px)] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
//           <path d="M12 20h9" />
//           <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
//         </svg>
//       ),
//     },
//     {
//       name: "Team Signatures",
//       href: "/team-signatures",
//       icon: (
//         <svg className="w-5 h-5 3xl:w-[clamp(22px,1.2vw,30px)] 3xl:h-[clamp(22px,1.2vw,30px)] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
//           <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
//           <circle cx="9" cy="7" r="4" />
//           <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
//           <path d="M16 3.13a4 4 0 0 1 0 7.75" />
//         </svg>
//       ),
//     },
//     {
//       name: "Templates",
//       href: "/templates",
//       icon: (
//         <svg className="w-5 h-5 3xl:w-[clamp(22px,1.2vw,30px)] 3xl:h-[clamp(22px,1.2vw,30px)] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
//           <rect x="3" y="3" width="18" height="18" rx="2" />
//           <path d="M3 9h18" />
//           <path d="M9 21V9" />
//         </svg>
//       ),
//     },
//     {
//       name: "Design Studio",
//       href: "/design-studio",
//       icon: (
//         <svg className="w-5 h-5 3xl:w-[clamp(22px,1.2vw,30px)] 3xl:h-[clamp(22px,1.2vw,30px)] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
//           <circle cx="12" cy="12" r="3" />
//           <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
//         </svg>
//       ),
//     },
//     {
//       name: "Pricing & Billing",
//       href: "/pricing",
//       icon: (
//         <svg className="w-5 h-5 3xl:w-[clamp(22px,1.2vw,30px)] 3xl:h-[clamp(22px,1.2vw,30px)] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
//           <circle cx="12" cy="12" r="10" />
//           <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
//           <path d="M12 6v2m0 8v2" />
//         </svg>
//       ),
//     },
//     {
//       name: "Settings",
//       href: "/settings",
//       icon: (
//         <svg className="w-5 h-5 3xl:w-[clamp(22px,1.2vw,30px)] 3xl:h-[clamp(22px,1.2vw,30px)] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
//           <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
//           <circle cx="12" cy="12" r="3" />
//         </svg>
//       ),
//     },
//     {
//       name: "Help & Support",
//       href: "/help",
//       icon: (
//         <svg className="w-5 h-5 3xl:w-[clamp(22px,1.2vw,30px)] 3xl:h-[clamp(22px,1.2vw,30px)] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
//           <circle cx="12" cy="12" r="10" />
//           <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
//           <line x1="12" y1="17" x2="12.01" y2="17" />
//         </svg>
//       ),
//     },
//   ];

//   return (
//     <>
//       {/* Mobile Backdrop */}
//       {mobileOpen && (
//         <div
//           onClick={onCloseMobile}
//           className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
//         />
//       )}

//       {/* Sidebar Container: standard fixed width w-[256px] on desktop */}
//       <aside
//         className={`fixed inset-y-0 left-0 z-50 flex h-full max-h-screen w-[256px] shrink-0 flex-col justify-between overflow-y-auto overflow-x-hidden border-r border-[#E2E8F0] bg-white px-5 py-4 transition-all duration-300 ease-in-out sidebar-scrollbar lg:static lg:translate-x-0 ${
//           mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
//         }`}
//       >
//         <div className="flex flex-col shrink-0">
//           {/* Logo Section */}
//           <div className="flex items-center justify-between pb-3.5">
//             <Link
//               href="/dashboard"
//               className="flex items-center gap-2.5 transition hover:opacity-90"
//               onClick={onCloseMobile}
//             >
//               <Image
//                 src="/logo.svg"
//                 alt="Sig Signature"
//                 width={36}
//                 height={20}
//                 className="h-6 w-auto"
//                 priority
//               />
//               <span
//                 className="font-semibold text-[#022977] text-[16px]"
//                 style={{
//                   fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
//                   letterSpacing: "0%",
//                   verticalAlign: "middle",
//                 }}
//               >
//                 Sig Signature
//               </span>
//             </Link>

//             {/* Mobile close button */}
//             <button
//               type="button"
//               onClick={onCloseMobile}
//               className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 lg:hidden"
//               aria-label="Close sidebar"
//             >
//               <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             </button>
//           </div>

//           {/* Navigation Links */}
//           <nav className="mt-1 flex flex-col space-y-1 -mx-2" aria-label="Sidebar Navigation">
//             {navItems.map((item) => {
//               const isActive =
//                 pathname === item.href ||
//                 (item.href === "/signatures" && pathname.startsWith("/signatures")) ||
//                 (item.href === "/team-signatures" && pathname.startsWith("/team-signatures")) ||
//                 (item.href === "/templates" && pathname.startsWith("/templates")) ||
//                 (item.href === "/pricing" && pathname.startsWith("/pricing")) ||
//                 (item.href === "/design-studio" && pathname.startsWith("/design-studio")) ||
//                 (item.href === "/help" && pathname.startsWith("/help")) ||
//                 (item.href === "/settings" && pathname.startsWith("/settings"));
//               return (
//                 <Link
//                   key={item.name}
//                   href={item.href}
//                   prefetch={true}
//                   onClick={(e) => {
//                     if (item.href.startsWith("#")) {
//                       e.preventDefault();
//                     }
//                     onCloseMobile?.();
//                   }}
//                   className={`flex items-center gap-3 rounded-xl px-2 py-2 transition-colors font-medium text-[15px] ${
//                     isActive
//                       ? "bg-[#EFF6FF] text-[#245FD4]"
//                       : "text-[#64748B] hover:bg-slate-50 hover:text-[#1E293B]"
//                   }`}
//                   style={{
//                     fontFamily: "var(--font-commissioner), Commissioner, sans-serif",
//                     letterSpacing: "0%",
//                     verticalAlign: "middle",
//                   }}
//                 >
//                   <span className={isActive ? "text-[#245FD4]" : "text-[#64748B]"}>
//                     {item.icon}
//                   </span>
//                   <span>{item.name}</span>
//                 </Link>
//               );
//             })}
//           </nav>
//         </div>

//         {/* Bottom Cards Section */}
//         <div className="mt-auto flex flex-col gap-2.5 pt-3 shrink-0">
//           {/* Card 1: Unlock Premium Features */}
//           <div className="rounded-2xl bg-[#EFF6FF] p-3.5 text-center">
//             <div className="mx-auto mb-2 flex h-6 w-6 items-center justify-center rounded-lg bg-[#245FD4] text-white shadow-xs">
//               <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
//                 <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
//               </svg>
//             </div>
//             <h4
//               className="text-[13px] font-bold text-[#1E293B]"
//               style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
//             >
//               Unlock Premium Features
//             </h4>
//             <p
//               className="mt-0.5 text-[11px] leading-[16px] text-[#64748B]"
//               style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
//             >
//               Upgrade to premium and access powerful features and advanced customization.
//             </p>
//             <Link
//               href="/pricing"
//               onClick={onCloseMobile}
//               className="mt-2.5 block w-full rounded-xl bg-cta-gradient bg-gradient-to-r from-[#245FD4] to-[#022977] py-2 text-center text-[12px] font-medium text-white shadow-xs transition hover:opacity-95"
//               style={{
//                 fontFamily: "var(--font-commissioner), Commissioner, sans-serif",
//                 letterSpacing: "0%",
//               }}
//             >
//               Upgrade Now
//             </Link>
//           </div>

//           {/* Card 2: Free Plan 0/3 Signatures */}
//           <div className="rounded-xl border border-[#E2E8F0] bg-white p-3">
//             <div className="flex items-center gap-2.5">
//               <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-100 text-[#64748B]">
//                 <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                   <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                 </svg>
//               </div>
//               <div className="flex flex-col">
//                 <span
//                   className="text-[11px] font-normal text-[#64748B]"
//                   style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
//                 >
//                   Free Plan
//                 </span>
//                 <span
//                   className="text-[12px] font-bold text-[#1E293B]"
//                   style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
//                 >
//                   {signatureCount} / 3 Signatures
//                 </span>
//               </div>
//             </div>

//             {/* Plan progress bar */}
//             <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
//               <div
//                 className="h-full rounded-full bg-[#245FD4] transition-all duration-300"
//                 style={{
//                   width: `${Math.min(100, Math.max(12, (signatureCount / 3) * 100))}%`,
//                 }}
//               />
//             </div>

//             <div className="mt-2 flex items-center justify-between">
//               <Link
//                 href="/pricing"
//                 onClick={onCloseMobile}
//                 className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#245FD4] transition hover:underline"
//                 style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
//               >
//                 <span>Upgrade Plan</span>
//                 <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
//                   <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
//                 </svg>
//               </Link>
//             </div>
//           </div>

//           {/* Logout Button */}
//           <button
//             type="button"
//             disabled={isLoggingOut}
//             onClick={async () => {
//               if (optionalUser?.logout) {
//                 await optionalUser.logout();
//                 return;
//               }
//               setIsLoggingOut(true);
//               try {
//                 const refreshToken = getStoredRefreshToken();
//                 await logoutUser(refreshToken || undefined);
//               } catch (err) {
//                 console.warn("Logout error:", err);
//               } finally {
//                 clearAuthSession();
//                 setIsLoggingOut(false);
//                 router.replace("/login");
//                 router.refresh();
//               }
//             }}
//             className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-50/80 disabled:opacity-60 cursor-pointer text-left"
//             style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
//           >
//             <svg
//               className="h-4 w-4 text-rose-500"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             >
//               <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
//               <polyline points="16 17 21 12 16 7" />
//               <line x1="21" y1="12" x2="9" y2="12" />
//             </svg>
//             <span>{isLoggingOut ? "Logging out..." : "Log out"}</span>
//           </button>
//         </div>
//       </aside>
//     </>
//   );
// }
