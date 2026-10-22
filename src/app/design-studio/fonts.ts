import {
  Inter,
  Roboto,
  DM_Sans,
  Alata,
  DM_Serif_Display,
  Playfair_Display,
  Duru_Sans,
} from "next/font/google";

export const fontInter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const fontRoboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
});

export const fontDmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dmsans",
  display: "swap",
});

export const fontAlata = Alata({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-alata",
  display: "swap",
});

export const fontDmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-dmserif",
  display: "swap",
});

export const fontPlayfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const fontDuruSans = Duru_Sans({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-durusans",
  display: "swap",
});
