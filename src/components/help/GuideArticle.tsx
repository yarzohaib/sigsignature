import React from "react";
import Link from "next/link";
import { DetailedGuide } from "@/lib/guidesData";

interface GuideArticleProps {
  guide: DetailedGuide;
}

export default function GuideArticle({ guide }: GuideArticleProps) {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
      {/* 1. Breadcrumb navigation */}
      <nav aria-label="Breadcrumb" className="mb-4 sm:mb-6">
        <ol className="flex items-center flex-wrap gap-1.5 sm:gap-2 text-xs sm:text-sm text-slate-500 font-body">
          <li>
            <Link
              href="/"
              className="text-slate-500 hover:text-brand transition-colors"
            >
              Home
            </Link>
          </li>
          <li aria-hidden="true" className="text-slate-400">/</li>
          <li>
            <Link
              href="/help"
              className="text-slate-500 hover:text-brand transition-colors"
            >
              Help &amp; Support
            </Link>
          </li>
          <li aria-hidden="true" className="text-slate-400">/</li>
          <li>
            <Link
              href="/help#popular-guides"
              className="text-slate-500 hover:text-brand transition-colors"
            >
              Guides
            </Link>
          </li>
          <li aria-hidden="true" className="text-slate-400">/</li>
          <li className="font-medium text-slate-800 line-clamp-1 max-w-[240px] sm:max-w-none">
            {guide.title}
          </li>
        </ol>
      </nav>

      {/* 2. Main White Container (matches crushsvg style in screenshot) */}
      <article className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 md:p-12 shadow-xs">
        {/* Eyebrow badge */}
        <div className="mb-3">
          <span className="font-heading text-xs font-bold uppercase tracking-wider text-brand">
            {guide.eyebrow}
          </span>
        </div>

        {/* Title */}
        <h1
          className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 leading-[1.2]"
          style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
        >
          {guide.title}
        </h1>

        {/* Subtitle / intro deck */}
        <p className="mt-3 sm:mt-4 text-base sm:text-lg leading-relaxed text-slate-600 font-body">
          {guide.subtitle}
        </p>

        {/* Meta badges: read time, applies to, author */}
        <div className="mt-5 sm:mt-6 flex flex-wrap items-center gap-3 border-y border-slate-100 py-3 sm:py-3.5 text-xs sm:text-sm text-slate-500 font-body">
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>{guide.readTime}</span>
          </div>
          <span className="text-slate-300">•</span>
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
            <span>{guide.appliesTo}</span>
          </div>
          {guide.author && (
            <>
              <span className="text-slate-300">•</span>
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span>{guide.author}</span>
              </div>
            </>
          )}
        </div>

        {/* Overview & Prerequisites */}
        {guide.overview && guide.overview.length > 0 && (
          <div className="mt-8 space-y-3">
            <h2
              className="text-xl sm:text-2xl font-bold text-slate-900"
              style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
            >
              Overview
            </h2>
            {guide.overview.map((para, i) => (
              <p key={i} className="text-base text-slate-700 leading-relaxed font-body">
                {para}
              </p>
            ))}
          </div>
        )}

        {/* Prerequisites box */}
        {guide.prerequisites && guide.prerequisites.length > 0 && (
          <div className="mt-6 rounded-xl border border-blue-100 bg-[#EFF6FF] p-4 sm:p-5">
            <div className="flex items-center gap-2 text-sm font-bold text-brand mb-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              <span>Prerequisites</span>
            </div>
            <ul className="space-y-1.5 text-sm text-slate-700 list-disc list-inside font-body">
              {guide.prerequisites.map((req, i) => (
                <li key={i}>{req}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Dynamic Sections */}
        <div className="mt-10 space-y-10">
          {guide.sections.map((section, secIdx) => (
            <div key={secIdx} className="space-y-4">
              <h2
                className="text-xl sm:text-2xl font-bold text-slate-900"
                style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
              >
                {section.heading}
              </h2>

              {section.subheading && (
                <p className="text-base text-slate-600 font-medium font-body">
                  {section.subheading}
                </p>
              )}

              {/* Paragraphs */}
              {section.paragraphs?.map((p, pIdx) => (
                <p key={pIdx} className="text-base text-slate-700 leading-relaxed font-body">
                  {p}
                </p>
              ))}

              {/* Numbered Steps */}
              {section.steps && section.steps.length > 0 && (
                <div className="space-y-6 mt-4">
                  {section.steps.map((step) => (
                    <div
                      key={step.number}
                      className="rounded-xl border border-slate-200/70 bg-slate-50/50 p-4 sm:p-5 transition hover:border-slate-300"
                    >
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg bg-brand text-white font-bold text-sm shadow-xs">
                          {step.number}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3
                            className="text-base sm:text-lg font-bold text-slate-900"
                            style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                          >
                            {step.title}
                          </h3>
                          <p className="mt-1.5 text-sm sm:text-base text-slate-700 leading-relaxed font-body">
                            {step.description}
                          </p>

                          {step.substeps && step.substeps.length > 0 && (
                            <ul className="mt-2.5 space-y-1.5 text-sm text-slate-600 list-disc list-inside font-body pl-1">
                              {step.substeps.map((sub, subIdx) => (
                                <li key={subIdx} className="leading-relaxed">
                                  {sub}
                                </li>
                              ))}
                            </ul>
                          )}

                          {step.callout && (
                            <div
                              className={`mt-3.5 rounded-lg p-3 text-xs sm:text-sm font-body ${
                                step.callout.type === "warning"
                                  ? "border border-amber-200 bg-amber-50 text-amber-900"
                                  : step.callout.type === "tip"
                                  ? "border border-emerald-200 bg-emerald-50 text-emerald-900"
                                  : "border border-blue-200 bg-blue-50 text-blue-900"
                              }`}
                            >
                              <div className="flex items-start gap-2">
                                <span className="font-bold shrink-0 uppercase tracking-wide text-[11px]">
                                  {step.callout.type}:
                                </span>
                                <span>{step.callout.text}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Code Snippet block */}
              {section.codeSnippet && (
                <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950 p-4 sm:p-5 text-slate-100 font-mono text-xs sm:text-sm overflow-x-auto shadow-inner">
                  <pre className="leading-relaxed whitespace-pre">
                    <code>{section.codeSnippet.code}</code>
                  </pre>
                  {section.codeSnippet.caption && (
                    <p className="mt-3 pt-3 border-t border-slate-800 font-sans text-xs text-slate-400">
                      {section.codeSnippet.caption}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Quality Checklist or Comparison Table */}
        {guide.checklist && (
          <div className="mt-10 space-y-3">
            <h2
              className="text-xl sm:text-2xl font-bold text-slate-900"
              style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
            >
              Diagnostic Checklist &amp; Reference
            </h2>
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-sm font-body border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider font-bold text-slate-700">
                  <tr>
                    {guide.checklist.headers.map((h, i) => (
                      <th key={i} className="px-4 py-3 sm:px-5">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {guide.checklist.rows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-slate-50/60 transition-colors">
                      {row.map((cell, cIdx) => (
                        <td
                          key={cIdx}
                          className={`px-4 py-3 sm:px-5 leading-relaxed ${
                            cIdx === 0
                              ? "font-semibold text-slate-900"
                              : "text-slate-600"
                          }`}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Key Takeaways */}
        {guide.keyTakeaways && guide.keyTakeaways.length > 0 && (
          <div className="mt-10 rounded-xl border border-brand/20 bg-gradient-to-r from-[#EFF6FF] to-white p-5 sm:p-6">
            <h2
              className="text-base sm:text-lg font-bold text-brand uppercase tracking-wide flex items-center gap-2 mb-3"
              style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
            >
              <svg className="w-5 h-5 text-brand shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Key Takeaways</span>
            </h2>
            <ul className="space-y-2 text-sm sm:text-base text-slate-700 list-disc list-inside font-body">
              {guide.keyTakeaways.map((takeaway, i) => (
                <li key={i} className="leading-relaxed">
                  {takeaway}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Back & Next Navigation */}
        <div className="mt-10 pt-6 border-t border-slate-200 flex items-center justify-between flex-wrap gap-4 font-body">
          <Link
            href="/help"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-brand transition"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            <span>Back to Help Center</span>
          </Link>

          <Link
            href="/design-studio"
            className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-brand-dark transition active:scale-98"
          >
            <span>Open Design Studio</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </article>
    </div>
  );
}
