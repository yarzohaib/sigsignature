"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import PasswordField from "@/components/ui/PasswordField";
import AuthFeedbackModal from "@/components/ui/AuthFeedbackModal";
import { resetPassword, validateResetToken } from "@/app/lib/api";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [token] = useState(() => searchParams.get("token")?.trim() || "");

  const [isValidatingToken, setIsValidatingToken] = useState(() => Boolean(token));
  const [tokenError, setTokenError] = useState<string | null>(null);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{
    newPassword?: string;
    confirmPassword?: string;
  }>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [isLoading, setIsLoading] = useState(false);

  // Validate token on mount before displaying the form
  useEffect(() => {
    if (!token) return;

    let isMounted = true;
    validateResetToken(token)
      .then(() => {
        if (isMounted) {
          setIsValidatingToken(false);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          const message =
            err instanceof Error ? err.message : "Invalid or expired reset token";
          setTokenError(message);
          setIsValidatingToken(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [token]);

  // Sanitize address bar & browser history once validated or when an error occurs so raw token is wiped
  useEffect(() => {
    if (token && typeof window !== "undefined" && window.location.search) {
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, [token]);

  // Handle 3-second redirect countdown to /login upon successful password reset
  useEffect(() => {
    if (!isSuccessModalOpen) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/login?reset=success");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isSuccessModalOpen, router]);

  function validate(): boolean {
    const nextErrors: typeof errors = {};

    if (!newPassword) {
      nextErrors.newPassword = "Password is required";
    } else if (newPassword.length < 8) {
      nextErrors.newPassword = "Password must be at least 8 characters long";
    } else if (!/[A-Z]/.test(newPassword)) {
      nextErrors.newPassword = "Password must contain at least one uppercase letter";
    } else if (!/[a-z]/.test(newPassword)) {
      nextErrors.newPassword = "Password must contain at least one lowercase letter";
    } else if (!/[0-9]/.test(newPassword)) {
      nextErrors.newPassword = "Password must contain at least one number";
    } else if (!/[^A-Za-z0-9]/.test(newPassword)) {
      nextErrors.newPassword =
        "Password must contain at least one special character (!@#$%^&* etc.)";
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword = "Please confirm your password";
    } else if (confirmPassword !== newPassword) {
      nextErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError(null);

    if (!validate()) {
      return;
    }

    setIsLoading(true);

    try {
      await resetPassword({
        token,
        newPassword,
      });

      setIsSuccessModalOpen(true);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to reset password. The reset link may have expired.";
      setServerError(message);
    } finally {
      setIsLoading(false);
    }
  }

  // If no token in URL, prompt user to request one from /forgot-password
  if (!token) {
    return (
      <div className="flex w-full max-w-[496px] flex-col items-center justify-center gap-5 rounded-2xl border border-slate-200/80 bg-white p-8 sm:p-10 text-center shadow-xs">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
          <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <div className="space-y-1.5">
          <h1 className="text-brand-gradient font-heading text-[24px] font-semibold sm:text-[28px]">
            Reset Link Required
          </h1>
          <p className="text-sm text-slate-600 max-w-sm">
            Password reset links are sent directly to your email for security. Please check your inbox and click the reset button, or request a new link below.
          </p>
        </div>
        <Link
          href="/forgot-password"
          className="bg-brand-gradient flex h-12 w-full items-center justify-center rounded-xl font-body text-base font-semibold text-white shadow-xs transition hover:opacity-95 sm:h-14 sm:text-lg mt-2"
        >
          Request Reset Link
        </Link>
        <Link href="/login" className="text-xs font-semibold text-brand hover:underline">
          Return to Log In
        </Link>
      </div>
    );
  }

  // Loading state while validating token on mount
  if (isValidatingToken) {
    return (
      <div className="flex w-full max-w-[496px] flex-col items-center justify-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-8 sm:p-12 text-center shadow-xs">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-[#245FD4]">
          <svg className="h-6 w-6 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
        <p className="text-sm font-medium text-slate-600">
          Validating reset link...
        </p>
      </div>
    );
  }

  // If token is invalid or expired upfront, block active input fields and show expired error state
  if (tokenError) {
    return (
      <div className="flex w-full max-w-[496px] flex-col items-center justify-center gap-5 rounded-2xl border border-red-200/80 bg-white p-8 sm:p-10 text-center shadow-xs">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
          <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <div className="space-y-1.5">
          <h1 className="text-brand-gradient font-heading text-[24px] font-semibold sm:text-[28px]">
            Invalid or Expired Link
          </h1>
          <p className="text-sm text-slate-600 max-w-sm">
            {tokenError.includes("expired") || tokenError.includes("Invalid")
              ? "This password reset link has expired or has already been used. For your security, reset links are single-use only."
              : tokenError}
          </p>
        </div>
        <Link
          href="/forgot-password"
          className="bg-brand-gradient flex h-12 w-full items-center justify-center rounded-xl font-body text-base font-semibold text-white shadow-xs transition hover:opacity-95 sm:h-14 sm:text-lg mt-2"
        >
          Request a new password reset link
        </Link>
        <Link href="/login" className="text-xs font-semibold text-brand hover:underline">
          Return to Log In
        </Link>
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-[496px] flex-col gap-5 sm:gap-6">
      {/* Feedback Modal */}
      <AuthFeedbackModal
        isOpen={isSuccessModalOpen}
        onClose={() => router.push("/login?reset=success")}
        showCloseButton={false}
        icon="check"
        badge="SUCCESS"
        title="Password Reset Complete!"
        description={
          <div className="space-y-2">
            <p>
              Your password has been successfully updated. You can now securely log in to your account with your new credentials.
            </p>
            <p className="text-xs font-medium text-slate-500">
              Redirecting to log in in {countdown} {countdown === 1 ? "second" : "seconds"}...
            </p>
          </div>
        }
        primaryAction={{
          label: "Proceed to Log In",
          onClick: () => router.push("/login?reset=success"),
        }}
      />

      {/* Heading */}
      <div className="text-center">
        <h1 className="text-brand-gradient font-heading text-[26px] font-semibold leading-tight sm:text-[32px]">
          Create New Password
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Enter a new password to securely access your Sig Signature account.
        </p>
      </div>

      {/* Error banner */}
      {serverError && (
        <div
          role="alert"
          className="flex flex-col gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-800"
        >
          <div className="flex items-center gap-2">
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
          <Link href="/forgot-password" className="text-xs font-semibold text-brand underline ml-7">
            Request a new password reset link
          </Link>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5" noValidate>
        <div>
          <PasswordField
            label="New Password"
            name="newPassword"
            placeholder="Enter your new password"
            value={newPassword}
            error={errors.newPassword}
            disabled={isLoading}
            onChange={(e) => {
              setNewPassword(e.target.value);
              if (errors.newPassword) {
                setErrors((prev) => ({ ...prev, newPassword: undefined }));
              }
            }}
          />
          <p className="mt-1.5 text-xs text-slate-500">
            Must be at least 8 characters with 1 uppercase, 1 lowercase, 1 number, and 1 special character.
          </p>
        </div>

        <PasswordField
          label="Confirm New Password"
          name="confirmPassword"
          placeholder="Confirm your new password"
          value={confirmPassword}
          error={errors.confirmPassword}
          disabled={isLoading}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            if (errors.confirmPassword) {
              setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
            }
          }}
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
              <span>Updating Password...</span>
            </>
          ) : (
            "Reset Password"
          )}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center text-slate-500">
          Loading reset form...
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
