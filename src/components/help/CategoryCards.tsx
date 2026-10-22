import React from "react";
import Link from "next/link";
import { HELP_CATEGORIES, HelpCategory } from "@/lib/helpData";

function CategoryIcon({ type }: { type: HelpCategory["icon"] }) {
  switch (type) {
    case "rocket":
      return (
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
          <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
          <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
          <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
        </svg>
      );
    case "palette":
      return (
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="13.5" cy="6.5" r=".75" fill="currentColor" />
          <circle cx="17.5" cy="10.5" r=".75" fill="currentColor" />
          <circle cx="8.5" cy="7.5" r=".75" fill="currentColor" />
          <circle cx="6.5" cy="12.5" r=".75" fill="currentColor" />
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.563-2.512 5.563-5.563C21.437 6.082 17.203 2 12 2z" />
        </svg>
      );
    case "code":
      return (
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      );
    case "user":
      return (
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      );
  }
}

export default function CategoryCards() {
  return (
    <section aria-labelledby="help-categories-heading" className="w-full">
      <h2 id="help-categories-heading" className="sr-only">
        Help Categories
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 2xl:gap-6">
        {HELP_CATEGORIES.map((cat) => (
          <Link
            key={cat.slug}
            href={`/help?category=${cat.slug}`}
            className="group flex flex-col justify-between rounded-2xl border border-[#E2E8F0] bg-white p-5 sm:p-6 transition hover:border-[#245FD4]/40 hover:shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#245FD4]"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#245FD4] transition group-hover:scale-105">
                <CategoryIcon type={cat.icon} />
              </div>
              <span
                className="text-xs font-medium text-[#94A3B8]"
                style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
              >
                {cat.guideCount} guides
              </span>
            </div>
            <div className="mt-4">
              <h3
                className="text-base font-bold text-[#1E293B] group-hover:text-[#245FD4] transition-colors"
                style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
              >
                {cat.title}
              </h3>
              <p
                className="mt-1 text-xs sm:text-[13px] text-[#64748B] leading-relaxed"
                style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
              >
                {cat.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
