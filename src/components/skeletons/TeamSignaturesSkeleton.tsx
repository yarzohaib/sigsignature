import React from "react";
import { Skeleton, SkeletonContainer } from "@/components/ui/Skeleton";

export function TeamSignaturesSkeleton() {
  return (
    <SkeletonContainer
      label="Loading team signatures..."
      className="flex flex-col gap-6 sm:gap-7 w-full"
    >
      {/* 1. Header Bar: Title, Subtitle, and Action Buttons */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between shrink-0">
        <div>
          <Skeleton className="h-8 sm:h-9 w-48 sm:w-60 rounded-xl" />
          <Skeleton className="mt-2 h-4 w-72 sm:w-96 rounded-md" />
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Skeleton className="h-9 w-28 rounded-full" />
          <Skeleton className="h-10 w-36 sm:w-44 rounded-xl" />
        </div>
      </div>

      {/* 2. Team Template Summary Bar Placeholder */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-4.5 shadow-xs">
        <div className="flex items-center gap-4">
          <Skeleton className="h-14 w-24 rounded-lg shrink-0" />
          <div className="space-y-2">
            <Skeleton className="h-4.5 w-36 rounded-md" />
            <Skeleton className="h-3.5 w-52 rounded-md" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-28 rounded-xl" />
          <Skeleton className="h-9 w-32 rounded-xl" />
        </div>
      </div>

      {/* 3. Team Member Cards Grid (Matching real 1/2/3/4/5 col responsive breakpoints) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 gap-5 2xl:gap-6 w-full">
        {/* Card 1: Add member / invite card placeholder */}
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 p-6 min-h-[220px]">
          <Skeleton className="h-12 w-12 rounded-full mb-3" />
          <Skeleton className="h-4 w-28 rounded-md mb-1.5" />
          <Skeleton className="h-3 w-40 rounded-md" />
        </div>

        {/* Cards 2-5: Member Cards */}
        {[1, 2, 3, 4].map((idx) => (
          <div
            key={idx}
            className="flex flex-col justify-between rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-xs min-h-[220px]"
          >
            <div>
              {/* Member Top Row */}
              <div className="flex items-start gap-3.5">
                <Skeleton className="h-12 w-12 rounded-full shrink-0" />
                <div className="space-y-1.5 flex-1 min-w-0">
                  <Skeleton className="h-4 w-32 rounded-md" />
                  <Skeleton className="h-3 w-20 rounded-md" />
                  <Skeleton className="h-3 w-36 rounded-md" />
                </div>
              </div>
            </div>

            {/* Member Action Buttons */}
            <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
              <Skeleton className="h-8 flex-1 rounded-lg" />
              <Skeleton className="h-8 flex-1 rounded-lg" />
              <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
            </div>
          </div>
        ))}
      </div>
    </SkeletonContainer>
  );
}

export default TeamSignaturesSkeleton;
