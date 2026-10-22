import React from "react";
import { Skeleton, SkeletonContainer } from "@/components/ui/Skeleton";

/**
 * Team Signatures Skeleton matching the Templates Gallery gold standard benchmark.
 * Clean, smooth, and well-proportioned card grid with signature preview frames.
 */
export function TeamSignaturesSkeleton() {
  return (
    <SkeletonContainer
      label="Loading team signatures..."
      className="flex flex-col gap-6 sm:gap-7 w-full"
    >
      {/* 1. Header Bar: Title, Subtitle, and Create Button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between shrink-0">
        <div>
          <Skeleton className="h-8 w-52 sm:w-64 rounded-xl" />
          <Skeleton className="mt-2 h-4 w-72 sm:w-96 rounded-md" />
        </div>
        <Skeleton className="h-[44px] w-full sm:w-[220px] rounded-full shrink-0" />
      </div>

      {/* 2. 6-Card Grid matching the Templates Gallery Benchmark Standard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {[1, 2, 3, 4, 5, 6].map((idx) => (
          <div
            key={idx}
            className="flex flex-col rounded-2xl border border-[#E2E8F0] bg-white shadow-xs overflow-hidden"
          >
            {/* Signature Preview Frame */}
            <div className="relative bg-[#F8FAFC] p-4 h-[190px] flex items-center justify-center w-full">
              <Skeleton className="h-[140px] w-full max-w-[300px] rounded-xl" />
            </div>

            {/* Member Info + Action Button bar */}
            <div className="p-4 flex items-center justify-between border-t border-slate-100">
              <div className="space-y-1.5 flex-1 pr-3">
                <Skeleton className="h-4 w-32 rounded-md" />
                <Skeleton className="h-3 w-24 rounded-md" />
              </div>
              <Skeleton className="h-9 w-24 rounded-xl shrink-0" />
            </div>
          </div>
        ))}
      </div>
    </SkeletonContainer>
  );
}

export default TeamSignaturesSkeleton;
