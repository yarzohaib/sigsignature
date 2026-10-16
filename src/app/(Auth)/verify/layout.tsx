import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify Email | SigSignature",
  description:
    "Verify your email address to activate your SigSignature account and start creating professional signatures.",
};

export default function VerifyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
