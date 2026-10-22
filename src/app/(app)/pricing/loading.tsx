import PricingSkeleton from "@/components/skeletons/PricingSkeleton";

export default function PricingLoading() {
  return (
    <div className="px-4 py-6 sm:px-6 sm:py-7 lg:px-8 lg:py-8 xl:px-12 2xl:px-16 w-full">
      <PricingSkeleton />
    </div>
  );
}
