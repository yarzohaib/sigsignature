import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.sigsignature.com";
  // Fixed deployment reference date to ensure predictable, clean HTTP headers
  const releaseDate = new Date("2026-10-23T00:00:00.000Z");

  return [
    // Homepage - Highest Priority
    {
      url: `${baseUrl}/`,
      lastModified: releaseDate,
      changeFrequency: "daily",
      priority: 1.0,
    },

    // Core Studio & Signature Builder - High Priority
    {
      url: `${baseUrl}/design-studio`,
      lastModified: releaseDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },

    // Authentication Pages
    {
      url: `${baseUrl}/login`,
      lastModified: releaseDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/signup`,
      lastModified: releaseDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/forgot`,
      lastModified: releaseDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },

    // Information & Company Pages
    {
      url: `${baseUrl}/about`,
      lastModified: releaseDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/team`,
      lastModified: releaseDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: releaseDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/updates`,
      lastModified: releaseDate,
      changeFrequency: "weekly",
      priority: 0.7,
    },

    // Legal Pages
    {
      url: `${baseUrl}/privacy`,
      lastModified: releaseDate,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: releaseDate,
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];
}
