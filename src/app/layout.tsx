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
  title: "Free Email Signature Generator | SigSignature",
  description:
    "Create up to 3 professional signatures with SigSignature’s free email signature generator. Customize templates, preview live, and export HTML or images.",
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