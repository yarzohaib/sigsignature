import { Suspense } from "react";
import HeroSection from "@/components/dashboard/HeroSection";
import ActionCards from "@/components/dashboard/ActionCards";
import GettingStartedSteps from "@/components/dashboard/GettingStartedSteps";
import DashboardSkeleton from "@/components/skeletons/DashboardSkeleton";

function DashboardContent() {
  return (
    <div className="flex flex-1 flex-col h-full min-h-0 w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 3xl:px-14 py-3 sm:py-4 lg:py-4 xl:py-5 2xl:py-6 3xl:py-[clamp(24px,1.4vw,40px)] overflow-y-auto lg:overflow-hidden">
      <main className="flex flex-1 flex-col h-full min-h-0 justify-between gap-3 sm:gap-4 lg:gap-3.5 xl:gap-4.5 2xl:gap-5 3xl:gap-[clamp(18px,1.1vw,32px)] w-full">
        {/* Welcome Heading Section */}
        <HeroSection />

        {/* Action Cards: Start From a Template & Create from Scratch */}
        <ActionCards />

        {/* Getting Started 5-step progress container */}
        <GettingStartedSteps />
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 flex-col h-full min-h-0 w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 3xl:px-14 py-3 sm:py-4 lg:py-4 xl:py-5 2xl:py-6 overflow-y-auto lg:overflow-hidden">
          <DashboardSkeleton />
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
