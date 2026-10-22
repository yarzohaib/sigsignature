import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account Settings | SigSignature",
  description: "Manage your personal profile, security credentials, and company preferences.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
