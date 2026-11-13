"use client";

import React, { useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DetailedGuide } from "@/lib/guidesData";
import { getStoredToken } from "@/app/lib/auth";

function subscribeAuthEvents(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("sig_user_update", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("sig_user_update", callback);
    window.removeEventListener("storage", callback);
  };
}

function getAuthSnapshot(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return Boolean(getStoredToken());
  } catch {
    return false;
  }
}

function getAuthServerSnapshot(): boolean {
  return false;
}

function cleanInlineText(str?: string): string {
  if (!str) return "";
  return str
    .replace(/\s*\(\s*⚙️?\s*\)/gi, "")
    .replace(/\s*\(⚙\)/gi, "")
    .replace(/\s*\(\s*≡\s*\)/gi, "")
    .replace(/≡/g, "")
    .replace(/⚙️?/g, "")
    .replace(/\*\*\*([^*]+)\*\*\*/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/\*/g, "")
    .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\s*->\s*/g, " → ")
    .replace(/\s*-->\s*/g, " → ")
    .replace(/[ \t]+/g, " ")
    .trim();
}

function renderFormattedText(text?: string) {
  if (!text) return null;
  const cleaned = cleanInlineText(text);

  // If text starts with a label followed by colon (e.g. "Monochrome: Icons use..."), bold only the heading label
  const colonMatch = cleaned.match(/^([A-Za-z0-9\s&/()#_-]+:)\s*(.+)$/);
  if (colonMatch) {
    const label = colonMatch[1];
    const rest = colonMatch[2];
    return (
      <>
        <span className="font-semibold text-slate-900">{label}</span>{" "}
        <span className="font-normal text-slate-700">{rest}</span>
      </>
    );
  }

  return <span className="font-normal text-slate-700">{cleaned}</span>;
}

interface GuideArticleProps {
  guide: DetailedGuide;
}

export default function GuideArticle({ guide }: GuideArticleProps) {
  const router = useRouter();
  const isAuthenticated = useSyncExternalStore(
    subscribeAuthEvents,
    getAuthSnapshot,
    getAuthServerSnapshot
  );

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 xl:px-10 2xl:px-12 w-full pb-16">
      <div className="w-full max-w-5xl mx-auto">
        {/* Breadcrumb: Help & Support > Guides > [guide name] */}
      <nav aria-label="Breadcrumb" className="mb-5 sm:mb-6 flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-500 font-body flex-wrap">
        <Link
          href="/help"
          className="hover:text-brand transition flex items-center gap-1.5"
        >
          <span>Help & Support</span>
        </Link>
        <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <polyline points="9 18 15 12 9 6" />
        </svg>
        <Link
          href="/help/guides"
          className="hover:text-brand transition"
        >
          Guides
        </Link>
        <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <polyline points="9 18 15 12 9 6" />
        </svg>
        <span className="text-slate-900 font-semibold truncate max-w-[260px] sm:max-w-md">
          {cleanInlineText(guide.title)}
        </span>
      </nav>

      {/* Main White Container */}
      <article className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 md:p-12 shadow-xs">
        {/* Eyebrow badge */}
        <div className="mb-3">
          <span className="font-heading text-xs font-bold uppercase tracking-wider text-brand">
            {cleanInlineText(guide.eyebrow)}
          </span>
        </div>

        {/* Title */}
        <h1
          className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 leading-[1.2]"
          style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
        >
          {cleanInlineText(guide.title)}
        </h1>

        {/* Subtitle / intro deck */}
        <p className="mt-3 sm:mt-4 text-base sm:text-lg leading-relaxed text-slate-600 font-body">
          {cleanInlineText(guide.subtitle)}
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
          <span className="text-slate-300" aria-hidden="true">&bull;</span>
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
              <span className="text-slate-300" aria-hidden="true">&bull;</span>
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
            <div className="flex items-center gap-2.5 text-base font-semibold text-brand mb-2.5">
              <svg className="w-5 h-5 shrink-0 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Prerequisites</span>
            </div>
            <ul className="space-y-2 text-sm sm:text-[15px] text-slate-700 list-disc list-inside font-body">
              {guide.prerequisites.map((req, i) => (
                <li key={i} className="leading-relaxed font-normal">
                  {renderFormattedText(req)}
                </li>
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

              {/* In-section Table */}
              {section.table && (
                <div className="overflow-x-auto rounded-xl border border-slate-200 mt-4">
                  <table className="w-full text-left text-sm font-body border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider font-bold text-slate-700">
                      <tr>
                        {section.table.headers.map((h, i) => (
                          <th key={i} className="px-4 py-3 sm:px-5">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {section.table.rows.map((row, rIdx) => (
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
              )}

              {/* Step Walkthrough Cards (Number container removed, clean layout) */}
              {section.steps && section.steps.length > 0 && (
                <div className="space-y-4 sm:space-y-5 mt-4">
                  {section.steps.map((step, sIdx) => (
                    <div
                      key={sIdx}
                      className="rounded-xl border border-slate-200/70 bg-slate-50/50 p-4 sm:p-5 transition hover:border-slate-300"
                    >
                      <h3
                        className="text-base sm:text-lg font-bold text-slate-900 leading-snug"
                        style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                      >
                        {cleanInlineText(step.title)}
                      </h3>
                      {step.description && step.description !== step.title && (
                        <p className="mt-1.5 text-sm sm:text-base text-slate-700 leading-relaxed font-body font-normal">
                          {renderFormattedText(step.description)}
                        </p>
                      )}

                      {step.substeps && step.substeps.length > 0 && (
                        <ul className="mt-2.5 space-y-1.5 text-sm text-slate-600 list-disc list-inside font-body pl-1">
                          {step.substeps
                            .filter((sub) => sub && sub !== "---")
                            .map((sub, subIdx) => (
                              <li key={subIdx} className="leading-relaxed font-normal">
                                {renderFormattedText(sub)}
                              </li>
                            ))}
                        </ul>
                      )}

                      {step.callout && (
                        <div
                          className={`mt-3.5 rounded-lg p-3 sm:p-3.5 text-xs sm:text-sm font-body ${
                            step.callout.type === "warning"
                              ? "border border-amber-200 bg-amber-50 text-amber-900"
                              : step.callout.type === "tip"
                              ? "border border-emerald-200 bg-emerald-50 text-emerald-900"
                              : "border border-blue-200 bg-blue-50 text-blue-900"
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            {step.callout.type === "tip" ? (
                              <svg className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.002 6.002 0 00-4-5.659V5a2 2 0 114 0v2.091A6.002 6.002 0 0012 12.75z" />
                              </svg>
                            ) : step.callout.type === "warning" ? (
                              <svg className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                              </svg>
                            ) : (
                              <svg className="h-4 w-4 shrink-0 text-blue-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                              </svg>
                            )}
                            <div className="flex flex-wrap items-baseline gap-1.5 leading-relaxed">
                              <span className="font-bold shrink-0 uppercase tracking-wide text-[11px]">
                                {step.callout.type}:
                              </span>
                              <span>{cleanInlineText(step.callout.text)}</span>
                            </div>
                          </div>
                        </div>
                      )}
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
                <li key={i} className="leading-relaxed font-normal">
                  {renderFormattedText(takeaway)}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Contextual Homepage Link */}
        <div className="mt-8 rounded-xl border border-slate-200/90 bg-[#F8FAFC] p-4 sm:p-5 text-sm text-slate-700 font-body">
          <p className="leading-relaxed">
            Ready to design a clean, responsive sign-off? You can{" "}
            <Link
              href="https://www.sigsignature.com/"
              onClick={(e) => {
                if (isAuthenticated) {
                  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                  e.preventDefault();
                  router.push("/dashboard");
                }
              }}
              className="font-semibold text-brand underline underline-offset-2 hover:text-brand-dark transition"
            >
              create your signature with our free email signature generator
            </Link>
            .
          </p>
        </div>

        {/* Bottom Actions: Back to all guides & Open Design Studio */}
        <div className="mt-10 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 font-body">
          <Link
            href="/help/guides"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-brand transition group"
          >
            <svg
              className="w-4 h-4 transition-transform group-hover:-translate-x-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            <span>Back to All Guides</span>
          </Link>

          <Link
            href="/design-studio"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-brand-dark transition active:scale-98"
          >
            <span>Open Design Studio</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </article>
      </div>
    </div>
  );
}
