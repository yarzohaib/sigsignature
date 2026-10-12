"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import TextField from "@/components/ui/TextField";
import { requestEmailVerification, verifyEmailWithToken } from "@/app/lib/api";

function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") || "";
  const initialToken = searchParams.get("token") || "";

  const [email, setEmail] = useState(initialEmail);
  const [token, setToken] = useState(initialToken);
  const [hasTokenMode, setHasTokenMode] = useState(Boolean(initialToken));
  const [errors, setErrors] = useState<{ email?: string; token?: string }>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [serverSuccess, setServerSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  function validate(): boolean {
    const nextErrors: typeof errors = {};

    if (hasTokenMode) {
      if (!token.trim()) {
        nextErrors.token = "Verification token is required";
      }
    } else {
      if (!email.trim()) {
        nextErrors.email = "Email is required";
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
          nextErrors.email = "Please enter a valid email address";
        }
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError(null);
    setServerSuccess(null);

    if (!validate()) {
      return;
    }

    setIsLoading(true);

    try {
      if (hasTokenMode) {
        // Verify with secure token
        const response = await verifyEmailWithToken(token.trim());
        setServerSuccess(
          response.message ||
            "Your email has been successfully verified! You can now log in."
        );
      } else {
        // Request a new verification link
        const response = await requestEmailVerification(email.trim().toLowerCase());
        setServerSuccess(
          response.message ||
            "If an account exists for this email, a verification link has been generated."
        );
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to verify email. Please try again.";
      setServerError(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex w-full max-w-[496px] flex-col gap-5 sm:gap-6">
      {/* Heading */}
      <div className="text-center">
        <h1 className="text-brand-gradient font-heading text-[26px] font-semibold leading-tight sm:text-[32px]">
          Verify Your Email
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          {hasTokenMode
            ? "Submit your secure verification token to activate your account."
            : "Enter your email to receive a secure 24-hour verification link."}
        </p>
      </div>

      {/* Success banner */}
      {serverSuccess && (
        <div
          role="status"
          className="flex flex-col gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800"
        >
          <div className="flex items-center gap-3">
            <svg
              className="h-5 w-5 shrink-0 text-emerald-600"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>{serverSuccess}</span>
          </div>
          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            <Link
              href="/login"
              className="inline-flex items-center gap-1 font-semibold text-emerald-900 underline hover:text-emerald-700"
            >
              Proceed to Log In &rarr;
            </Link>
            <span className="text-emerald-400">|</span>
            <Link
              href="/templates/email-verification"
              className="inline-flex items-center gap-1 font-semibold text-emerald-900 underline hover:text-emerald-700"
            >
              Preview Email Template
            </Link>
          </div>
        </div>
      )}

      {/* Error banner */}
      {serverError && (
        <div
          role="alert"
          className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800"
        >
          <svg
            className="h-5 w-5 shrink-0 text-red-600"
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
          <span>{serverError}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5" noValidate>
        {hasTokenMode ? (
          <div>
            <TextField
              label="Verification Token"
              name="token"
              placeholder="Paste your verification token"
              value={token}
              error={errors.token}
              disabled={isLoading}
              onChange={(e) => {
                setToken(e.target.value);
                if (errors.token) setErrors((prev) => ({ ...prev, token: undefined }));
              }}
            />
            <div className="mt-2 flex justify-between text-xs">
              <button
                type="button"
                onClick={() => setHasTokenMode(false)}
                className="font-semibold text-brand underline"
              >
                Need a new verification link?
              </button>
              <Link href="/login" className="text-slate-500 hover:text-slate-800">
                Log In
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <TextField
              label="Email"
              name="email"
              type="email"
              placeholder="Enter your email address"
              value={email}
              error={errors.email}
              disabled={isLoading}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
              }}
            />
            <div className="mt-2 flex justify-between text-xs">
              <button
                type="button"
                onClick={() => setHasTokenMode(true)}
                className="font-semibold text-brand underline"
              >
                Already have a token?
              </button>
              <span className="text-slate-500 text-[#6889C9]" >
                Didn&apos;t get?{" "}
                <Link href="/login" className="font-semibold text-brand-dark ">
                  Log In
                </Link>
              </span>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="bg-brand-gradient flex h-12 w-full items-center justify-center gap-2 rounded-xl font-body text-base font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70 sm:h-14 sm:text-lg"
        >
          {isLoading ? (
            <>
              <svg
                className="h-5 w-5 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
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
              <span>{hasTokenMode ? "Verifying Token..." : "Sending Link..."}</span>
            </>
          ) : hasTokenMode ? (
            "Verify with Token"
          ) : (
            "Send Verification Link"
          )}
        </button>
      </form>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center text-slate-500">
          Loading verification...
        </div>
      }
    >
      <VerifyEmailForm />
    </Suspense>
  );
}
