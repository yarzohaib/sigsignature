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
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/icon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/icon-96.png", sizes: "96x96", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
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