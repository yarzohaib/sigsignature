import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password | Sig Signature",
  description:
    "Set a new secure password for your Sig Signature account.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ResetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
