import SignaturesListSkeleton from "@/components/skeletons/SignaturesListSkeleton";

export default function TeamSignaturesLoading() {
  return (
    <div className="px-4 py-6 sm:px-6 sm:py-7 lg:px-8 lg:py-8 xl:px-10 2xl:px-12 w-full">
      <SignaturesListSkeleton
        title="Team Signatures"
        subtitle="Manage your team members and shared email signature templates."
      />
    </div>
  );
}
