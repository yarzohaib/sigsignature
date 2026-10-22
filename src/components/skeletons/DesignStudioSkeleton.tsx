import React from "react";
import { Skeleton, SkeletonContainer } from "@/components/ui/Skeleton";

export function DesignStudioSkeleton() {
  return (
    <SkeletonContainer
      label="Loading Design Studio workspace..."
      className="flex flex-1 min-h-0 w-full overflow-hidden"
    >
      {/* Mobile Tab Control placeholder (< lg) */}
      <div className="flex lg:hidden w-full items-center justify-center border-b border-[#E2E8F0] bg-white px-4 py-2 shrink-0">
        <Skeleton className="h-8 w-60 rounded-xl" />
      </div>

      <div className="flex flex-1 min-h-0 w-full overflow-hidden">
        {/* ======================================================== */}
        {/* LEFT: TOOLS PANEL SKELETON */}
        {/* ======================================================== */}
        <aside
          aria-label="Studio tools loading placeholder"
          className="hidden lg:flex flex-col w-[340px] xl:w-[418px] shrink-0 border-r border-[#E2E8F0] bg-[#FCFCFC] p-5 overflow-hidden gap-5"
        >
          {/* Section 1: Fonts */}
          <div className="border-b border-[#E2E8F0] pb-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Skeleton className="h-6 w-6 rounded-md" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-4 w-4 rounded-sm" />
            </div>
            <div className="mt-3.5 grid grid-cols-2 gap-2">
              <Skeleton className="h-10 rounded-[10px]" />
              <Skeleton className="h-10 rounded-[10px]" />
              <Skeleton className="h-10 rounded-[10px]" />
              <Skeleton className="h-10 rounded-[10px]" />
            </div>
          </div>

          {/* Section 2: Details / Content Inputs */}
          <div className="border-b border-[#E2E8F0] pb-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Skeleton className="h-6 w-6 rounded-md" />
                <Skeleton className="h-4 w-28" />
              </div>
              <Skeleton className="h-4 w-4 rounded-sm" />
            </div>
            <div className="space-y-1.5 pt-1">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-9 w-full rounded-lg" />
            </div>
            <div className="space-y-1.5">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-9 w-full rounded-lg" />
            </div>
            <div className="space-y-1.5">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-9 w-full rounded-lg" />
            </div>
          </div>

          {/* Section 3: Colors & Theme */}
          <div className="border-b border-[#E2E8F0] pb-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Skeleton className="h-6 w-6 rounded-md" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-4 w-4 rounded-sm" />
            </div>
            <div className="flex items-center gap-2 pt-1">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-7 w-7 rounded-full shrink-0" />
              ))}
            </div>
          </div>

          {/* Section 4: Social Icons */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Skeleton className="h-6 w-6 rounded-md" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-4 w-4 rounded-sm" />
            </div>
            <div className="flex items-center gap-2 pt-1">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-8 w-8 rounded-lg shrink-0" />
              ))}
            </div>
          </div>
        </aside>

        {/* ======================================================== */}
        {/* RIGHT: CANVAS WORKSPACE SKELETON */}
        {/* ======================================================== */}
        <main className="flex-1 flex flex-col min-w-0 bg-[#FCFCFC] overflow-hidden">
          {/* Top Toolbar Row 1: Action Buttons */}
          <div className="hidden lg:flex items-center justify-end px-6 pt-4 pb-1 shrink-0">
            <div className="flex items-center gap-2">
              <Skeleton className="h-9 w-36 rounded-lg" />
              <Skeleton className="h-9 w-32 rounded-lg" />
            </div>
          </div>

          {/* Top Toolbar Row 2: Canvas Info & Zoom Controls */}
          <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-2.5 shrink-0 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-16" />
            </div>
            <div className="flex items-center gap-1.5">
              <Skeleton className="h-7 w-7 rounded-md" />
              <Skeleton className="h-7 w-7 rounded-md" />
              <div className="h-4 w-[1px] bg-slate-200 mx-0.5" />
              <Skeleton className="h-7 w-7 rounded-md" />
              <Skeleton className="h-7 w-12 rounded-md" />
              <Skeleton className="h-7 w-7 rounded-md" />
              <Skeleton className="h-7 w-12 rounded-md" />
            </div>
          </div>

          {/* Center Canvas Area: Signature Preview Card */}
          <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 bg-[#F8FAFC]/50 overflow-hidden">
            <div className="w-full max-w-[500px] rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs">
              <div className="flex items-start gap-4 sm:gap-5">
                {/* Avatar */}
                <Skeleton className="h-16 w-16 sm:h-18 sm:w-18 rounded-full shrink-0" />

                {/* Details */}
                <div className="flex-1 min-w-0 space-y-2">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-3.5 w-28" />
                  <Skeleton className="h-3.5 w-32" />

                  <div className="h-[1px] w-full bg-slate-100 my-2.5" />

                  <div className="space-y-1.5">
                    <Skeleton className="h-3 w-48" />
                    <Skeleton className="h-3 w-36" />
                    <Skeleton className="h-3 w-44" />
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <Skeleton className="h-6 w-6 rounded-md" />
                    <Skeleton className="h-6 w-6 rounded-md" />
                    <Skeleton className="h-6 w-6 rounded-md" />
                    <Skeleton className="h-6 w-6 rounded-md" />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom tip / helper text placeholder */}
            <div className="mt-6 flex items-center gap-2">
              <Skeleton className="h-3 w-3 rounded-full" />
              <Skeleton className="h-3 w-64" />
            </div>
          </div>
        </main>
      </div>
    </SkeletonContainer>
  );
}

export default DesignStudioSkeleton;
