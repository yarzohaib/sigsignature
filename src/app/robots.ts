import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const isPreLaunch = process.env.NEXT_PUBLIC_PRE_LAUNCH === "true";

  // Pre-launch environment guard: block all indexing if flag is active
  if (isPreLaunch) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
      sitemap: "https://www.sigsignature.com/sitemap.xml",
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
    "/forgot-password",
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
