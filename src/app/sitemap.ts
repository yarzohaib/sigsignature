import { MetadataRoute } from "next";
import { BLOG_POSTS } from "@/lib/blogData";
import { DETAILED_GUIDES } from "@/lib/guidesData";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.sigsignature.com";
  const now = new Date("2026-11-03");

  const coreRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/templates`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/gmail-signature-generator`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/outlook-signature-generator`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/pricing`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/design-studio`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/help`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${baseUrl}/help/guides`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/use-cases`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/updates`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: `${baseUrl}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
  ];

  const guideRoutes: MetadataRoute.Sitemap = Object.keys(DETAILED_GUIDES).map((slug) => ({
    url: `${baseUrl}/help/guides/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const blogRoutes: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...coreRoutes, ...guideRoutes, ...blogRoutes];
}
