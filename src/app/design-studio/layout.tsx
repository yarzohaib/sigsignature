import type { Metadata } from "next";
import {
  fontInter,
  fontRoboto,
  fontDmSans,
  fontAlata,
  fontDmSerif,
  fontPlayfair,
  fontDuruSans,
} from "./fonts";

export const metadata: Metadata = {
  title: "Email Signature Design Studio | SigSignature",
  description:
    "Design, customize, and preview your professional HTML email signature with real-time editing and multi-client compilation.",
  alternates: {
    canonical: "https://www.sigsignature.com/design-studio",
  },
  openGraph: {
    title: "Email Signature Design Studio | SigSignature",
    description:
      "Design, customize, and preview your professional HTML email signature with real-time editing and multi-client compilation.",
    url: "https://www.sigsignature.com/design-studio",
    siteName: "SigSignature",
    type: "website",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Email Signature Design Studio | SigSignature",
    description:
      "Design, customize, and preview your professional HTML email signature with real-time editing and multi-client compilation.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function DesignStudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${fontInter.variable} ${fontRoboto.variable} ${fontDmSans.variable} ${fontAlata.variable} ${fontDmSerif.variable} ${fontPlayfair.variable} ${fontDuruSans.variable} h-screen w-full overflow-hidden`}
    >
      {children}
    </div>
  );
}
