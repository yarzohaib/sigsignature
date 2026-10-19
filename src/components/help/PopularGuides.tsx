import React from "react";
import Link from "next/link";
import { POPULAR_GUIDES, PopularGuide } from "@/lib/helpData";

interface PopularGuidesProps {
  searchQuery?: string;
}

export default function PopularGuides({ searchQuery = "" }: PopularGuidesProps) {
  const query = searchQuery.trim().toLowerCase();
  const guides: PopularGuide[] = query
    ? POPULAR_GUIDES.filter((g) => g.title.toLowerCase().includes(query))
    : POPULAR_GUIDES;

  return (
    <section aria-labelledby="popular-guides-heading" className="flex flex-col">
      <div className="flex items-center justify-between mb-3.5">
        <h2
          id="popular-guides-heading"
          className="text-lg font-bold text-[#1E293B]"
          style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
        >
          Popular guides
        </h2>
        <Link
          href="/help?all=true"
          className="text-xs font-semibold text-[#245FD4] hover:underline transition"
          style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
        >
          View all guides
        </Link>
      </div>

      <div className="rounded-2xl border border-[#E2E8F0] bg-white divide-y divide-[#F1F5F9] overflow-hidden">
        {guides.length === 0 ? (
          <div className="p-6 text-center text-xs text-[#94A3B8]">
            No guides found matching &quot;{searchQuery}&quot;.
          </div>
        ) : (
          guides.map((guide) => (
            <Link
              key={guide.id}
              href={guide.href}
              className="group flex items-center justify-between gap-3 px-4 py-3 sm:px-5 sm:py-3.5 hover:bg-slate-50/80 transition focus-visible:outline-none focus-visible:bg-slate-50"
            >
              <div className="flex items-center gap-3 min-w-0">
                <svg
                  className="h-4 w-4 text-[#94A3B8] shrink-0 group-hover:text-[#245FD4] transition-colors"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>

                <div className="min-w-0">
                  <p
                    className="truncate text-[13px] sm:text-sm font-semibold text-[#1E293B] group-hover:text-[#245FD4] transition-colors"
                    style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                  >
                    {guide.title}
                  </p>
                  <p
                    className="text-[11px] sm:text-xs text-[#94A3B8] mt-0.5"
                    style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                  >
                    <span>{guide.category}</span>
                    <span className="mx-1.5 text-slate-300">·</span>
                    <span>{guide.readTime}</span>
                  </p>
                </div>
              </div>

              <svg
                className="h-3.5 w-3.5 text-[#94A3B8] shrink-0 group-hover:text-[#245FD4] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </Link>
          ))
        )}
      </div>
    </section>
  );
}
