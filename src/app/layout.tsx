import type { Metadata, Viewport } from "next";
import { Montserrat, Commissioner } from "next/font/google";
import { fontInter, fontRoboto, fontDmSans } from "./design-studio/fonts";
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

export const metadata: Metadata = {
  title: {
    template: "%s",
    default: "SigSignature | Professional Email Signature Generator",
  },
  description:
    "SigSignature is a lightweight, deliverability-focused HTML email signature generator engineered for modern professionals and teams.",
  verification: {
    google: "DUyyrpNeKYNjkUUggUmFhX3q03kIWGrqg-2qJHNPcCI",
  },
};

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