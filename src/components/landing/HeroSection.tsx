import Link from "next/link";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-4.5rem)] lg:min-h-[calc(100vh-5rem)] flex-col justify-between overflow-hidden pt-4 pb-4 sm:pt-6 sm:pb-6 lg:pt-4 lg:pb-6">
      {/* Top right light gradient blur (#C4DFFB at 50% opacity, blur ~324px as in Figma Ellipse 68) */}
      <div className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col justify-between px-4 sm:px-6 lg:px-8 xl:px-12 2xl:max-w-[1536px] 3xl:max-w-[1720px]">
        {/* Main Grid: Left Copy & Right LivePreview */}
        <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-10 xl:gap-14 2xl:gap-16 my-auto py-2 sm:py-4">
          {/* Left Column: Copy & Actions */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left lg:col-span-6">
            <p className="font-heading text-sm font-semibold tracking-wide text-[#1243A3] sm:text-base mb-3 sm:mb-4 lg:mb-5 xl:text-lg 2xl:text-xl text-center lg:text-left">
              No Developer Needed
            </p>

            <h1 className="font-heading text-[clamp(2rem,1.25rem+2.5vw,3rem)] lg:text-[48px] xl:text-[54px] 2xl:text-[62px] 3xl:text-[68px] font-semibold tracking-tight text-slate-900 leading-[1.15] lg:leading-[1.12] [text-wrap:balance]">
              Free{" "}
              <span className="text-cta-gradient bg-gradient-to-r from-[#245FD4] to-[#022977] bg-clip-text text-transparent">
                Email Signature Generator
              </span>{" "}
              – Create Professional Signatures in Minutes
            </h1>

            <p className="font-body mt-4 sm:mt-5 text-[15px] sm:text-base lg:text-base xl:text-lg 2xl:text-[20px] 3xl:text-[22px] leading-relaxed text-[#878787] max-w-[640px] 2xl:max-w-[720px]">
              Create up to 3 professional email signatures with our free email signature generator. Start with a template or build from scratch, customize your design, preview changes live, and export HTML or images.
            </p>

            <div className="mt-6 sm:mt-7 flex flex-col items-center sm:items-start gap-3 sm:flex-row sm:items-center w-full">
              <Link
                href="/signup"
                className="group inline-flex w-full max-w-[360px] sm:max-w-none sm:w-auto min-h-[48px] 2xl:min-h-[54px] items-center justify-center gap-2.5 rounded-full bg-cta-gradient bg-gradient-to-r from-[#245FD4] to-[#022977] px-8 py-3.5 2xl:px-10 2xl:py-4 font-body text-base 2xl:text-lg font-semibold text-white shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 [@media(hover:hover)]:hover:opacity-95 [@media(hover:hover)]:hover:shadow-md active:scale-95"
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
            {/* Mobile: Live Preview Card (shown only below md) */}
            <div className="block md:hidden w-full">
              <div className="relative mx-auto max-w-[420px] w-full rounded-2xl border border-slate-200 bg-white shadow-[0_8px_32px_rgba(0,0,0,0.10)] overflow-hidden">
                {/* Card Header */}
                <div className="border-b border-slate-100 bg-slate-50/60 px-4 py-3 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  </div>
                  <span className="ml-2 text-sm font-medium text-slate-600">Live Preview</span>
                </div>
                {/* Signature preview */}
                <div className="p-5">
                  <div className="flex items-center gap-4 rounded-xl border border-slate-200/80 bg-slate-50/60 p-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#245FD4] to-[#022977] text-base font-bold text-white">
                      MN
                    </div>
                    <div className="min-w-0">
                      <p className="text-base font-bold text-slate-900">Muhammad Nadir</p>
                      <p className="text-sm text-slate-600">Product Designer</p>
                      <p className="mt-1 text-[13px] sm:text-sm text-[#878787] break-all">sardar@thenevon.com</p>
                    </div>
                  </div>
                  <div className="mt-3.5 flex gap-2.5">
                    <div className="h-9 flex-1 rounded-lg bg-gradient-to-r from-[#245FD4] to-[#022977] flex items-center justify-center shadow-xs">
                      <span className="text-xs sm:text-[13px] font-semibold text-white">Copy HTML</span>
                    </div>
                    <div className="h-9 flex-1 rounded-lg border border-slate-200 bg-white flex items-center justify-center shadow-xs">
                      <span className="text-xs sm:text-[13px] font-semibold text-slate-700">Export PNG</span>
                    </div>
                  </div>
                </div>
                {/* Floating badges inside the card - HTML Validation */}
                <div className="px-4 pb-4 flex gap-2 flex-wrap">
                  <div className="flex items-center gap-2 rounded-xl border border-slate-100 bg-white px-3 py-2 shadow-sm">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#DCEBFF]">
                      <svg className="h-3.5 w-3.5 text-brand" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
                    </div>
                    <div className="flex flex-col text-left leading-tight">
                      <span className="font-heading text-[11px] font-bold tracking-wider text-slate-900 uppercase">HTML Validation</span>
                      <span className="font-body text-[10px] text-slate-500">Renders in 40+ clients</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl border border-slate-100 bg-white px-3 py-2 shadow-sm">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-950">
                      <svg className="h-3.5 w-3.5 text-white fill-current" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2L14.2 9.8L22 12L14.2 14.2L12 22L9.8 14.2L2 12L9.8 9.8L12 2Z" /><circle cx="5" cy="5" r="1.5" /></svg>
                    </div>
                    <div className="flex flex-col text-left leading-tight">
                      <span className="font-heading text-xs font-bold text-slate-900">Auto-formatted</span>
                      <span className="font-body text-[10px] text-slate-500">Retina-ready assets</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop: Full Preview.svg (hidden below md) */}
            <div className="hidden md:block w-full max-w-[640px] sm:max-w-[720px] lg:max-w-none 2xl:max-w-[840px] 3xl:max-w-[960px]">
              <div className="relative flex w-full justify-center lg:justify-end">
                <div className="relative inline-block w-full max-w-full">
                  <Image
                    src="/Preview.svg"
                    alt="Live signature builder preview"
                    width={800}
                    height={610}
                    priority
                    sizes="(min-width: 1536px) 50vw, (min-width: 1024px) 50vw, 100vw"
                    className="h-auto w-full max-w-full rounded-2xl object-contain drop-shadow-md"
                  />

                  {/* Floating Badge 1: HTML Validation (Animated jumping slightly) */}
                  <div className="animate-float-1 absolute top-[14%] left-0 sm:-left-6 lg:-left-8 z-20 flex select-none items-center gap-2 2xl:gap-3 rounded-xl sm:rounded-2xl border border-slate-100 bg-white/95 px-2.5 py-2 sm:px-4 sm:py-3 2xl:px-5 2xl:py-3.5 shadow-[0_12px_28px_rgba(0,0,0,0.12)] backdrop-blur-xs">
                    <div className="flex h-8 w-8 sm:h-11 sm:w-11 2xl:h-12 2xl:w-12 shrink-0 items-center justify-center rounded-full bg-[#DCEBFF]">
                      <svg
                        className="h-4 w-4 text-brand sm:h-5 sm:w-5 2xl:h-6 2xl:w-6"
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
                      <span className="font-heading text-[10px] sm:text-xs 2xl:text-sm font-bold tracking-wider text-slate-900 uppercase">
                        HTML Validation
                      </span>
                      <span className="font-body text-[9px] sm:text-[11px] 2xl:text-xs text-slate-500">
                        Renders in 40+ clients
                      </span>
                    </div>
                  </div>

                  {/* Floating Badge 2: Auto-formatted (Animated jumping slightly) */}
                  <div className="animate-float-2 absolute right-0 sm:-right-4 lg:-right-6 bottom-[6%] z-20 flex select-none items-center gap-2 2xl:gap-3 rounded-xl sm:rounded-2xl border border-slate-100 bg-white/95 px-2.5 py-2 sm:px-4 sm:py-3 2xl:px-5 2xl:py-3.5 shadow-[0_12px_28px_rgba(0,0,0,0.12)] backdrop-blur-xs">
                    <div className="flex h-8 w-8 sm:h-11 sm:w-11 2xl:h-12 2xl:w-12 shrink-0 items-center justify-center rounded-full bg-slate-950">
                      <svg
                        className="h-4 w-4 text-white fill-current sm:h-5 sm:w-5 2xl:h-6 2xl:w-6"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path d="M12 2L14.2 9.8L22 12L14.2 14.2L12 22L9.8 14.2L2 12L9.8 9.8L12 2Z" />
                        <circle cx="5" cy="5" r="1.5" />
                      </svg>
                    </div>
                    <div className="flex flex-col text-left leading-tight">
                      <span className="font-heading text-[11px] sm:text-sm 2xl:text-base font-bold text-slate-900">
                        Auto-formatted
                      </span>
                      <span className="font-body text-[9px] sm:text-[11px] 2xl:text-xs text-slate-500">
                        Retina-ready assets
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Social Proof Line (No border, transparent background matching section) */}
        <div className="mt-auto pt-4 flex justify-center pb-2 sm:pb-3">
          <div className="inline-flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
            {/* Avatars cluster from People.svg */}
            <Image
              src="/People.svg"
              alt="Used by 500+ professionals"
              width={100}
              height={34}
              sizes="(min-width: 1536px) 110px, 90px"
              className="h-7 sm:h-8 2xl:h-9 w-auto object-contain"
            />

            <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-1.5 sm:gap-2 font-body text-xs text-[#878787] sm:text-sm xl:text-base 2xl:text-lg text-center">
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
