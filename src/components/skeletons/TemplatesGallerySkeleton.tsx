import React from "react";
import { Skeleton, SkeletonContainer } from "@/components/ui/Skeleton";

export function TemplatesGallerySkeleton() {
  return (
    <SkeletonContainer label="Loading templates gallery..." className="flex flex-col gap-6 sm:gap-7 w-full">
      {/* Header bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between shrink-0">
        <div>
          <Skeleton className="h-8 w-48 sm:w-60" />
          <Skeleton className="mt-2 h-4 w-64 sm:w-80" />
        </div>
      </div>

      {/* Filter Row: Category tabs + Sort selector */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 pb-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {[1, 2, 3, 4, 5].map((idx) => (
            <Skeleton key={idx} className="h-8 w-20 rounded-full shrink-0" />
          ))}
        </div>
        <Skeleton className="h-8 w-32 rounded-lg shrink-0" />
      </div>

      {/* 6-Card Grid matching real template gallery breakpoints */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {[1, 2, 3, 4, 5, 6].map((idx) => (
          <div
            key={idx}
            className="flex flex-col rounded-2xl border border-[#E2E8F0] bg-white shadow-xs overflow-hidden"
          >
            {/* Template Preview Image area */}
            <div className="relative bg-[#F8FAFC] p-4 h-[200px] flex items-center justify-center">
              <Skeleton className="h-[160px] w-full rounded-xl" />
            </div>

            {/* Template Info + Button bar */}
            <div className="p-4 flex items-center justify-between border-t border-slate-100">
              <div className="space-y-1.5 flex-1 pr-3">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-9 w-28 rounded-xl shrink-0" />
            </div>
          </div>
        ))}
      </div>
    </SkeletonContainer>
  );
}

export default TemplatesGallerySkeleton;
