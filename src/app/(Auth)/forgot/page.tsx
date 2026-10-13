"use client";

import Link from "next/link";
import { useState } from "react";
import TextField from "@/components/ui/TextField";
import AuthFeedbackModal from "@/components/ui/AuthFeedbackModal";
import { requestForgotPassword } from "@/app/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function handleEmailChange(val: string) {
    setEmail(val);
    if (error) setError(null);
    if (serverError) setServerError(null);
  }

  function validate(): boolean {
    if (!email.trim()) {
      setError("Email is required");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid email address");
      return false;
    }
    return true;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError(null);

    if (!validate()) {
      return;
    }

    setIsLoading(true);

    try {
      await requestForgotPassword(email.trim().toLowerCase());
      setIsModalOpen(true);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to request password reset. Please try again.";
      setServerError(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex w-full max-w-[496px] flex-col gap-5 sm:gap-6">
      {/* Feedback Modal */}
      <AuthFeedbackModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        icon="mail"
        badge="RESET LINK SENT"
        title="Check Your Inbox"
        description={
          <>
            We&apos;ve sent password reset instructions to{" "}
            <span className="font-semibold text-brand-dark">{email}</span>. Please click
            the link in the email to set a new password. The link expires in 30 minutes.
          </>
        }
        primaryAction={{
          label: "Proceed to Log In",
          href: "/login",
        }}
        secondaryAction={{
          label: "Enter Reset Token Manually",
          href: `/reset?email=${encodeURIComponent(email)}`,
        }}
      />

      {/* Heading */}
      <div className="text-center">
        <h1 className="text-brand-gradient font-heading text-[26px] font-semibold leading-tight sm:text-[32px]">
          Forgot Password?
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Enter your email address, and we&apos;ll send you a password reset link
        </p>
      </div>

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
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 sm:gap-6" noValidate>
        <TextField
          label="Email"
          name="email"
          type="email"
          placeholder="Enter your email address"
          value={email}
          error={error || undefined}
          disabled={isLoading}
          onChange={(e) => handleEmailChange(e.target.value)}
        />

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
              <span>Sending Link...</span>
            </>
          ) : (
            "Send Reset Link"
          )}
        </button>
      </form>

      {/* Footer */}
      <p className="text-center text-sm text-slate-600 text-[#6889C9]">
        Remember your password?{" "}
        <Link href="/login" className="font-bold text-brand-dark ">
          Log In
        </Link>
      </p>
    </div>
  );
}
