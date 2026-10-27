import React from "react";
import { Skeleton, SkeletonContainer } from "@/components/ui/Skeleton";

export function DashboardSkeleton() {
  return (
    <SkeletonContainer label="Loading dashboard..." className="flex flex-1 flex-col lg:h-full lg:min-h-0 justify-between gap-5 sm:gap-6 lg:gap-3.5 xl:gap-4.5 2xl:gap-5 w-full">
      {/* 1. Welcome Banner Header (Matching new gradient HeroSection banner card geometry) */}
      <Skeleton className="w-full h-[180px] sm:h-[190px] lg:h-[200px] rounded-[20px] sm:rounded-[22px] shrink-0" />

      {/* 2. Quick Overview Cards Skeleton (4 cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 shrink-0">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-[84px] w-full rounded-2xl" />
        ))}
      </div>

      {/* 3. Action Cards (Start from template / Create from scratch) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-4 xl:gap-5 2xl:gap-6 w-full shrink-0">
        {[1, 2].map((cardIdx) => (
          <div
            key={cardIdx}
            className="flex flex-col 2xl:flex-row items-stretch justify-between rounded-2xl 2xl:rounded-3xl border border-[#E2E8F0] bg-white p-3.5 sm:p-4 lg:p-4.5 xl:p-5 2xl:p-6 shadow-xs gap-3.5 sm:gap-4 xl:gap-4.5 2xl:gap-6"
          >
            {/* Top / Left illustration skeleton */}
            <Skeleton className="h-[145px] sm:h-[165px] lg:h-[165px] xl:h-[185px] 2xl:h-auto 2xl:w-[240px] 3xl:w-[280px] 2xl:self-stretch w-full rounded-xl 2xl:rounded-2xl shrink-0" />

            {/* Right / Content Column */}
            <div className="flex flex-1 flex-col justify-between min-w-0">
              <div className="flex items-start gap-3 2xl:block">
                <Skeleton className="w-10 h-10 xl:w-11 xl:h-11 rounded-xl shrink-0 2xl:hidden" />
                <div className="space-y-1.5 flex-1 min-w-0">
                  <Skeleton className="h-5 w-44 rounded-md" />
                  <Skeleton className="h-3.5 w-full max-w-[260px] rounded-md" />
                </div>
              </div>

              {/* Bottom Button */}
              <div className="mt-3.5 sm:mt-4 xl:mt-4 2xl:mt-3 shrink-0">
                <Skeleton className="h-10 xl:h-11 2xl:h-12 w-full rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </SkeletonContainer>
  );
}

export default DashboardSkeleton;
