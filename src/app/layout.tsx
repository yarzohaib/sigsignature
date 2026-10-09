import type { Metadata } from "next";
import { Montserrat, Commissioner } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

const commissioner = Commissioner({
  subsets: ["latin"],
  variable: "--font-commissioner",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sig Signature",
  description: "Create professional email signatures in minutes.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`scroll-smooth ${montserrat.variable} ${commissioner.variable}`}>
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}