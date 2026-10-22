import type { Metadata } from "next";
import HelpContent from "@/components/help/HelpContent";

export const metadata: Metadata = {
  title: "Help & Support | Sig Signature",
  description:
    "Find practical answers, step-by-step guides, and quick solutions for designing, exporting, and managing your email signatures.",
};

export default function HelpPage() {
  return <HelpContent />;
}
