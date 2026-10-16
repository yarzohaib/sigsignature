import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | SigSignature",
  description:
    "Your SigSignature dashboard to create, manage, and monitor your professional email signatures.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
