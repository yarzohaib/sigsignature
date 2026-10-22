"use client";

import React, { useState } from "react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardTopBar from "@/components/dashboard/DashboardTopBar";
import { UserProvider } from "@/contexts/UserContext";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <UserProvider>
      <div className="flex h-screen overflow-hidden bg-[#F8FAFC]">
        {/* Persistent 256px Fixed Sidebar */}
        <DashboardSidebar
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        {/* Persistent Top Navigation Bar + Dynamic Page Canvas */}
        <div className="flex flex-1 flex-col min-w-0 h-screen overflow-hidden">
          <DashboardTopBar onOpenMobileMenu={() => setMobileMenuOpen(true)} />

          {/* Page Scroll Canvas */}
          <div className="flex-1 overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </UserProvider>
  );
}

export default AppShell;
