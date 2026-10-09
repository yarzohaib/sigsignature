"use client";

import { useState } from "react";
import Link from "next/link";
import SectionBadge from "./SectionBadge";

type TemplateType = "minimal" | "execute" | "compact";

export default function SolutionSection() {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>("minimal");

  return (
    <section className="bg-[#FCFCFC] py-16 sm:py-24">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Centered Section Badge at the top */}
        <div className="mb-12 flex justify-center sm:mb-16">
          <SectionBadge label="SOLUTION" />
        </div>

        {/* 2-Column Content */}
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Left Column: Signature Preview Card (No Shadow, clean rounded border) */}
          <div className="lg:col-span-7">
            <div className="rounded-[30px] border border-[#C1C1C1]/80 bg-white p-6 shadow-none sm:rounded-[39px] sm:p-8">
              {/* Header row with Avatar & Status */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand font-heading text-lg font-bold text-white shadow-none">
                    SN
                  </div>
                  <div>
                    <h4 className="font-heading text-lg font-semibold text-slate-900">
                      Satya Nadella
                    </h4>
                    <p className="font-body text-xs text-[#878787] sm:text-sm">
                      Head of Microsoft · CEO
                    </p>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  Active
                </span>
              </div>

              {/* Details row */}
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-2 text-xs text-slate-600 sm:text-sm">
                  <svg
                    className="h-4 w-4 shrink-0 text-brand"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                    />
                  </svg>
                  <span>satya@gmail.com</span>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-600 sm:text-sm">
                  <svg
                    className="h-4 w-4 shrink-0 text-brand"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                    />
                  </svg>
                  <span>+1 555 983 1279</span>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-600 sm:col-span-2 sm:text-sm">
                  <svg
                    className="h-4 w-4 shrink-0 text-brand"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918"
                    />
                  </svg>
                  <span>www.microsoft.com</span>
                </div>
              </div>

              {/* Social icons row */}
              <div className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-4">
                <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-brand">
                  Book a call &gt;
                </span>
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-700">
                  in
                </span>
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-700">
                  𝕏
                </span>
              </div>

              {/* Template Tab Selector Pills: Minimal, Execute, Compact */}
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedTemplate("minimal")}
                  className={`rounded-xl px-5 py-2.5 font-body text-xs font-semibold transition-all sm:text-sm ${
                    selectedTemplate === "minimal"
                      ? "bg-brand text-white shadow-none"
                      : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  Minimal
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTemplate("execute")}
                  className={`rounded-xl px-5 py-2.5 font-body text-xs font-semibold transition-all sm:text-sm ${
                    selectedTemplate === "execute"
                      ? "bg-brand text-white shadow-none"
                      : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  Execute
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTemplate("compact")}
                  className={`rounded-xl px-5 py-2.5 font-body text-xs font-semibold transition-all sm:text-sm ${
                    selectedTemplate === "compact"
                      ? "bg-brand text-white shadow-none"
                      : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  Compact
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Left-aligned Heading (NOT centered) & Checklist */}
          <div className="flex flex-col items-start text-left lg:col-span-5">
            <h2 className="font-heading text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl lg:text-[50px] lg:leading-[1.12]">
              There&apos;s a <span className="text-brand">Better Way.</span>
            </h2>

            <p className="font-body mt-5 text-base leading-relaxed text-[#878787] sm:text-lg">
              Sig Signature is a self-service email signature builder that lets
              anyone from freelancers to entire teams.
            </p>

            <ul className="mt-6 space-y-4">
              <li className="flex items-center gap-3 font-body text-sm font-medium text-slate-800 sm:text-base">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-brand">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                </span>
                <span>Start with a template</span>
              </li>
              <li className="flex items-center gap-3 font-body text-sm font-medium text-slate-800 sm:text-base">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-brand">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                </span>
                <span>Build from scratch</span>
              </li>
              <li className="flex items-center gap-3 font-body text-sm font-medium text-slate-800 sm:text-base">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-brand">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                </span>
                <span>Create professional signature in minutes</span>
              </li>
            </ul>

            <div className="mt-8">
              <Link
                href="/signup"
                className="group inline-flex items-center gap-2.5 rounded-full bg-brand px-6 py-3 font-body text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark hover:shadow-md"
              >
                <span>Try the Editor</span>
                <svg
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
