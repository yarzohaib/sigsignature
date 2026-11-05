"use client";

import { useState, useEffect, useRef, useSyncExternalStore, useMemo, type MouseEvent as ReactMouseEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { UserProfile, getCurrentUser, logoutUser } from "@/app/lib/api";
import {
  getStoredUser,
  getStoredToken,
  setStoredUser,
  getStoredRefreshToken,
  clearAuthSession,
} from "@/app/lib/auth";

function subscribeAuthEvents(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("sig_user_update", callback);
  window.addEventListener("sig_avatar_update", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("sig_user_update", callback);
    window.removeEventListener("sig_avatar_update", callback);
    window.removeEventListener("storage", callback);
  };
}

function getAuthSnapshot(): string {
  if (typeof window === "undefined") return "";
  try {
    const token = localStorage.getItem("sig_access_token") || "";
    const rawUser = localStorage.getItem("sig_user") || "";
    const avatar = localStorage.getItem("sig_user_avatar_preview") || "";
    return `${token}:::${rawUser}:::${avatar}`;
  } catch {
    return "";
  }
}

function getAuthServerSnapshot(): string {
  return "";
}

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidePill, setHidePill] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const prevOpenRef = useRef(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const isNavActive = (href: string) => {
    if (href === "/blog") return pathname === href || pathname.startsWith(`${href}/`);
    if (href === "/templates" || href === "/template") {
      return pathname === "/templates" || pathname.startsWith("/templates/") || pathname === "/template" || pathname.startsWith("/template/");
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const desktopNavClass = (href: string) =>
    `font-body text-[15px] 3xl:text-[17px] transition-all duration-200 min-h-[44px] flex items-center rounded-full border px-3 py-1.5 ${
      isNavActive(href)
        ? "border-[#245FD4]/20 bg-[#EBF2FE] font-semibold text-[#245FD4] shadow-xs"
        : "border-transparent font-medium text-slate-600 hover:border-[#245FD4]/20 hover:bg-[#EBF2FE] hover:font-semibold hover:text-[#245FD4] hover:shadow-xs"
    }`;

  const mobileNavClass = (href: string) =>
    `flex min-h-[48px] items-center rounded-full border border-transparent px-4 font-body text-base transition-colors ${
      isNavActive(href)
        ? "bg-transparent font-semibold text-[#245FD4]"
        : "font-medium text-slate-800 hover:border-[#245FD4]/20 hover:bg-[#EBF2FE] hover:font-semibold hover:text-[#245FD4]"
    }`;

  // Synchronize auth state with localStorage and custom window events
  const authRaw = useSyncExternalStore(
    subscribeAuthEvents,
    getAuthSnapshot,
    getAuthServerSnapshot
  );

  const { user, avatarUrl } = useMemo(() => {
    if (!authRaw) return { user: null, avatarUrl: null };
    const parts = authRaw.split(":::");
    const token = parts[0];
    const userStr = parts[1];
    const avatar = parts[2] || null;
    if (!token || !userStr) return { user: null, avatarUrl: null };
    try {
      const parsedUser = JSON.parse(userStr) as UserProfile;
      return {
        user: parsedUser,
        avatarUrl: avatar || parsedUser.avatarUrl || null,
      };
    } catch {
      return { user: null, avatarUrl: null };
    }
  }, [authRaw]);

  function handleBrandClick(event: ReactMouseEvent<HTMLAnchorElement>) {
    if (window.location.pathname !== "/") return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;

    event.preventDefault();
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: shouldReduceMotion ? "auto" : "smooth",
    });
    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  }

  // Validate session with backend in background
  useEffect(() => {
    const token = getStoredToken();
    if (!token) return;

    getCurrentUser()
      .then((freshUser) => {
        const currentStored = getStoredUser();
        if (JSON.stringify(freshUser) !== JSON.stringify(currentStored)) {
          setStoredUser(freshUser);
        }
      })
      .catch(() => {
        clearAuthSession();
      });
  }, []);

  // Close desktop user dropdown on click outside or Escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setUserDropdownOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setUserDropdownOpen(false);
      }
    }
    if (userDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [userDropdownOpen]);

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      const refreshToken = getStoredRefreshToken();
      await logoutUser(refreshToken || undefined);
    } catch (err) {
      console.warn("Logout error:", err);
    } finally {
      clearAuthSession();
      setUserDropdownOpen(false);
      setIsLoggingOut(false);
      try {
        sessionStorage.setItem("sig_flash_toast", "You have been logged out successfully.");
      } catch {
        // Ignore
      }
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("sig_flash_toast", {
            detail: "You have been logged out successfully.",
          })
        );
      }
      router.refresh();
    }
  }

  const displayName = user
    ? [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email.split("@")[0]
    : "";
  const displayEmail = user?.email || "";
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const hasValidAvatar = Boolean(avatarUrl && failedUrl !== avatarUrl);

  const userInitials = useMemo(() => {
    if (!displayName) return "M";
    return (
      displayName
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join("") || "M"
    );
  }, [displayName]);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          setScrolled(currentScrollY > 20);

          // Fast scroll down detection below md
          const deltaY = currentScrollY - lastScrollY;
          if (deltaY > 10 && currentScrollY > 60) {
            setHidePill(true);
          } else if (deltaY < -4 || currentScrollY <= 20) {
            setHidePill(false);
          }

          lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close when viewport expands past md breakpoint (768px)
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 768px)");
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setMobileMenuOpen(false);
      }
    };
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  // Close on Escape key press
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileMenuOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [mobileMenuOpen]);

  // Return focus to the hamburger button when mobile menu closes
  useEffect(() => {
    if (prevOpenRef.current && !mobileMenuOpen) {
      buttonRef.current?.focus();
    }
    prevOpenRef.current = mobileMenuOpen;
  }, [mobileMenuOpen]);

  // Smooth anchor scrolling on landing page
  const handleNavAnchorClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetId: string,
    align: ScrollLogicalPosition = "start"
  ) => {
    if (typeof window === "undefined") return;

    if (window.location.pathname !== "/" && window.location.pathname !== "") {
      return;
    }

    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
      return;
    }

    e.preventDefault();
    setMobileMenuOpen(false);

    if (targetId === "pricing") {
      const cardsEl = document.getElementById("pricing-cards") || document.getElementById("pricing");
      if (cardsEl) {
        cardsEl.scrollIntoView({ behavior: "smooth", block: "center" });
        history.pushState(null, "", "pricing");
        return;
      }
    }

    const targetEl = document.getElementById(targetId);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: "smooth", block: align });
      history.pushState(null, "", `#${targetId}`);
    }
  };

  // Align hash anchor smoothly on direct load or hashchange
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleHash = () => {
      const hash = window.location.hash.replace(/^#/, "");
      if (hash === "pricing") {
        const cardsEl = document.getElementById("pricing-cards") || document.getElementById("pricing");
        if (cardsEl) {
          cardsEl.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      } else if (hash === "features" || hash === "how-it-works") {
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    };

    const timer1 = setTimeout(handleHash, 100);
    const timer2 = setTimeout(handleHash, 500);
    window.addEventListener("load", handleHash);
    window.addEventListener("hashchange", handleHash);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      window.removeEventListener("load", handleHash);
      window.removeEventListener("hashchange", handleHash);
    };
  }, []);

  return (
    <>
      {/* =========================================================================
          1. MOBILE FLOATING PILL (< 768px)
          - Inset 12px from top & sides (+ safe-area insets)
          - Fully rounded, translucent backdrop-blur pill
          - Subtle at top, opaque with soft shadow after >8px scroll
          - 44px tap target hamburger button (no border)
          - Animated fade/scale dropdown panel (180ms)
         ========================================================================= */}
      <div
        className={`fixed z-50 md:hidden pointer-events-none transition-transform duration-300 ease-out ${
          hidePill && !mobileMenuOpen ? "-translate-y-28" : "translate-y-0"
        }`}
        style={{
          top: "calc(12px + env(safe-area-inset-top, 0px))",
          left: "calc(12px + env(safe-area-inset-left, 0px))",
          right: "calc(12px + env(safe-area-inset-right, 0px))",
        }}
      >
        <div
          className={`pointer-events-auto flex h-[52px] w-full items-center justify-between rounded-full px-4 transition-all duration-300 ease-out ${
            scrolled || mobileMenuOpen
              ? "border border-slate-200/80 bg-white/95 shadow-[0_8px_24px_rgba(0,0,0,0.08)] backdrop-blur-md"
              : "border border-white/40 bg-white/50 shadow-none backdrop-blur-sm"
          }`}
        >
          {/* Mobile Logo & Wordmark */}
          <Link
            href="/"
            onClick={(event) => {
              handleBrandClick(event);
              setMobileMenuOpen(false);
            }}
            className="flex min-h-[44px] min-w-[44px] items-center gap-2 transition hover:opacity-90"
          >
            <Image
              src="/logo.svg"
              alt="Sig Signature logo"
              width={40}
              height={22}
              className="h-6 w-auto"
              priority
            />
            <span className="font-heading text-base font-semibold text-[#022977]">
              Sig Signature
            </span>
          </Link>

          {/* Mobile Right: Hamburger Toggle (Avatar is hidden on mobile pill to avoid crowding; full profile is inside menu drawer) */}
          <div className="flex items-center gap-2">
            {/* Mobile Hamburger Toggle (44px tap target, borderless) */}
            <button
              ref={buttonRef}
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-panel"
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              className="flex h-11 w-11 items-center justify-center rounded-full text-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand hover:bg-black/5 active:bg-black/10"
            >
              {mobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Panel: 24px radius, soft shadow, 180ms fade & scale */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              id="mobile-nav-panel"
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: -6 }}
              animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: -6 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="pointer-events-auto mt-2.5 w-full rounded-[24px] border border-slate-200/80 bg-white/95 p-3.5 shadow-[0_16px_36px_rgba(0,0,0,0.12)] backdrop-blur-xl"
            >
              <nav className="flex flex-col">
                <Link
                  href="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className={mobileNavClass("/about")}
                >
                  About Us
                </Link>
                <Link
                  href="/team"
                  onClick={() => setMobileMenuOpen(false)}
                  className={mobileNavClass("/team")}
                >
                  Our Team
                </Link>
                <Link
                  href="/blog"
                  onClick={() => setMobileMenuOpen(false)}
                  className={mobileNavClass("/blog")}
                >
                  Blog
                </Link>
                <Link
                  href="/use-cases"
                  onClick={() => setMobileMenuOpen(false)}
                  className={mobileNavClass("/use-cases")}
                >
                  Use Cases
                </Link>
                <Link
                  href="/pricing"
                  onClick={() => setMobileMenuOpen(false)}
                  className={mobileNavClass("/pricing")}
                >
                  Pricing
                </Link>
                <Link
                  href="/templates"
                  onClick={() => setMobileMenuOpen(false)}
                  className={mobileNavClass("/templates")}
                >
                  Templates
                </Link>

                {user ? (
                  <div className="mt-2.5 flex flex-col gap-2 border-t border-slate-200/80 pt-3">
                    {/* User Credentials Card */}
                    <div className="flex items-center gap-3 rounded-xl bg-slate-50/80 p-3 border border-slate-100">
                      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full ring-2 ring-brand/30 bg-slate-100 text-xs font-bold text-slate-700">
                        {hasValidAvatar ? (
                          <Image
                            src={avatarUrl!}
                            alt={displayName || "Profile photo"}
                            width={40}
                            height={40}
                            unoptimized
                            onError={() => avatarUrl && setFailedUrl(avatarUrl)}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span aria-hidden="true">{userInitials}</span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p
                          className="font-heading text-sm font-bold text-slate-900 truncate"
                          style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                        >
                          {displayName}
                        </p>
                        <p
                          className="font-body text-xs text-slate-500 truncate"
                          style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                          title={displayEmail}
                        >
                          {displayEmail}
                        </p>
                      </div>
                    </div>

                    <Link
                      href="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex min-h-[44px] items-center gap-3 rounded-xl px-3 font-body text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-100 hover:text-brand"
                    >
                      <svg className="h-4 w-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="7" height="7" rx="1.5" />
                        <rect x="14" y="3" width="7" height="7" rx="1.5" />
                        <rect x="14" y="14" width="7" height="7" rx="1.5" />
                        <rect x="3" y="14" width="7" height="7" rx="1.5" />
                      </svg>
                      <span>Dashboard</span>
                    </Link>

                    <Link
                      href="/signatures"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex min-h-[44px] items-center gap-3 rounded-xl px-3 font-body text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-100 hover:text-brand"
                    >
                      <svg className="h-4 w-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                      </svg>
                      <span>My Signatures</span>
                    </Link>

                    <Link
                      href="/settings"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex min-h-[44px] items-center gap-3 rounded-xl px-3 font-body text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-100 hover:text-brand"
                    >
                      <svg className="h-4 w-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="3" />
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-.33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                      </svg>
                      <span>My Profile</span>
                    </Link>

                    {/* Log Out button */}
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleLogout();
                      }}
                      disabled={isLoggingOut}
                      className="mt-1 flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50/60 font-body text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-100/80 active:scale-98 disabled:opacity-60"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                      <span>{isLoggingOut ? "Logging out..." : "Log Out"}</span>
                    </button>
                  </div>
                ) : (
                  <div className="mt-2.5 flex flex-col gap-2 border-t border-slate-200/80 pt-3">
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex min-h-[48px] items-center justify-center rounded-xl border border-[#C1C1C1] font-body text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                    >
                      Log In
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex min-h-[48px] items-center justify-center rounded-xl bg-cta-gradient bg-gradient-to-r from-[#245FD4] to-[#022977] font-body text-sm font-semibold text-white shadow-sm transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                    >
                      Start Free
                    </Link>
                  </div>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Backdrop for Outside Click */}
      {mobileMenuOpen && (
        <div
          aria-hidden="true"
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px] transition-opacity md:hidden"
        />
      )}

      {/* =========================================================================
          2. DESKTOP NAVBAR (>= 768px md)
          - Sticky scroll container with dynamic backdrop blur and border
         ========================================================================= */}
      <header
        className={`sticky top-0 z-50 hidden w-full md:block transition-all duration-200 ease-in-out ${
          scrolled
            ? "bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs"
            : "bg-transparent border-b border-transparent"
        }`}
      >

        <div className="mx-auto flex h-16 sm:h-18 max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8 xl:px-12 2xl:max-w-[1536px] 3xl:max-w-[1720px]">
          {/* Brand Logo pointing back to landing page */}
          <Link
            href="/"
            onClick={handleBrandClick}
            className="flex items-center gap-2.5 transition hover:opacity-90 min-h-[44px] min-w-[44px]"
          >
            <Image
              src="/logo.svg"
              alt="Sig Signature logo"
              width={48}
              height={26}
              className="h-7 w-auto sm:h-8"
              priority
            />
            <span className="font-heading text-lg font-semibold sm:text-xl 3xl:text-2xl text-[#022977]">
              Sig Signature
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="flex items-center gap-1 lg:gap-1.5 xl:gap-2">
            <Link
              href="/about"
              className={desktopNavClass("/about")}
            >
              About Us
            </Link>
            <Link
              href="/team"
              className={desktopNavClass("/team")}
            >
              Our Team
            </Link>
            <Link
              href="/blog"
              className={desktopNavClass("/blog")}
            >
              Blog
            </Link>
            <Link
              href="/use-cases"
              className={desktopNavClass("/use-cases")}
            >
              Use Cases
            </Link>
            <Link
              href="/pricing"
              className={desktopNavClass("/pricing")}
            >
              Pricing
            </Link>
            <Link
              href="/templates"
              className={desktopNavClass("/templates")}
            >
              Templates
            </Link>
          </nav>

          {/* Desktop Action Buttons / User Menu */}
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setUserDropdownOpen((prev) => !prev)}
                aria-expanded={userDropdownOpen}
                aria-haspopup="true"
                className="group flex items-center gap-3 rounded-full border border-slate-200 bg-transparent py-1.5 pr-4 pl-1.5 shadow-2xs backdrop-blur-sm transition hover:border-[#245FD4]/40 hover:bg-slate-50/80 active:scale-98 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                {/* User Avatar Photo or Dynamic Initials */}
                <div className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full ring-2 ring-brand/20 bg-slate-100 text-[11px] font-bold text-slate-700 transition group-hover:ring-brand">
                  {hasValidAvatar ? (
                    <Image
                      src={avatarUrl!}
                      alt={displayName || "Profile photo"}
                      width={32}
                      height={32}
                      unoptimized
                      onError={() => avatarUrl && setFailedUrl(avatarUrl)}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span aria-hidden="true">{userInitials}</span>
                  )}
                </div>

                {/* Name */}
                <span
                  className="font-heading text-sm font-semibold text-slate-900 transition group-hover:text-brand max-w-[150px] truncate text-left"
                  style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                >
                  {displayName}
                </span>

                {/* Chevron icon */}
                <svg
                  className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
                    userDropdownOpen ? "rotate-180 text-brand" : "group-hover:text-slate-600"
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

              {/* Dropdown Menu */}
              <AnimatePresence>
                {userDropdownOpen && (
                  <motion.div
                    initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: -4 }}
                    animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
                    exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: -4 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute right-0 top-full mt-2 w-60 rounded-2xl border border-slate-200/90 bg-white/98 shadow-[0_12px_32px_-4px_rgba(15,23,42,0.1),0_4px_12px_-2px_rgba(15,23,42,0.05)] backdrop-blur-md z-50 text-left overflow-hidden"
                  >
                    {/* Header: User Credentials (Photo, Name, Email) */}
                    <div className="px-3.5 py-3 border-b border-slate-100 bg-slate-50/60">
                      <div className="flex items-center gap-2.5">
                        <div className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full ring-1 ring-slate-200/80 bg-white text-[11px] font-bold text-slate-700">
                          {hasValidAvatar ? (
                            <Image
                              src={avatarUrl!}
                              alt={displayName || "Profile photo"}
                              width={32}
                              height={32}
                              unoptimized
                              onError={() => avatarUrl && setFailedUrl(avatarUrl)}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span aria-hidden="true">{userInitials}</span>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p
                            className="font-heading text-xs font-bold text-slate-900 truncate leading-snug"
                            style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                          >
                            {displayName}
                          </p>
                          <p
                            className="font-body text-[11px] text-slate-500 truncate mt-0.5 leading-snug"
                            style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                            title={displayEmail}
                          >
                            {displayEmail}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Quick navigation links */}
                    <div className="p-1.5 space-y-0.5">
                      <Link
                        href="/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100/80 hover:text-brand"
                        style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                      >
                        <svg className="h-4 w-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="3" width="7" height="7" rx="1.5" />
                          <rect x="14" y="3" width="7" height="7" rx="1.5" />
                          <rect x="14" y="14" width="7" height="7" rx="1.5" />
                          <rect x="3" y="14" width="7" height="7" rx="1.5" />
                        </svg>
                        <span>Dashboard</span>
                      </Link>

                      <Link
                        href="/settings"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100/80 hover:text-brand"
                        style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                      >
                        <svg className="h-4 w-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                        <span>My Profile</span>
                      </Link>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-slate-100" />

                    {/* Logout Button */}
                    <div className="p-1.5">
                      <button
                        type="button"
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-50/80 disabled:opacity-60 cursor-pointer text-left"
                        style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                      >
                        <svg className="h-4 w-4 text-rose-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                          <polyline points="16 17 21 12 16 7" />
                          <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        <span>{isLoggingOut ? "Logging out..." : "Log Out"}</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <Link
                href="/login"
                className="font-body text-[15px] 3xl:text-[17px] font-normal text-[#000000] transition hover:text-brand min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-cta-gradient bg-gradient-to-r from-[#245FD4] to-[#022977] px-6 py-2.5 min-h-[44px] inline-flex items-center justify-center font-body text-sm 3xl:text-base font-semibold text-white shadow-none transition hover:opacity-95"
              >
                Start Free
              </Link>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
