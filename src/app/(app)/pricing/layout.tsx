import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing & Plans | Sig Signature",
  description:
    "Compare SigSignature Free and Pro plans. Simple, transparent pricing with no hidden fees and up to 3 signatures free forever.",
  alternates: {
    canonical: "https://www.sigsignature.com/pricing",
  },
  openGraph: {
    title: "Pricing & Plans | Sig Signature",
    description:
      "Compare SigSignature Free and Pro plans. Simple, transparent pricing with no hidden fees.",
    url: "https://www.sigsignature.com/pricing",
    siteName: "Sig Signature",
    type: "website",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing & Plans | Sig Signature",
    description:
      "Compare SigSignature Free and Pro plans. Simple, transparent pricing with no hidden fees.",
    images: ["/og-image.png"],
  },
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
