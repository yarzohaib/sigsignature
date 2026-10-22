import React from "react";
import { Skeleton, SkeletonContainer } from "@/components/ui/Skeleton";

export function PricingSkeleton() {
  return (
    <SkeletonContainer label="Loading pricing..." className="flex flex-1 flex-col justify-between w-full my-auto py-1">
      {/* Top Heading */}
      <div className="w-full text-left shrink-0 mb-6">
        <Skeleton className="h-8 w-56 sm:w-72" />
        <Skeleton className="mt-2 h-4 w-64 sm:w-80" />
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mx-auto">
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 sm:p-8 shadow-xs min-h-[440px] flex flex-col justify-between">
          <div className="space-y-4">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-8 w-32" />
            <div className="space-y-2 pt-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
          </div>
          <Skeleton className="h-11 w-full rounded-xl mt-6" />
        </div>

        <div className="rounded-2xl border border-blue-200 bg-white p-6 sm:p-8 shadow-md min-h-[440px] flex flex-col justify-between">
          <div className="space-y-4">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-8 w-32" />
            <div className="space-y-2 pt-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
          </div>
          <Skeleton className="h-11 w-full rounded-xl mt-6" />
        </div>
      </div>
    </SkeletonContainer>
  );
}

export default PricingSkeleton;
