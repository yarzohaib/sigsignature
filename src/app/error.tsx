"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to monitoring service (e.g. Sentry or console in dev)
    console.error("SigSignature runtime error caught by error.tsx boundary:", error);
  }, [error]);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-between overflow-hidden bg-[#F8FAFC] px-4 py-8 sm:px-6 sm:py-12">
      {/* Background Vector Gradients */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-[40%] left-1/2 h-[900px] w-[1400px] -translate-x-1/2 rounded-full blur-[4px] opacity-70"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(36, 95, 212, 0.12) 0%, rgba(248, 250, 252, 0) 70%)",
          }}
        />
        <div
          className="absolute -bottom-[30%] left-1/2 h-[800px] w-[1400px] -translate-x-1/2 rounded-full blur-[4px] opacity-60"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(36, 95, 212, 0.10) 0%, rgba(248, 250, 252, 0) 70%)",
          }}
        />
      </div>

      {/* Header / Logo */}
      <header className="relative z-10 flex w-full justify-center pt-2 sm:pt-4">
        <Link href="/" className="inline-flex items-center gap-2.5 transition hover:opacity-90">
          <Image
            src="/logo.svg"
            alt="Sig Signature logo"
            width={48}
            height={26}
            className="h-8 w-auto sm:h-9"
            priority
          />
          <span className="font-heading text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Sig <span className="text-[#245FD4]">Signature</span>
          </span>
        </Link>
      </header>

      {/* Center Error Content */}
      <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center py-8 max-w-lg">
        {/* Warning Icon Container */}
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 border border-blue-100 shadow-sm text-brand mb-6">
          <svg
            className="h-8 w-8 text-[#245FD4]"
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

        <h1 className="font-heading text-2xl font-bold text-slate-900 sm:text-3xl">
          Something went wrong
        </h1>
        <p className="mt-3 font-body text-sm sm:text-base text-slate-600 leading-relaxed">
          An unexpected issue interrupted this action. You can try refreshing the view or return to the dashboard.
        </p>

        {error.digest && (
          <p className="mt-2 text-xs font-mono text-slate-400 select-all">
            Incident ID: {error.digest}
          </p>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex w-full max-w-[280px] flex-col items-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="flex h-12 w-full items-center justify-center rounded-xl bg-cta-gradient bg-gradient-to-r from-[#245FD4] to-[#022977] font-body text-sm font-semibold text-white shadow-xs transition hover:opacity-95 cursor-pointer"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="flex h-12 w-full items-center justify-center rounded-xl border border-[#C1C1C1]/60 bg-white font-body text-sm font-semibold text-[#1243A3] shadow-2xs transition hover:bg-slate-50"
          >
            Return to Home
          </Link>
        </div>
      </div>

      {/* Footer Copyright */}
      <footer className="relative z-10 pb-2 sm:pb-4 text-center">
        <p className="font-body text-xs sm:text-sm font-normal text-[#878787]">
          &copy; 2026 Sig Signature. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
