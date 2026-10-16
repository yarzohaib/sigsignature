import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password | SigSignature",
  description:
    "Reset your SigSignature account password to regain access to your saved email signatures.",
};

export default function ForgotLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
