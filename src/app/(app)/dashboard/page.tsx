import { Suspense } from "react";
import HeroSection from "@/components/dashboard/HeroSection";
import ActionCards from "@/components/dashboard/ActionCards";
import GettingStartedSteps from "@/components/dashboard/GettingStartedSteps";
import DashboardSkeleton from "@/components/skeletons/DashboardSkeleton";

function DashboardContent() {
  return (
    <div className="flex flex-1 flex-col w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 3xl:px-14 py-5 sm:py-6 lg:py-4 xl:py-5 2xl:py-6 3xl:py-[clamp(24px,1.4vw,40px)] lg:h-full lg:min-h-0 lg:overflow-hidden">
      <main className="flex flex-1 flex-col justify-between gap-5 sm:gap-6 lg:gap-3.5 xl:gap-4.5 2xl:gap-5 3xl:gap-[clamp(18px,1.1vw,32px)] w-full lg:h-full lg:min-h-0">
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
        <div className="flex flex-1 flex-col w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 3xl:px-14 py-5 sm:py-6 lg:py-4 xl:py-5 2xl:py-6 3xl:py-[clamp(24px,1.4vw,40px)] lg:h-full lg:min-h-0 lg:overflow-hidden">
          <DashboardSkeleton />
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
