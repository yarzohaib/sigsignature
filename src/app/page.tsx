import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center sm:p-10">
      <div className="max-w-xl">
        <h1 className="font-heading text-4xl font-bold text-brand-dark sm:text-5xl">
          Professional Email Signatures In Minutes
        </h1>
        <p className="font-body mt-4 text-base text-slate-600 sm:text-lg">
          Create, manage, and distribute sleek email signatures that impress clients and elevate your personal brand.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/signup"
            className="bg-brand-gradient flex h-14 w-full items-center justify-center rounded-xl font-body text-base font-semibold text-white shadow-sm transition hover:opacity-90 sm:w-52"
          >
            Get Started Free
          </Link>

          <Link
            href="/login"
            className="flex h-14 w-full items-center justify-center rounded-xl border border-line bg-white font-body text-base font-semibold text-brand-dark transition hover:bg-slate-50 sm:w-52"
          >
            Log In
          </Link>
        </div>
      </div>
    </main>
  );
}