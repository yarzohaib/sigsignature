import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password | Sig Signature",
  description:
    "Reset your Sig Signature account password to regain access to your saved email signatures.",
  alternates: {
    canonical: "https://www.sigsignature.com/forgot-password",
  },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function ForgotLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
