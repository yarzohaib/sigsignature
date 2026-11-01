"use client";

import React, { useState } from "react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardTopBar from "@/components/dashboard/DashboardTopBar";
import GettingStartedModal from "@/components/dashboard/GettingStartedModal";
import { UserProvider, useOptionalUser } from "@/contexts/UserContext";
import { getStoredUser } from "@/app/lib/auth";

function AppShellContent({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const optionalUser = useOptionalUser();
  const userId = optionalUser?.user?.id || getStoredUser()?.id || "";

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC]">
      {/* Persistent 256px Fixed Sidebar across all app pages */}
      <DashboardSidebar
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Persistent Top Navigation Bar + Dynamic Page Canvas */}
      <div className="flex flex-1 flex-col min-w-0 h-screen overflow-hidden">
        <DashboardTopBar
          avatarUrl={optionalUser?.avatarUrl || undefined}
          userName={optionalUser?.displayName}
          userEmail={optionalUser?.displayEmail}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
        />

        {/* Page Scroll Canvas */}
        <div
          id="app-scroll-container"
          data-scroll-container
          className="flex-1 min-h-0 overflow-y-auto flex flex-col scroll-smooth"
        >
          {children}
        </div>
      </div>

      {/* Global Getting Started / Onboarding Modal accessible across all app screens */}
      {userId && <GettingStartedModal userId={userId} />}
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <AppShellContent>{children}</AppShellContent>
    </UserProvider>
  );
}

export default AppShell;
