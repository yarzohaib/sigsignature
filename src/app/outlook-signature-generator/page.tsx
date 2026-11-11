import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { BreadcrumbJsonLd } from "@/components/seo/StructuredData";
import OutlookGeneratorHeroMockup from "@/components/seo-landing/OutlookGeneratorHeroMockup";
import GmailTemplateShowcase from "@/components/seo-landing/GmailTemplateShowcase";
import OutlookInstallationSteps from "@/components/seo-landing/OutlookInstallationSteps";
import GmailFaqAccordion from "@/components/seo-landing/GmailFaqAccordion";
import LandingMotionConfig from "@/components/motion/LandingMotionConfig";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion";

export const metadata: Metadata = {
  title: "Create an HTML Signature for Outlook | Free Online Generator | Sig Signature",
  description:
    "Create an HTML signature for Outlook with Sig Signature. Start with a template or blank canvas, customize your design, and export clean HTML for Outlook and Microsoft 365. Free plan available.",
  alternates: {
    canonical: "https://www.sigsignature.com/outlook-signature-generator",
  },
  openGraph: {
    title: "Create an HTML Signature for Outlook | Free Online Generator | Sig Signature",
    description:
      "Create an HTML signature for Outlook with Sig Signature. Start with a template or blank canvas, customize your design, and export clean HTML for Outlook and Microsoft 365. Free plan available.",
    url: "https://www.sigsignature.com/outlook-signature-generator",
    siteName: "Sig Signature",
    type: "website",
    images: [
      {
        url: "https://www.sigsignature.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Create an HTML Signature for Outlook | Sig Signature",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Create an HTML Signature for Outlook | Free Online Generator | Sig Signature",
    description:
      "Create an HTML signature for Outlook with Sig Signature. Start with a template or blank canvas, customize your design, and export clean HTML for Outlook and Microsoft 365.",
    images: ["https://www.sigsignature.com/og-image.png"],
  },
};

const OUTLOOK_FAQS = [
  {
    question: "What is Sig Signature, and how does its Outlook signature generator work?",
    answer:
      "Sig Signature is an online email signature generator that helps individuals, freelancers, professionals, and teams create personalized signatures without writing code. You choose a template or blank layout, enter your contact information, customize fonts and colors, and copy the generated HTML signature directly into Outlook.",
  },
  {
    question: "Is the Sig Signature email signature generator free?",
    answer:
      "Yes. Registered users can create and save up to three email signatures with the Sig Signature free plan. It includes templates, a blank-canvas option, design customization, live previews, and HTML and PNG/image exports. Free signatures do not automatically include a Sig Signature watermark or branding.",
  },
  {
    question: "Can I design a signature from scratch without using a template?",
    answer:
      "Yes. Sig Signature supports both ready-made templates and blank-canvas creation. You can start with a blank layout, arrange your details, and build your custom signature from scratch with complete control over your styling.",
  },
  {
    question: "Does this signature work with Microsoft 365 and all Outlook versions?",
    answer:
      "Yes. Sig Signature exported HTML signatures have been thoroughly tested with Microsoft 365, classic Outlook desktop (2016, 2019, 2021), Outlook for Mac, and Outlook Web.",
  },
  {
    question: "What is included in Sig Signature Premium, and how much does it cost?",
    answer:
      "The Sig Signature Premium plan is available for $10 per month. It is designed for users and teams who need additional active signatures, team signature management, automated cloud sync, and priority technical support.",
  },
];

export default function OutlookSignatureGeneratorPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": OUTLOOK_FAQS.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  };

  return (
    <LandingMotionConfig>
      <div className="relative isolate flex min-h-screen flex-col bg-surface font-body text-slate-900 selection:bg-brand selection:text-white">
        {/* Background ambient lighting */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[900px] overflow-hidden"
        >
          <div className="absolute -right-[200px] -top-[240px] h-[480px] w-[560px] rounded-full bg-[#C4DFFB] opacity-40 blur-[80px] lg:-right-[372px] lg:-top-[475px] lg:h-[946px] lg:w-[1103px] lg:blur-[162px]" />
          <div className="absolute -right-[100px] -top-[170px] h-[300px] w-[320px] rounded-full bg-[#F0F8F5] opacity-40 blur-[80px] lg:-right-[216px] lg:-top-[350px] lg:h-[598px] lg:w-[616px] lg:blur-[162px]" />
        </div>

        <Navbar />
        <BreadcrumbJsonLd
          items={[
            { name: "Home", url: "https://www.sigsignature.com" },
            {
              name: "Outlook Signature Generator",
              url: "https://www.sigsignature.com/outlook-signature-generator",
            },
          ]}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />

        <main className="flex-1">
          {/* 1. HERO SECTION */}
          <section className="pt-10 pb-14 sm:pt-12 sm:pb-16 lg:pt-14 lg:pb-20">
            <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-12 2xl:max-w-[1536px] 3xl:max-w-[1720px]">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
                {/* Left Column: Heading, Tagline badge, intro copy, CTA buttons */}
                <div className="lg:col-span-6 text-left">
                  {/* Tagline Badge */}
                  <Reveal y={16} blur={6}>
                    <div className="inline-flex items-center gap-2 rounded-full border border-[#245FD4]/20 bg-[#EFF6FF] px-3.5 py-1 text-xs font-semibold text-[#245FD4] mb-4 shadow-2xs">
                      <span className="flex h-1.5 w-1.5 rounded-full bg-[#245FD4]" />
                      <span>Engineered for Microsoft Outlook & 365</span>
                    </div>
                  </Reveal>

                  <Reveal y={24} blur={8} delay={0.08}>
                    <h1
                      className="font-heading text-[clamp(2.5rem,1.75rem+2.6vw,3.75rem)] lg:text-[60px] xl:text-[66px] font-semibold text-slate-900 tracking-tight leading-[1.08]"
                      style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                    >
                      Create an HTML <br />
                      <span className="text-[#245FD4]">Signature</span> for Outlook
                    </h1>
                  </Reveal>

                  <Reveal y={20} blur={6} delay={0.14}>
                    <p
                      className="mt-5 font-body text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl"
                      style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                    >
                      Create clean, responsive HTML email signatures engineered specifically for Microsoft Outlook and Microsoft 365. Zero formatting errors, crisp logos across desktop and mobile, and 1-click copy directly into your Outlook settings.
                    </p>
                  </Reveal>

                  {/* Free plan / pricing note badge */}
                  <Reveal y={16} blur={4} delay={0.18}>
                    <div className="mt-4 flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-500">
                      <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      <span>Free plan includes up to 3 email signatures • No watermark or branding added</span>
                    </div>
                  </Reveal>

                  {/* Action buttons */}
                  <Reveal y={16} blur={4} delay={0.22}>
                    <div className="mt-8 flex flex-wrap items-center gap-4">
                      <Link
                        href="/signup"
                        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#245FD4] to-[#022977] px-7 py-3.5 font-body text-sm font-semibold text-white shadow-sm transition hover:opacity-95 hover:shadow-md"
                        style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                      >
                        <span>Create Free Signature</span>
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                      </Link>

                      <Link
                        href="/templates"
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-[#245FD4] transition py-3.5 px-4"
                        style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                      >
                        <span>Browse Templates</span>
                        <span>→</span>
                      </Link>
                    </div>
                  </Reveal>
                </div>

                {/* Right Column: Hero Interactive Editor/Preview Mockup */}
                <div className="lg:col-span-6 flex justify-center lg:justify-end">
                  <Reveal y={24} blur={8} delay={0.15} className="w-full">
                    <OutlookGeneratorHeroMockup />
                  </Reveal>
                </div>
              </div>
            </div>
          </section>

          {/* 2. CORE VALUE PROPS SECTION (3 Feature Cards) */}
          <section className="py-16 sm:py-20 bg-white border-y border-slate-200/80">
            <div className="mx-auto w-full max-w-[1440px] xl:px-12 2xl:max-w-[1536px] 3xl:max-w-[1720px] px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
                <Reveal y={20} blur={6}>
                  <h2
                    className="font-heading text-[clamp(1.85rem,1.25rem+2vw,2.75rem)] lg:text-[44px] xl:text-[48px] font-semibold text-slate-900 tracking-tight leading-[1.15]"
                    style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                  >
                    More than a <span className="text-[#245FD4]">name</span> at the end of an email.
                  </h2>
                </Reveal>
                <Reveal y={16} blur={4} delay={0.1}>
                  <p
                    className="mt-4 font-body text-base sm:text-lg text-slate-600 leading-relaxed"
                    style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                  >
                    Sig Signature helps you design, customize, and manage clean signatures that look professional in every Outlook inbox.
                  </p>
                </Reveal>
              </div>

              <RevealGroup stagger={0.1} className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                {/* Card 1 */}
                <RevealItem className="h-full">
                  <div className="h-full rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-2xs hover:border-[#245FD4]/30 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-start">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EFF6FF] border border-[#245FD4]/20 text-[#245FD4] mb-5">
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <line x1="3" y1="9" x2="21" y2="9" />
                        <line x1="9" y1="21" x2="9" y2="9" />
                      </svg>
                    </div>
                    <h3
                      className="font-heading text-lg sm:text-xl font-bold leading-tight text-slate-900 md:min-h-[3.5rem]"
                      style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                    >
                      Templates & Blank-Canvas Creation
                    </h3>
                    <p
                      className="mt-2.5 font-body text-sm text-slate-600 leading-relaxed"
                      style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                    >
                      Choose from professionally designed signature templates or start from a blank canvas to build your own custom HTML layout from scratch.
                    </p>
                  </div>
                </RevealItem>

                {/* Card 2 */}
                <RevealItem className="h-full">
                  <div className="h-full rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-2xs hover:border-[#245FD4]/30 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-start">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EFF6FF] border border-[#245FD4]/20 text-[#245FD4] mb-5">
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                      </svg>
                    </div>
                    <h3
                      className="font-heading text-lg sm:text-xl font-bold leading-tight text-slate-900 md:min-h-[3.5rem]"
                      style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                    >
                      Live Preview as You Design
                    </h3>
                    <p
                      className="mt-2.5 font-body text-sm text-slate-600 leading-relaxed"
                      style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                    >
                      Upload your profile photo or company logo, set your brand colors, and add social media links. A live preview updates in real time as you edit.
                    </p>
                  </div>
                </RevealItem>

                {/* Card 3 */}
                <RevealItem className="h-full">
                  <div className="h-full rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-2xs hover:border-[#245FD4]/30 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-start">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EFF6FF] border border-[#245FD4]/20 text-[#245FD4] mb-5">
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                    </div>
                    <h3
                      className="font-heading text-lg sm:text-xl font-bold leading-tight text-slate-900 md:min-h-[3.5rem]"
                      style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                    >
                      Tested for Outlook & <span className="whitespace-nowrap">Microsoft 365</span>
                    </h3>
                    <p
                      className="mt-2.5 font-body text-sm text-slate-600 leading-relaxed"
                      style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                    >
                      Export clean, email-safe HTML code tested specifically for Outlook desktop, Outlook Web (365), and Mac with zero formatting errors.
                    </p>
                  </div>
                </RevealItem>
              </RevealGroup>
            </div>
          </section>

          {/* 3. TEMPLATE SHOWCASE SECTION */}
          <section className="py-16 sm:py-20 lg:py-24 bg-[#FAFCFF]">
            <div className="mx-auto w-full max-w-[1440px] xl:px-12 2xl:max-w-[1536px] 3xl:max-w-[1720px] px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
                <Reveal y={20} blur={6}>
                  <h2
                    className="font-heading text-[clamp(1.85rem,1.25rem+2vw,2.75rem)] lg:text-[44px] xl:text-[48px] font-semibold text-slate-900 tracking-tight leading-[1.15]"
                    style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                  >
                    <span className="text-[#245FD4]">Outlook signature templates</span>, with room for your style.
                  </h2>
                </Reveal>
                <Reveal y={16} blur={4} delay={0.1}>
                  <p
                    className="mt-4 font-body text-base sm:text-lg text-slate-600 leading-relaxed"
                    style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                  >
                    Explore our collection of clean, professional templates designed to render consistently across desktop, tablet, and mobile devices.
                  </p>
                </Reveal>
              </div>

              {/* Template Filters / Styles note indicator */}
              <Reveal y={16} blur={4} delay={0.12} className="flex justify-center mb-8">
                <div className="inline-flex items-center gap-3 rounded-full border border-slate-200/80 bg-white px-5 py-2 text-xs font-semibold text-slate-600 shadow-2xs">
                  <span className="text-[#245FD4] font-bold">Template Filters:</span>
                  <span className="text-slate-800">Minimal</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-800">Extended</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-800">Visual</span>
                </div>
              </Reveal>

              {/* Template Cards Grid */}
              <Reveal y={24} blur={6} delay={0.15}>
                <GmailTemplateShowcase />
              </Reveal>

              {/* Exploration Banner: Encouraging Visitors to Check the Main Platform */}
              <Reveal y={20} blur={6} delay={0.2} className="mt-12 sm:mt-16">
                <div className="rounded-2xl border border-[#245FD4]/20 bg-gradient-to-r from-[#EFF6FF] via-white to-[#F0F8FF] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
                  <div className="text-left max-w-xl">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#245FD4]/10 px-3 py-1 text-xs font-semibold text-[#245FD4] mb-2">
                      Full Sig Signature Platform
                    </span>
                    <h3
                      className="font-heading text-xl sm:text-2xl font-bold text-slate-900"
                      style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                    >
                      Looking for our complete suite of templates?
                    </h3>
                    <p
                      className="mt-1.5 text-sm text-slate-600"
                      style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                    >
                      Visit the Sig Signature homepage to see live interactive signature previews, comparison breakdown, team capabilities, and complete features.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 shrink-0">
                    <Link
                      href="/"
                      className="inline-flex items-center gap-2 rounded-full bg-[#245FD4] hover:bg-[#1243A3] text-white px-6 py-3 font-body text-sm font-semibold transition shadow-sm hover:shadow-md"
                      style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                    >
                      <span>Explore Main Landing Page</span>
                      <span>→</span>
                    </Link>
                    <Link
                      href="/templates"
                      className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 px-5 py-3 font-body text-sm font-semibold transition"
                      style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                    >
                      <span>All Templates</span>
                    </Link>
                  </div>
                </div>
              </Reveal>

              {/* Callout Text below templates */}
              <div className="mt-8 text-center">
                <p
                  className="font-body text-xs sm:text-sm text-slate-500"
                  style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                >
                  Save your designs in your dashboard and return to update your information whenever your role or contact details change.
                </p>
              </div>
            </div>
          </section>

          {/* 4. CREATION WORKFLOW (3-Step Overview) */}
          <section className="py-16 sm:py-20 bg-white border-y border-slate-200/80">
            <div className="mx-auto w-full max-w-[1440px] xl:px-12 2xl:max-w-[1536px] 3xl:max-w-[1720px] px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
                <Reveal y={20} blur={6}>
                  <h2
                    className="font-heading text-[clamp(1.85rem,1.25rem+2vw,2.75rem)] lg:text-[44px] xl:text-[48px] font-semibold text-slate-900 tracking-tight leading-[1.15]"
                    style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                  >
                    Create a signature that is <span className="text-[#245FD4]">ready for business.</span>
                  </h2>
                </Reveal>
                <Reveal y={16} blur={4} delay={0.1}>
                  <p
                    className="mt-4 font-body text-base sm:text-lg text-slate-600 leading-relaxed"
                    style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                  >
                    From template selection to your Outlook inbox in less than a minute.
                  </p>
                </Reveal>
              </div>

              <RevealGroup stagger={0.12} className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
                {/* Step 1 */}
                <RevealItem className="flex flex-col items-start text-left">
                  <span className="font-heading text-4xl sm:text-5xl font-bold text-[#245FD4] mb-4">
                    01
                  </span>
                  <h3
                    className="font-heading text-lg sm:text-xl font-bold text-slate-900"
                    style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                  >
                    Choose your template or layout
                  </h3>
                  <p
                    className="mt-2 font-body text-sm text-slate-600 leading-relaxed"
                    style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                  >
                    Select a starting template suited for your role, or open the blank canvas to design your layout from the ground up.
                  </p>
                </RevealItem>

                {/* Step 2 */}
                <RevealItem className="flex flex-col items-start text-left">
                  <span className="font-heading text-4xl sm:text-5xl font-bold text-[#245FD4] mb-4">
                    02
                  </span>
                  <h3
                    className="font-heading text-lg sm:text-xl font-bold text-slate-900"
                    style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                  >
                    Add your professional information
                  </h3>
                  <p
                    className="mt-2 font-body text-sm text-slate-600 leading-relaxed"
                    style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                  >
                    Enter your name, job title, phone numbers, website link, and upload your high-resolution profile photo or company logo.
                  </p>
                </RevealItem>

                {/* Step 3 */}
                <RevealItem className="flex flex-col items-start text-left">
                  <span className="font-heading text-4xl sm:text-5xl font-bold text-[#245FD4] mb-4">
                    03
                  </span>
                  <h3
                    className="font-heading text-lg sm:text-xl font-bold text-slate-900"
                    style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                  >
                    Copy and paste into Outlook
                  </h3>
                  <p
                    className="mt-2 font-body text-sm text-slate-600 leading-relaxed"
                    style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                  >
                    Click copy to grab your rendered HTML signature, paste it into your Outlook signature settings, and save your changes.
                  </p>
                </RevealItem>
              </RevealGroup>

              {/* Central CTA under steps */}
              <Reveal y={16} blur={4} delay={0.2} className="mt-12 sm:mt-16 flex justify-center">
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#245FD4] to-[#022977] px-8 py-3.5 font-body text-sm font-semibold text-white shadow-sm transition hover:opacity-95 hover:shadow-md"
                  style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                >
                  <span>Start Designing Your Free Signature</span>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </Link>
              </Reveal>
            </div>
          </section>

          {/* 5. STEP-BY-STEP INSTALLATION GUIDE */}
          <section className="py-16 sm:py-20 lg:py-24 bg-[#FAFCFF]">
            <div className="mx-auto w-full max-w-[1440px] xl:px-12 2xl:max-w-[1536px] 3xl:max-w-[1720px] px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-10">
                <Reveal y={20} blur={6}>
                  <h2
                    className="font-heading text-[clamp(1.85rem,1.25rem+2vw,2.75rem)] lg:text-[44px] xl:text-[48px] font-semibold text-slate-900 tracking-tight leading-[1.15]"
                    style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                  >
                    How to Add <span className="text-[#245FD4]">HTML Signature</span> to Outlook
                  </h2>
                </Reveal>
                <Reveal y={16} blur={4} delay={0.1}>
                  <p
                    className="mt-4 font-body text-base sm:text-lg text-slate-600 leading-relaxed"
                    style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                  >
                    Follow these simple steps to install your Sig Signature HTML design into your Outlook account.
                  </p>
                </Reveal>
              </div>

              <Reveal y={24} blur={6} delay={0.15}>
                <OutlookInstallationSteps />
              </Reveal>
            </div>
          </section>

          {/* 6. FREQUENTLY ASKED QUESTIONS */}
          <section className="py-16 sm:py-20 bg-white border-t border-slate-200/80">
            <div className="mx-auto w-full max-w-[1440px] xl:px-12 2xl:max-w-[1536px] 3xl:max-w-[1720px] px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto mb-10">
                <Reveal y={20} blur={6}>
                  <h2
                    className="font-heading text-[clamp(1.85rem,1.25rem+2vw,2.75rem)] lg:text-[44px] xl:text-[48px] font-semibold text-slate-900 tracking-tight leading-[1.15]"
                    style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                  >
                    Frequently Asked <span className="text-[#245FD4]">Questions</span>
                  </h2>
                </Reveal>
                <Reveal y={16} blur={4} delay={0.1}>
                  <p
                    className="mt-3 font-body text-base text-slate-600"
                    style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                  >
                    Helpful details to make creating and using your Outlook signature easy.
                  </p>
                </Reveal>
              </div>

              <Reveal y={20} blur={6} delay={0.15}>
                <GmailFaqAccordion items={OUTLOOK_FAQS} />
              </Reveal>
            </div>
          </section>

          {/* 7. BOTTOM CTA BANNER */}
          <section
            className="py-16 sm:py-20 lg:py-24 text-white text-center"
            style={{
              background:
                "linear-gradient(100.16deg, #245FD4 1.32%, #00359F 50.19%, #00143C 100%)",
            }}
          >
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
              <Reveal y={24} blur={8}>
                <h2
                  className="font-heading text-[clamp(2rem,1.3rem+2vw,3rem)] lg:text-[50px] xl:text-[54px] font-semibold text-white tracking-tight leading-[1.12]"
                  style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                >
                  Your Outlook signature. <br />
                  Thoughtfully designed. <span className="text-blue-200">Unmistakably you.</span>
                </h2>
              </Reveal>
              <Reveal y={16} blur={6} delay={0.1}>
                <p
                  className="mt-4 font-body text-base sm:text-lg text-white/90 leading-relaxed max-w-xl mx-auto"
                  style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                >
                  Create up to 3 professional email signatures free with Sig Signature. Start with a template or blank canvas — no credit card required.
                </p>
              </Reveal>
              <Reveal y={16} blur={4} delay={0.18}>
                <div className="mt-8 flex flex-col items-center justify-center gap-3">
                  <Link
                    href="/signup"
                    className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 font-body text-sm font-semibold text-[#002B7F] shadow-sm transition hover:bg-slate-100 hover:shadow-md"
                    style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                  >
                    <span>Create Free Signature</span>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </Link>
                  <p className="text-xs text-white/70">
                    No credit card. No designer. No developer. Just you.
                  </p>
                </div>
              </Reveal>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </LandingMotionConfig>
  );
}
