"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import TextField from "@/components/ui/TextField";
import AuthFeedbackModal from "@/components/ui/AuthFeedbackModal";
import { requestEmailVerification, verifyEmailWithToken } from "@/app/lib/api";

type VerificationState = "verifying" | "success" | "error" | "resend";

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const initialEmail = searchParams.get("email") || "";

  const [state, setState] = useState<VerificationState>(() => (token ? "verifying" : "resend"));
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [email, setEmail] = useState(initialEmail);
  const [emailError, setEmailError] = useState<string | undefined>(undefined);
  const [isSendingLink, setIsSendingLink] = useState(false);
  const [modalConfig, setModalConfig] = useState<{
    icon: "mail" | "check";
    badge: string;
    title: string;
    description: React.ReactNode;
    primaryAction: { label: string; href?: string; onClick?: () => void };
  } | null>(null);

  // Auto-verify as soon as the user arrives with a token in the URL
  useEffect(() => {
    if (!token) return;

    const activeToken = token.trim();
    if (!activeToken) return;

    // Immediately sanitize address bar & browser history so the raw token is completely wiped from view
    if (typeof window !== "undefined" && window.location.search) {
      window.history.replaceState(null, "", window.location.pathname);
    }

    let isCancelled = false;

    async function autoVerify() {
      setState("verifying");
      try {
        await verifyEmailWithToken(activeToken);
        if (!isCancelled) {
          setState("success");
        }
      } catch (err: unknown) {
        if (!isCancelled) {
          const message =
            err instanceof Error
              ? err.message
              : "This verification link is invalid or has expired.";
          setErrorMessage(message);
          setState("error");
        }
      }
    }

    autoVerify();

    return () => {
      isCancelled = true;
    };
  }, [token]);

  async function handleResend(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEmailError(undefined);

    const trimmed = email.trim();
    if (!trimmed) {
      setEmailError("Email is required");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    setIsSendingLink(true);
    try {
      await requestEmailVerification(trimmed.toLowerCase());
      setModalConfig({
        icon: "mail",
        badge: "VERIFICATION LINK SENT",
        title: "Check Your Inbox",
        description: (
          <>
            A fresh verification link has been sent to{" "}
            <span className="font-semibold text-brand-dark">{trimmed}</span>.
            Please check your inbox and click the verification button to activate your account.
          </>
        ),
        primaryAction: {
          label: "Proceed to Log In",
          onClick: () => router.push("/login"),
        },
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to send verification link.";
      setEmailError(message);
    } finally {
      setIsSendingLink(false);
    }
  }

  // 1. Loading / Auto-verifying state
  if (state === "verifying") {
    return (
      <div className="flex w-full max-w-[496px] flex-col items-center justify-center gap-5 rounded-2xl border border-slate-200/80 bg-white p-8 sm:p-10 text-center shadow-xs">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-[#245FD4]">
          <svg
            className="h-8 w-8 animate-spin text-[#245FD4]"
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
        </div>
        <div className="space-y-1.5">
          <h1 className="text-brand-gradient font-heading text-[24px] font-semibold sm:text-[28px]">
            Verifying Your Email
          </h1>
          <p className="text-sm text-slate-600">
            Please wait while we automatically confirm your verification link...
          </p>
        </div>
      </div>
    );
  }

  // 2. Success state
  if (state === "success") {
    return (
      <div className="flex w-full max-w-[496px] flex-col items-center justify-center gap-5 rounded-2xl border border-emerald-200/80 bg-white p-8 sm:p-10 text-center shadow-xs animate-in fade-in duration-300">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
          <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <div className="space-y-1.5">
          <span className="font-heading text-xs font-bold uppercase tracking-wider text-emerald-700">
            EMAIL VERIFIED
          </span>
          <h1 className="text-brand-gradient font-heading text-[24px] font-semibold sm:text-[28px]">
            Email Verified Successfully!
          </h1>
          <p className="text-sm text-slate-600 max-w-sm">
            Your account is now activated. You can sign in and start designing deliverable email signatures.
          </p>
        </div>
        <Link
          href="/login"
          className="bg-brand-gradient flex h-12 w-full items-center justify-center rounded-xl font-body text-base font-semibold text-white shadow-xs transition hover:opacity-95 sm:h-14 sm:text-lg mt-2"
        >
          Proceed to Log In
        </Link>
      </div>
    );
  }

  // 3. Error or Resend link state
  return (
    <div className="flex w-full max-w-[496px] flex-col gap-5 sm:gap-6">
      {modalConfig && (
        <AuthFeedbackModal
          isOpen={Boolean(modalConfig)}
          onClose={() => setModalConfig(null)}
          icon={modalConfig.icon}
          badge={modalConfig.badge}
          title={modalConfig.title}
          description={modalConfig.description}
          primaryAction={modalConfig.primaryAction}
        />
      )}

      {/* Heading */}
      <div className="text-center">
        <h1 className="text-brand-gradient font-heading text-[26px] font-semibold leading-tight sm:text-[32px]">
          {state === "error" ? "Verification Link Expired" : "Verify Your Email"}
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          {state === "error"
            ? "This verification link is invalid or has expired. Enter your email below to receive a new link."
            : "Enter your email address to receive a secure verification link."}
        </p>
      </div>

      {/* Error alert if token failed */}
      {state === "error" && errorMessage && (
        <div
          role="alert"
          className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900"
        >
          <svg className="h-5 w-5 shrink-0 text-amber-600" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Resend verification link form */}
      <form onSubmit={handleResend} className="flex flex-col gap-4 sm:gap-5" noValidate>
        <div>
          <TextField
            label="Email Address"
            name="email"
            type="email"
            placeholder="Enter your email address"
            value={email}
            error={emailError}
            disabled={isSendingLink}
            onChange={(e) => {
              setEmail(e.target.value);
              if (emailError) setEmailError(undefined);
            }}
          />
          <div className="mt-2 flex justify-between text-xs">
            <Link href="/login" className="font-semibold text-brand hover:underline">
              Already verified? Log In
            </Link>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSendingLink}
          className="bg-brand-gradient flex h-12 w-full items-center justify-center gap-2 rounded-xl font-body text-base font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70 sm:h-14 sm:text-lg"
        >
          {isSendingLink ? (
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
            "Resend Verification Link"
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
