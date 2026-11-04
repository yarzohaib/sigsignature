import type { MetadataRoute } from "next";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

export default async function robots(): Promise<MetadataRoute.Robots> {
  let isStaging = false;
  try {
    const headerList = await headers();
    const host = (headerList.get("host") || "").toLowerCase();
    if (host.includes("staging.sigsignature.com")) {
      isStaging = true;
    }
  } catch {
    // Fallback if called outside request scope
  }

  const isPreLaunch =
    process.env.NEXT_PUBLIC_PRE_LAUNCH === "true" ||
    process.env.VERCEL_ENV === "preview" ||
    process.env.APP_ENV === "staging";

  // Staging & Pre-launch environment guard: block all indexing so Google never crawls staging
  if (isStaging || isPreLaunch) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  const privateDisallows = [
    "/dashboard",
    "/dashboard/",
    "/signatures",
    "/signatures/",
    "/team-signatures",
    "/team-signatures/",
    "/settings",
    "/settings/",
    "/s/",
    "/api/",
    "/auth/",
    "/reset",
    "/reset-password",
    "/verify",
    "/404",
  ];

  const publicAllows = [
    "/",
    "/about",
    "/team",
    "/contact",
    "/updates",
    "/terms",
    "/privacy",
    "/template",
    "/templates",
    "/pricing",
    "/pricing/",
    "/gmail-signature-generator",
    "/outlook-signature-generator",
    "/help",
    "/help/",
    "/help/guides",
    "/help/guides/",
    "/llms.txt",
    "/ads.txt",
    "/BingSiteAuth.xml",
    "/design-studio",
    "/login",
    "/signup",
    "/forgot",
    "/_next/static/",
    "/_next/image",
    "/favicon.ico",
    "/icon.svg",
    "/icon-*.png",
    "/apple-touch-icon.png",
    "/logo.svg",
    "/logo-white.svg",
    "/*.svg$",
    "/*.png$",
    "/*.jpg$",
    "/*.webp$",
  ];

  return {
    rules: [
      {
        userAgent: "*",
        allow: publicAllows,
        disallow: privateDisallows,
      },
      {
        userAgent: ["GPTBot", "PerplexityBot", "ClaudeBot"],
        allow: [
          "/",
          "/about",
          "/team",
          "/contact",
          "/updates",
          "/terms",
          "/privacy",
          "/template",
          "/templates",
          "/gmail-signature-generator",
          "/outlook-signature-generator",
          "/help",
    "/help/",
    "/help/guides",
    "/help/guides/",
          "/llms.txt",
          "/ads.txt",
    "/BingSiteAuth.xml",
        ],
        disallow: privateDisallows,
      },
    ],
    sitemap: "https://www.sigsignature.com/sitemap.xml",
  };
}
