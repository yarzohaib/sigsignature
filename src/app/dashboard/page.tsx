"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "@/components/auth/Logo";
import SignaturePreview from "@/components/auth/SignaturePreview";
import { UserProfile, getCurrentUser, logoutUser } from "@/app/lib/api";
import {
  clearAuthSession,
  getStoredRefreshToken,
  getStoredToken,
  getStoredUser,
} from "@/app/lib/auth";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    async function verifyAuth() {
      const token = getStoredToken();
      if (!token) {
        router.replace("/login?redirect=/dashboard");
        return;
      }

      // Populate immediately with locally stored user if available
      const cachedUser = getStoredUser();
      if (cachedUser) {
        setUser(cachedUser);
      }

      // Validate with backend /api/v1/auth/me to verify token validity
      try {
        const freshUser = await getCurrentUser(token);
        setUser(freshUser);
      } catch (err) {
        console.warn("Session expired or invalid, redirecting to login:", err);
        clearAuthSession();
        router.replace("/login?redirect=/dashboard");
        return;
      } finally {
        setIsLoading(false);
      }
    }

    verifyAuth();
  }, [router]);

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      const refreshToken = getStoredRefreshToken();
      await logoutUser(refreshToken || undefined);
    } finally {
      clearAuthSession();
      router.replace("/login");
      router.refresh();
    }
  }

  // Loading skeleton while verifying session
  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-surface p-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand border-t-transparent" />
          <p className="font-heading text-lg font-semibold text-brand-dark">
            Verifying your session...
          </p>
          <p className="text-sm text-slate-500">
            Checking authentication tokens with server
          </p>
        </div>
      </main>
    );
  }

  const displayName = user?.firstName
    ? `${user.firstName} ${user.lastName || ""}`.trim()
    : "Member";

  const userInitials =
    user?.firstName && user?.lastName
      ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
      : user?.firstName
      ? user.firstName.slice(0, 2).toUpperCase()
      : "ME";

  return (
    <div className="min-h-screen bg-surface">
      {/* Top Navigation */}
      <header className="sticky top-0 z-30 border-b border-line/60 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <Link href="/" className="transition hover:opacity-90">
              <Logo variant="blue" />
            </Link>
            <nav className="hidden items-center gap-1 md:flex">
              <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-semibold text-brand-dark">
                Dashboard
              </span>
              <span className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-500 transition hover:text-slate-800">
                My Signatures
              </span>
              <span className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-500 transition hover:text-slate-800">
                Templates
              </span>
            </nav>
          </div>

          {/* User profile & Logout */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-gradient text-sm font-bold text-white shadow-sm">
                {userInitials}
              </div>
              <div className="hidden text-left sm:block">
                <p className="text-sm font-semibold text-slate-900 leading-tight">
                  {displayName}
                </p>
                <p className="text-xs text-slate-500">{user?.email}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center gap-1.5 rounded-xl border border-line bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition hover:border-red-300 hover:bg-red-50 hover:text-red-700 disabled:opacity-50 sm:text-sm"
              title="Log out of your account"
            >
              {isLoggingOut ? (
                "Logging out..."
              ) : (
                <>
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  <span>Log Out</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Protected Page Notice Banner */}
        <div className="mb-8 flex flex-col gap-3 rounded-2xl border border-blue-100 bg-blue-50/70 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand text-white">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-brand-dark">
                Protected Member Dashboard
              </p>
              <p className="text-xs text-slate-600 sm:text-sm">
                This page is secured. It is only accessible to users authenticated with a valid session token.
              </p>
            </div>
          </div>
          <span className="self-start rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 sm:self-center">
            ● Authenticated
          </span>
        </div>

        {/* Welcome Hero */}
        <div className="mb-8">
          <h1 className="text-brand-gradient font-heading text-2xl font-bold sm:text-3xl lg:text-4xl">
            Welcome back, {user?.firstName || "there"}!
          </h1>
          <p className="mt-1 text-sm text-slate-600 sm:text-base">
            Create, customize, and manage your email signatures in one place.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-line/60 bg-white p-5 shadow-xs">
            <p className="text-xs font-medium text-slate-500">Active Signatures</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">0</p>
            <p className="mt-1 text-xs text-slate-400">Ready to create your first</p>
          </div>

          <div className="rounded-2xl border border-line/60 bg-white p-5 shadow-xs">
            <p className="text-xs font-medium text-slate-500">Templates Available</p>
            <p className="mt-2 text-3xl font-bold text-brand">3</p>
            <p className="mt-1 text-xs text-slate-400">Minimal, Execute, Compact</p>
          </div>

          <div className="rounded-2xl border border-line/60 bg-white p-5 shadow-xs">
            <p className="text-xs font-medium text-slate-500">Account Status</p>
            <div className="mt-2 flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-emerald-500" />
              <p className="text-xl font-bold text-slate-900">Active</p>
            </div>
            <p className="mt-1 text-xs text-slate-400">Verified session</p>
          </div>

          <div className="rounded-2xl border border-line/60 bg-white p-5 shadow-xs">
            <p className="text-xs font-medium text-slate-500">Registered Email</p>
            <p className="mt-2 truncate text-base font-bold text-slate-900" title={user?.email}>
              {user?.email}
            </p>
            <p className="mt-1 text-xs text-slate-400">Primary contact</p>
          </div>
        </div>

        {/* Signatures Workspace & Live Preview Section */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_420px]">
          {/* Left: Create Signature Placeholder Card */}
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-line/80 bg-white p-8 text-center sm:p-12">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-brand">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
            <h2 className="mt-4 font-heading text-xl font-bold text-brand-dark sm:text-2xl">
              Create Your First Email Signature
            </h2>
            <p className="mt-2 max-w-md text-sm text-slate-600">
              Customize your contact info, social links, profile image, and branding colors. Pick from professional layouts designed to work across Outlook, Gmail, Apple Mail, and more.
            </p>
            <button
              type="button"
              className="bg-brand-gradient mt-6 flex h-12 items-center justify-center gap-2 rounded-xl px-6 font-body text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              <span>Create New Signature</span>
            </button>
          </div>

          {/* Right: Signature Template Preview */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-base font-semibold text-brand-dark">
                Template Preview
              </h3>
              <span className="text-xs font-semibold text-brand">Live sample</span>
            </div>
            <div className="rounded-2xl border border-line/60 bg-white p-4 shadow-xs">
              <SignaturePreview />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
