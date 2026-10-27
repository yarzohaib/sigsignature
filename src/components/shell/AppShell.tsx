"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardTopBar from "@/components/dashboard/DashboardTopBar";
import GettingStartedModal from "@/components/dashboard/GettingStartedModal";
import { UserProvider, useOptionalUser } from "@/contexts/UserContext";
import { getStoredUser } from "@/app/lib/auth";

function AppShellContent({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const optionalUser = useOptionalUser();
  const userId = optionalUser?.user?.id || getStoredUser()?.id || "";
  const pathname = usePathname();
  const isGuidesPage = Boolean(pathname?.startsWith("/help/guides"));

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC]">
      {/* Persistent 256px Fixed Sidebar (hidden on All Guides and Individual Guide pages) */}
      {!isGuidesPage && (
        <DashboardSidebar
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Persistent Top Navigation Bar + Dynamic Page Canvas */}
      <div className="flex flex-1 flex-col min-w-0 h-screen overflow-hidden">
        <DashboardTopBar onOpenMobileMenu={() => setMobileMenuOpen(true)} isGuidesPage={isGuidesPage} />

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
