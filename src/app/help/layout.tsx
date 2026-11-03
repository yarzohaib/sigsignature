import type { Metadata } from "next";
import AdaptiveHelpShell from "@/components/help/AdaptiveHelpShell";

export const metadata: Metadata = {
  title: "Help & Documentation | Sig Signature",
  description: "Documentation, installation guides, and email client setup instructions for Gmail, Outlook, Apple Mail, and Thunderbird.",
  alternates: {
    canonical: "https://www.sigsignature.com/help",
  },
  openGraph: {
    title: "Help & Documentation | Sig Signature",
    description: "Documentation, installation guides, and email client setup instructions.",
    url: "https://www.sigsignature.com/help",
    siteName: "Sig Signature",
    type: "website",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Help & Documentation | Sig Signature",
    description: "Documentation, installation guides, and email client setup instructions.",
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

export default function HelpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdaptiveHelpShell>{children}</AdaptiveHelpShell>;
}
