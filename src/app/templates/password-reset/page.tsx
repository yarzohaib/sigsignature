import Link from "next/link";
import Logo from "@/components/auth/Logo";

export default function PasswordResetTemplatePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-100 p-4 sm:p-8">
      {/* Navigation bar to switch between screens */}
      <div className="mb-6 flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm">
        <Link
          href="/forgot"
          className="rounded-lg border border-line bg-white px-3 py-1.5 font-semibold text-slate-700 shadow-2xs hover:bg-slate-50"
        >
          &larr; Back to Forgot Password
        </Link>
        <span className="text-slate-400">|</span>
        <Link
          href="/templates/email-verification"
          className="rounded-lg border border-line bg-white px-3 py-1.5 font-semibold text-brand shadow-2xs hover:bg-slate-50"
        >
          View Email Verification Template &rarr;
        </Link>
      </div>

      {/* Email Card Container matching Figma Pass Template */}
      <div className="w-full max-w-[480px] overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-slate-900/5">
        {/* Top Hero with Gradient */}
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-100/60 p-6 sm:p-8">
          <div className="mb-6 flex items-center justify-between">
            <Logo />
          </div>

          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="font-heading text-xl font-bold text-brand-dark sm:text-2xl">
                Reset Your Password Securely.
              </h1>
              <p className="mt-2 text-xs text-slate-600 sm:text-sm">
                We received a request to reset your password.
              </p>
            </div>

            {/* Lock Icon Badge with dots */}
            <div className="flex flex-col items-center gap-1">
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[9px] font-bold text-brand tracking-widest">
                ***
              </span>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-dark text-white shadow-md">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 text-center sm:p-8">
          <h2 className="font-heading text-lg font-bold text-slate-900 sm:text-xl">
            Complete Your Password Reset
          </h2>

          <p className="mt-3 text-xs leading-relaxed text-slate-600 sm:text-sm">
            Hi John,
            <br />
            Need a new password? Click the button below to securely reset your password and regain access to your Sig Signature account.
          </p>

          <div className="mt-6">
            <Link
              href="/reset"
              className="bg-brand-gradient inline-flex h-12 w-full items-center justify-center rounded-xl font-body text-sm font-semibold text-white shadow-sm transition hover:opacity-90 sm:h-14 sm:text-base"
            >
              Reset Password
            </Link>
          </div>

          <p className="mt-4 text-xs text-slate-400">
            This password reset link will expire in 30 minutes.
          </p>

          <p className="mt-2 text-[11px] text-slate-400">
            If you didn&apos;t request this password reset, you can safely ignore this email. Your account will remain secure.
          </p>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 bg-brand-dark px-6 py-4 text-center text-[11px] text-slate-300 sm:px-8">
          <p>&copy; 2026 Sig Signature. All rights reserved.</p>
          <div className="mt-1.5 flex justify-center gap-3 text-[10px] text-slate-400">
            <Link href="#" className="hover:underline">Privacy Policy</Link>
            <span>&bull;</span>
            <Link href="#" className="hover:underline">Terms of Service</Link>
            <span>&bull;</span>
            <Link href="#" className="hover:underline">Contact Support</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
