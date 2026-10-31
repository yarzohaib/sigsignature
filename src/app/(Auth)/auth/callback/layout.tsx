import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authenticating | Sig Signature",
  description: "Completing authentication with SigSignature...",
};

export default function AuthCallbackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
