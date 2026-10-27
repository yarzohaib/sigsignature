"use client";

import { Suspense } from "react";
import HeroSection from "@/components/dashboard/HeroSection";
import QuickOverview from "@/components/dashboard/QuickOverview";
import ActionCards from "@/components/dashboard/ActionCards";
import GettingStartedModal from "@/components/dashboard/GettingStartedModal";
import DashboardSkeleton from "@/components/skeletons/DashboardSkeleton";
import { useOptionalUser } from "@/contexts/UserContext";
import { getStoredUser } from "@/app/lib/auth";

function DashboardContent() {
  const optionalUser = useOptionalUser();
  const userId = optionalUser?.user?.id || getStoredUser()?.id || "";

  return (
    <div className="flex min-h-full flex-1 flex-col w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 3xl:px-14 py-5 sm:py-6 lg:py-6 xl:py-7 2xl:py-8 3xl:py-[clamp(24px,1.4vw,40px)]">
      <main className="flex w-full flex-1 flex-col justify-start gap-6 sm:gap-7 lg:justify-between lg:gap-5 xl:gap-6 2xl:gap-7 3xl:gap-[clamp(24px,1.5vw,44px)]">
        {/* Welcome Heading Section */}
        <HeroSection />

        {/* Quick Overview Metrics Section */}
        <QuickOverview />

        {/* Action Cards: Start From a Template & Create from Scratch */}
        <ActionCards />
      </main>

      {/* Onboarding Welcome / Getting Started Modal */}
      {userId && <GettingStartedModal userId={userId} />}
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
