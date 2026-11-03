"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { BLOG_POSTS, BLOG_CATEGORIES, BlogCategory, BlogPost } from "@/lib/blogData";
import BlogCardVisual from "./BlogCardVisual";

export default function BlogListSection() {
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory>("All stories");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return BLOG_POSTS.filter((post) => {
      const matchesCategory =
        selectedCategory === "All stories" || post.category === selectedCategory;
      const matchesSearch =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.category.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <section id="journal" className="scroll-mt-24 pt-4 pb-16 sm:pt-6 sm:pb-20 lg:pt-8 lg:pb-24">
      <div className="mx-auto max-w-[1288px] px-4 sm:px-6 lg:px-8">
        {/* Section Header Row matching Figma: Title + Search */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <h2
            className="font-heading text-3xl sm:text-4xl lg:text-[42px] font-medium text-[#101B30] tracking-[-0.04em] leading-tight text-left"
            style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
          >
            A little insight. A better sign&#8209;off.
          </h2>

          {/* Search Pill Input matching Figma */}
          <div className="relative w-full sm:w-72 lg:w-80">
            <svg
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search the journal"
              aria-label="Search the journal"
              className="w-full rounded-full border border-slate-200/90 bg-white py-2.5 pl-11 pr-10 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 shadow-2xs outline-none transition focus:border-[#245FD4] focus:ring-2 focus:ring-[#245FD4]/15"
              style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-700"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Pills matching Figma */}
        <div className="mt-8 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {BLOG_CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold transition shrink-0 cursor-pointer ${
                  isActive
                    ? "bg-[#101B30] text-white shadow-xs"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                }`}
                style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* 3-Column Stories Grid matching Figma */}
        {filteredPosts.length > 0 ? (
          <div className="mt-10 sm:mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {filteredPosts.map((post: BlogPost) => (
              <article
                key={post.slug}
                className="group flex h-full flex-col justify-between text-left"
              >
                <div>
                  <Link
                    href={`/blog/${post.slug}`}
                    tabIndex={-1}
                    aria-hidden="true"
                    className="block overflow-hidden rounded-2xl"
                  >
                    <BlogCardVisual
                      type={post.visualType}
                      coverImage={post.coverImage}
                      title={post.title}
                    />
                  </Link>

                  <h3
                    className="mt-5 font-heading text-xl sm:text-2xl font-medium text-[#101B30] tracking-[-0.03em] leading-[1.28] transition group-hover:text-[#245FD4] line-clamp-2 min-h-[3rem] sm:min-h-[3.6rem]"
                    style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                  >
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h3>

                  <p
                    className="mt-2.5 font-body text-xs sm:text-sm text-[#687386] leading-relaxed line-clamp-3 min-h-[3.75rem]"
                    style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                  >
                    {post.excerpt}
                  </p>
                </div>

                <div className="mt-4 pt-1">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1.5 font-body text-xs sm:text-sm font-semibold text-[#245FD4] transition group-hover:gap-2"
                    style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                  >
                    <span>Read the story</span>
                    <svg
                      className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2.5"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                    </svg>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-12 rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-xs">
            <h3
              className="text-lg font-bold text-[#1E293B]"
              style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
            >
              No stories found
            </h3>
            <p
              className="mt-1 text-sm text-[#64748B]"
              style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
            >
              Try clearing your search or switching categories.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All stories");
              }}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#245FD4] to-[#022977] px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs transition hover:opacity-95"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Integration Row matching Figma: "Your signature. At home in your inbox." */}
        <div className="mt-12 sm:mt-16 pt-8 sm:pt-10 border-t border-slate-200/80 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 text-left">
          <div>
            <h3
              className="font-heading text-2xl sm:text-3xl lg:text-[34px] font-medium text-[#101B30] tracking-[-0.03em] leading-[1.3]"
              style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
            >
              Your signature. <br />
              At home in your inbox.
            </h3>
          </div>

          {/* Integration Badges matching Figma - uniform monochrome brand blue */}
          <div className="flex flex-wrap items-center gap-6 sm:gap-8">
            {/* Gmail */}
            <div className="flex items-center gap-2 text-slate-800 font-body text-xs sm:text-sm font-medium">
              <svg className="h-4 w-4 text-[#245FD4]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-10 7L2 7" />
              </svg>
              <span>Gmail</span>
            </div>

            {/* Outlook */}
            <div className="flex items-center gap-2 text-slate-800 font-body text-xs sm:text-sm font-medium">
              <svg className="h-4 w-4 text-[#245FD4]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="12" cy="12" r="4" />
              </svg>
              <span>Outlook</span>
            </div>

            {/* HTML export */}
            <div className="flex items-center gap-2 text-slate-800 font-body text-xs sm:text-sm font-medium">
              <span className="font-mono text-xs font-bold text-[#245FD4]">&lt;/&gt;</span>
              <span>HTML export</span>
            </div>

            {/* Image export */}
            <div className="flex items-center gap-2 text-slate-800 font-body text-xs sm:text-sm font-medium">
              <svg className="h-4 w-4 text-[#245FD4]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <span>Image export</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
