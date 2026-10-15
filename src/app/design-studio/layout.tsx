import {
  fontInter,
  fontRoboto,
  fontDmSans,
  fontAlata,
  fontDmSerif,
  fontPlayfair,
  fontDuruSans,
} from "./fonts";

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
