import React from "react";
import { Skeleton, SkeletonContainer } from "@/components/ui/Skeleton";

export function SettingsSkeleton() {
  return (
    <SkeletonContainer label="Loading settings..." className="flex flex-col gap-6 sm:gap-7 w-full">
      {/* 1. Header with Title and Form Action Buttons */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between shrink-0">
        <div>
          <Skeleton className="h-8 sm:h-9 w-36 sm:w-44 rounded-xl" />
          <Skeleton className="mt-2 h-4 w-72 sm:w-96 rounded-md" />
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Skeleton className="h-10 w-24 rounded-full" />
          <Skeleton className="h-10 w-32 rounded-full" />
        </div>
      </div>

      {/* 2. Responsive 2-Column Settings Layout matching loaded geometry */}
      <div className="flex flex-col lg:flex-row items-start gap-6 w-full">
        {/* Left Column (flex-1) */}
        <div className="flex-1 min-w-0 flex flex-col gap-5 w-full">
          {/* Card 1: Profile */}
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 sm:p-7 shadow-xs">
            <Skeleton className="h-6 w-36 rounded-md mb-5" />
            <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100">
              <Skeleton className="h-20 w-20 rounded-full shrink-0" />
              <div className="space-y-2 flex-1 w-full">
                <Skeleton className="h-4 w-44 rounded-md" />
                <Skeleton className="h-9 w-32 rounded-xl" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24 rounded-md" />
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24 rounded-md" />
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
            </div>
            <div className="space-y-2 mt-4">
              <Skeleton className="h-4 w-32 rounded-md" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          </div>

          {/* Card 2: Signature Defaults */}
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 sm:p-7 shadow-xs">
            <Skeleton className="h-6 w-44 rounded-md mb-5" />
            <div className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-36 rounded-md" />
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-28 rounded-md" />
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Skeleton key={i} className="h-8 w-8 rounded-full shrink-0" />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Notifications */}
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 sm:p-7 shadow-xs">
            <Skeleton className="h-6 w-32 rounded-md mb-4" />
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-40 rounded-md" />
                  <Skeleton className="h-3 w-56 rounded-md" />
                </div>
                <Skeleton className="h-6 w-11 rounded-full" />
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-32 rounded-md" />
                  <Skeleton className="h-3 w-48 rounded-md" />
                </div>
                <Skeleton className="h-6 w-11 rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Fixed width matching real: w-full lg:w-[320px] xl:w-[350px] 2xl:w-[380px]) */}
        <div className="w-full lg:w-[320px] xl:w-[350px] 2xl:w-[380px] shrink-0 flex flex-col gap-5">
          {/* Card 4: Plan & Usage */}
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 sm:p-6 shadow-xs">
            <Skeleton className="h-5 w-28 rounded-md mb-3" />
            <Skeleton className="h-4 w-full rounded-md mb-4" />
            <Skeleton className="h-2 w-full rounded-full mb-4" />
            <Skeleton className="h-9 w-full rounded-xl" />
          </div>

          {/* Card 5: Security */}
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 sm:p-6 shadow-xs">
            <Skeleton className="h-5 w-24 rounded-md mb-4" />
            <div className="space-y-3">
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <Skeleton className="h-4 w-32 rounded-md" />
                <Skeleton className="h-8 w-20 rounded-lg" />
              </div>
              <div className="flex items-center justify-between py-1">
                <Skeleton className="h-4 w-36 rounded-md" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
            </div>
          </div>

          {/* Card 6: Live Signature Preview placeholder */}
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 sm:p-6 shadow-xs">
            <Skeleton className="h-5 w-36 rounded-md mb-4" />
            <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4 space-y-2">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                <div className="space-y-1 flex-1">
                  <Skeleton className="h-4 w-28 rounded-md" />
                  <Skeleton className="h-3 w-20 rounded-md" />
                </div>
              </div>
              <Skeleton className="h-[1px] w-full my-2" />
              <Skeleton className="h-3 w-36 rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </SkeletonContainer>
  );
}

export default SettingsSkeleton;
