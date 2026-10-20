import type { Metadata } from "next";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import SectionBadge from "@/components/landing/SectionBadge";

export const metadata: Metadata = {
  title: "About Us | SigSignature",
  description:
    "Sig Signature by The Nevon is a lightweight, deliverability-focused HTML email signature generator built for modern professionals and teams.",
};

const engineeringPrinciples = [
  {
    principle: "Deliverability First",
    commitment:
      "Every generated signature is audited to remain under 10KB to preserve deliverability, prevent email clipping, and protect sender reputation.",
    metric: "< 10KB Payload",
    icon: (
      <svg
        className="h-6 w-6 text-white"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
        />
      </svg>
    ),
  },
  {
    principle: "Cross-Client Consistency",
    commitment:
      "Layout fidelity verified across Microsoft Outlook, Gmail, Apple Mail, and mobile email applications.",
    metric: "40+ Client Environments",
    icon: (
      <svg
        className="h-6 w-6 text-white"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25"
        />
      </svg>
    ),
  },
  {
    principle: "Clean Software",
    commitment:
      "Zero bloat, zero tracking scripts embedded in user signatures, and zero unnecessary dependencies.",
    metric: "0% Bloat · Zero Tracking",
    icon: (
      <svg
        className="h-6 w-6 text-white"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
        />
      </svg>
    ),
  },
  {
    principle: "Powered by The Nevon",
    commitment:
      "Part of The Nevon's portfolio of purpose-built productivity and developer utilities.",
    metric: "The Nevon Ecosystem",
    icon: (
      <svg
        className="h-6 w-6 text-white"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
        />
      </svg>
    ),
  },
];

export default function AboutPage() {
  return (
    <div className="relative isolate flex min-h-screen flex-col bg-surface font-body text-slate-900 selection:bg-brand selection:text-white">
      {/* Background ambient lighting from Figma system */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[900px] overflow-hidden"
      >
        <div className="absolute -right-[200px] -top-[240px] h-[480px] w-[560px] rounded-full bg-[#C4DFFB] opacity-50 blur-[80px] lg:-right-[372px] lg:-top-[475px] lg:h-[946px] lg:w-[1103px] lg:blur-[162px]" />
        <div className="absolute -right-[100px] -top-[170px] h-[300px] w-[320px] rounded-full bg-[#F0F8F5] opacity-50 blur-[80px] lg:-right-[216px] lg:-top-[350px] lg:h-[598px] lg:w-[616px] lg:blur-[162px]" />
      </div>

      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-12 pb-16 sm:pt-16 sm:pb-20 lg:pt-20 lg:pb-24">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 xl:px-12">
            <div className="mx-auto max-w-4xl text-center">
              <div className="mb-6 flex items-center justify-center">
                <SectionBadge label="ABOUT US" />
              </div>

              <h1 className="font-heading text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-[54px] lg:leading-[1.12]">
                <span className="text-cta-gradient bg-gradient-to-r from-[#245FD4] to-[#022977] bg-clip-text text-transparent">
                  Engineered for deliverability.
                </span>{" "}
                Designed for professional correspondence.
              </h1>

              <div className="mt-8 rounded-3xl border border-[#C1C1C1]/60 bg-white/95 p-6 shadow-sm backdrop-blur-xs sm:p-8 md:p-10">
                <p className="font-heading text-xs font-semibold tracking-wider text-[#1243A3] uppercase sm:text-sm">
                  Our Mission
                </p>
                <p className="mt-3 font-body text-base leading-relaxed text-slate-700 sm:text-lg lg:text-[19px] lg:leading-[1.6]">
                  Sig Signature is a focused web utility developed and maintained by{" "}
                  <strong className="font-semibold text-slate-900">The Nevon</strong>. We build
                  software tools that eliminate repetitive technical friction for creators,
                  independent professionals, and scaling companies.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* THE PROBLEM WE SOLVE (AEO & GEO Authority) */}
        <section className="py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 xl:px-12">
            <div className="mx-auto max-w-3xl text-center">
              <SectionBadge label="TECHNICAL APPROACH" className="mb-4" />
              <h2 className="font-heading text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl lg:text-[46px] lg:leading-[1.15]">
                The Problem We Solve
              </h2>
              <p className="mt-4 font-body text-base text-[#878787] sm:text-lg">
                Why email signature markup is deceptively fragile, and how our strict compiler ensures
                every email lands intact.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
              {/* Left Card: The Vulnerability - styled consistently with Sig Signature Standard */}
              <div className="flex flex-col justify-between rounded-3xl border border-[#245FD4]/30 bg-gradient-to-b from-white to-blue-50/30 p-8 shadow-xs sm:p-10">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#DCEBFF] text-[#245FD4]">
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                        />
                      </svg>
                    </div>
                    <div>
                      <span className="font-heading text-xs font-bold tracking-wider text-[#1243A3] uppercase">
                        The Status Quo
                      </span>
                      <h3 className="font-heading text-xl font-semibold text-slate-900 sm:text-2xl">
                        Bloated Markup &amp; Fragile Code
                      </h3>
                    </div>
                  </div>

                  <p className="mt-6 font-body text-base leading-relaxed text-slate-600 sm:text-[17px]">
                    Email signature design is deceptively fragile. Most visual signature generators
                    export bloated markup containing proprietary tags, external stylesheet references,
                    or unoptimized base64 image strings. When rendered inside restrictive email
                    environments—most notoriously Microsoft Outlook&apos;s Word-based rendering
                    engine—these signatures break, distort layouts, clip avatars, or trigger
                    corporate spam filters.
                  </p>
                </div>

                <div className="mt-8 flex flex-wrap gap-2 pt-4 border-t border-blue-100 text-xs font-medium text-[#1243A3]">
                  <span className="rounded-full bg-[#DCEBFF] px-3 py-1">Proprietary Tags</span>
                  <span className="rounded-full bg-[#DCEBFF] px-3 py-1">Unoptimized Base64</span>
                  <span className="rounded-full bg-[#DCEBFF] px-3 py-1">Spam Filter Triggers</span>
                  <span className="rounded-full bg-[#DCEBFF] px-3 py-1">Outlook Word-Engine Clashes</span>
                </div>
              </div>

              {/* Right Card: The Solution */}
              <div className="flex flex-col justify-between rounded-3xl border border-[#245FD4]/30 bg-gradient-to-b from-white to-blue-50/30 p-8 shadow-xs sm:p-10">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#DCEBFF] text-[#245FD4]">
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2.5"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <span className="font-heading text-xs font-bold tracking-wider text-[#1243A3] uppercase">
                        The Sig Signature Standard
                      </span>
                      <h3 className="font-heading text-xl font-semibold text-slate-900 sm:text-2xl">
                        Strict Table-Based Compilation
                      </h3>
                    </div>
                  </div>

                  <p className="mt-6 font-body text-base leading-relaxed text-slate-600 sm:text-[17px]">
                    Sig Signature solves this through an architectural focus on strict table-based
                    compilation. Every signature created in our editor outputs lightweight,
                    standards-compliant HTML with inline CSS, explicit dimension attributes, and MSO
                    conditional comments. The result is an email signature that renders identically
                    whether opened in Gmail Web, Apple Mail on iOS, or Outlook Desktop on Windows.
                  </p>
                </div>

                <div className="mt-8 flex flex-wrap gap-2 pt-4 border-t border-blue-100 text-xs font-medium text-[#1243A3]">
                  <span className="rounded-full bg-[#DCEBFF] px-3 py-1">Table-Based HTML</span>
                  <span className="rounded-full bg-[#DCEBFF] px-3 py-1">Inline CSS</span>
                  <span className="rounded-full bg-[#DCEBFF] px-3 py-1">MSO Conditionals</span>
                  <span className="rounded-full bg-[#DCEBFF] px-3 py-1">Explicit Dimensions</span>
                  <span className="rounded-full bg-[#DCEBFF] px-3 py-1">Identical Cross-Client Parity</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CORE ENGINEERING PRINCIPLES */}
        <section className="py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 xl:px-12">
            <div className="mx-auto max-w-3xl text-center">
              <SectionBadge label="CORE PRINCIPLES" className="mb-4" />
              <h2 className="font-heading text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl lg:text-[46px] lg:leading-[1.15]">
                Core Engineering Principles
              </h2>
              <p className="mt-4 font-body text-base text-[#878787] sm:text-lg">
                Uncompromising engineering guidelines enforced throughout our architecture.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8">
              {engineeringPrinciples.map((item) => (
                <div
                  key={item.principle}
                  className="flex flex-col justify-between rounded-3xl border border-[#C1C1C1]/70 bg-white p-7 transition-all duration-200 hover:border-blue-300 hover:shadow-sm sm:p-8"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div
                        style={{
                          background: "linear-gradient(180deg, #245FD4 0%, #022977 100%)",
                        }}
                        className="flex h-12 w-12 items-center justify-center rounded-2xl shadow-xs"
                      >
                        {item.icon}
                      </div>
                      <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-[#1243A3]">
                        {item.metric}
                      </span>
                    </div>

                    <h3 className="font-heading mt-5 text-xl font-semibold text-slate-900 sm:text-2xl">
                      {item.principle}
                    </h3>
                    <p className="mt-3 font-body text-base leading-relaxed text-[#5A5A5A] sm:text-[17px]">
                      {item.commitment}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ORGANIZATION & GOVERNANCE */}
        <section className="py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 xl:px-12">
            {/* Centered badge outside the box */}
            <div className="mb-8 flex items-center justify-center">
              <SectionBadge label="ORGANIZATION & GOVERNANCE" />
            </div>

            <div className="mx-auto max-w-4xl rounded-3xl border border-[#C1C1C1]/80 bg-white p-8 shadow-xs sm:p-12 lg:p-16">
              <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-2xl">
                  <h2 className="font-heading text-2xl font-semibold text-slate-900 sm:text-3xl lg:text-[34px]">
                    Built and Maintained by The Nevon
                  </h2>
                  <p className="mt-4 font-body text-base leading-relaxed text-slate-600 sm:text-lg">
                    Sig Signature is built, operated, and maintained by{" "}
                    <strong className="font-semibold text-slate-900">The Nevon</strong>. All
                    inquiries regarding corporate governance, enterprise deployments, and licensing
                    may be directed to our official contact channel.
                  </p>
                  <p className="mt-4 font-body text-xs text-slate-400 sm:text-sm">
                    Sig Signature Documentation &copy; The Nevon. All rights reserved. Confidential
                    &amp; Proprietary Specification.
                  </p>
                </div>

                <div className="flex shrink-0">
                  <a
                    href="mailto:teams@thenevon.com"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-cta-gradient bg-gradient-to-r from-[#245FD4] to-[#022977] px-8 py-3.5 font-body text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
                  >
                    <span>Contact Us</span>
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2.5"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Full-width horizontal divider line above Footer */}
      <div className="w-full border-t border-[#D7D7D7]" />

      <Footer />
    </div>
  );
}
