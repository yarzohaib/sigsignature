import React from "react";
import { Skeleton, SkeletonContainer } from "@/components/ui/Skeleton";

export function DashboardSkeleton() {
  return (
    <SkeletonContainer
      label="Loading dashboard..."
      className="flex flex-1 flex-col justify-between gap-5 sm:gap-6 xl:gap-7 2xl:gap-8 3xl:gap-10 w-full"
    >
      {/* 1. Welcome Banner Header */}
      <div className="text-left shrink-0 pb-2">
        <Skeleton className="h-8 sm:h-9 xl:h-10 2xl:h-12 3xl:h-14 w-64 sm:w-80 xl:w-96 2xl:w-[480px] rounded-xl" />
        <div className="mt-2.5 xl:mt-3 2xl:mt-4 space-y-1.5 sm:space-y-2">
          <Skeleton className="h-4 sm:h-4.5 xl:h-5 2xl:h-6 3xl:h-7 w-80 sm:w-[420px] xl:w-[500px] 2xl:w-[620px] rounded-md" />
          <Skeleton className="h-4 sm:h-4.5 xl:h-5 2xl:h-6 3xl:h-7 w-60 sm:w-72 xl:w-84 2xl:w-[440px] rounded-md" />
        </div>
      </div>

      {/* 2. Action Cards Grid (Start from template / Create from scratch) */}
      <div className="grid grid-cols-1 gap-4 lg:gap-5 xl:gap-6 2xl:gap-8 3xl:gap-10 lg:grid-cols-2 shrink-0 w-full">
        {[1, 2].map((cardIdx) => (
          <div
            key={cardIdx}
            className="flex flex-col justify-between rounded-2xl 2xl:rounded-3xl border border-[#E2E8F0] bg-white p-4.5 sm:p-5.5 xl:p-6 2xl:p-8 3xl:p-10 shadow-xs"
          >
            <div>
              {/* Top preview box */}
              <Skeleton className="w-full rounded-xl 2xl:rounded-2xl h-[135px] sm:h-[150px] lg:h-[175px] xl:h-[220px] 2xl:h-[280px] 3xl:h-[350px]" />

              {/* Icon & Heading */}
              <div className="mt-3.5 sm:mt-4 xl:mt-5 2xl:mt-6 3xl:mt-7 flex items-start gap-3.5 xl:gap-4 2xl:gap-5 3xl:gap-6">
                <Skeleton className="w-12 h-12 xl:w-14 xl:h-14 2xl:w-16 2xl:h-16 3xl:w-20 3xl:h-20 rounded-xl 2xl:rounded-2xl shrink-0" />
                <div className="space-y-2 xl:space-y-3 flex-1 min-w-0">
                  <Skeleton className="h-5 sm:h-6 xl:h-7 2xl:h-8 w-44 sm:w-56 xl:w-64 2xl:w-80 rounded-md" />
                  <Skeleton className="h-3.5 sm:h-4 xl:h-4.5 2xl:h-5 w-full max-w-[280px] xl:max-w-[360px] 2xl:max-w-[440px] rounded-md" />
                </div>
              </div>
            </div>

            {/* Button */}
            <div className="mt-4 sm:mt-5 xl:mt-6 2xl:mt-7 3xl:mt-8">
              <Skeleton className="h-11 sm:h-12 xl:h-13 2xl:h-15 3xl:h-17 w-full rounded-full" />
            </div>
          </div>
        ))}
      </div>

      {/* 3. Getting Started Steps Card */}
      <div className="rounded-2xl 2xl:rounded-3xl border border-[#E2E8F0] bg-white p-4.5 sm:p-5.5 xl:p-6 2xl:p-8 3xl:p-10 shadow-xs shrink-0">
        <Skeleton className="h-5 sm:h-6 xl:h-7 2xl:h-8 w-36 sm:w-44 xl:w-52 rounded-md mb-3.5 sm:mb-4 xl:mt-1 xl:mb-5 2xl:mb-6" />

        {/* 5-Step horizontal sequence matching desktop grid */}
        <div className="hidden md:grid md:grid-cols-5 md:gap-4 lg:gap-6 xl:gap-8 2xl:gap-10 3xl:gap-12">
          {[1, 2, 3, 4, 5].map((idx) => (
            <div key={idx} className="flex flex-col items-start text-left">
              <div className="flex items-center w-full">
                <Skeleton className="h-9 w-9 sm:h-10 sm:w-10 xl:h-12 xl:w-12 2xl:h-14 2xl:w-14 3xl:h-16 3xl:w-16 rounded-full shrink-0" />
                {idx < 5 && (
                  <div className="hidden md:block flex-1 h-[2px] xl:h-[3px] bg-slate-100 mx-2" />
                )}
              </div>
              <Skeleton className="mt-2.5 2xl:mt-3 h-3 sm:h-3.5 xl:h-4 2xl:h-4.5 w-32 xl:w-40 2xl:w-48 rounded-md" />
              <Skeleton className="mt-1 2xl:mt-1.5 h-4 sm:h-4.5 xl:h-5 2xl:h-6 w-24 xl:w-32 2xl:w-36 rounded-md" />
            </div>
          ))}
        </div>

        {/* Mobile vertical skeleton */}
        <div className="flex flex-col space-y-4 md:hidden">
          {[1, 2, 3].map((idx) => (
            <div key={idx} className="flex items-start gap-3.5">
              <Skeleton className="h-8 w-8 rounded-full shrink-0" />
              <div className="space-y-1.5 flex-1 pt-0.5">
                <Skeleton className="h-4 w-28 rounded-md" />
                <Skeleton className="h-3 w-48 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </SkeletonContainer>
  );
}

export default DashboardSkeleton;