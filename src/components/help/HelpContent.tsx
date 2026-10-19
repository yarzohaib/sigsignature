"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardTopBar from "@/components/dashboard/DashboardTopBar";
import HelpHero from "@/components/help/HelpHero";
import CategoryCards from "@/components/help/CategoryCards";
import PopularGuides from "@/components/help/PopularGuides";
import QuickAnswers from "@/components/help/QuickAnswers";
import SupportBanner from "@/components/help/SupportBanner";
import { UserProfile, getCurrentUser, logoutUser } from "@/app/lib/api";
import {
  clearAuthSession,
  getStoredRefreshToken,
  getStoredUser,
} from "@/app/lib/auth";

export default function HelpContent() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(() => getStoredUser());
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let isCancelled = false;
    async function refreshUser() {
      try {
        const freshUser = await getCurrentUser();
        if (!isCancelled) {
          setUser(freshUser);
        }
      } catch (err) {
        console.warn("Session check in Help page failed:", err);
      }
    }

    refreshUser();
    return () => {
      isCancelled = true;
    };
  }, []);

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

  const displayName = user?.firstName
    ? `${user.firstName} ${user.lastName || ""}`.trim()
    : "Member";

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC]">
      {/* 256px Fixed Sidebar */}
      <DashboardSidebar
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Navigation Bar with Search and Profile */}
        <DashboardTopBar
          userName={displayName}
          userEmail={user?.email}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onLogout={handleLogout}
          isLoggingOut={isLoggingOut}
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Help & Support Body Canvas */}
        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-8 xl:px-10 2xl:px-12">
          <main className="mx-auto flex flex-col gap-8 sm:gap-10 w-full max-w-[1093px] pb-10">
            {/* 1. Hero */}
            <HelpHero />

            {/* 2. Category Cards */}
            <CategoryCards />

            {/* 3. Popular Guides & Quick Answers */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-start">
              <PopularGuides searchQuery={searchQuery} />
              <QuickAnswers />
            </div>

            {/* 4. Support Banner */}
            <SupportBanner />
          </main>
        </div>
      </div>
    </div>
  );
}
