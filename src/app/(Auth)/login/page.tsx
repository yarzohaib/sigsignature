"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import TextField from "@/components/ui/TextField";
import PasswordField from "@/components/ui/PasswordField";
import { GoogleIcon, GithubIcon } from "@/components/auth/icons";
import { loginUser, startOAuth, type OAuthProvider } from "@/app/lib/api";
import { setAuthSession } from "@/app/lib/auth";

function getOAuthErrorMessage(code: string | null): string | null {
  if (!code) return null;
  switch (code) {
    case "access_denied":
    case "user_cancelled":
    case "cancelled":
    case "oauth_cancelled":
      return "Sign in was cancelled. Please try again.";
    case "oauth_failed":
      return "Something went wrong while signing in. Please try again.";
    case "email_not_verified":
      return "Your account does not have a verified email address, so we cannot sign you in with it.";
    case "account_inactive":
      return "Your account is inactive. Please contact support.";
    default:
      return "Something went wrong while signing in. Please try again.";
  }
}

type LoginFormErrors = {
  email?: string;
  password?: string;
};

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorCode = searchParams.get("error");
  const redirectTarget = searchParams.get("redirect") || "/dashboard";

  const isVerified = searchParams.get("verified") === "true";
  const initialEmailParam = searchParams.get("email") || "";

  const [email, setEmail] = useState(initialEmailParam);
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [serverError, setServerError] = useState<string | null>(() =>
    getOAuthErrorMessage(errorCode)
  );
  const [lockoutCountdown, setLockoutCountdown] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<OAuthProvider | null>(null);

  // Active countdown timer for rate limit lockout
  useEffect(() => {
    if (lockoutCountdown === null || lockoutCountdown <= 0) return;

    const timer = setInterval(() => {
      setLockoutCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          setServerError("Lockout window has ended. You may try logging in again.");
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [lockoutCountdown]);

  function formatCountdown(totalSec: number) {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    if (mins > 0) {
      return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
    }
    return `${secs}s`;
  }

  // If error query param changes, adjust state directly during render (React pattern)
  const [prevErrorCode, setPrevErrorCode] = useState(errorCode);
  if (errorCode !== prevErrorCode) {
    setPrevErrorCode(errorCode);
    setServerError(getOAuthErrorMessage(errorCode));
    setOauthLoading(null);
    setIsLoading(false);
  }

  // Reset button loading state on pageshow (e.g. Back/Forward cache restoration)
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });

    function handlePageShow() {
      setOauthLoading(null);
      setIsLoading(false);
    }

    window.addEventListener("pageshow", handlePageShow);
    return () => {
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, []);

  // Handle redirect back to signup if OAuth was originally initiated from signup
  useEffect(() => {
    if (errorCode) {
      try {
        const source = sessionStorage.getItem("sig_oauth_source");
        if (source === "signup") {
          sessionStorage.removeItem("sig_oauth_source");
          router.replace(`/signup?error=${encodeURIComponent(errorCode)}`);
        }
      } catch {
        // Ignore sessionStorage access errors
      }
    }
  }, [errorCode, router]);

  async function handleOAuth(provider: OAuthProvider) {
    try {
      setIsLoading(true);
      setOauthLoading(provider);
      setServerError(null);

      try {
        const rawRedirect = searchParams.get("redirect");
        if (
          rawRedirect &&
          rawRedirect.startsWith("/") &&
          !rawRedirect.startsWith("//")
        ) {
          sessionStorage.setItem("sig_oauth_redirect", rawRedirect);
        }
        sessionStorage.setItem("sig_oauth_source", "login");
      } catch {
        // Ignore sessionStorage access errors
      }

      await startOAuth(provider, {
        onPopupClosed: () => {
          setOauthLoading(null);
          setIsLoading(false);
        },
        onError: (err) => {
          setServerError(getOAuthErrorMessage(err));
          setOauthLoading(null);
          setIsLoading(false);
        },
        onSuccess: (target) => {
          try {
            sessionStorage.setItem(
              "sig_flash_toast",
              "Successfully logged in! Welcome back."
            );
          } catch {
            // Ignore sessionStorage access errors
          }
          router.push(target || redirectTarget);
          router.refresh();
        },
      });
    } catch (err: unknown) {
      setOauthLoading(null);
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong while signing in. Please try again.";
      setServerError(message);
    } finally {
      setIsLoading(false);
    }
  }

  function handleEmailChange(val: string) {
    setEmail(val);
    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
    if (serverError && !lockoutCountdown) setServerError(null);
  }

  function handlePasswordChange(val: string) {
    setPassword(val);
    if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
    if (serverError && !lockoutCountdown) setServerError(null);
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
    if (!lockoutCountdown) {
      setServerError(null);
    }

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

        try {
          sessionStorage.setItem(
            "sig_flash_toast",
            "Successfully logged in! Welcome back."
          );
        } catch {
          // Ignore sessionStorage access errors
        }

        router.push(redirectTarget);
        router.refresh();
      } else {
        throw new Error("Invalid response received from server.");
      }
    } catch (err: unknown) {
      const errorObj = err as Error & { status?: number; retryAfterSeconds?: number; code?: string };
      const rawMessage =
        errorObj instanceof Error
          ? errorObj.message
          : "Invalid email or password. Please try again.";

      const isRateLimit =
        errorObj?.status === 429 ||
        rawMessage.includes("Too many requests") ||
        rawMessage.includes("Too many login attempts");

      if (isRateLimit) {
        const seconds =
          typeof errorObj.retryAfterSeconds === "number" && errorObj.retryAfterSeconds > 0
            ? errorObj.retryAfterSeconds
            : 300; // default 5 minutes
        setLockoutCountdown(seconds);
        setServerError(
          `Too many login attempts. Please try again in ${
            seconds >= 60 ? `${Math.ceil(seconds / 60)} minutes` : `${seconds} seconds`
          } or reset your password.`
        );
      } else {
        setLockoutCountdown(null);
        setServerError(rawMessage);
      }
      setIsLoading(false);
    }
  }

  return (
    <div className="flex w-full max-w-[496px] flex-col gap-5 sm:gap-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-brand-gradient font-heading text-[26px] font-semibold leading-tight sm:text-[32px]">
          Log in to Sig Signature
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Welcome back! Log in to access your signatures.
        </p>
      </div>

      {/* Social login buttons (side by side matching signup page) */}
      <div className="mx-auto grid w-full max-w-[432px] grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => handleOAuth("google")}
          disabled={isLoading || oauthLoading !== null}
          className="flex h-12 items-center justify-center gap-2 rounded-xl border border-line bg-white text-sm font-semibold text-brand-dark transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 sm:h-14 sm:text-base"
        >
          {oauthLoading === "google" ? (
            <svg
              className="h-4 w-4 animate-spin text-brand"
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
          ) : (
            <GoogleIcon />
          )}
          <span>Google</span>
        </button>
        <button
          type="button"
          onClick={() => handleOAuth("github")}
          disabled={isLoading || oauthLoading !== null}
          className="flex h-12 items-center justify-center gap-2 rounded-xl border border-line bg-white text-sm font-semibold text-brand-dark transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 sm:h-14 sm:text-base"
        >
          {oauthLoading === "github" ? (
            <svg
              className="h-4 w-4 animate-spin text-brand"
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
          ) : (
            <GithubIcon />
          )}
          <span>Github</span>
        </button>
      </div>

      <div className="flex items-center gap-4 text-sm text-slate-800">
        <span className="h-px flex-1 bg-line" />
        Or
        <span className="h-px flex-1 bg-line" />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5" noValidate>
        {/* Email verified success alert */}
        {isVerified && !serverError && (
          <div
            role="status"
            className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50/80 p-4 text-sm text-emerald-900 shadow-xs"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-emerald-950">Email verified successfully!</p>
              <p className="text-xs text-emerald-800 mt-0.5">Please log in to access your account.</p>
            </div>
          </div>
        )}

        {/* Server error alert */}
        {serverError && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-800"
          >
            <svg
              className="mt-0.5 h-5 w-5 shrink-0 text-red-600"
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
            <div className="flex flex-col gap-1.5 flex-1">
              {lockoutCountdown !== null && lockoutCountdown > 0 ? (
                <span>
                  Too many login attempts. Please try again in{" "}
                  <strong className="font-bold tabular-nums text-red-950">
                    {formatCountdown(lockoutCountdown)}
                  </strong>{" "}
                  or{" "}
                  <Link
                    href={
                      email.trim()
                        ? `/forgot?email=${encodeURIComponent(email.trim())}`
                        : "/forgot"
                    }
                    className="font-bold underline hover:text-red-950 transition-colors"
                  >
                    reset your password
                  </Link>
                  .
                </span>
              ) : serverError.toLowerCase().includes("reset your password") ? (
                <span>
                  {serverError.replace(/or reset your password\.?/i, "or ")}
                  <Link
                    href={
                      email.trim()
                        ? `/forgot?email=${encodeURIComponent(email.trim())}`
                        : "/forgot"
                    }
                    className="font-bold underline hover:text-red-950 transition-colors"
                  >
                    reset your password
                  </Link>
                  .
                </span>
              ) : (
                <span>{serverError}</span>
              )}

              {serverError.toLowerCase().includes("verify") && (
                <Link
                  href={`/verify?email=${encodeURIComponent(email)}`}
                  className="inline-flex items-center gap-1 font-semibold text-brand underline hover:text-brand-dark"
                >
                  Resend verification email &rarr;
                </Link>
              )}
            </div>
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
              <Link
                href="/forgot"
                className="font-normal text-[#022977] underline transition hover:text-brand-dark"
              >
                 Forgot your password? Reset it
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
      <p className="text-center text-sm text-[#6889C9]">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-bold text-brand-dark">
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
