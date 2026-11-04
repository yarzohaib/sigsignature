import type { Metadata } from "next";
import AdaptiveTemplatesShell from "@/components/templates/AdaptiveTemplatesShell";

export const metadata: Metadata = {
  title: "Email Signature Templates | Sig Signature",
  description:
    "Explore modern, responsive, and professionally designed email signature templates. Compatible with Gmail, Outlook, Apple Mail, and all major email clients.",
  alternates: {
    canonical: "https://www.sigsignature.com/templates",
  },
  openGraph: {
    title: "Email Signature Templates | Sig Signature",
    description:
      "Explore modern, responsive, and professionally designed email signature templates. Compatible with Gmail, Outlook, Apple Mail, and all major email clients.",
    url: "https://www.sigsignature.com/templates",
    siteName: "Sig Signature",
    type: "website",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Email Signature Templates | Sig Signature",
    description:
      "Explore modern, responsive, and professionally designed email signature templates. Compatible with Gmail, Outlook, Apple Mail, and all major email clients.",
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

export default function TemplatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdaptiveTemplatesShell>{children}</AdaptiveTemplatesShell>;
}
