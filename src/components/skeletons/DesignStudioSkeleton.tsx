import React from "react";
import { Skeleton, SkeletonContainer } from "@/components/ui/Skeleton";

/**
 * Design Studio Workspace Skeleton matching the Templates gold standard benchmark.
 * Clean, well-proportioned split layout: simplified tools panel on left, clean canvas on right.
 */
export function DesignStudioSkeleton() {
  return (
    <SkeletonContainer
      label="Loading Design Studio workspace..."
      className="flex flex-1 min-h-0 w-full overflow-hidden"
    >
      <div className="flex flex-1 min-h-0 w-full overflow-hidden">
        {/* ======================================================== */}
        {/* LEFT: TOOLS PANEL SKELETON */}
        {/* ======================================================== */}
        <aside
          aria-label="Studio tools loading placeholder"
          className="hidden lg:flex flex-col w-[340px] xl:w-[418px] shrink-0 border-r border-[#E2E8F0] bg-[#FCFCFC] p-6 overflow-hidden gap-6"
        >
          {/* Section 1: Fonts */}
          <div className="border-b border-[#E2E8F0] pb-6">
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-5 w-24 rounded-md" />
              <Skeleton className="h-4 w-4 rounded-sm" />
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <Skeleton className="h-11 rounded-xl" />
              <Skeleton className="h-11 rounded-xl" />
              <Skeleton className="h-11 rounded-xl" />
              <Skeleton className="h-11 rounded-xl" />
            </div>
          </div>

          {/* Section 2: Content Details */}
          <div className="border-b border-[#E2E8F0] pb-6 space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-28 rounded-md" />
              <Skeleton className="h-4 w-4 rounded-sm" />
            </div>
            <div className="space-y-1.5 pt-1">
              <Skeleton className="h-3.5 w-16 rounded-md" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Skeleton className="h-3.5 w-20 rounded-md" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          </div>

          {/* Section 3: Colors */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-24 rounded-md" />
              <Skeleton className="h-4 w-4 rounded-sm" />
            </div>
            <div className="flex items-center gap-2 pt-1">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-8 w-8 rounded-full shrink-0" />
              ))}
            </div>
          </div>
        </aside>

        {/* ======================================================== */}
        {/* RIGHT: CANVAS WORKSPACE SKELETON */}
        {/* ======================================================== */}
        <main className="flex-1 flex flex-col min-w-0 bg-[#FCFCFC] overflow-hidden">
          {/* Top Toolbar: Action Buttons */}
          <div className="hidden lg:flex items-center justify-end px-6 pt-4 pb-2 shrink-0">
            <div className="flex items-center gap-2">
              <Skeleton className="h-9 w-36 rounded-xl" />
              <Skeleton className="h-9 w-36 rounded-xl" />
            </div>
          </div>

          {/* Sub-toolbar: Canvas Info & Zoom */}
          <div className="flex items-center justify-between gap-3 px-6 py-2.5 shrink-0 border-b border-slate-100">
            <Skeleton className="h-4 w-32 rounded-md" />
            <div className="flex items-center gap-1.5">
              <Skeleton className="h-7 w-7 rounded-md" />
              <Skeleton className="h-7 w-7 rounded-md" />
              <Skeleton className="h-7 w-12 rounded-md" />
              <Skeleton className="h-7 w-12 rounded-md" />
            </div>
          </div>

          {/* Center Canvas: Signature Preview Card */}
          <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 bg-[#F8FAFC] overflow-hidden">
            <div className="w-full max-w-[520px] rounded-2xl border border-slate-200/80 bg-white p-7 sm:p-8 shadow-xs">
              <div className="flex items-start gap-5">
                <Skeleton className="h-16 w-16 rounded-full shrink-0" />
                <div className="flex-1 space-y-2.5">
                  <Skeleton className="h-5 w-44 rounded-md" />
                  <Skeleton className="h-3.5 w-32 rounded-md" />
                  <div className="h-[1px] w-full bg-slate-100 my-2" />
                  <Skeleton className="h-3 w-48 rounded-md" />
                  <Skeleton className="h-3 w-36 rounded-md" />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </SkeletonContainer>
  );
}

export default DesignStudioSkeleton;
