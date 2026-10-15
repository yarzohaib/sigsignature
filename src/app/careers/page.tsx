import type { Metadata } from "next";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import SectionBadge from "@/components/landing/SectionBadge";

export const metadata: Metadata = {
  title: "Careers at The Nevon | Building Sig Signature & Modern Web Utilities",
  description:
    "Explore career opportunities at The Nevon. We build lightweight, high-utility web tools including Sig Signature and CrushSVG.",
};

const operatingValues = [
  {
    title: "High Agency",
    description:
      "We expect team members to make informed architectural decisions, take full ownership of their code, and ship reliably.",
    badge: "Autonomy & Ownership",
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
    title: "Craft & Precision",
    description:
      "We prioritize clean code, microcopy clarity, and strict cross-platform compatibility over vanity metrics.",
    badge: "Pixel-Perfect Standards",
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
          d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.39m3.42 3.415a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.416a6.717 6.717 0 01-1.622 3.39m4.765-4.649a6.717 6.717 0 013.39-1.622"
        />
      </svg>
    ),
  },
  {
    title: "Async-First",
    description:
      "We operate asynchronously across time zones, with clear documentation replacing endless status meetings.",
    badge: "Documentation Driven",
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
          d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
];

const openDisciplines = [
  {
    role: "Frontend Engineering",
    stack: "Next.js, TypeScript, Tailwind CSS, Canvas API",
    responsibility:
      "Build pixel-perfect UI components and low-latency interactive canvas editors.",
    focus: "Client Performance & Interactive State",
  },
  {
    role: "Backend & Systems",
    stack: "Node.js, Python, REST APIs, Vercel/Cloudflare Edge",
    responsibility:
      "Develop scalable APIs, image processing engines, and secure billing webhooks.",
    focus: "High Availability & Serverless Infrastructure",
  },
  {
    role: "Product Design",
    stack: "Design Systems, Figma, Responsive Typography",
    responsibility:
      "Craft elegant design systems, template libraries, and clean user journeys.",
    focus: "Design Tokens & Cross-Device Ergonomics",
  },
];

export default function CareersPage() {
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
                <SectionBadge label="CAREERS AT THE NEVON" />
              </div>

              <h1 className="font-heading text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-[54px] lg:leading-[1.12]">
                <span className="text-cta-gradient bg-gradient-to-r from-[#245FD4] to-[#022977] bg-clip-text text-transparent">
                  Build focused software
                </span>{" "}
                that solves real technical problems.
              </h1>

              <div className="mt-8 rounded-3xl border border-[#C1C1C1]/60 bg-white/95 p-6 shadow-sm backdrop-blur-xs sm:p-8 md:p-10">
                <p className="font-heading text-xs font-semibold tracking-wider text-[#1243A3] uppercase sm:text-sm">
                  Our Engineering Philosophy
                </p>
                <p className="mt-3 font-body text-base leading-relaxed text-slate-700 sm:text-lg lg:text-[19px] lg:leading-[1.6]">
                  At The Nevon, we do not build bloated enterprise platforms with endless feature sprawl.
                  We build fast, high-utility, single-purpose software tools that do one job exceptionally
                  well. Sig Signature, CrushSVG, and our suite of web utilities are designed with ruthless
                  attention to performance, clean architecture, and minimal friction.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* HOW WE WORK (OPERATING VALUES) */}
        <section className="py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 xl:px-12">
            <div className="mx-auto max-w-3xl text-center">
              <SectionBadge label="HOW WE WORK" className="mb-4" />
              <h2 className="font-heading text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl lg:text-[46px] lg:leading-[1.15]">
                Our Operating Values
              </h2>
              <p className="mt-4 font-body text-base text-[#878787] sm:text-lg">
                The cultural principles that guide how we design, code, review, and ship utilities.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {operatingValues.map((val) => (
                <div
                  key={val.title}
                  className="flex flex-col justify-between rounded-3xl border border-[#245FD4]/30 bg-gradient-to-b from-white to-blue-50/30 p-8 shadow-xs"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div
                        style={{
                          background: "linear-gradient(180deg, #245FD4 0%, #022977 100%)",
                        }}
                        className="flex h-12 w-12 items-center justify-center rounded-2xl shadow-xs"
                      >
                        {val.icon}
                      </div>
                      <span className="rounded-full bg-[#DCEBFF] px-3 py-1 text-xs font-semibold text-[#1243A3]">
                        {val.badge}
                      </span>
                    </div>

                    <h3 className="font-heading mt-6 text-xl font-semibold text-slate-900 sm:text-2xl">
                      {val.title}
                    </h3>
                    <p className="mt-3 font-body text-base leading-relaxed text-slate-600">
                      {val.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* OPEN DISCIPLINES */}
        <section className="py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 xl:px-12">
            <div className="mx-auto max-w-3xl text-center">
              <SectionBadge label="OPEN DISCIPLINES" className="mb-4" />
              <h2 className="font-heading text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl lg:text-[46px] lg:leading-[1.15]">
                Disciplines We Invest In
              </h2>
              <p className="mt-4 font-body text-base text-[#878787] sm:text-lg">
                We are always excited to collaborate with engineers and product designers who take pride in crafting focused utilities.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
              {openDisciplines.map((item) => (
                <div
                  key={item.role}
                  className="flex flex-col justify-between rounded-3xl border border-[#C1C1C1]/80 bg-white p-7 shadow-xs transition-all duration-200 hover:border-blue-300 hover:shadow-sm sm:p-8"
                >
                  <div>
                    <span className="inline-block rounded-full border border-blue-200 bg-blue-50/70 px-3 py-1 text-xs font-semibold text-[#1243A3]">
                      {item.focus}
                    </span>
                    <h3 className="font-heading mt-4 text-xl font-semibold text-slate-900 sm:text-2xl">
                      {item.role}
                    </h3>

                    <div className="mt-5">
                      <p className="font-heading text-xs font-semibold tracking-wider text-[#1243A3] uppercase">
                        Primary Responsibility
                      </p>
                      <p className="mt-1.5 font-body text-sm leading-relaxed text-[#5A5A5A] sm:text-[15px]">
                        {item.responsibility}
                      </p>
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-100">
                      <p className="font-heading text-xs font-semibold tracking-wider text-slate-500 uppercase">
                        Core Tech Stack
                      </p>
                      <p className="mt-1.5 font-body text-xs font-medium text-slate-700 sm:text-sm">
                        {item.stack}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* GENERAL APPLICATIONS & INVITATION */}
        <section className="py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 xl:px-12">
            <div className="mb-8 flex items-center justify-center">
              <SectionBadge label="GENERAL APPLICATIONS" />
            </div>

            <div className="mx-auto max-w-4xl rounded-3xl border border-[#C1C1C1]/80 bg-white p-8 shadow-xs sm:p-12 lg:p-16">
              <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-2xl">
                  <h2 className="font-heading text-2xl font-semibold text-slate-900 sm:text-3xl lg:text-[34px]">
                    Join Our Core Team
                  </h2>
                  <p className="mt-4 font-body text-base leading-relaxed text-slate-600 sm:text-lg">
                    Interested in joining our team? Send your resume, portfolio or GitHub profile, and a brief note describing what you like to build. We review every thoughtful submission.
                  </p>
                  <p className="mt-4 font-body text-xs text-slate-400 sm:text-sm">
                    Sig Signature Documentation &copy; The Nevon. All rights reserved.
                  </p>
                </div>

                <div className="flex shrink-0">
                  <a
                    href="mailto:careers@thenevon.com"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-cta-gradient bg-gradient-to-r from-[#245FD4] to-[#022977] px-8 py-3.5 font-body text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
                  >
                    <span>careers@thenevon.com</span>
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
