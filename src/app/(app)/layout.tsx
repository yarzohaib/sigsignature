import React from "react";
import AppShell from "@/components/shell/AppShell";

export const dynamic = "force-dynamic";

export default function AuthenticatedAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
