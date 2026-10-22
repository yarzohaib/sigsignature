import React from "react";
import { Skeleton, SkeletonContainer } from "@/components/ui/Skeleton";

export function PricingSkeleton() {
  return (
    <SkeletonContainer label="Loading pricing..." className="flex flex-1 flex-col justify-between w-full my-auto py-1 gap-6">
      {/* 1. Top Heading Section */}
      <div className="w-full text-left shrink-0">
        <Skeleton className="h-8 sm:h-9 w-72 sm:w-96 rounded-xl" />
        <Skeleton className="mt-2 h-4 w-80 sm:w-[500px] rounded-md" />
      </div>

      {/* 2. 2-Plan Cards Row (Free & Premium side by side) */}
      <div className="my-2 xl:my-3 flex flex-col lg:flex-row items-stretch justify-between gap-4 xl:gap-6 w-full shrink-0">
        {/* Free Plan Card Skeleton */}
        <div className="flex flex-col justify-between flex-1 w-full rounded-xl border border-slate-200 bg-white p-6 sm:p-7 min-h-[340px] xl:min-h-[365px] shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-3">
              <Skeleton className="h-5 w-28 rounded-md" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
            <Skeleton className="h-9 w-20 rounded-lg mb-4" />
            <div className="space-y-2.5 pt-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded-full shrink-0" />
                  <Skeleton className="h-3.5 w-full max-w-[240px] rounded-md" />
                </div>
              ))}
            </div>
          </div>
          <Skeleton className="h-10 w-full rounded-xl mt-6" />
        </div>

        {/* Premium Plan Card Skeleton */}
        <div className="flex flex-col justify-between flex-1 w-full rounded-xl border border-blue-200 bg-white p-6 sm:p-7 min-h-[340px] xl:min-h-[365px] shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-3">
              <Skeleton className="h-5 w-32 rounded-md" />
              <Skeleton className="h-6 w-28 rounded-full" />
            </div>
            <Skeleton className="h-9 w-28 rounded-lg mb-4" />
            <div className="space-y-2.5 pt-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded-full shrink-0" />
                  <Skeleton className="h-3.5 w-full max-w-[260px] rounded-md" />
                </div>
              ))}
            </div>
          </div>
          <Skeleton className="h-10 w-full rounded-xl mt-6" />
        </div>
      </div>

      {/* 3. FAQ Section Skeleton (4-card grid) */}
      <div className="w-full shrink-0 pt-2">
        <Skeleton className="h-5 w-52 rounded-md mb-3" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-2">
              <Skeleton className="h-4 w-48 rounded-md" />
              <Skeleton className="h-3 w-full rounded-md" />
              <Skeleton className="h-3 w-3/4 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </SkeletonContainer>
  );
}

export default PricingSkeleton;
