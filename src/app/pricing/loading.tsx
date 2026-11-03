import React from "react";
import PricingSkeleton from "@/components/skeletons/PricingSkeleton";

export default function PricingLoading() {
  return (
    <div className="flex flex-1 flex-col justify-center overflow-y-auto lg:overflow-hidden px-4 py-3 sm:px-6 sm:py-4 lg:px-8 xl:px-12 2xl:px-16 bg-white w-full">
      <PricingSkeleton />
    </div>
  );
}
