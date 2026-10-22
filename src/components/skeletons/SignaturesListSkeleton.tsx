import React from "react";
import { Skeleton, SkeletonContainer } from "@/components/ui/Skeleton";

interface SignaturesListSkeletonProps {
  title?: string;
  subtitle?: string;
  buttonLabel?: string;
}

export function SignaturesListSkeleton({
  title = "Signatures",
  subtitle = "Manage and export email signatures.",
}: SignaturesListSkeletonProps) {
  return (
    <SkeletonContainer label={`Loading ${title}...`} className="flex flex-col gap-6 sm:gap-7 w-full">
      {/* Header bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between shrink-0">
        <div>
          <Skeleton className="h-8 w-44 sm:w-56" />
          <Skeleton className="mt-2 h-4 w-64 sm:w-80" />
          {subtitle && <span className="sr-only">{subtitle}</span>}
        </div>
        <Skeleton className="h-[46px] w-full sm:w-[275px] rounded-full shrink-0" />
      </div>

      {/* Grid of 3 Cards with matching geometry */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6 w-full">
        {[1, 2, 3].map((idx) => (
          <div
            key={idx}
            className="flex flex-col justify-between rounded-xl border border-[#E2E8F0] bg-white shadow-xs overflow-hidden"
          >
            {/* Top Preview Section */}
            <div className="relative bg-[#F8FAFC] p-3 min-h-[148px] flex items-center justify-center w-full">
              <Skeleton className="h-[124px] w-full max-w-[280px] rounded-lg" />
            </div>

            {/* Middle Info Row */}
            <div className="flex items-center justify-between p-3.5 pb-2.5">
              <div className="space-y-1.5 flex-1 pr-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="h-7 w-7 rounded-lg shrink-0" />
            </div>

            {/* Bottom Actions Row */}
            <div className="flex items-center gap-2 border-t border-slate-100 p-3 bg-slate-50/40">
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

export default SignaturesListSkeleton;
