import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { AboutPageJsonLd, BreadcrumbJsonLd } from "@/components/seo/StructuredData";

export const metadata: Metadata = {
  title: "About Us | Sig Signature",
  description:
    "Sig Signature by The Nevon is a lightweight, deliverability-focused HTML email signature generator built for modern professionals and teams.",
  alternates: {
    canonical: "https://www.sigsignature.com/about",
  },
  openGraph: {
    title: "About Us | Sig Signature",
    description:
      "Learn how Sig Signature by The Nevon engineers deliverability-first, pixel-perfect HTML email signatures for modern professionals and teams.",
    url: "https://www.sigsignature.com/about",
    siteName: "Sig Signature",
    images: [
      {
        url: "https://www.sigsignature.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "About Sig Signature",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | Sig Signature",
    description:
      "Learn how Sig Signature by The Nevon engineers deliverability-first, pixel-perfect HTML email signatures.",
    images: ["https://www.sigsignature.com/og-image.png"],
  },
};

const senderArchetypes = [
  {
    role: "Sales Teams & SDRs",
    context:
      "First impressions, and most look identical; plain text, uninspiring branding. Present better in seconds whether your outreach is warm or cold.",
    helps: [
      "Add a one-tap booking link to rep book meetings faster.",
      "Put your role, company, and LinkedIn up-front for instant credibility.",
      "Keep one polished signature across the whole team: no drift.",
      "Give separate signatures for outbound, inbound reps, or account.",
    ],
  },
  {
    role: "Freelancers & Consultants",
    context:
      "You are the brand. When your signature looks thrown together, clients quickly wonder whether your work is too. No matter how good your portfolio is.",
    helps: [
      "Look established with a signature that stands on your work and logo.",
      "One link to your portfolio, booking page, or case study not five.",
      "Switch between personal and client project signatures anytime.",
      "Free to start, so you don't need a billable hour for design.",
    ],
  },
  {
    role: "Recruiters & Hiring Teams",
    context:
      "Recruiters send hundreds of emails a week to candidates who are comparing you to rival or other offers. An unbranded, inconsistent signature makes your company blend in.",
    helps: [
      "Make every outreach feel official with a branded email footer.",
      "A one-tap link to your careers page or scheduling tool.",
      "Role-based signatures for different teams or hiring stages.",
      "Consistent branding so new recruits can pull a lever.",
    ],
  },
];

export default function AboutPage() {
  return (
    <div className="relative isolate flex min-h-screen flex-col bg-surface font-body text-slate-900 selection:bg-brand selection:text-white">
      {/* Background ambient lighting matching Figma design system */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[900px] overflow-hidden"
      >
        <div className="absolute -right-[200px] -top-[240px] h-[480px] w-[560px] rounded-full bg-[#C4DFFB] opacity-50 blur-[80px] lg:-right-[372px] lg:-top-[475px] lg:h-[946px] lg:w-[1103px] lg:blur-[162px]" />
        <div className="absolute -right-[100px] -top-[170px] h-[300px] w-[320px] rounded-full bg-[#F0F8F5] opacity-50 blur-[80px] lg:-right-[216px] lg:-top-[350px] lg:h-[598px] lg:w-[616px] lg:blur-[162px]" />
      </div>

      <Navbar />
      <AboutPageJsonLd />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://www.sigsignature.com" },
          { name: "About Us", url: "https://www.sigsignature.com/about" },
        ]}
      />

      <main className="flex-1">
        {/* 1. HERO SECTION */}
        {/* Keep the hero clear of the floating mobile navbar without excessive top whitespace. */}
        <section className="pt-20 pb-14 sm:pt-8 sm:pb-16 lg:pt-8 lg:pb-20">
          <div className="mx-auto max-w-[1288px] px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
              <h1 className="font-heading text-3xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-[52px] lg:leading-[1.15]">
                A Small Detail. <br />
                <span className="text-[#245FD4]">A Signature Difference.</span>
              </h1>
              <p className="mx-auto mt-4 max-w-xl font-body text-sm sm:text-base leading-relaxed text-[#5A5A5A]">
                We believe your everyday emails deserve the same care as the brand you&apos;re building.
              </p>
              <div className="mt-7 flex justify-center">
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 rounded-full bg-cta-gradient bg-gradient-to-r from-[#245FD4] to-[#022977] px-8 py-3.5 font-body text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
                >
                  <span>Create Your Free Signature</span>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* 2. SIGNATURE VISUAL CANVAS FLANKED BY BRAND ANNOTATIONS */}
            <div className="mt-12 sm:mt-16 mx-auto max-w-5xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
                {/* Left Annotation Column */}
                <div className="order-2 lg:order-1 lg:col-span-3 text-center lg:text-left">
                  <h3 className="font-heading text-xl sm:text-2xl font-semibold text-[#022977] leading-tight">
                    The right details. <br />
                    A natural next step.
                  </h3>
                  <p className="mt-3 font-body text-xs sm:text-[13px] text-[#64748B] leading-relaxed max-w-xs mx-auto lg:mx-0">
                    A name, a role, a way to reach you. <br className="hidden lg:inline" />
                    Small details that keep a conversation moving.
                  </p>
                </div>

                {/* Center Signature Grid Card */}
                <div className="order-1 lg:order-2 lg:col-span-6 flex justify-center">
                  <div className="relative w-full max-w-[500px] rounded-3xl border border-[#CCE0F8] bg-[#F4F8FD]/80 p-5 sm:p-7 overflow-hidden shadow-xs">
                    {/* Subtle Blue Grid */}
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 opacity-40 pointer-events-none"
                      style={{
                        backgroundImage:
                          "linear-gradient(#B8D4F7 1px, transparent 1px), linear-gradient(to right, #B8D4F7 1px, transparent 1px)",
                        backgroundSize: "28px 28px",
                      }}
                    />

                    {/* White Signature Preview Card */}
                    <div className="relative z-10 mx-auto rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-sm">
                      <div className="flex items-center gap-4">
                        {/* 3D Blue Sphere Avatar */}
                        <div
                          className="h-14 w-14 sm:h-16 sm:w-16 shrink-0 rounded-full shadow-inner"
                          style={{
                            background:
                              "radial-gradient(circle at 35% 35%, #3B82F6 0%, #1E40AF 45%, #0B1C43 100%)",
                          }}
                        />
                        <div className="min-w-0 flex-1">
                          <h3 className="font-heading text-base sm:text-lg font-bold text-slate-900 truncate">
                            The Nevon
                          </h3>
                          <p className="font-body text-xs text-slate-500 font-medium">
                            Leadership Development Platform · Ceo
                          </p>
                          <p className="font-body text-xs text-[#245FD4] mt-0.5 truncate">
                            thenevon@gmail.com
                          </p>
                          <p className="font-body text-xs text-slate-400 mt-0.5">
                            +655 863 1279
                          </p>
                        </div>
                      </div>

                      {/* Action Row */}
                      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-[#0A2558] text-white">
                            <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918" />
                            </svg>
                          </div>
                          <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-[#0A2558] text-white">
                            <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                            </svg>
                          </div>
                          <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-[#0A2558] text-white">
                            <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                            </svg>
                          </div>
                        </div>

                        <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#245FD4] bg-white px-3 py-1.5 font-heading text-xs font-semibold text-[#245FD4]">
                          <span>Design for what&apos;s next</span>
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                          </svg>
                        </span>
                      </div>
                    </div>

                    {/* Footer inside grid canvas: MORE THAN A SIGN-OFF */}
                    <div className="mt-4 flex items-center justify-center gap-1.5 font-heading text-[10px] font-bold tracking-widest uppercase text-[#5B8AC9]">
                      <svg className="h-3 w-3 text-[#5B8AC9]" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M2 5V2h3M11 2h3v3M2 11v3h3M11 14h3v-3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span>More than a sign-off</span>
                    </div>
                  </div>
                </div>

                {/* Right Annotation Column */}
                <div className="order-3 lg:order-3 lg:col-span-3 text-center lg:text-left lg:self-end lg:pb-3">
                  <div className="inline-block">
                    <h3 className="font-heading text-xl sm:text-2xl font-semibold text-[#022977] leading-tight">
                      Clearly you. <br />
                      Unmistakably <br />
                      your brand.
                    </h3>
                    <div className="mt-2.5 h-[1.5px] w-full bg-[#CCE0F8]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. ONE SIGNATURE TOOL, EVERY KIND OF SENDER */}
        <section className="py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-[1288px] px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-heading text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl lg:text-[42px] lg:leading-[1.17]">
                One Signature Tool, Every Kind Of <span className="text-[#245FD4]">Sender</span>
              </h2>
              <p className="mx-auto mt-3.5 max-w-2xl font-body text-xs sm:text-sm text-slate-500 leading-relaxed">
                Different people send email for different reasons, but everyone deserves a signature that looks professional and works in every inbox. Here&apos;s how Sig Signature earns its place for each of them.
              </p>
            </div>

            {/* 3 Archetype Cards */}
            <div className="mt-10 sm:mt-12 space-y-6">
              {senderArchetypes.map((item) => (
                <div
                  key={item.role}
                  className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 lg:p-10 shadow-xs"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
                    {/* Left: Role & Context */}
                    <div className="lg:col-span-5 flex items-start gap-4">
                      <div className="flex h-6 w-6 sm:h-7 sm:w-7 shrink-0 items-center justify-center rounded-full bg-[#EBF2FE] border border-[#245FD4]/20 text-[#245FD4] mt-0.5 shadow-xs">
                        <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#245FD4]" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-heading text-lg sm:text-xl font-bold text-slate-900">
                          {item.role}
                        </h3>
                        <p className="mt-2 font-body text-xs sm:text-sm text-slate-500 leading-relaxed max-w-md">
                          {item.context}
                        </p>
                      </div>
                    </div>

                    {/* Right: How Sig Signature Helps */}
                    <div className="lg:col-span-7 lg:border-l lg:border-slate-100 lg:pl-10">
                      <p className="font-heading text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">
                        How Sig Signature Helps
                      </p>
                      <ul className="space-y-2 font-body text-xs sm:text-[13px] text-slate-600">
                        {item.helps.map((point) => (
                          <li key={point} className="flex items-start gap-2">
                            <span className="text-[#245FD4] font-bold">•</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. LESS FRICTION. MORE YOU. */}
        <section className="py-16 sm:py-20 lg:py-24 bg-[#F0F5FD]">
          <div className="mx-auto max-w-[1288px] px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              {/* Left Column */}
              <div className="lg:col-span-6">
                <h2 className="font-heading text-3xl font-medium tracking-tight text-slate-900 sm:text-4xl lg:text-[48px] lg:leading-[1.12]">
                  Less friction. <br />
                  More <span className="text-[#245FD4]">you.</span>
                </h2>
                <p className="mt-4 font-body text-sm sm:text-base leading-relaxed text-slate-600 max-w-lg">
                  Start with a template or a blank canvas. Bring in your colors, fonts and contact details. See every change as you make it, then take your signature into the email tools you already use.
                </p>

                <div className="mt-6 space-y-3 font-body">
                  <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-700 font-medium">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#245FD4] text-white">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </span>
                    <span>Templates for a head start. Freedom to build from scratch.</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-700 font-medium">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#245FD4] text-white">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </span>
                    <span>A live preview, not a guessing game.</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-700 font-medium">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#245FD4] text-white">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </span>
                    <span>Production-ready HTML and high-quality image export.</span>
                  </div>
                </div>

                <div className="mt-8">
                  <Link
                    href="/templates"
                    className="inline-flex items-center gap-2 rounded-full bg-cta-gradient bg-gradient-to-r from-[#245FD4] to-[#022977] px-7 py-3 font-body text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
                  >
                    <span>See What You Can Create</span>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </Link>
                </div>
              </div>

              {/* Right Column: Studio UI Mockup */}
              <div className="lg:col-span-6">
                <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:rounded-[32px] sm:p-7 lg:p-8">
                  {/* Browser chrome */}
                  <div className="grid grid-cols-3 items-center pb-5 text-xs text-slate-500 sm:pb-7">
                    <div className="flex items-center gap-2" aria-hidden="true">
                      <span className="h-2.5 w-2.5 rounded-full bg-blue-200" />
                      <span className="h-2.5 w-2.5 rounded-full bg-blue-200" />
                      <span className="h-2.5 w-2.5 rounded-full bg-blue-200" />
                    </div>
                    <span className="truncate text-center text-[10px] sm:text-xs">www.sigsignature.com</span>
                    <span className="justify-self-end" aria-hidden="true">
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path strokeLinecap="round" d="M4 7h10M18 7h2M4 12h2m4 0h10M4 17h10m4 0h2"/><path strokeLinecap="round" d="M16 5v4M8 10v4m8 1v4"/></svg>
                    </span>
                  </div>

                  {/* Editor tabs */}
                  <div className="flex items-center gap-5 border-b border-slate-200 pb-3 text-xs font-semibold sm:gap-8 sm:pb-4 sm:text-sm">
                    <span className="text-slate-500">Design</span>
                    <span className="text-[#245FD4]">Live preview</span>
                    <span className="text-slate-500">Export</span>
                  </div>

                  {/* Signature preview canvas */}
                  <div className="mt-5 flex min-h-[220px] items-center justify-center rounded-2xl bg-[#F4F7FB] p-4 sm:mt-7 sm:min-h-[300px] sm:p-6">
                    <div className="w-full max-w-[560px] rounded-[22px] border border-slate-200/80 bg-white p-5 sm:p-7">
                      <div className="flex items-center gap-4 sm:gap-6">
                        <div className="h-16 w-16 shrink-0 rounded-full bg-gradient-to-br from-[#061D59] via-[#174FAE] to-[#43A0FF] sm:h-24 sm:w-24" />
                        <div className="min-w-0">
                          <h4 className="font-heading text-base font-bold text-slate-900 sm:text-2xl">The Nevon</h4>
                          <p className="font-body text-xs text-slate-500 sm:text-base">Leadership Development Platform · Ceo</p>
                          <p className="font-body mt-1 break-all text-xs text-[#245FD4] sm:text-sm">thenevon@gmail.com</p>
                          <p className="font-body mt-1 text-xs text-slate-500 sm:text-sm">+655 863 1279</p>
                        </div>
                      </div>
                      <div className="mt-5 border-t border-slate-300 pt-4 sm:mt-7 sm:pt-5">
                        <div className="flex items-center gap-2.5 sm:gap-3">
                          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#0A2D78] text-white sm:h-11 sm:w-11">
                            <svg className="h-5 w-5 sm:h-7 sm:w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="12" cy="12" r="9"/><path strokeLinecap="round" d="M3.5 9h17M3.5 15h17M12 3c2.2 2.4 3.3 5.4 3.3 9s-1.1 6.6-3.3 9c-2.2-2.4-3.3-5.4-3.3-9S9.8 5.4 12 3Z"/></svg>
                          </span>
                          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#0A2D78] text-white sm:h-11 sm:w-11">
                            <svg className="h-5 w-5 sm:h-7 sm:w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="3" y="5" width="18" height="14" rx="1.5"/><path strokeLinecap="round" strokeLinejoin="round" d="m4 7 8 6 8-6"/></svg>
                          </span>
                          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#0A2D78] text-white sm:h-11 sm:w-11">
                            <svg className="h-5 w-5 sm:h-7 sm:w-7" viewBox="0 0 24 24" fill="currentColor"><path d="M6.6 2.8 9.4 2c.7-.2 1.4.2 1.6.9l1.1 3.5c.2.6 0 1.2-.5 1.6l-1.7 1.3a14.4 14.4 0 0 0 4.8 4.8l1.3-1.7c.4-.5 1-.7 1.6-.5l3.5 1.1c.7.2 1.1.9.9 1.6l-.8 2.8c-.2.7-.9 1.2-1.7 1.2C10.7 18.6 5.4 13.3 5.4 6c0-.8.5-1.5 1.2-1.7Z"/></svg>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Brand palette and export status */}
                  <div className="flex flex-col gap-4 pt-5 sm:flex-row sm:items-end sm:justify-between sm:pt-7">
                    <div>
                      <p className="mb-2 text-[10px] font-medium uppercase tracking-wide text-slate-500 sm:text-xs">Your brand color</p>
                      <div className="flex items-center gap-2.5">
                        <span className="h-6 w-6 rounded-full bg-[#245FD4] sm:h-8 sm:w-8" />
                        <span className="h-6 w-6 rounded-full bg-[#0A347F] sm:h-8 sm:w-8" />
                        <span className="h-6 w-6 rounded-full bg-[#111C32] sm:h-8 sm:w-8" />
                        <span className="h-6 w-6 rounded-full bg-[#879DBF] sm:h-8 sm:w-8" />
                      </div>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="font-body text-xs text-[#245FD4] sm:text-sm">Ready for your inbox</p>
                      <p className="mt-1 font-body text-[10px] text-slate-500 sm:text-xs">HTML / IMAGE</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. THOUGHTFUL BY DESIGN. PRACTICAL BY NATURE. */}
        <section
          className="py-16 sm:py-20 lg:py-24 text-white"
          style={{
            background:
              "linear-gradient(100.16deg, #245FD4 1.32%, #00359F 50.19%, #00143C 100%)",
          }}
        >
          <div className="mx-auto max-w-[1288px] px-4 sm:px-6 lg:px-8">
            {/* Header: Title and narrative paragraph */}
            <div className="grid grid-cols-1 md:grid-cols-3 md:items-end gap-6 md:gap-8 lg:gap-12 pb-2">
              <h2
                className="font-heading text-3xl font-medium tracking-tight text-white sm:text-4xl md:col-span-2 lg:text-[44px] lg:leading-[1.15]"
                style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
              >
                Thoughtful by design. <br />
                Practical by nature.
              </h2>
              <p
                className="font-body text-xs sm:text-sm text-white/80 max-w-sm leading-relaxed md:col-start-3"
                style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
              >
                Everything comes back to a simple goal: help you show up professionally, on your own terms.
              </p>
            </div>

            {/* Three pillars aligned to the header columns with separate rules. */}
            <div className="mt-8 sm:mt-10 grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
              {/* Pillar 1 */}
              <div className="border-t border-white/30 pt-6 sm:pt-8">
                <div className="text-white mb-4 sm:mb-5">
                  <svg
                    className="h-6 w-6 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polygon points="3 11 22 2 13 21 11 13 3 11" />
                  </svg>
                </div>
                <h3
                  className="font-heading min-h-12 text-lg sm:text-xl font-semibold leading-[1.2] text-white tracking-tight"
                  style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                >
                  Control, not complexity.
                </h3>
                <p
                  className="mt-2.5 font-body text-xs sm:text-sm leading-relaxed text-white/75"
                  style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                >
                  Choose the details that matter to you. Customize colors, fonts and icons without handing the process to someone else.
                </p>
              </div>

              {/* Pillar 2 */}
              <div className="border-t border-white/30 pt-6 sm:pt-8">
                <div className="text-white mb-4 sm:mb-5">
                  <svg
                    className="h-6 w-6 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2" />
                    <path d="M3 9h18" />
                    <path d="M9 21V9" />
                  </svg>
                </div>
                <h3
                  className="font-heading min-h-12 text-lg sm:text-xl font-semibold leading-[1.2] text-white tracking-tight"
                  style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                >
                  Consistency, not sameness.
                </h3>
                <p
                  className="mt-2.5 font-body text-xs sm:text-sm leading-relaxed text-white/75"
                  style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                >
                  Keep a clear visual identity across multiple signatures, while leaving room for different people, roles and conversations.
                </p>
              </div>

              {/* Pillar 3 */}
              <div className="border-t border-white/30 pt-6 sm:pt-8">
                <div className="text-white mb-4 sm:mb-5">
                  <svg
                    className="h-6 w-6 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="m18 16 4-4-4-4" />
                    <path d="m6 8-4 4 4 4" />
                    <path d="m14.5 4-5 16" />
                  </svg>
                </div>
                <h3
                  className="font-heading min-h-12 text-lg sm:text-xl font-semibold leading-[1.2] text-white tracking-tight"
                  style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                >
                  Made to leave the editor.
                </h3>
                <p
                  className="mt-2.5 font-body text-xs sm:text-sm leading-relaxed text-white/75"
                  style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                >
                  A signature should be useful beyond its preview. Export HTML or an image and bring your design into your everyday email.
                </p>
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
