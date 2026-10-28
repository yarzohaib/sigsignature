"use client";

import { Suspense } from "react";
import HeroSection from "@/components/dashboard/HeroSection";
import QuickOverview from "@/components/dashboard/QuickOverview";
import ActionCards from "@/components/dashboard/ActionCards";
import DashboardSkeleton from "@/components/skeletons/DashboardSkeleton";

function DashboardContent() {
  return (
    <div className="flex min-h-full flex-1 flex-col w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 3xl:px-14 pt-5 pb-6 sm:pt-6 lg:h-full lg:min-h-0 lg:overflow-hidden lg:pt-5 xl:pt-6 2xl:pt-7 3xl:pt-[clamp(24px,1.4vw,40px)]">
      <main className="flex w-full flex-1 flex-col justify-start gap-5 sm:gap-6 lg:min-h-0 lg:justify-start lg:gap-6 xl:gap-7 2xl:gap-8">
        {/* Welcome Heading Section */}
        <HeroSection />

        {/* Quick Overview Metrics Section */}
        <QuickOverview />

        {/* Action Cards: Start From a Template & Create from Scratch */}
        <ActionCards />
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 flex-col w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 3xl:px-14 pt-5 pb-6 sm:pt-6 lg:pt-4 xl:pt-5 2xl:pt-6 3xl:pt-[clamp(24px,1.4vw,40px)] lg:h-full lg:min-h-0 lg:overflow-hidden">
          <DashboardSkeleton />
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
