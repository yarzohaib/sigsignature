"use client";

import { Suspense } from "react";
import HeroSection from "@/components/dashboard/HeroSection";
import QuickOverview from "@/components/dashboard/QuickOverview";
import ActionCards from "@/components/dashboard/ActionCards";
import DashboardSkeleton from "@/components/skeletons/DashboardSkeleton";

function DashboardContent() {
  return (
    <div className="flex min-h-full w-full shrink-0 flex-col px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 3xl:px-14 pt-5 pb-16 sm:pt-6 sm:pb-20 lg:pt-5 lg:pb-16 xl:pt-6 2xl:pt-7 2xl:pb-20 3xl:pt-[clamp(24px,1.4vw,40px)]">
      <main className="flex w-full shrink-0 flex-col justify-start gap-5 sm:gap-6 lg:justify-start lg:gap-6 xl:gap-7 2xl:gap-8">
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
        <div className="flex min-h-full w-full shrink-0 flex-col px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 3xl:px-14 pt-5 pb-16 sm:pt-6 sm:pb-20 lg:pt-4 lg:pb-16 xl:pt-5 2xl:pt-6 2xl:pb-20 3xl:pt-[clamp(24px,1.4vw,40px)]">
          <DashboardSkeleton />
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
