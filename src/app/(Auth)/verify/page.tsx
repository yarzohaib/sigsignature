"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import TextField from "@/components/ui/TextField";
import AuthFeedbackModal from "@/components/ui/AuthFeedbackModal";
import { requestEmailVerification, verifyEmailWithToken } from "@/app/lib/api";
import { getStoredToken, getStoredUser } from "@/app/lib/auth";

type VerificationState = "verifying" | "success" | "error" | "resend";

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Capture initial token & email on mount so URL sanitization or searchParams re-render never wipes it
  const [initialToken] = useState(() => (searchParams.get("token") || searchParams.get("t") || "").trim());
  const initialEmail = (searchParams.get("email") || "").trim();

  const [state, setState] = useState<VerificationState>(() => (initialToken ? "verifying" : "resend"));
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [email, setEmail] = useState(initialEmail);
  const [emailError, setEmailError] = useState<string | undefined>(undefined);
  const [isSendingLink, setIsSendingLink] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [modalConfig, setModalConfig] = useState<{
    icon: "mail" | "check";
    badge: string;
    title: string;
    description: React.ReactNode;
    primaryAction: { label: string; href?: string; onClick?: () => void };
  } | null>(null);

  // Check login state on mount
  useEffect(() => {
    const user = getStoredUser();
    const token = getStoredToken();
    if (user && token) {
      setIsLoggedIn(true);
    }
  }, []);

  // Prevent multiple executions in StrictMode or re-renders
  const hasTriggeredRef = useRef(false);

  // Auto-verify as soon as the user arrives with a token
  useEffect(() => {
    if (!initialToken) {
      setState("resend");
      return;
    }

    if (hasTriggeredRef.current) return;
    hasTriggeredRef.current = true;

    async function autoVerify() {
      setState("verifying");
      try {
        await verifyEmailWithToken(initialToken);
        setState("success");
        // Sanitize the URL only after successful verification completes
        if (typeof window !== "undefined" && window.location.search) {
          window.history.replaceState(null, "", window.location.pathname);
        }
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : "This verification link is invalid or has expired.";
        setErrorMessage(message);
        setState("error");
      }
    }

    autoVerify();
  }, [initialToken]);

  // Automatic countdown & redirect on success
  useEffect(() => {
    if (state !== "success") return;

    const destination = isLoggedIn ? "/dashboard" : "/login";

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          router.push(destination);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [state, isLoggedIn, router]);

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
    const destination = isLoggedIn ? "/dashboard" : "/login";
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
        <div className="w-full space-y-2 mt-2">
          <Link
            href={destination}
            className="bg-brand-gradient flex h-12 w-full items-center justify-center rounded-xl font-body text-base font-semibold text-white shadow-xs transition hover:opacity-95 sm:h-14 sm:text-lg"
          >
            {isLoggedIn ? "Proceed to Dashboard" : "Proceed to Log In"}
          </Link>
          <p className="text-xs text-slate-500">
            Redirecting automatically in {countdown} {countdown === 1 ? "second" : "seconds"}...
          </p>
        </div>
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
          className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-900"
        >
          <svg className="h-5 w-5 shrink-0 text-rose-600 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <div className="flex-1 space-y-1">
            <p className="font-semibold text-rose-900">Verification Link Invalid</p>
            <p className="text-rose-700 text-xs sm:text-sm">{errorMessage}</p>
          </div>
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
            <Link href="/contact" className="text-slate-500 hover:text-brand hover:underline">
              Need help? Contact Support
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
