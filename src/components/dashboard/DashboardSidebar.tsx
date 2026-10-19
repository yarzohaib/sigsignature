"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { getSignatureRepository } from "@/lib/signatures/repository";

type SidebarProps = {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
};

export default function DashboardSidebar({ mobileOpen = false, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const [signatureCount, setSignatureCount] = useState<number>(0);

  useEffect(() => {
    let isMounted = true;
    async function loadCount() {
      try {
        const repo = getSignatureRepository();
        const list = await repo.list();
        if (isMounted) {
          setSignatureCount(list.length);
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
  }, [pathname]);

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
    // {
    //   name: "Brand Assets",
    //   href: "#brand-assets",
    //   icon: (
    //     <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    //       <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    //       <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    //     </svg>
    //   ),
    // },
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

      {/* Sidebar Container: 256px fixed width */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[256px] flex-col justify-between border-r border-[#E2E8F0] bg-white p-6 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
        style={{ width: "256px" }}
      >
        <div className="flex flex-col">
          {/* Logo Section */}
          <div className="flex items-center justify-between pb-6">
            <Link
              href="/dashboard"
              className="flex items-center gap-2.5 transition hover:opacity-90"
              onClick={onCloseMobile}
            >
              <Image
                src="/logo.svg"
                alt="Sig Signature"
                width={36}
                height={20}
                className="h-6 w-auto"
                priority
              />
              <span
                style={{
                  fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                  fontWeight: 600,
                  fontSize: "16px",
                  lineHeight: "26.67px",
                  letterSpacing: "0%",
                  verticalAlign: "middle",
                  color: "#022977",
                }}
              >
                Sig Signature
              </span>
            </Link>

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
          <nav className="mt-2 flex flex-col space-y-1.5" aria-label="Sidebar Navigation">
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
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={(e) => {
                    if (item.href.startsWith("#")) {
                      e.preventDefault();
                    }
                    onCloseMobile?.();
                  }}
                  className={`flex items-center gap-3.5 rounded-xl px-3.5 py-2.5 transition-colors ${
                    isActive
                      ? "bg-[#EFF6FF] text-[#245FD4]"
                      : "text-[#64748B] hover:bg-slate-50 hover:text-[#1E293B]"
                  }`}
                  style={{
                    fontFamily: "var(--font-commissioner), Commissioner, sans-serif",
                    fontWeight: 500,
                    fontSize: "16px",
                    lineHeight: "21.33px",
                    letterSpacing: "0%",
                    verticalAlign: "middle",
                  }}
                >
                  <span className={isActive ? "text-[#245FD4]" : "text-[#64748B]"}>
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Cards Section (Gap 62px from navigation as per Figma specs) */}
        <div className="mt-8 flex flex-col gap-3 pt-4">
          {/* Card 1: Unlock Premium Features */}
          <div className="rounded-2xl bg-[#EFF6FF] p-4 text-left">
            <div className="mb-2.5 flex h-7 w-7 items-center justify-center rounded-lg bg-[#245FD4] text-white shadow-xs">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
              </svg>
            </div>
            <h4
              className="text-[14px] font-bold text-[#1E293B]"
              style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
            >
              Unlock Premium Features
            </h4>
            <p
              className="mt-1 text-[12px] leading-[18px] text-[#64748B]"
              style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
            >
              Upgrade to premium and access powerful features and advanced customization.
            </p>
            <Link
              href="/pricing"
              onClick={onCloseMobile}
              className="mt-3.5 block w-full rounded-xl bg-cta-gradient bg-gradient-to-r from-[#245FD4] to-[#022977] py-2.5 text-center text-[12px] font-medium text-white shadow-xs transition hover:opacity-95"
              style={{
                fontFamily: "var(--font-commissioner), Commissioner, sans-serif",
                fontWeight: 500,
                fontSize: "12px",
                lineHeight: "16px",
                letterSpacing: "0%",
              }}
            >
              Upgrade Now
            </Link>
          </div>

          {/* Card 2: Free Plan 0/3 Signatures */}
          <div className="rounded-xl border border-[#E2E8F0] bg-white p-3.5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-[#64748B]">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
            <div className="mt-2.5 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-[#245FD4] transition-all duration-300"
                style={{
                  width: `${Math.min(100, Math.max(12, (signatureCount / 3) * 100))}%`,
                }}
              />
            </div>

            <div className="mt-2.5 flex items-center justify-between">
              <Link
                href="/pricing"
                onClick={onCloseMobile}
                className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#245FD4] transition hover:underline"
                style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
              >
                <span>Upgrade Plan</span>
                <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
