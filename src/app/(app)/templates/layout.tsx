import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Email Signature Templates | SigSignature",
  description:
    "Explore professionally designed email signature templates. Choose from Minimal, Corporate, Creative, and Bold aesthetics.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function TemplatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
