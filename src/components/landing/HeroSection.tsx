import Link from "next/link";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative flex min-h-[calc(100vh-5rem)] flex-col justify-between overflow-hidden pt-4 pb-6 sm:pt-6 sm:pb-8 lg:pt-8 lg:pb-10">
      {/* Top right light gradient blur (#C4DFFB at 50% opacity, blur ~324px as in Figma Ellipse 68) */}
      <div className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col justify-between px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Main Grid: Left Copy & Right LivePreview */}
        <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-10 xl:gap-14 my-auto">
          {/* Left Column: Copy & Actions */}
          <div className="flex flex-col items-start lg:col-span-6">
            <p className="font-heading text-sm font-semibold tracking-wide text-[#1243A3] sm:text-base mb-4 sm:mb-5">
              No Developer Needed
            </p>

            <h1 className="font-heading text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-[48px] xl:text-[54px] lg:leading-[1.12]">
              Free{" "}
              <span className="text-cta-gradient bg-gradient-to-r from-[#245FD4] to-[#022977] bg-clip-text text-transparent">
                Email Signature Generator
              </span>{" "}
              – Create Professional Signatures in Minutes
            </h1>

            <p className="font-body mt-4 sm:mt-5 text-base leading-relaxed text-[#878787] sm:text-lg">
              Create up to 3 professional email signatures with our free email signature generator. Start with a template or build from scratch, customize your design, preview changes live, and export HTML or images.
            </p>

            <div className="mt-6 sm:mt-7 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <Link
                href="/signup"
                className="group inline-flex items-center gap-2.5 rounded-full bg-cta-gradient bg-gradient-to-r from-[#245FD4] to-[#022977] px-8 py-3.5 font-body text-base font-semibold text-white shadow-sm transition-all hover:opacity-95 hover:shadow-md"
              >
                <span>Create Your Free Signature</span>
                <svg
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </Link>
            </div>

            <p className="mt-6 sm:mt-7 font-body text-xs text-[#878787] sm:text-sm">
              {/* Free forever · No credit card required · Ready in under 60 seconds */}
            </p>
          </div>

          {/* Right Column: Hero Graphic with Floating Animated Badges */}
          <div className="relative flex items-center justify-center lg:col-span-6">
            <div className="relative flex w-full max-w-[640px] justify-center sm:max-w-[720px] lg:max-w-none lg:justify-end">
              <div className="relative inline-block w-full">
                <Image
                  src="/Preview.svg"
                  alt="Live signature builder preview"
                  width={671}
                  height={512}
                  priority
                  className="h-auto w-full rounded-2xl object-contain drop-shadow-md"
                />

                {/* Floating Badge 1: HTML Validation (Animated jumping slightly) */}
                <div className="animate-float-1 absolute top-[14%] -left-2 z-20 flex select-none items-center gap-2.5 rounded-2xl border border-slate-100 bg-white/95 px-3 py-2.5 shadow-[0_12px_28px_rgba(0,0,0,0.12)] backdrop-blur-xs sm:-left-6 sm:gap-3 sm:px-4 sm:py-3 lg:-left-8">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#DCEBFF] sm:h-11 sm:w-11">
                    <svg
                      className="h-4 w-4 text-brand sm:h-5 sm:w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div className="flex flex-col text-left leading-tight">
                    <span className="font-heading text-[11px] font-bold tracking-wider text-slate-900 uppercase sm:text-xs">
                      HTML Validation
                    </span>
                    <span className="font-body text-[10px] text-slate-500 sm:text-[11px]">
                      Renders in 40+ clients
                    </span>
                  </div>
                </div>

                {/* Floating Badge 2: Auto-formatted (Animated jumping slightly) */}
                <div className="animate-float-2 absolute -right-2 bottom-[6%] z-20 flex select-none items-center gap-2.5 rounded-2xl border border-slate-100 bg-white/95 px-3 py-2.5 shadow-[0_12px_28px_rgba(0,0,0,0.12)] backdrop-blur-xs sm:-right-4 sm:gap-3 sm:px-4 sm:py-3 lg:-right-6">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-950 sm:h-11 sm:w-11">
                    <svg
                      className="h-4 w-4 text-white fill-current sm:h-5 sm:w-5"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M12 2L14.2 9.8L22 12L14.2 14.2L12 22L9.8 14.2L2 12L9.8 9.8L12 2Z" />
                      <circle cx="5" cy="5" r="1.5" />
                    </svg>
                  </div>
                  <div className="flex flex-col text-left leading-tight">
                    <span className="font-heading text-[12px] font-bold text-slate-900 sm:text-sm">
                      Auto-formatted
                    </span>
                    <span className="font-body text-[10px] text-slate-500 sm:text-[11px]">
                      Retina-ready assets
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Proof Line (No border, transparent background matching section) */}
        <div className="mt-6 flex justify-center sm:mt-8">
          <div className="inline-flex flex-wrap items-center justify-center gap-3">
            {/* Avatars cluster from People.svg */}
            <Image
              src="/People.svg"
              alt="Used by 500+ professionals"
              width={90}
              height={30}
              className="h-7 w-auto object-contain"
            />

            <div className="flex flex-wrap items-center gap-2 font-body text-xs text-[#878787] sm:text-sm">
              <span className="text-slate-400">✦</span>
              <span className="font-medium text-slate-800">Used by 500+ professionals</span>
              <span className="text-slate-400">✦</span>
              <span>Works with Gmail, Outlook &amp; more</span>
              <span className="text-slate-400">✦</span>
              <span>Production-ready HTML every time</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
