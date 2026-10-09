import Link from "next/link";
import EmailVerificationTemplatePage from "./email-verification/page";
import PasswordResetTemplatePage from "./password-reset/page";

export default function TemplatesOverviewPage() {
  return (
    <div className="min-h-screen bg-slate-200 py-10 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center">
          <h1 className="font-heading text-3xl font-bold text-brand-dark">
            Email &amp; Notification Templates
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Preview of transaction email notification cards as designed in Figma.
          </p>
          <div className="mt-4 flex justify-center gap-4 text-sm">
            <Link
              href="/login"
              className="font-semibold text-brand underline hover:text-brand-dark"
            >
              Back to Login
            </Link>
            <span className="text-slate-400">|</span>
            <Link
              href="/forgot"
              className="font-semibold text-brand underline hover:text-brand-dark"
            >
              Back to Forgot Password
            </Link>
            <span className="text-slate-400">|</span>
            <Link
              href="/verify"
              className="font-semibold text-brand underline hover:text-brand-dark"
            >
              Back to Verify Email
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* Email Verification Template Column */}
          <div className="flex flex-col items-center">
            <span className="mb-3 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-brand">
              Email Template (Verification)
            </span>
            <div className="w-full">
              <EmailVerificationTemplatePage />
            </div>
          </div>

          {/* Password Reset Template Column */}
          <div className="flex flex-col items-center">
            <span className="mb-3 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-brand">
              Pass Template (Password Reset)
            </span>
            <div className="w-full">
              <PasswordResetTemplatePage />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
