import type { Metadata } from "next";

export function getSiteMetadata(
  isPreLaunch: boolean = process.env.NEXT_PUBLIC_PRE_LAUNCH === "true"
): Metadata {
  return {
    metadataBase: new URL("https://www.sigsignature.com"),
    alternates: {
      canonical: "./",
    },
    robots: isPreLaunch
      ? {
          index: false,
          follow: false,
          nocache: true,
          googleBot: {
            index: false,
            follow: false,
            noimageindex: true,
          },
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
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
}

export const siteMetadata: Metadata = getSiteMetadata();
