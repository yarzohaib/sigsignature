"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { ALL_19_GUIDES, DetailedGuide } from "@/lib/guidesData";

const CATEGORIES = [
  {
    slug: "getting-started",
    title: "Getting Started",
    description: "Your first signature, step by step.",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
        <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
        <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
      </svg>
    ),
  },
  {
    slug: "design-templates",
    title: "Design & Templates",
    description: "Make every detail your own, from Retina images to dark mode.",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="13.5" cy="6.5" r=".75" fill="currentColor" />
        <circle cx="17.5" cy="10.5" r=".75" fill="currentColor" />
        <circle cx="8.5" cy="7.5" r=".75" fill="currentColor" />
        <circle cx="6.5" cy="12.5" r=".75" fill="currentColor" />
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.563-2.512 5.563-5.563C21.437 6.082 17.203 2 12 2z" />
      </svg>
    ),
  },
  {
    slug: "export-installation",
    title: "Export & Installation",
    description: "From the editor into Gmail, Outlook, Apple Mail, and custom webmail.",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    slug: "account-billing",
    title: "Account & Billing",
    description: "Manage team workspaces, roles, plans, and invoices.",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

export default function AllGuidesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  // Handle hash scrolling on page load (e.g. navigated from /help?category=design-templates or /help/guides#design-templates)
  useEffect(() => {
    function handleHash() {
      const hash = window.location.hash.replace("#", "");
      if (hash) {
        setActiveCategory(hash);
        const element = document.getElementById(hash);
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 100);
        }
      }
    }

    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  const filteredGuides = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return ALL_19_GUIDES.filter((g) => {
      const matchesSearch =
        !q ||
        g.title.toLowerCase().includes(q) ||
        g.subtitle.toLowerCase().includes(q) ||
        g.category.toLowerCase().includes(q) ||
        (g.keyTakeaways && g.keyTakeaways.some((t) => t.toLowerCase().includes(q)));
      const matchesCat =
        activeCategory === "all" || g.categorySlug === activeCategory;
      return matchesSearch && matchesCat;
    });
  }, [searchQuery, activeCategory]);

  return (
    <div className="w-full px-4 pt-6 pb-28 sm:px-6 sm:pt-8 lg:px-8 xl:px-10 2xl:px-12">
      <div className="w-full max-w-6xl mx-auto">
        {/* Breadcrumb: Help & Support > Guides */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-500 font-body">
          <Link
            href="/help"
            className="hover:text-brand transition flex items-center gap-1.5"
          >
            <span>Help & Support</span>
          </Link>
          <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <polyline points="9 18 15 12 9 6" />
          </svg>
          <span className="text-slate-900 font-semibold">
            Guides
          </span>
        </nav>

        {/* Page Hero Header */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 lg:p-10 shadow-xs mb-8 sm:mb-10">
          <div className="max-w-3xl">
            <span
              className="inline-block rounded-full bg-[#EFF6FF] px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#245FD4]"
              style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
            >
              SigSignature Knowledge Base
            </span>
            <h1
              className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#0F172A]"
              style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
            >
              All Technical Guides
            </h1>
            <p
              className="mt-2.5 text-sm sm:text-base lg:text-lg leading-relaxed text-[#64748B]"
              style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
            >
              Everything you need to create, customize, test, install, and manage bulletproof HTML email signatures across all major email clients.
            </p>
          </div>

          {/* Search bar */}
          <div className="mt-6 sm:mt-8 max-w-xl">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                maxLength={100}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search all guides (e.g. Gmail, Outlook, Retina, Dark Mode)..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 pl-11 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#245FD4] focus:outline-none focus:ring-4 focus:ring-[#245FD4]/10 transition shadow-2xs font-body"
              />
              <svg
                className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-3.5 text-xs text-slate-400 hover:text-slate-700"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Quick jump category pills */}
          <div className="mt-6 flex flex-wrap items-center gap-2 pt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setActiveCategory("all");
                window.history.pushState(null, "", "/help/guides");
              }}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition cursor-pointer ${
                activeCategory === "all"
                  ? "bg-[#245FD4] text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200/80"
              }`}
              style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
            >
              All Guides
            </button>
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.slug;
              return (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => {
                    setActiveCategory(cat.slug);
                    window.history.pushState(null, "", `/help/guides#${cat.slug}`);
                    const el = document.getElementById(cat.slug);
                    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold transition cursor-pointer ${
                    isActive
                      ? "bg-[#245FD4] text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200/80"
                  }`}
                  style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                >
                  <span>{cat.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Guides List by Category Sections */}
        {searchQuery ? (
          /* Search results flat grid */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2
                className="text-lg font-bold text-slate-900"
                style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
              >
                Search Results ({filteredGuides.length})
              </h2>
            </div>
            {filteredGuides.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
                <p className="text-base text-slate-600 font-body">
                  No guides found matching &quot;{searchQuery}&quot;.
                </p>
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="mt-3 text-sm font-semibold text-brand hover:underline cursor-pointer"
                >
                  Clear search and view all guides
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredGuides.map((guide) => (
                  <GuideCard key={guide.id} guide={guide} />
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Structured Category Sections */
          <div className="space-y-12 sm:space-y-16">
            {CATEGORIES.map((cat) => {
              const guides = ALL_19_GUIDES.filter((g) => g.categorySlug === cat.slug);
              return (
                <section
                  key={cat.slug}
                  id={cat.slug}
                  className="scroll-mt-24"
                  aria-labelledby={`heading-${cat.slug}`}
                >
                  {/* Category Section Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-5 border-b border-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#245FD4]">
                        {cat.icon}
                      </div>
                      <div>
                        <h2
                          id={`heading-${cat.slug}`}
                          className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight"
                          style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                        >
                          {cat.title}
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500 font-body mt-0.5">
                          {cat.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Guides Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                    {guides.map((guide) => (
                      <GuideCard key={guide.id} guide={guide} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function GuideCard({ guide }: { guide: DetailedGuide }) {
  return (
    <Link
      href={`/help/guides/${guide.slug}`}
      className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition hover:border-[#245FD4]/50 hover:shadow-md"
    >
      <div>
        <div className="flex items-center justify-end gap-2 mb-3">
          <span
            className="text-xs text-slate-400 font-body"
            title="Estimated reading time"
          >
            {guide.readTime}
          </span>
        </div>

        <h3
          className="text-[15px] sm:text-base font-bold text-slate-900 leading-snug group-hover:text-[#245FD4] transition"
          style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
        >
          {guide.title}
        </h3>

        <p
          className="mt-2 text-xs sm:text-[13px] leading-relaxed text-slate-500 line-clamp-3 font-body"
        >
          {guide.subtitle}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#245FD4] group-hover:underline">
        <span>Read Guide</span>
        <svg
          className="w-4 h-4 transition-transform group-hover:translate-x-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </div>
    </Link>
  );
}
