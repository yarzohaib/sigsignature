import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | SigSignature",
  description:
    "Create a free SigSignature account to design up to 3 professional email signatures with live preview and HTML export.",
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
