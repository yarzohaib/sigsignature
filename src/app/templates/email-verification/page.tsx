import Link from "next/link";
import Logo from "@/components/auth/Logo";

export default function EmailVerificationTemplatePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-100 p-4 sm:p-8">
      {/* Navigation bar to switch between screens */}
      <div className="mb-6 flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm">
        <Link
          href="/verify"
          className="rounded-lg border border-line bg-white px-3 py-1.5 font-semibold text-slate-700 shadow-2xs hover:bg-slate-50"
        >
          &larr; Back to Verify Email Screen
        </Link>
        <span className="text-slate-400">|</span>
        <Link
          href="/templates/password-reset"
          className="rounded-lg border border-line bg-white px-3 py-1.5 font-semibold text-brand shadow-2xs hover:bg-slate-50"
        >
          View Password Reset Template &rarr;
        </Link>
      </div>

      {/* Email Card Container matching Figma Email Template */}
      <div className="w-full max-w-[480px] overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-slate-900/5">
        {/* Top Hero with Gradient */}
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-100/60 p-6 sm:p-8">
          <div className="mb-6 flex items-center justify-between">
            <Logo />
          </div>

          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="font-heading text-xl font-bold text-brand-dark sm:text-2xl">
                Confirm Your Email Address
              </h1>
              <p className="mt-2 text-xs text-slate-600 sm:text-sm">
                One quick step left verify your email to unlock your Sig Signature account.
              </p>
            </div>

            {/* Envelope Icon Badge */}
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand text-white shadow-md">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 text-center sm:p-8">
          <h2 className="font-heading text-lg font-bold text-slate-900 sm:text-xl">
            Secure Your Account
          </h2>

          <p className="mt-3 text-xs leading-relaxed text-slate-600 sm:text-sm">
            Hi John,
            <br />
            Please verify your email address to activate your account and start creating professional email signatures.
          </p>

          <div className="mt-6">
            <Link
              href="/verify?email=john@example.com"
              className="bg-brand-gradient inline-flex h-12 w-full items-center justify-center rounded-xl font-body text-sm font-semibold text-white shadow-sm transition hover:opacity-90 sm:h-14 sm:text-base"
            >
              Verify Email
            </Link>
          </div>

          <p className="mt-4 text-xs text-slate-400">
            This verification link will expire in 24 hours.
          </p>

          <p className="mt-2 text-[11px] text-slate-400">
            If you didn&apos;t create a Sig Signature account, you can safely ignore this email.
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
