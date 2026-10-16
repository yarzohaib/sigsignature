import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing & Plans | SigSignature",
  description:
    "Compare SigSignature Free and Pro plans. Simple, transparent pricing with no hidden fees.",
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
