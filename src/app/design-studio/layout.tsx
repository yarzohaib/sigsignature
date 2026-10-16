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
  title: "Design Studio | SigSignature",
  description:
    "Design, customize, and preview your professional HTML email signature with real-time editing and multi-client compilation.",
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
