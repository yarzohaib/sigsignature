import type { Metadata } from "next";
import { Suspense } from "react";
import HelpContent from "@/components/help/HelpContent";
import HelpSkeleton from "@/components/skeletons/HelpSkeleton";

export const metadata: Metadata = {
  title: "Help & Support | Sig Signature",
  description:
    "Find practical answers, step-by-step guides, and quick solutions for designing, exporting, and managing your email signatures.",
};

export default function HelpPage() {
  return (
    <Suspense
      fallback={
        <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 xl:px-10 2xl:px-12 w-full">
          <HelpSkeleton />
        </div>
      }
    >
      <HelpContent />
    </Suspense>
  );
}
