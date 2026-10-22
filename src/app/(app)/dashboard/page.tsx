import { Suspense } from "react";
import HeroSection from "@/components/dashboard/HeroSection";
import ActionCards from "@/components/dashboard/ActionCards";
import GettingStartedSteps from "@/components/dashboard/GettingStartedSteps";
import DashboardSkeleton from "@/components/skeletons/DashboardSkeleton";

function DashboardContent() {
  return (
    <div className="flex flex-1 flex-col px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-7 xl:px-10 xl:py-8 2xl:px-12 3xl:px-16 w-full max-w-[2400px] mx-auto">
      <main className="flex flex-1 flex-col justify-between gap-5 sm:gap-6 xl:gap-7 2xl:gap-8 3xl:gap-10 w-full">
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
        <div className="flex flex-1 flex-col px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-7 xl:px-10 xl:py-8 2xl:px-12 3xl:px-16 w-full max-w-[2400px] mx-auto">
          <DashboardSkeleton />
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
