import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log In | Sig Signature",
  description:
    "Log in to your Sig Signature account to create, customize, and manage your professional email signatures.",
  alternates: {
    canonical: "https://www.sigsignature.com/login",
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

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
