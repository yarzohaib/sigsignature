import type { Viewport } from "next";
import { Montserrat, Commissioner } from "next/font/google";
import { fontInter, fontRoboto, fontDmSans } from "./(app)/design-studio/fonts";
import { siteMetadata } from "@/lib/seo";
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata = siteMetadata;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`scroll-smooth ${montserrat.variable} ${commissioner.variable} ${fontInter.variable} ${fontRoboto.variable} ${fontDmSans.variable}`}
    >
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
