import React from "react";
import { Skeleton, SkeletonContainer } from "@/components/ui/Skeleton";

export function DashboardSkeleton() {
  return (
    <SkeletonContainer label="Loading dashboard..." className="flex flex-1 flex-col justify-between gap-5 sm:gap-6 3xl:gap-8 4xl:gap-10 w-full">
      {/* 1. Welcome Banner Header (Matching plain text HeroSection geometry, no card wrapper) */}
      <div className="text-left shrink-0 pb-2 sm:pb-3 2xl:pb-4 3xl:pb-5 4xl:pb-6">
        <Skeleton className="h-9 3xl:h-11 4xl:h-13 w-64 sm:w-80 3xl:w-96 4xl:w-[460px] rounded-xl" />
        <div className="mt-2.5 3xl:mt-3.5 space-y-1.5 3xl:space-y-2">
          <Skeleton className="h-4.5 3xl:h-5 4xl:h-6 w-80 sm:w-[420px] 3xl:w-[480px] 4xl:w-[540px] rounded-md" />
          <Skeleton className="h-4.5 3xl:h-5 4xl:h-6 w-60 sm:w-72 3xl:w-80 4xl:w-96 rounded-md" />
        </div>
      </div>

      {/* 2. Action Cards (Start from template / Create from scratch) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5 2xl:gap-6 3xl:gap-8 4xl:gap-10 w-full shrink-0">
        {[1, 2].map((cardIdx) => (
          <div
            key={cardIdx}
            className="flex flex-col justify-between rounded-2xl 3xl:rounded-3xl border border-[#E2E8F0] bg-white p-4.5 sm:p-5.5 xl:p-6 2xl:p-7 3xl:p-9 4xl:p-11 shadow-xs"
          >
            <div>
              {/* Top illustration skeleton */}
              <Skeleton className="w-full rounded-xl 3xl:rounded-2xl h-[130px] sm:h-[145px] xl:h-[160px] 2xl:h-[175px] 3xl:h-[260px] 4xl:h-[340px]" />

              {/* Icon + Title/Desc */}
              <div className="mt-3.5 sm:mt-4 2xl:mt-5 3xl:mt-7 4xl:mt-8 flex items-start gap-3.5 2xl:gap-4 3xl:gap-5 4xl:gap-6">
                <Skeleton className="w-12 h-12 3xl:w-15 3xl:h-15 4xl:w-18 4xl:h-18 rounded-xl 3xl:rounded-2xl shrink-0" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-5 3xl:h-6 4xl:h-7 w-48 3xl:w-56 rounded-md" />
                  <Skeleton className="h-3.5 3xl:h-4 4xl:h-5 w-full max-w-[280px] 3xl:max-w-[360px] rounded-md" />
                </div>
              </div>
            </div>

            {/* Bottom Button */}
            <div className="mt-4 sm:mt-5 2xl:mt-6 3xl:mt-8 4xl:mt-10">
              <Skeleton className="h-[44px] sm:h-[46px] 2xl:h-[48px] 3xl:h-[56px] 4xl:h-[64px] w-full rounded-full" />
            </div>
          </div>
        ))}
      </div>

      {/* 3. Getting Started Steps card */}
      <div className="rounded-2xl 3xl:rounded-3xl border border-[#E2E8F0] bg-white p-4.5 sm:p-5.5 xl:p-6 2xl:p-7 3xl:p-9 4xl:p-11 shadow-xs shrink-0">
        <Skeleton className="h-5 3xl:h-6 4xl:h-7 w-36 3xl:w-44 rounded-md mb-3.5 sm:mb-4 2xl:mb-5 3xl:mb-7 4xl:mb-8" />

        {/* 5-Step horizontal sequence matching md:grid-cols-5 */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 lg:gap-6 2xl:gap-8 3xl:gap-10 4xl:gap-12">
          {[1, 2, 3, 4, 5].map((idx) => (
            <div key={idx} className="flex flex-col items-start text-left">
              <div className="flex items-center w-full">
                <Skeleton className="h-9 w-9 2xl:h-10 2xl:w-10 3xl:h-13 3xl:w-13 4xl:h-16 4xl:w-16 rounded-full shrink-0" />
                {idx < 5 && <div className="hidden md:block flex-1 h-[2px] bg-slate-100 mx-2" />}
              </div>
              <Skeleton className="mt-2.5 3xl:mt-3.5 4xl:mt-4 h-3 3xl:h-3.5 4xl:h-4 w-32 3xl:w-40 rounded-md" />
              <Skeleton className="mt-1 3xl:mt-1.5 h-4 3xl:h-4.5 4xl:h-5 w-24 3xl:w-32 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </SkeletonContainer>
  );
}

export default DashboardSkeleton;
