"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { exchangeOAuthCode } from "@/app/lib/api";
import { setAuthSession } from "@/app/lib/auth";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const exchangedRef = useRef(false);

  useEffect(() => {
    // If no code is present in query parameters, redirect to /login
    if (!code) {
      router.replace("/login");
      return;
    }

    // In React 19 strict mode, effects run twice in development.
    // The OAuth exchange code is single-use, so guard with a ref.
    if (exchangedRef.current) {
      return;
    }
    exchangedRef.current = true;

    async function handleExchange() {
      try {
        const response = await exchangeOAuthCode(code!);

        if (!response.data?.tokens || !response.data?.user) {
          throw new Error(
            response.message || "Failed to exchange authorization code."
          );
        }

        setAuthSession(response.data.tokens, response.data.user);

        // Read and clear the stored redirect target
        let redirectTarget = "/dashboard";
        try {
          const savedTarget = sessionStorage.getItem("sig_oauth_redirect");
          sessionStorage.removeItem("sig_oauth_redirect");
          if (
            savedTarget &&
            savedTarget.startsWith("/") &&
            !savedTarget.startsWith("//")
          ) {
            redirectTarget = savedTarget;
          }
        } catch {
          // Ignore sessionStorage access errors
        }

        router.replace(redirectTarget);
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : "Something went wrong while signing in. Please try again.";
        setErrorMessage(message);
      }
    }

    handleExchange();
  }, [code, router]);

  if (errorMessage) {
    return (
      <div className="flex w-full max-w-[440px] flex-col items-center justify-center rounded-2xl border border-line bg-white p-8 text-center shadow-xs">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
          <svg
            className="h-6 w-6"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <h2 className="mt-4 text-xl font-bold text-brand-dark">
          Authentication Failed
        </h2>
        <p className="mt-2 text-sm text-slate-600">{errorMessage}</p>
        <div className="mt-6 w-full">
          <Link
            href="/login"
            className="bg-brand-gradient flex h-12 w-full items-center justify-center rounded-xl font-body text-base font-semibold text-white transition hover:opacity-90"
          >
            Back to Log In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-[440px] flex-col items-center justify-center rounded-2xl border border-line bg-white p-8 text-center shadow-xs">
      <svg
        className="h-10 w-10 animate-spin text-brand"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      <h2 className="mt-4 text-xl font-bold text-brand-dark">Signing you in</h2>
      <p className="mt-2 text-sm text-slate-600">
        Please wait while we set up your session...
      </p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex w-full max-w-[440px] flex-col items-center justify-center rounded-2xl border border-line bg-white p-8 text-center shadow-xs">
          <svg
            className="h-10 w-10 animate-spin text-brand"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <h2 className="mt-4 text-xl font-bold text-brand-dark">
            Signing you in
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Please wait while we set up your session...
          </p>
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
