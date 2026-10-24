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

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/about",
          "/team",
          "/contact",
          "/updates",
          "/terms",
          "/privacy",
          "/llms.txt",
          "/ads.txt",
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
        ],
        disallow: [
          "/dashboard",
          "/dashboard/",
          "/signatures",
          "/signatures/",
          "/team-signatures",
          "/team-signatures/",
          "/settings",
          "/settings/",
          "/help",
          "/help/",
          "/templates",
          "/templates/",
          "/pricing",
          "/pricing/",
          "/s/",
          "/api/",
          "/auth/",
          "/reset",
          "/reset-password",
          "/verify",
          "/404",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
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
          "/llms.txt",
        ],
        disallow: [
          "/dashboard",
          "/dashboard/",
          "/signatures",
          "/signatures/",
          "/team-signatures",
          "/team-signatures/",
          "/settings",
          "/settings/",
          "/help",
          "/help/",
          "/templates",
          "/templates/",
          "/pricing",
          "/pricing/",
          "/s/",
          "/api/",
          "/auth/",
          "/reset",
          "/verify",
          "/404",
        ],
      },
    ],
    sitemap: "https://www.sigsignature.com/sitemap.xml",
  };
}
