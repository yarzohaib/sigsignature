import type { Metadata } from "next";
import AdaptivePricingShell from "@/components/pricing/AdaptivePricingShell";

export const metadata: Metadata = {
  title: "Pricing & Plans | Sig Signature",
  description:
    "Compare Sig Signature Free and Pro plans. Simple, transparent pricing with no hidden fees and up to 3 signatures free forever.",
  alternates: {
    canonical: "https://www.sigsignature.com/pricing",
  },
  openGraph: {
    title: "Pricing & Plans | Sig Signature",
    description:
      "Compare Sig Signature Free and Pro plans. Simple, transparent pricing with no hidden fees.",
    url: "https://www.sigsignature.com/pricing",
    siteName: "Sig Signature",
    type: "website",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing & Plans | Sig Signature",
    description:
      "Compare Sig Signature Free and Pro plans. Simple, transparent pricing with no hidden fees.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdaptivePricingShell>{children}</AdaptivePricingShell>;
}
