import React from "react";
import { Skeleton, SkeletonContainer } from "@/components/ui/Skeleton";

export function SettingsSkeleton() {
  return (
    <SkeletonContainer label="Loading settings..." className="flex flex-col gap-6 sm:gap-7 w-full">
      {/* Header with Title and Action Buttons */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Skeleton className="h-9 w-36 sm:w-44" />
          <Skeleton className="mt-2 h-4 w-72 sm:w-96" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-24 rounded-full" />
          <Skeleton className="h-10 w-32 rounded-full" />
        </div>
      </div>

      {/* Profile Card */}
      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 sm:p-7 shadow-xs">
        <Skeleton className="h-6 w-36 mb-4" />
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100">
          <Skeleton className="h-20 w-20 rounded-full shrink-0" />
          <div className="space-y-2 flex-1 w-full">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-9 w-32 rounded-lg" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
        </div>
      </div>

      {/* Security Card */}
      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 sm:p-7 shadow-xs">
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <div className="space-y-1">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-3 w-52" />
            </div>
            <Skeleton className="h-9 w-28 rounded-lg" />
          </div>
          <div className="flex items-center justify-between py-2">
            <div className="space-y-1">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-48" />
            </div>
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
        </div>
      </div>
    </SkeletonContainer>
  );
}

export default SettingsSkeleton;
