import type { Metadata } from "next";

export const CANONICAL_SITE_URL = "https://www.sigsignature.com";

/**
 * Returns canonical absolute URL for legal links (/terms, /privacy) to avoid 308 redirect hops
 * from non-www apex domains or trailing-slash discrepancies. In local dev, returns the relative path.
 */
export function getCanonicalLegalUrl(path: "/terms" | "/privacy"): string {
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host === "localhost" || host === "127.0.0.1" || host.endsWith(".local")) {
      return path;
    }
  }
  return `${CANONICAL_SITE_URL}${path}`;
}

export function getSiteMetadata(
  isPreLaunch: boolean = process.env.NEXT_PUBLIC_PRE_LAUNCH === "true"
): Metadata {
  return {
    metadataBase: new URL("https://www.sigsignature.com"),
    alternates: {
      canonical: "https://www.sigsignature.com",
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
    keywords: [
      "email signature generator",
      "html email signature",
      "free email signature creator",
      "gmail signature generator",
      "outlook signature html",
      "apple mail signature",
      "email signature templates",
      "sigsignature",
    ],
    authors: [{ name: "The Nevon", url: "https://www.thenevon.com" }],
    creator: "The Nevon",
    publisher: "SigSignature",
    category: "Productivity",
    openGraph: {
      type: "website",
      locale: "en_US",
      url: "https://www.sigsignature.com",
      siteName: "SigSignature",
      title: "SigSignature | Professional HTML Email Signature Generator",
      description:
        "Design deliverability-focused, client-tested email signatures in under 2 minutes. Free templates for Gmail, Outlook, Apple Mail.",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: "SigSignature Live Email Signature Generator",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "SigSignature | Professional HTML Email Signature Generator",
      description:
        "Design deliverability-focused, client-tested email signatures in under 2 minutes. Free templates for Gmail, Outlook, Apple Mail.",
      images: ["/og-image.png"],
      creator: "@sigsignature",
    },
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
