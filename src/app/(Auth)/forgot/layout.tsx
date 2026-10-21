import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password | SigSignature",
  description:
    "Reset your SigSignature account password to regain access to your saved email signatures.",
  alternates: {
    canonical: "https://www.sigsignature.com/forgot",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ForgotLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
