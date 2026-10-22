import React from "react";
import { Skeleton, SkeletonContainer } from "@/components/ui/Skeleton";

export function DashboardSkeleton() {
  return (
    <SkeletonContainer label="Loading dashboard..." className="flex flex-1 flex-col justify-between gap-5 sm:gap-6 w-full">
      {/* 1. Welcome Banner Header (Matching plain text HeroSection geometry, no card wrapper) */}
      <div className="text-left shrink-0 pb-2">
        <Skeleton className="h-9 w-64 sm:w-80 rounded-xl" />
        <div className="mt-2.5 space-y-1.5">
          <Skeleton className="h-4.5 w-80 sm:w-[420px] rounded-md" />
          <Skeleton className="h-4.5 w-60 sm:w-72 rounded-md" />
        </div>
      </div>

      {/* 2. Action Cards (Start from template / Create from scratch) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 w-full">
        <div className="flex flex-col justify-between rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-xs min-h-[170px]">
          <div className="flex items-start gap-3.5">
            <Skeleton className="h-11 w-11 rounded-xl shrink-0" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-5 w-44 rounded-md" />
              <Skeleton className="h-3.5 w-full max-w-[260px] rounded-md" />
            </div>
          </div>
          <Skeleton className="mt-5 h-9 w-36 rounded-xl" />
        </div>

        <div className="flex flex-col justify-between rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-xs min-h-[170px]">
          <div className="flex items-start gap-3.5">
            <Skeleton className="h-11 w-11 rounded-xl shrink-0" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-5 w-44 rounded-md" />
              <Skeleton className="h-3.5 w-full max-w-[260px] rounded-md" />
            </div>
          </div>
          <Skeleton className="mt-5 h-9 w-36 rounded-xl" />
        </div>
      </div>

      {/* 3. Getting Started Steps card */}
      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 sm:p-6 2xl:p-7 shadow-xs">
        <Skeleton className="h-5 w-36 rounded-md mb-5" />

        {/* 5-Step horizontal sequence matching md:grid-cols-5 */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 lg:gap-6 2xl:gap-8">
          {[1, 2, 3, 4, 5].map((idx) => (
            <div key={idx} className="flex flex-col items-start text-left">
              <div className="flex items-center w-full">
                <Skeleton className="h-9 w-9 2xl:h-10 2xl:w-10 rounded-full shrink-0" />
                {idx < 5 && <div className="hidden md:block flex-1 h-[2px] bg-slate-100 mx-2" />}
              </div>
              <Skeleton className="mt-3 h-3 w-32 rounded-md" />
              <Skeleton className="mt-1.5 h-4 w-24 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </SkeletonContainer>
  );
}

export default DashboardSkeleton;
