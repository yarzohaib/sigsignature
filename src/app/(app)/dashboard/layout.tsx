import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Sig Signature",
  description:
    "Your Sig Signature dashboard to create, manage, and monitor your professional email signatures.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
