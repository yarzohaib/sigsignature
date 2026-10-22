import React from "react";
import { Skeleton, SkeletonContainer } from "@/components/ui/Skeleton";

export function HelpSkeleton() {
  return (
    <SkeletonContainer label="Loading help & support..." className="flex flex-col gap-8 sm:gap-10 w-full pb-10">
      {/* 1. Hero Section Skeleton */}
      <div className="flex flex-col items-center text-center max-w-2xl mx-auto w-full pt-4">
        <Skeleton className="h-6 w-32 rounded-full mb-3" />
        <Skeleton className="h-9 sm:h-10 w-64 sm:w-80 rounded-xl mb-3" />
        <Skeleton className="h-4 w-72 sm:w-96 rounded-md mb-6" />
        <Skeleton className="h-12 w-full max-w-xl rounded-2xl shadow-xs" />
      </div>

      {/* 2. Category Cards Grid (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <Skeleton className="h-4 w-28 rounded-md" />
            <Skeleton className="h-3 w-36 rounded-md" />
          </div>
        ))}
      </div>

      {/* 3. Popular Guides & Quick Answers (2-column layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-start w-full">
        {/* Guides Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs space-y-4">
          <Skeleton className="h-5 w-40 rounded-md mb-2" />
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
              <Skeleton className="h-4 w-56 rounded-md" />
              <Skeleton className="h-4 w-4 rounded-sm" />
            </div>
          ))}
        </div>

        {/* Quick Answers Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs space-y-4">
          <Skeleton className="h-5 w-36 rounded-md mb-2" />
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
              <Skeleton className="h-4 w-60 rounded-md" />
              <Skeleton className="h-4 w-4 rounded-sm" />
            </div>
          ))}
        </div>
      </div>

      {/* 4. Support Banner Skeleton */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-5 w-48 rounded-md" />
          <Skeleton className="h-3.5 w-72 rounded-md" />
        </div>
        <Skeleton className="h-10 w-36 rounded-xl shrink-0" />
      </div>
    </SkeletonContainer>
  );
}

export default HelpSkeleton;
