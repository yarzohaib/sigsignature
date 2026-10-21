"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardTopBar from "@/components/dashboard/DashboardTopBar";
import HeroSection from "@/components/dashboard/HeroSection";
import ActionCards from "@/components/dashboard/ActionCards";
import GettingStartedSteps from "@/components/dashboard/GettingStartedSteps";
import { UserProfile, getCurrentUser, logoutUser } from "@/app/lib/api";
import {
  clearAuthSession,
  getStoredRefreshToken,
  getStoredUser,
  setStoredUser,
} from "@/app/lib/auth";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    async function verifyAuth() {
      // Populate immediately with locally stored user if available
      const cachedUser = getStoredUser();
      if (cachedUser) {
        setUser(cachedUser);
      }

      // Validate with backend /api/v1/auth/me (automatically refreshes token if expired)
      try {
        const freshUser = await getCurrentUser();
        setUser(freshUser);
        setStoredUser(freshUser);
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

  // Display name: prefers user's real name, defaults to "Member"
  const displayName = user?.firstName
    ? `${user.firstName} ${user.lastName || ""}`.trim()
    : "Member";

  // Loading skeleton while verifying session
  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8FAFC] p-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-3 border-[#245FD4] border-t-transparent" />
          <p
            className="text-base font-bold text-[#1E293B]"
            style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
          >
            Loading your dashboard...
          </p>
        </div>
      </main>
    );
  }

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
        />

        {/* Dashboard Body Canvas: responsive from laptop to extra large 2xl/4K screens */}
        <div className="flex flex-1 flex-col justify-center overflow-y-auto lg:overflow-hidden px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6 xl:px-10 xl:py-7 2xl:px-12 2xl:py-8">
          <main className="mx-auto flex flex-1 lg:max-h-[860px] xl:max-h-[900px] 2xl:max-h-[960px] flex-col justify-between w-full max-w-[1240px] xl:max-w-[1360px] 2xl:max-w-[1440px]">
            {/* Welcome Heading Section */}
            <HeroSection />

            {/* Action Cards: Start From a Template & Create from Scratch */}
            <ActionCards />

            {/* Getting Started 5-step progress container */}
            <GettingStartedSteps />
          </main>
        </div>
      </div>
    </div>
  );
}
