"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import TextField from "@/components/ui/TextField";
import PasswordField from "@/components/ui/PasswordField";
import { GoogleIcon, GithubIcon } from "@/components/auth/icons";
import { loginUser } from "@/app/lib/api";
import { setAuthSession } from "@/app/lib/auth";

type LoginFormErrors = {
  email?: string;
  password?: string;
};

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered") === "true";
  const redirectTarget = searchParams.get("redirect") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [serverSuccess, setServerSuccess] = useState<string | null>(
    registered ? "Account created successfully! Please log in." : null
  );
  const [isLoading, setIsLoading] = useState(false);

  function handleEmailChange(val: string) {
    setEmail(val);
    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
    if (serverError) setServerError(null);
  }

  function handlePasswordChange(val: string) {
    setPassword(val);
    if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
    if (serverError) setServerError(null);
  }

  function validate(): boolean {
    const nextErrors: LoginFormErrors = {};

    if (!email.trim()) {
      nextErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        nextErrors.email = "Please enter a valid email address";
      }
    }

    if (!password) {
      nextErrors.password = "Password is required";
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
      const response = await loginUser({
        email: email.trim().toLowerCase(),
        password,
      });

      if (response.data?.tokens && response.data?.user) {
        setAuthSession(response.data.tokens, response.data.user);
        setServerSuccess("Login successful! Redirecting to dashboard...");

        // Smooth redirect to protected dashboard
        setTimeout(() => {
          router.push(redirectTarget);
          router.refresh();
        }, 800);
      } else {
        throw new Error("Invalid response received from server.");
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Invalid email or password. Please try again.";
      setServerError(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex w-full max-w-[496px] flex-col gap-5 sm:gap-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-brand-gradient font-heading text-[26px] font-semibold leading-tight sm:text-[32px]">
          Welcome Back!
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Log in to access your signatures.
        </p>
      </div>

      {/* Social login buttons (side by side matching signup page) */}
      <div className="mx-auto grid w-full max-w-[432px] grid-cols-2 gap-3">
        <button
          type="button"
          disabled={isLoading}
          className="flex h-12 items-center justify-center gap-2 rounded-xl border border-line bg-white text-sm font-semibold text-brand-dark transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 sm:h-14 sm:text-base"
        >
          <GoogleIcon /> Google
        </button>
        <button
          type="button"
          disabled={isLoading}
          className="flex h-12 items-center justify-center gap-2 rounded-xl border border-line bg-white text-sm font-semibold text-brand-dark transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 sm:h-14 sm:text-base"
        >
          <GithubIcon /> Github
        </button>
      </div>

      <div className="flex items-center gap-4 text-sm text-slate-800">
        <span className="h-px flex-1 bg-line" />
        Or
        <span className="h-px flex-1 bg-line" />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5" noValidate>
        {/* Registration notice or success alert */}
        {serverSuccess && (
          <div
            role="status"
            className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800"
          >
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
        )}

        {/* Server error alert */}
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

        <TextField
          label="Email"
          name="email"
          type="email"
          placeholder="Enter your email address"
          value={email}
          error={errors.email}
          disabled={isLoading}
          onChange={(e) => handleEmailChange(e.target.value)}
        />

        <div>
          <PasswordField
            label="Password"
            name="password"
            placeholder="Enter your password"
            value={password}
            error={errors.password}
            disabled={isLoading}
            onChange={(e) => handlePasswordChange(e.target.value)}
          />

          <div className="mt-2 text-left">
            <span className="text-sm text-slate-600">
              Forgot your password?{" "}
              <Link
                href="/forgot"
                className="font-semibold text-brand underline transition hover:text-brand-dark"
              >
                Reset it
              </Link>
            </span>
          </div>
        </div>

        {/* Full length Log In button matching Get Started styling */}
        <button
          type="submit"
          disabled={isLoading}
          className="bg-brand-gradient flex h-12 w-full items-center justify-center gap-2 rounded-xl font-body text-base font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70 sm:h-[58px] sm:text-lg"
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
              <span>Logging In...</span>
            </>
          ) : (
            "Log In"
          )}
        </button>
      </form>

      {/* Footer link to Sign Up */}
      <p className="text-center text-sm text-brand">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-bold underline hover:text-brand-dark">
          Sign Up Free
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center text-slate-500">
          Loading login...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
