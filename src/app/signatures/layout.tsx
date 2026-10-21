import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Signatures | SigSignature",
  description:
    "Manage, edit, duplicate, and export your saved email signatures in SigSignature.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SignaturesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
