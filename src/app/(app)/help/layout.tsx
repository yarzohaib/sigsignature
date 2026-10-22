import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Help & Documentation | SigSignature",
  description: "Documentation, installation guides, and email client setup instructions.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function HelpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
