import React from "react";
import { Skeleton, SkeletonContainer } from "@/components/ui/Skeleton";

export function DashboardSkeleton() {
  return (
    <SkeletonContainer label="Loading dashboard..." className="flex flex-1 flex-col lg:h-full lg:min-h-0 justify-between gap-5 sm:gap-6 lg:gap-3.5 xl:gap-4.5 2xl:gap-5 w-full">
      {/* 1. Welcome Banner Header (Matching plain text HeroSection geometry, no card wrapper) */}
      <div className="text-left shrink-0">
        <Skeleton className="h-8 xl:h-9 w-64 sm:w-80 rounded-xl" />
        <div className="mt-1.5 space-y-1">
          <Skeleton className="h-4 w-72 sm:w-96 rounded-md" />
          <Skeleton className="h-4 w-56 sm:w-72 rounded-md" />
        </div>
      </div>

      {/* 2. Action Cards (Start from template / Create from scratch) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-4 xl:gap-5 2xl:gap-6 lg:flex-1 lg:min-h-0 w-full">
        {[1, 2].map((cardIdx) => (
          <div
            key={cardIdx}
            className="flex flex-col justify-between lg:flex-1 lg:min-h-0 rounded-2xl 2xl:rounded-3xl border border-[#E2E8F0] bg-white p-4.5 sm:p-5.5 lg:p-4 xl:p-5 2xl:p-6 shadow-xs"
          >
            <div className="flex flex-col lg:flex-1 lg:min-h-0">
              {/* Top illustration skeleton */}
              <Skeleton className="h-[130px] sm:h-[145px] lg:h-auto lg:flex-1 lg:min-h-[110px] w-full rounded-xl 2xl:rounded-2xl" />

              {/* Icon + Title/Desc */}
              <div className="mt-3.5 sm:mt-4 lg:mt-2.5 xl:mt-3.5 flex items-start gap-3.5 xl:gap-3.5 shrink-0">
                <Skeleton className="w-12 h-12 lg:w-10 lg:h-10 xl:w-11 xl:h-11 2xl:w-12 2xl:h-12 rounded-xl shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-5 w-44 rounded-md" />
                  <Skeleton className="h-3.5 w-full max-w-[260px] rounded-md" />
                </div>
              </div>
            </div>

            {/* Bottom Button */}
            <div className="mt-4 sm:mt-5 lg:mt-2.5 xl:mt-3.5 shrink-0">
              <Skeleton className="h-[44px] sm:h-[46px] lg:h-10 xl:h-11 2xl:h-12 w-full rounded-full" />
            </div>
          </div>
        ))}
      </div>

      {/* 3. Getting Started Steps card */}
      <div className="rounded-2xl 2xl:rounded-3xl border border-[#E2E8F0] bg-white p-4.5 sm:p-5.5 lg:p-4 xl:p-4.5 2xl:p-5 3xl:p-6 shadow-xs shrink-0">
        <Skeleton className="h-5 w-32 xl:w-36 rounded-md mb-2.5 sm:mt-3" />

        {/* 5-Step horizontal sequence matching md:grid-cols-5 */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 lg:gap-4 xl:gap-6 2xl:gap-8">
          {[1, 2, 3, 4, 5].map((idx) => (
            <div key={idx} className="flex flex-col items-start text-left">
              <div className="flex items-center w-full">
                <Skeleton className="h-8 w-8 xl:h-9 xl:w-9 2xl:h-10 2xl:w-10 rounded-full shrink-0" />
                {idx < 5 && <div className="hidden md:block flex-1 h-[2px] bg-slate-100 mx-2" />}
              </div>
              <Skeleton className="mt-1.5 xl:mt-2 h-3 w-28 rounded-md" />
              <Skeleton className="mt-1 h-3.5 w-20 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </SkeletonContainer>
  );
}

export default DashboardSkeleton;
