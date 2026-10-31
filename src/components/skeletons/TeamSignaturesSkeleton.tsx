import React from "react";
import { Skeleton, SkeletonContainer } from "@/components/ui/Skeleton";

/**
 * Custom Team Signatures Skeleton matching the exact UI of /team-signatures:
 * 1. Synchronized Header bar with team icon, title, subtitle, progress pill, and "+ New signature" button.
 * 2. Geometry-aligned central banner skeleton matching EmptyTeamState (central headline, subtitle,
 *    dual action buttons, and 3 feature columns) to prevent jarring layout shift.
 */
export function TeamSignaturesSkeleton() {
  return (
    <SkeletonContainer
      label="Loading team signatures..."
      className="flex flex-col gap-6 sm:gap-7 w-full"
    >
      {/* 1. Header Bar matching TeamSignaturesHeader */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between shrink-0">
        <div>
          <div className="flex items-center gap-2.5">
            <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
            <Skeleton className="h-7 sm:h-8 w-44 rounded-md" />
          </div>
          <Skeleton className="mt-2 h-4 w-72 sm:w-96 rounded-md" />
        </div>

        {/* Right controls: Progress pill & + New signature button */}
        <div className="flex items-center gap-3 self-start sm:self-auto shrink-0">
          <Skeleton className="h-8 w-36 rounded-full" />
          <Skeleton className="h-10 w-36 rounded-xl" />
        </div>
      </div>

      {/* 2. Central Empty-State Banner Skeleton matching EmptyTeamState */}
      <div className="w-full rounded-3xl border border-[#E4E9F4] bg-white p-6 sm:p-10 md:p-14 shadow-2xs">
        {/* Central Hero area */}
        <div className="mx-auto max-w-3xl flex flex-col items-center text-center">
          <Skeleton className="h-10 sm:h-12 w-72 sm:w-96 rounded-xl" />
          <Skeleton className="mt-4 h-4 w-full max-w-xl rounded-md" />
          <Skeleton className="mt-2 h-4 w-3/4 max-w-md rounded-md" />

          {/* Centered CTA Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
            <Skeleton className="h-12 w-44 rounded-xl" />
            <Skeleton className="h-12 w-44 rounded-xl" />
          </div>
        </div>

        {/* 3 Bottom Feature Columns Container */}
        <div className="mt-12 sm:mt-16 rounded-2xl border border-[#E4E9F4] bg-[#F8FAFC] p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
            {[1, 2, 3].map((idx) => (
              <div key={idx} className="flex flex-col items-center text-center px-4">
                <Skeleton className="h-12 w-12 rounded-2xl mb-4 shrink-0" />
                <Skeleton className="h-5 w-36 rounded-md mb-2" />
                <Skeleton className="h-3.5 w-48 rounded-md mb-1.5" />
                <Skeleton className="h-3.5 w-40 rounded-md" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </SkeletonContainer>
  );
}

export default TeamSignaturesSkeleton;
