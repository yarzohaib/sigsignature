"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("SigSignature global layout error caught:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center bg-[#F8FAFC] font-sans text-slate-900 p-6">
        <div className="max-w-md text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 border border-blue-100 text-[#245FD4] mb-6">
            <svg
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Application Error
          </h1>
          <p className="mt-3 text-sm text-slate-600 leading-relaxed">
            A critical error occurred while initializing the application.
          </p>
          {error.digest && (
            <p className="mt-2 text-xs font-mono text-slate-400 select-all">
              Incident ID: {error.digest}
            </p>
          )}
          <div className="mt-8 flex flex-col gap-3">
            <button
              type="button"
              onClick={() => reset()}
              className="flex h-12 w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#245FD4] to-[#022977] text-sm font-semibold text-white shadow-sm hover:opacity-95 cursor-pointer"
            >
              Reload Application
            </button>
            <Link
              href="/"
              className="flex h-12 w-full items-center justify-center rounded-xl border border-slate-300 bg-white text-sm font-semibold text-[#1243A3] shadow-xs hover:bg-slate-50"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
