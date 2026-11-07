"use client";

import React, { useSyncExternalStore, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import AppShell from "@/components/shell/AppShell";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

function subscribeAuthEvents(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("sig_user_update", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("sig_user_update", callback);
    window.removeEventListener("storage", callback);
  };
}

function getAuthSnapshot(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const token =
      localStorage.getItem("sig_access_token") ||
      (document.cookie.includes("sig_token=") ? "cookie_present" : "");
    const user = localStorage.getItem("sig_user");
    return Boolean(token && (user || token === "cookie_present"));
  } catch {
    return false;
  }
}

function getAuthServerSnapshot(): boolean {
  // Always default to public guest layout during SSR / static generation for SEO
  return false;
}

function AdaptivePricingLayoutInner({
  children,
  isAuthenticated,
}: {
  children: React.ReactNode;
  isAuthenticated: boolean;
}) {
  const searchParams = useSearchParams();
  const isSidebarNav = searchParams?.get("from") === "sidebar";

  // Authenticated users navigating from within dashboard sidebar see AppShell (with sidebar).
  // When navigating via public Navbar (or unauthenticated), render clean public layout (no sidebar).
  if (isAuthenticated && isSidebarNav) {
    return <AppShell>{children}</AppShell>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] font-body text-slate-900">
      <Navbar />
      <div className="flex-1 w-full pt-16 md:pt-0">
        {children}
      </div>
      {/* Full-width horizontal divider line above Footer */}
      <div className="w-full border-t border-[#D7D7D7]" />
      <Footer />
    </div>
  );
}

export default function AdaptivePricingShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthenticated = useSyncExternalStore(
    subscribeAuthEvents,
    getAuthSnapshot,
    getAuthServerSnapshot
  );

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col bg-[#F8FAFC] font-body text-slate-900">
          <Navbar />
          <div className="flex-1 w-full pt-16 md:pt-0">
            {children}
          </div>
          <div className="w-full border-t border-[#D7D7D7]" />
          <Footer />
        </div>
      }
    >
      <AdaptivePricingLayoutInner isAuthenticated={isAuthenticated}>
        {children}
      </AdaptivePricingLayoutInner>
    </Suspense>
  );
}
