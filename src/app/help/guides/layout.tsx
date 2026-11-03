import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Guides & Tutorials | Sig Signature Help",
  description:
    "Step-by-step email signature installation guides and tutorials for Gmail, Outlook, Apple Mail, mobile devices, and HTML export.",
  alternates: {
    canonical: "https://www.sigsignature.com/help/guides",
  },
  openGraph: {
    title: "Guides & Tutorials | Sig Signature Help",
    description:
      "Step-by-step email signature installation guides and tutorials for Gmail, Outlook, Apple Mail, and mobile devices.",
    url: "https://www.sigsignature.com/help/guides",
    siteName: "Sig Signature",
    type: "website",
  },
};

export default function HelpGuidesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
