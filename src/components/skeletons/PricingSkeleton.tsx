import React from "react";
import { Skeleton, SkeletonContainer } from "@/components/ui/Skeleton";

export function PricingSkeleton() {
  return (
    <SkeletonContainer label="Loading pricing..." className="flex flex-1 flex-col justify-between w-full my-auto py-1 gap-6 3xl:gap-[clamp(16px,1vw,28px)]">
      {/* 1. Top Heading Section */}
      <div className="w-full text-left shrink-0">
        <Skeleton className="h-8 sm:h-9 3xl:h-12 w-72 sm:w-96 3xl:w-[480px] rounded-xl" />
        <Skeleton className="mt-2 3xl:mt-3 h-4 3xl:h-6 w-80 sm:w-[500px] 3xl:w-[650px] rounded-md" />
      </div>

      {/* 2. 2-Plan Cards Row (Free & Premium side by side) */}
      <div className="my-2 xl:my-3 3xl:my-[clamp(10px,0.7vw,22px)] flex flex-col lg:flex-row items-stretch justify-between gap-4 xl:gap-6 3xl:gap-[clamp(24px,1.5vw,44px)] w-full shrink-0">
        {/* Free Plan Card Skeleton */}
        <div className="flex flex-col justify-between flex-1 w-full rounded-xl 3xl:rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 3xl:p-[clamp(24px,1.5vw,44px)] min-h-[340px] xl:min-h-[365px] 3xl:min-h-[480px] shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-3 3xl:mb-4">
              <Skeleton className="h-5 3xl:h-7 w-28 3xl:w-40 rounded-md" />
              <Skeleton className="h-6 3xl:h-8 w-24 3xl:w-32 rounded-full" />
            </div>
            <Skeleton className="h-9 3xl:h-12 w-20 3xl:w-28 rounded-lg mb-4 3xl:mb-6" />
            <div className="space-y-2.5 3xl:space-y-4 pt-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-2 3xl:gap-3">
                  <Skeleton className="h-4 3xl:h-6 w-4 3xl:w-6 rounded-full shrink-0" />
                  <Skeleton className="h-3.5 3xl:h-5 w-full max-w-[240px] 3xl:max-w-[340px] rounded-md" />
                </div>
              ))}
            </div>
          </div>
          <Skeleton className="h-10 3xl:h-14 w-full rounded-xl 3xl:rounded-2xl mt-6 3xl:mt-8" />
        </div>

        {/* Premium Plan Card Skeleton */}
        <div className="flex flex-col justify-between flex-1 w-full rounded-xl 3xl:rounded-3xl border border-blue-200 bg-white p-6 sm:p-7 3xl:p-[clamp(24px,1.5vw,44px)] min-h-[340px] xl:min-h-[365px] 3xl:min-h-[480px] shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-3 3xl:mb-4">
              <Skeleton className="h-5 3xl:h-7 w-32 3xl:w-44 rounded-md" />
              <Skeleton className="h-6 3xl:h-8 w-28 3xl:w-36 rounded-full" />
            </div>
            <Skeleton className="h-9 3xl:h-12 w-28 3xl:w-36 rounded-lg mb-4 3xl:mb-6" />
            <div className="space-y-2.5 3xl:space-y-4 pt-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-2 3xl:gap-3">
                  <Skeleton className="h-4 3xl:h-6 w-4 3xl:w-6 rounded-full shrink-0" />
                  <Skeleton className="h-3.5 3xl:h-5 w-full max-w-[260px] 3xl:max-w-[360px] rounded-md" />
                </div>
              ))}
            </div>
          </div>
          <Skeleton className="h-10 3xl:h-14 w-full rounded-xl 3xl:rounded-2xl mt-6 3xl:mt-8" />
        </div>
      </div>

      {/* 3. FAQ Section Skeleton (4-card grid) */}
      <div className="w-full shrink-0 pt-2">
        <Skeleton className="h-5 3xl:h-7 w-52 3xl:w-72 rounded-md mb-3 3xl:mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 xl:gap-3.5 3xl:gap-[clamp(16px,1vw,28px)] w-full">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-xl 3xl:rounded-2xl border border-slate-200 bg-white p-4 3xl:p-6 shadow-2xs space-y-2 3xl:space-y-3">
              <Skeleton className="h-4 3xl:h-6 w-48 3xl:w-64 rounded-md" />
              <Skeleton className="h-3 3xl:h-4 w-full rounded-md" />
              <Skeleton className="h-3 3xl:h-4 w-3/4 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </SkeletonContainer>
  );
}

export default PricingSkeleton;
