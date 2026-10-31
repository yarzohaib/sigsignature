import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Team Signatures | Sig Signature",
  description: "Deploy and synchronize branded email signatures across your entire organization.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function TeamSignaturesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
