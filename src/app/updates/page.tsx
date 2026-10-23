import type { Metadata } from "next";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import SectionBadge from "@/components/landing/SectionBadge";

export const metadata: Metadata = {
  title: "Changelog & Product Updates | SigSignature",
  description:
    "Track the latest features, engine updates, bug fixes, and client compatibility improvements in Sig Signature.",
  alternates: {
    canonical: "https://www.sigsignature.com/updates",
  },
};

const v1Features = [
  {
    title: "Core Signature Studio",
    tag: "Studio",
    description:
      "Intuitive dual-pane editor with live reactive DOM updates for contact info, company details, and social links.",
    icon: (
      <svg className="h-5 w-5 text-[#245FD4]" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
      </svg>
    ),
  },
  {
    title: "Cross-Client Compiler",
    tag: "Engine",
    description:
      "Strict table-based inline CSS output verified for Microsoft Outlook (Word engine), Gmail, and Apple Mail.",
    icon: (
      <svg className="h-5 w-5 text-[#245FD4]" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "1-Click Clipboard Export",
    tag: "Workflow",
    description:
      "Instant clipboard transfer with simultaneous rich-HTML and plain-text fallback payloads.",
    icon: (
      <svg className="h-5 w-5 text-[#245FD4]" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
      </svg>
    ),
  },
  {
    title: "Curated Template Gallery",
    tag: "Design",
    description:
      "Template gallery categorized by Minimal, Corporate, Creative, and Bold design aesthetics.",
    icon: (
      <svg className="h-5 w-5 text-[#245FD4]" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v6c0 .621-.504 1.125-1.125 1.125h-6A1.125 1.125 0 012.25 13.125v-6zM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-8.25zM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-2.25z" />
      </svg>
    ),
  },
  {
    title: "Dual-Viewport Preview",
    tag: "Testing",
    description:
      "Full responsive viewport switcher enabling instant testing of desktop (600px) and mobile (320px) email layouts.",
    icon: (
      <svg className="h-5 w-5 text-[#245FD4]" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
      </svg>
    ),
  },
  {
    title: "Branding & Media",
    tag: "Assets",
    description:
      "Support for profile avatars, corporate logos, and promotional CTA banners with automatic 2MB size gating.",
    icon: (
      <svg className="h-5 w-5 text-[#245FD4]" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
    ),
  },
];

const roadmapItems = [
  {
    phase: "In Development",
    feature: "Team Signature Management",
    description: "Shared corporate signature templates with CSV bulk employee importing.",
    statusColor: "bg-blue-100 text-[#1243A3] border-blue-200",
  },
  {
    phase: "Planned",
    feature: "Click Analytics",
    description: "Real-time click tracking on promotional banners and custom social icons.",
    statusColor: "bg-amber-100 text-amber-800 border-amber-200",
  },
  {
    phase: "Research",
    feature: "Automated Provisioning API",
    description: "Direct synchronization with Google Workspace and Microsoft 365 directory users.",
    statusColor: "bg-purple-100 text-purple-800 border-purple-200",
  },
];

export default function UpdatesPage() {
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
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-12">
            <div className="mx-auto max-w-4xl text-center">
              <div className="mb-6 flex items-center justify-center">
                <SectionBadge label="PRODUCT UPDATES" />
              </div>

              <h1 className="font-heading text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-[54px] lg:leading-[1.12]">
                <span className="text-cta-gradient bg-gradient-to-r from-[#245FD4] to-[#022977] bg-clip-text text-transparent">
                  Changelog &amp; Releases
                </span>
              </h1>

              <p className="mx-auto mt-6 max-w-2xl font-body text-base leading-relaxed text-slate-600 sm:text-lg lg:text-[19px]">
                New features, rendering engine improvements, and client compatibility updates for Sig Signature.
              </p>
            </div>
          </div>
        </section>

        {/* VERSION 1.0.0 RELEASE */}
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-12">
            <div className="mx-auto max-w-5xl">
              {/* Release Header Banner */}
              <div className="rounded-3xl border border-[#245FD4]/30 bg-gradient-to-b from-white to-blue-50/30 p-8 shadow-xs sm:p-10">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-[#245FD4] px-4 py-1.5 font-heading text-xs font-bold uppercase tracking-wider text-white">
                      v1.0.0
                    </span>
                    <h2 className="font-heading text-2xl font-semibold text-slate-900 sm:text-3xl">
                      Production Launch
                    </h2>
                  </div>
                  <span className="font-body text-sm font-medium text-slate-500">
                    October 2026 · Official General Availability
                  </span>
                </div>

                <p className="mt-4 font-body text-base text-slate-600">
                  Initial public release of Sig Signature featuring our zero-dependency table compiler, reactive dual-pane builder, and multi-client testing suite.
                </p>

                {/* Feature Grid */}
                <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {v1Features.map((item) => (
                    <div
                      key={item.title}
                      className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#DCEBFF]">
                            {item.icon}
                          </div>
                          <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-[#1243A3]">
                            {item.tag}
                          </span>
                        </div>

                        <h3 className="font-heading mt-4 text-base font-semibold text-slate-900 sm:text-lg">
                          {item.title}
                        </h3>
                        <p className="mt-2 font-body text-sm leading-relaxed text-slate-600">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ROADMAP SECTION */}
        <section className="py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-12">
            <div className="mx-auto max-w-3xl text-center">
              <SectionBadge label="ROADMAP" className="mb-4" />
              <h2 className="font-heading text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl lg:text-[46px] lg:leading-[1.15]">
                Upcoming Product Roadmap
              </h2>
              <p className="mt-4 font-body text-base text-[#878787] sm:text-lg">
                What we&apos;re engineering next for Q4 2026 to expand Sig Signature&apos;s capabilities.
              </p>
            </div>

            <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-3">
              {roadmapItems.map((item) => (
                <div
                  key={item.feature}
                  className="flex flex-col justify-between rounded-3xl border border-[#C1C1C1]/80 bg-white p-7 shadow-xs sm:p-8"
                >
                  <div>
                    <span
                      className={`inline-block rounded-full border px-3 py-1 text-xs font-semibold ${item.statusColor}`}
                    >
                      {item.phase}
                    </span>
                    <h3 className="font-heading mt-5 text-xl font-semibold text-slate-900">
                      {item.feature}
                    </h3>
                    <p className="mt-3 font-body text-sm leading-relaxed text-[#5A5A5A] sm:text-[15px]">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
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
