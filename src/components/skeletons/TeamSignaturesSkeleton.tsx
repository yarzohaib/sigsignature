import React from "react";
import { Skeleton, SkeletonContainer } from "@/components/ui/Skeleton";

/**
 * Custom Team Signatures Skeleton matching the exact UI of /team-signatures:
 * 1. Header with team icon, title, subtitle, progress pill, and "+ New signature" button.
 * 2. "Team template:" bar with template name badge and Options dropdown.
 * 3. Exact responsive grid matching TeamMemberCard (preview frame + info + 3 buttons + more)
 *    and the trailing dashed "New signature" card.
 */
export function TeamSignaturesSkeleton() {
  return (
    <SkeletonContainer
      label="Loading team signatures..."
      className="flex flex-col gap-6 w-full"
    >
      {/* 1. Header Bar matching TeamSignaturesHeader */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-transparent">
        <div>
          <div className="flex items-center gap-2.5">
            {/* Team icon box */}
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

      {/* 2. Team Template Bar matching TeamTemplateBar */}
      <div className="mb-6 flex items-center justify-between rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-28 rounded-md" />
          <Skeleton className="h-4 w-32 rounded-md" />
          <span className="text-[#CBD5E1]">&bull;</span>
          <Skeleton className="h-5 w-28 rounded-md" />
        </div>
        <Skeleton className="h-6 w-16 rounded-md shrink-0" />
      </div>

      {/* 3. Cards Grid: matching real TeamMemberCard and AddMemberCard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 gap-5 2xl:gap-6 w-full">
        {/* Card 1 & 2: Team Member Cards */}
        {[1, 2].map((idx) => (
          <div
            key={idx}
            className="flex flex-col justify-between rounded-[24px] border border-[#E4E9F4] bg-white p-4 shadow-2xs min-h-[290px]"
          >
            {/* Top area: signature preview frame */}
            <div className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-b from-[#F8FAFC] to-[#F1F5F9] border border-[#EBF0F7] p-3 h-[160px] flex items-center justify-center">
              <Skeleton className="h-[120px] w-full max-w-[280px] rounded-xl" />
            </div>

            {/* Middle info row: Name + Status badge + Subtext */}
            <div className="pt-3.5 pb-2">
              <div className="flex items-center justify-between gap-2">
                <Skeleton className="h-4.5 w-28 rounded-md" />
                <Skeleton className="h-5 w-14 rounded-full shrink-0" />
              </div>
              <Skeleton className="mt-1.5 h-3 w-36 rounded-md" />
            </div>

            {/* Bottom action row: 3 buttons ([Edit], [Copy], [Send]) + more button */}
            <div className="flex items-center justify-between pt-3 border-t border-[#F1F5F9] gap-2">
              <div className="flex items-center gap-1.5 flex-1">
                <Skeleton className="h-7 w-14 rounded-lg" />
                <Skeleton className="h-7 w-14 rounded-lg" />
                <Skeleton className="h-7 w-14 rounded-lg" />
              </div>
              <Skeleton className="h-7 w-6 rounded-md shrink-0" />
            </div>
          </div>
        ))}

        {/* Card 3: Trailing Dashed New Signature Card matching AddMemberCard */}
        <div className="flex min-h-[290px] flex-col items-center justify-center rounded-[24px] border-2 border-dashed border-[#CBD5E1] bg-[#F8FAFC]/40 p-6 text-center">
          <Skeleton className="h-12 w-12 rounded-full mb-3 shrink-0" />
          <Skeleton className="h-4.5 w-28 rounded-md mb-1.5" />
          <Skeleton className="h-3 w-36 rounded-md" />
        </div>
      </div>
    </SkeletonContainer>
  );
}

export default TeamSignaturesSkeleton;
