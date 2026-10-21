import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing & Plans | SigSignature",
  description:
    "Compare SigSignature Free and Pro plans. Simple, transparent pricing with no hidden fees.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
