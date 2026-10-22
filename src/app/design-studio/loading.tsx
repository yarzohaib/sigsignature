"use client";

import React from "react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardTopBar from "@/components/dashboard/DashboardTopBar";
import DesignStudioSkeleton from "@/components/skeletons/DesignStudioSkeleton";

export default function DesignStudioLoading() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#FCFCFC]">
      <DashboardSidebar mobileOpen={false} onCloseMobile={() => {}} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardTopBar onOpenMobileMenu={() => {}} />
        <DesignStudioSkeleton />
      </div>
    </div>
  );
}
