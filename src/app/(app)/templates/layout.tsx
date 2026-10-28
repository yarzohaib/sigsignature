import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Email Signature Templates | SigSignature",
  description:
    "Explore professionally designed email signature templates. Choose from Minimal, Corporate, Creative, and Bold aesthetics with 1-click HTML copy.",
  alternates: {
    canonical: "https://www.sigsignature.com/templates",
  },
  openGraph: {
    title: "Email Signature Templates | SigSignature",
    description:
      "Explore professionally designed email signature templates. Choose from Minimal, Corporate, Creative, and Bold aesthetics.",
    url: "https://www.sigsignature.com/templates",
    siteName: "SigSignature",
    type: "website",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Email Signature Templates | SigSignature",
    description:
      "Explore professionally designed email signature templates. Choose from Minimal, Corporate, Creative, and Bold aesthetics.",
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
  return children;
}
