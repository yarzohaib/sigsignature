import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log In | Sig Signature",
  description:
    "Log in to your SigSignature account to create, customize, and manage your professional email signatures.",
  alternates: {
    canonical: "https://www.sigsignature.com/login",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
