import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-between overflow-hidden bg-[#F8FAFC] px-4 py-8 sm:px-6 sm:py-12">
      {/* Background Vector Gradients (Vectors 87 & 88 from Figma) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div
          className="absolute -top-[40%] left-1/2 h-[900px] w-[1400px] -translate-x-1/2 rounded-full blur-[4px] opacity-70"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(36, 95, 212, 0.12) 0%, rgba(248, 250, 252, 0) 70%)",
          }}
        />
        <div
          className="absolute -bottom-[30%] left-1/2 h-[800px] w-[1400px] -translate-x-1/2 rounded-full blur-[4px] opacity-60"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(36, 95, 212, 0.10) 0%, rgba(248, 250, 252, 0) 70%)",
          }}
        />
      </div>

      {/* Header / Logo */}
      <header className="relative z-10 flex w-full justify-center pt-2 sm:pt-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 transition hover:opacity-90"
        >
          <Image
            src="/logo.svg"
            alt="Sig Signature logo"
            width={48}
            height={26}
            className="h-8 w-auto sm:h-9"
            priority
          />
          <span className="font-heading text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Sig <span className="text-[#245FD4]">Signature</span>
          </span>
        </Link>
      </header>

      {/* Center 404 Content */}
      <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center py-8">
        {/* 404 Large Digits Graphic */}
        <div
          className="relative inline-flex items-center justify-center select-none font-body font-medium tracking-normal text-[130px] leading-[100px] sm:text-[200px] sm:leading-[140px] md:text-[250px] md:leading-[170px] lg:text-[300px] lg:leading-[198px] pb-6 sm:pb-10 lg:pb-12"
          aria-label="404"
        >
          {/* Layer 1: Solid Drop Shadow Extrusion shifted 12px downwards (#0152B2) */}
          <span
            aria-hidden="true"
            className="absolute select-none text-[#0152B2] translate-y-2 sm:translate-y-2.5 lg:translate-y-3"
          >
            404
          </span>
          {/* Layer 2: Mask matching background to prevent shadow showing through 40% fill */}
          <span
            aria-hidden="true"
            className="absolute select-none text-[#F8FAFC]"
          >
            404
          </span>
          {/* Layer 3: Face color (#245FD4 at 40% opacity) */}
          <span
            className="relative z-10 select-none"
            style={{ color: "rgba(36, 95, 212, 0.40)" }}
          >
            404
          </span>
        </div>

        {/* Heading: Oops. That Page Doesn't Exist. */}
        <h1
          className="mt-6 sm:mt-8 md:mt-10 lg:mt-12 font-body text-[22px] font-medium sm:text-[30px] md:text-[34px] lg:text-[38px] leading-tight lg:leading-[34px] tracking-normal text-[#353A3E] whitespace-nowrap"
        >
          Oops. That Page Doesn&apos;t Exist.
        </h1>

        {/* Subheading: It might have moved, or the link is broken. */}
        <p
          className="mt-3 sm:mt-4 max-w-[528px] font-body text-base font-normal sm:text-[18px] sm:leading-[24px] tracking-normal text-[#586472]"
        >
          It might have moved, or the link is broken.
        </p>

        {/* Buttons (Frame 1984079781 & Frame 1984079782) */}
        <div className="mt-8 sm:mt-9 flex w-full max-w-[260px] flex-col items-center gap-3">
          <Link
            href="/"
            className="flex h-12 w-full items-center justify-center rounded-xl bg-cta-gradient bg-gradient-to-r from-[#245FD4] to-[#022977] font-body text-sm font-semibold text-white shadow-xs transition hover:opacity-95"
          >
            Return to Home
          </Link>
          <Link
            href="mailto:support@sigsignature.com"
            className="flex h-12 w-full items-center justify-center rounded-xl border border-[#C1C1C1]/60 bg-white font-body text-sm font-semibold text-[#1243A3] shadow-2xs transition hover:bg-slate-50"
          >
            Contact Support
          </Link>
        </div>
      </div>

      {/* Footer Copyright */}
      <footer className="relative z-10 pb-2 sm:pb-4 text-center">
        <p className="font-body text-xs sm:text-sm font-normal text-[#878787]">
          &copy; 2026 Sig Signature. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
