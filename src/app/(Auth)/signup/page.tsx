"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import TextField from "@/components/ui/TextField";
import PasswordField from "@/components/ui/PasswordField";
import { GoogleIcon, GithubIcon } from "@/components/auth/icons";
import AuthFeedbackModal from "@/components/ui/AuthFeedbackModal";
import { signupUser, startOAuth, type OAuthProvider } from "@/app/lib/api";

function getOAuthErrorMessage(code: string | null): string | null {
  if (!code) return null;
  switch (code) {
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

type SignupFormState = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  agree: boolean;
};

type FormErrors = {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  agree?: string;
};

const initialForm: SignupFormState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  agree: false,
};

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorCode = searchParams.get("error");

  const [form, setForm] = useState<SignupFormState>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState<string | null>(() =>
    getOAuthErrorMessage(errorCode)
  );
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [oauthLoading, setOauthLoading] = useState<OAuthProvider | null>(null);

  function handleOAuth(provider: OAuthProvider) {
    setOauthLoading(provider);

    try {
      const rawRedirect = searchParams.get("redirect");
      if (
        rawRedirect &&
        rawRedirect.startsWith("/") &&
        !rawRedirect.startsWith("//")
      ) {
        sessionStorage.setItem("sig_oauth_redirect", rawRedirect);
      }
    } catch {
      // Ignore sessionStorage access errors
    }

    startOAuth(provider);
  }

  function updateField<K extends keyof SignupFormState>(key: K, value: SignupFormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
    if (serverError) {
      setServerError(null);
    }
  }

  function validate(): boolean {
    const newErrors: FormErrors = {};

    if (!form.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email.trim())) {
        newErrors.email = "Please enter a valid email address";
      }
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    } else if (!/[A-Z]/.test(form.password)) {
      newErrors.password = "Password must contain at least one uppercase letter";
    } else if (!/[a-z]/.test(form.password)) {
      newErrors.password = "Password must contain at least one lowercase letter";
    } else if (!/[0-9]/.test(form.password)) {
      newErrors.password = "Password must contain at least one number";
    } else if (!/[^A-Za-z0-9]/.test(form.password)) {
      newErrors.password =
        "Password must contain at least one special character (!@#$%^&* etc.)";
    }

    if (!form.agree) {
      newErrors.agree = "You must agree to the Terms & Policy to continue";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError(null);

    if (!validate()) {
      return;
    }

    setIsLoading(true);

    try {
      const targetEmail = form.email.trim().toLowerCase();
      await signupUser({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim() || undefined,
        email: targetEmail,
        password: form.password,
      });

      setRegisteredEmail(targetEmail);
      setShowSuccessModal(true);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to create account. Please try again.";
      setServerError(message);

      if (message.toLowerCase().includes("already exists")) {
        setErrors((prev) => ({
          ...prev,
          email: "An account with this email already exists",
        }));
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex w-full max-w-[496px] flex-col gap-5 sm:gap-6">
      {/* Verification Email Sent Modal */}
      <AuthFeedbackModal
        isOpen={showSuccessModal}
        onClose={() => router.push("/login")}
        icon="mail"
        badge="VERIFICATION EMAIL SENT"
        title="Check Your Inbox"
        description={
          <>
            We&apos;ve sent a verification link to{" "}
            <span className="font-semibold text-brand-dark">{registeredEmail}</span>.
            Please verify your email address to complete your registration. The link is
            valid for 24 hours.
          </>
        }
        primaryAction={{
          label: "Proceed to Log In",
          onClick: () => router.push("/login"),
        }}
        secondaryAction={{
          label: "Didn't receive it? Verify or Resend",
          href: `/verify?email=${encodeURIComponent(registeredEmail)}`,
        }}
      />

      <div className="text-center">
        <h1 className="text-brand-gradient font-heading text-[26px] font-semibold leading-tight sm:text-[32px]">
          Create Your Account
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Create professional email signatures in minutes.
        </p>
      </div>

      {/* Social login buttons */}
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

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5" noValidate>
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

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField
            label="First Name"
            name="firstName"
            placeholder="Enter first name"
            value={form.firstName}
            error={errors.firstName}
            disabled={isLoading}
            onChange={(e) => updateField("firstName", e.target.value)}
          />
          <TextField
            label="Last Name"
            name="lastName"
            placeholder="Enter last name"
            value={form.lastName}
            error={errors.lastName}
            disabled={isLoading}
            onChange={(e) => updateField("lastName", e.target.value)}
          />
        </div>

        <TextField
          label="Email"
          name="email"
          type="email"
          placeholder="Enter your email address"
          value={form.email}
          error={errors.email}
          disabled={isLoading}
          onChange={(e) => updateField("email", e.target.value)}
        />

        <div>
          <PasswordField
            label="Password"
            name="password"
            placeholder="Enter your password"
            value={form.password}
            error={errors.password}
            disabled={isLoading}
            onChange={(e) => updateField("password", e.target.value)}
          />
          <p className="mt-1.5 text-xs text-slate-500">
            Must be at least 8 characters with 1 uppercase, 1 lowercase, 1 number, and 1 special character.
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <label className="flex items-center gap-2 text-sm text-slate-800">
            <input
              type="checkbox"
              checked={form.agree}
              disabled={isLoading}
              onChange={(e) => updateField("agree", e.target.checked)}
              className="h-4 w-4 rounded border-line accent-brand disabled:cursor-not-allowed"
            />
            <span>
              I agree with the <Link href="#" className="underline">Terms &amp; Policy</Link>
            </span>
          </label>
          {errors.agree && <p className="text-sm text-red-600">{errors.agree}</p>}
        </div>

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
              <span>Creating Account...</span>
            </>
          ) : (
            "Get Started"
          )}
        </button>
      </form>

      <p className="text-center text-sm text-[#6889C9]">
        Already have an account?{" "}
        <Link href="/login" className="font-bold text-brand-dark">Log In</Link>
      </p>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center text-slate-500">
          Loading signup...
        </div>
      }
    >
      <SignupForm />
    </Suspense>
  );
}