import React from "react";
import { Skeleton, SkeletonContainer } from "@/components/ui/Skeleton";

export function DashboardSkeleton() {
  return (
    <SkeletonContainer label="Loading dashboard..." className="flex flex-1 flex-col justify-between gap-5 sm:gap-6 w-full">
      {/* 1. Welcome Banner Header */}
      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 sm:p-7 shadow-xs">
        <Skeleton className="h-8 w-60 sm:w-80" />
        <Skeleton className="mt-2.5 h-4 w-72 sm:w-96" />
      </div>

      {/* 2. Action Cards (Start from template / Create from scratch) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 w-full">
        <div className="flex flex-col justify-between rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-xs min-h-[160px]">
          <div>
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
          </div>
          <Skeleton className="mt-4 h-9 w-32 rounded-full" />
        </div>

        <div className="flex flex-col justify-between rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-xs min-h-[160px]">
          <div>
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
          </div>
          <Skeleton className="mt-4 h-9 w-32 rounded-full" />
        </div>
      </div>

      {/* 3. Getting Started Steps card */}
      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 sm:p-7 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <Skeleton className="h-5 w-44" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="mt-4 space-y-3">
          {[1, 2, 3, 4, 5].map((idx) => (
            <div key={idx} className="flex items-center gap-3 py-1">
              <Skeleton className="h-5 w-5 rounded-full shrink-0" />
              <Skeleton className="h-4 w-60 flex-1" />
            </div>
          ))}
        </div>
      </div>
    </SkeletonContainer>
  );
}

export default DashboardSkeleton;
