import Link from "next/link";
import Image from "next/image";
import SectionBadge from "./SectionBadge";

export default function HeroSection() {
  return (
    <section className="relative flex min-h-[calc(100vh-5rem)] flex-col justify-between overflow-hidden bg-[#FCFCFC] pt-4 pb-6 sm:pt-6 sm:pb-8 lg:pt-8 lg:pb-10">
      {/* Top right light gradient blur (#C4DFFB at 50% opacity, blur ~324px as in Figma Ellipse 68) */}
      <div className="pointer-events-none absolute -top-40 right-[-10%] -z-10 h-[600px] w-[600px] rounded-full bg-[#C4DFFB]/50 blur-[140px] lg:h-[950px] lg:w-[950px] lg:blur-[220px]" />

      <div className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col justify-between px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Main Grid: Left Copy & Right LivePreview */}
        <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-10 xl:gap-14 my-auto">
          {/* Left Column: Copy & Actions */}
          <div className="flex flex-col items-start lg:col-span-6">
            <SectionBadge label="No Developer Needed" className="mb-4 sm:mb-5" />

            <h1 className="font-heading text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-[48px] xl:text-[54px] lg:leading-[1.12]">
              Create a Professional{" "}
              <span className="text-brand">Email Signature</span> in Minutes.
            </h1>

            <p className="font-body mt-4 sm:mt-5 text-base leading-relaxed text-[#878787] sm:text-lg">
              Stop paying $100+ every time you need an email signature. Start
              from a template, or build one completely from scratch. Design,
              preview, and export production ready HTML signatures yourself in
              minutes.
            </p>

            <div className="mt-6 sm:mt-7 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <Link
                href="/signup"
                className="group inline-flex items-center gap-2.5 rounded-full bg-brand px-8 py-3.5 font-body text-base font-semibold text-white shadow-sm transition-all hover:bg-brand-dark hover:shadow-md"
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

            <p className="mt-3 font-body text-xs text-[#878787] sm:text-sm">
              Free forever · No credit card required · Ready in under 60 seconds
            </p>
          </div>

          {/* Right Column: Hero Graphic (LivePreview.png) */}
          <div className="relative flex items-center justify-center lg:col-span-6">
            <div className="relative w-full flex justify-center lg:justify-end">
              <Image
                src="/LivePreview.png"
                alt="Live signature builder preview"
                width={754}
                height={575}
                priority
                className="w-full h-auto max-w-[640px] sm:max-w-[720px] lg:max-w-none object-contain rounded-2xl drop-shadow-md"
              />
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
