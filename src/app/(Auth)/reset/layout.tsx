import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password | SigSignature",
  description:
    "Set a new secure password for your SigSignature account.",
};

export default function ResetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
