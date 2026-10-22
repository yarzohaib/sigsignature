import DashboardSkeleton from "@/components/skeletons/DashboardSkeleton";

export default function DashboardLoading() {
  return (
    <div className="flex flex-1 flex-col px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-7 xl:px-10 xl:py-8 2xl:px-12 3xl:px-16 w-full max-w-[2400px] mx-auto">
      <DashboardSkeleton />
    </div>
  );
}
