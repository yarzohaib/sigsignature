import React from "react";
import HelpSkeleton from "@/components/skeletons/HelpSkeleton";

export default function HelpLoading() {
  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 xl:px-10 2xl:px-12 w-full">
      <HelpSkeleton />
    </div>
  );
}
