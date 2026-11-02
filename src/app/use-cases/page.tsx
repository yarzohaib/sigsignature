import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { UseCasesPageJsonLd, BreadcrumbJsonLd } from "@/components/seo/StructuredData";
import UseCasePreview from "@/components/use-cases/UseCasePreview";

export const metadata: Metadata = {
  title: "Use Cases | Sig Signature",
  description:
    "Explore how sales teams, consultants, recruiters, and founders turn every email into an on-brand touchpoint with Sig Signature.",
  alternates: {
    canonical: "https://www.sigsignature.com/use-cases",
  },
  openGraph: {
    title: "Use Cases | Sig Signature",
    description:
      "Explore how sales teams, consultants, recruiters, and founders turn every email into an on-brand touchpoint with Sig Signature.",
    url: "https://www.sigsignature.com/use-cases",
    siteName: "Sig Signature",
    images: [
      {
        url: "https://www.sigsignature.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Sig Signature Use Cases",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Use Cases | Sig Signature",
    description:
      "Explore how sales teams, consultants, recruiters, and founders turn every email into an on-brand touchpoint.",
    images: ["https://www.sigsignature.com/og-image.png"],
  },
};

const workflowSteps = [
  {
    number: "01",
    title: "Start with your identity.",
    description:
      "Choose a template or build from scratch. Add the contact details, brand colors and links that belong in your conversation.",
  },
  {
    number: "02",
    title: "See it as you shape it.",
    description:
      "Use the live preview to refine your type, spacing and icons. Save multiple signatures for the contexts you work in.",
  },
  {
    number: "03",
    title: "Take it to your inbox.",
    description:
      "Copy the production-ready HTML or download an image. Add your signature to Gmail, Outlook or another email client, then send a test.",
  },
];

export default function UseCasesPage() {
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
      <UseCasesPageJsonLd />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://www.sigsignature.com" },
          { name: "Use Cases", url: "https://www.sigsignature.com/use-cases" },
        ]}
      />

      <main className="flex-1">
        {/* 1. HERO SECTION */}
        <section className="pt-28 pb-14 sm:pt-32 sm:pb-16 lg:pt-36 lg:pb-20">
          <div className="mx-auto max-w-[1288px] px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              {/* Left Column: Heading, Subtitle, CTA */}
              <div className="lg:col-span-5 text-left">
                <h1 className="font-heading text-4xl sm:text-5xl lg:text-[56px] font-semibold text-slate-900 tracking-tight leading-[1.12]">
                  Every Role. <br />
                  Every Email. <br />
                  <span className="text-[#245FD4]">On Brand.</span>
                </h1>
                <p className="mt-5 font-body text-base sm:text-[17px] text-[#687386] leading-relaxed max-w-md">
                  From your first introduction to your next campaign, turn an everyday sign-off into a useful, recognizable brand touchpoint.
                </p>
                <div className="mt-8 flex items-center">
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

              {/* Right Column: Email Composer Mockup */}
              <div className="lg:col-span-7">
                <div className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-7 lg:p-8 shadow-sm">
                  {/* Window Controls */}
                  <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
                    <span className="h-3 w-3 rounded-full bg-[#EF4444]" />
                    <span className="h-3 w-3 rounded-full bg-[#F59E0B]" />
                    <span className="h-3 w-3 rounded-full bg-[#10B981]" />
                  </div>

                  {/* Email Meta Headers */}
                  <div className="py-2.5 border-b border-slate-100 text-xs sm:text-sm font-body text-slate-600 flex items-center gap-2">
                    <span className="text-slate-400 font-medium">To:</span>
                    <span className="text-slate-700">new@company.com</span>
                  </div>
                  <div className="py-2.5 border-b border-slate-100 text-xs sm:text-sm font-body text-slate-600 flex items-center gap-2">
                    <span className="text-slate-400 font-medium">Subject:</span>
                    <span className="text-slate-800 font-medium">Let&apos;s Connect</span>
                  </div>

                  {/* Email Message Content */}
                  <div className="pt-4 pb-5 font-body text-xs sm:text-sm text-slate-600 space-y-2 leading-relaxed">
                    <p>Hi there,</p>
                    <p>Great to connect. Let&apos;s make something good happen.</p>
                    <p>Best,</p>
                  </div>

                  {/* Embedded Signature Card */}
                  <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-2xs">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                      <div className="flex items-center gap-4">
                        {/* Logo Emblem & Socials */}
                        <div className="flex flex-col items-center gap-2.5">
                          <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-gradient-to-br from-[#1E50BA] to-[#0A2558] flex items-center justify-center text-white shadow-xs">
                            <svg className="h-7 w-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <rect x="3" y="3" width="10" height="10" rx="2" />
                              <rect x="11" y="11" width="10" height="10" rx="2" />
                            </svg>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="flex h-5 w-5 items-center justify-center rounded bg-[#1E50BA] text-[10px] font-bold text-white">in</span>
                            <span className="flex h-5 w-5 items-center justify-center rounded bg-[#1E50BA] text-[10px] font-bold text-white">🏀</span>
                            <span className="flex h-5 w-5 items-center justify-center rounded bg-[#1E50BA] text-[10px] font-bold text-white">f</span>
                          </div>
                        </div>

                        {/* Contact Information */}
                        <div className="space-y-0.5">
                          <h4 className="font-heading text-sm sm:text-base font-bold text-slate-900">Daniel Wilson</h4>
                          <p className="font-body text-xs text-slate-500 font-medium">UX/UI Designer</p>
                          <div className="pt-1 space-y-0.5 font-body text-[11px]">
                            <p className="text-slate-500">+1 (555) 345-6789</p>
                            <p className="text-[#245FD4]">daniel@company.com</p>
                            <p className="text-slate-400">www.company.com</p>
                          </div>
                        </div>
                      </div>

                      {/* Right: Company Logo & Name */}
                      <div className="hidden sm:flex sm:flex-col items-center justify-center sm:pl-6 sm:border-l sm:border-slate-100 self-stretch">
                        <svg className="h-9 w-9 text-[#1E50BA]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <rect x="3" y="3" width="10" height="10" rx="2" />
                          <rect x="11" y="11" width="10" height="10" rx="2" />
                        </svg>
                        <span className="font-heading text-xs font-bold text-slate-800 mt-1.5">Company Name</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. USE CASE 1: MAKE THE NEXT STEP FEEL NATURAL */}
        <section className="py-14 sm:py-18 lg:py-20">
          <div className="mx-auto max-w-[1288px] px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              {/* Left Column: Narrative & Checklist */}
              <div className="lg:col-span-6 text-left">
                <h2 className="font-heading text-3xl sm:text-4xl lg:text-[42px] font-medium text-[#101B30] tracking-tight leading-[1.17]">
                  Make the next step <br />
                  feel natural.
                </h2>
                <p className="mt-4 font-body text-sm sm:text-base text-[#687386] leading-relaxed max-w-lg">
                  Keep the conversation personal and the next action easy to find. A clear signature puts your role, contact details and meeting link in one considered place.
                </p>

                <ul className="mt-6 space-y-3 font-body text-xs sm:text-sm text-slate-700">
                  <li className="flex items-center gap-3">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#245FD4] text-white">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </span>
                    <span>Help a new contact know who they&apos;re speaking with.</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#245FD4] text-white">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </span>
                    <span>Give your calendar or contact page a clear home.</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#245FD4] text-white">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </span>
                    <span>Keep follow-ups aligned with your brand.</span>
                  </li>
                </ul>

                <div className="mt-8">
                  <Link
                    href="/signup"
                    className="inline-flex items-center gap-2 rounded-full bg-cta-gradient bg-gradient-to-r from-[#245FD4] to-[#022977] px-7 py-3 font-body text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
                  >
                    <span>Create Your Signature</span>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </Link>
                </div>
              </div>

              {/* Right Column: Visual Preview */}
              <div className="lg:col-span-6">
                <UseCasePreview initialStyle="minimal" containerVariant="light" />
              </div>
            </div>
          </div>
        </section>

        {/* 3. USE CASE 2: YOUR EVERYDAY EMAIL. YOUR NEXT BRAND MOMENT */}
        <section className="py-14 sm:py-18 lg:py-20">
          <div className="mx-auto max-w-[1288px] px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              {/* Left Column on Desktop: Visual Preview (Dark Theme) */}
              <div className="order-2 lg:order-1 lg:col-span-6">
                <UseCasePreview initialStyle="executive" containerVariant="dark" />
              </div>

              {/* Right Column on Desktop: Narrative & Checklist */}
              <div className="order-1 lg:order-2 lg:col-span-6 text-left">
                <h2 className="font-heading text-3xl sm:text-4xl lg:text-[42px] font-medium text-[#101B30] tracking-tight leading-[1.17]">
                  Your everyday email. <br />
                  Your next brand moment.
                </h2>
                <p className="mt-4 font-body text-sm sm:text-base text-[#687386] leading-relaxed max-w-lg">
                  Give a launch, event or useful resource a place in the emails you already send. Bring the same visual identity to the signature and the message beneath it.
                </p>

                <ul className="mt-6 space-y-3 font-body text-xs sm:text-sm text-slate-700">
                  <li className="flex items-center gap-3">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#245FD4] text-white">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </span>
                    <span>Build around your brand colors, fonts and icons.</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#245FD4] text-white">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </span>
                    <span>Use a banner with one focused campaign message.</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#245FD4] text-white">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </span>
                    <span>Save different signatures for different conversations.</span>
                  </li>
                </ul>

                <div className="mt-8">
                  <Link
                    href="/signup"
                    className="inline-flex items-center gap-2 rounded-full bg-cta-gradient bg-gradient-to-r from-[#245FD4] to-[#022977] px-7 py-3 font-body text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
                  >
                    <span>Create Your Signature</span>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. USE CASE 3: A WARMER INTRODUCTION. A CLEARER INVITATION */}
        <section className="py-14 sm:py-18 lg:py-20">
          <div className="mx-auto max-w-[1288px] px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              {/* Left Column: Narrative & Checklist */}
              <div className="lg:col-span-6 text-left">
                <h2 className="font-heading text-3xl sm:text-4xl lg:text-[42px] font-medium text-[#101B30] tracking-tight leading-[1.17]">
                  A warmer introduction. <br />
                  A clearer invitation.
                </h2>
                <p className="mt-4 font-body text-sm sm:text-base text-[#687386] leading-relaxed max-w-lg">
                  Make candidate conversations feel like they came from a person, not a process. Pair a recognizable identity with a useful link to your careers page.
                </p>

                <ul className="mt-6 space-y-3 font-body text-xs sm:text-sm text-slate-700">
                  <li className="flex items-center gap-3">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#245FD4] text-white">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </span>
                    <span>Introduce the person behind the opportunity.</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#245FD4] text-white">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </span>
                    <span>Keep company details consistent in candidate emails.</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#245FD4] text-white">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </span>
                    <span>Make open roles or culture content easy to discover.</span>
                  </li>
                </ul>

                <div className="mt-8">
                  <Link
                    href="/signup"
                    className="inline-flex items-center gap-2 rounded-full bg-cta-gradient bg-gradient-to-r from-[#245FD4] to-[#022977] px-7 py-3 font-body text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
                  >
                    <span>Create Your Signature</span>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </Link>
                </div>
              </div>

              {/* Right Column: Visual Preview */}
              <div className="lg:col-span-6">
                <UseCasePreview initialStyle="compact" containerVariant="light" />
              </div>
            </div>
          </div>
        </section>

        {/* 5. DIFFERENT WORKFLOWS. ONE SIMPLE WAY TO CREATE */}
        <section className="py-16 sm:py-20 lg:py-24 bg-white">
          <div className="mx-auto max-w-[1288px] px-4 sm:px-6 lg:px-8">
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-[42px] font-medium text-[#101B30] tracking-tight leading-[1.17] text-left">
              Different workflows. <br />
              One simple way to create.
            </h2>

            <div className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
              {workflowSteps.map((step) => (
                <div key={step.number} className="border-t border-[#B8D4F7] pt-8 sm:pt-10 text-left">
                  <p className="font-heading text-xs sm:text-sm font-bold text-[#245FD4]">
                    {step.number}
                  </p>
                  <h3 className="mt-3 font-heading text-lg sm:text-xl font-medium text-[#101B30]">
                    {step.title}
                  </h3>
                  <p className="mt-2.5 font-body text-xs sm:text-sm text-[#687386] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. CTA BANNER: FIND YOUR USE CASE. MAKE IT YOUR SIGNATURE */}
        <section
          className="py-16 sm:py-20 lg:py-24 text-white text-center"
          style={{
            background:
              "linear-gradient(100.16deg, #245FD4 1.32%, #00359F 50.19%, #00143C 100%)",
          }}
        >
          <div className="mx-auto max-w-[1288px] px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-heading text-3xl sm:text-4xl lg:text-[48px] font-semibold text-white tracking-tight leading-[1.15]">
                Find your use case. <br />
                Make it your signature.
              </h2>
              <p className="mx-auto mt-4 max-w-xl font-body text-sm sm:text-base text-white/80 leading-relaxed">
                Start with your brand, shape it around your work, and make every sign-off feel considered.
              </p>
              <div className="mt-8 flex justify-center">
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 font-body text-sm font-semibold text-[#00359F] shadow-sm transition hover:bg-slate-50 hover:shadow-md"
                >
                  <span>Create Your Free Signature</span>
                </Link>
              </div>
              <p className="mt-4 font-body text-xs text-white/70">
                No credit card. No designer. No developer. Just you.
              </p>
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
