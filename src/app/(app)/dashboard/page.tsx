"use client";

import { Suspense } from "react";
import HeroSection from "@/components/dashboard/HeroSection";
import QuickOverview from "@/components/dashboard/QuickOverview";
import ActionCards from "@/components/dashboard/ActionCards";
import DashboardSkeleton from "@/components/skeletons/DashboardSkeleton";

function DashboardContent() {
  return (
    <div className="flex min-h-full flex-1 flex-col w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 3xl:px-14 py-5 sm:py-6 lg:py-6 xl:py-7 2xl:py-8 3xl:py-[clamp(24px,1.4vw,40px)]">
      <main className="flex w-full flex-1 flex-col justify-between gap-6 sm:gap-7 lg:gap-6 xl:gap-7 2xl:gap-8">
        {/* Top Group: Hero Section + Quick Overview */}
        <div className="flex flex-col gap-5 sm:gap-6 lg:gap-6 xl:gap-7 shrink-0">
          {/* Welcome Heading Section */}
          <HeroSection />

          {/* Quick Overview Metrics Section */}
          <QuickOverview />
        </div>

        {/* Action Cards: Start From a Template & Create from Scratch (anchored to bottom on bigger screens) */}
        <div className="w-full shrink-0 lg:mt-auto">
          <ActionCards />
        </div>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 flex-col w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 3xl:px-14 py-5 sm:py-6 lg:py-4 xl:py-5 2xl:py-6 3xl:py-[clamp(24px,1.4vw,40px)] lg:h-full lg:min-h-0 lg:overflow-hidden">
          <DashboardSkeleton />
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
