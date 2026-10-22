import React from "react";
import TeamSignaturesSkeleton from "@/components/skeletons/TeamSignaturesSkeleton";

export default function TeamSignaturesLoading() {
  return (
    <div className="px-4 py-6 sm:px-6 sm:py-7 lg:px-8 lg:py-8 xl:px-10 2xl:px-12 w-full">
      <TeamSignaturesSkeleton />
    </div>
  );
}
