import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { BreadcrumbJsonLd } from "@/components/seo/StructuredData";
import GmailComposerMockup from "@/components/seo-landing/GmailComposerMockup";
import InstallationTabs, { InstallTab } from "@/components/seo-landing/InstallationTabs";
import FaqAccordion, { FaqItem } from "@/components/seo-landing/FaqAccordion";
import { AVAILABLE_TEMPLATES } from "@/lib/templatesData";
import CuratedTemplatesGrid from "@/components/seo-landing/CuratedTemplatesGrid";

export const metadata: Metadata = {
  title: "Gmail Signature Generator | Free HTML Signatures for Google Workspace & Gmail",
  description:
    "Generate professional, dark-mode compatible HTML email signatures for Gmail and Google Workspace. Never clipped at 102KB, zero blue telephone links, 1-click rich-text paste.",
  alternates: {
    canonical: "https://www.sigsignature.com/gmail-signature-generator",
  },
  openGraph: {
    title: "Gmail Signature Generator | Free HTML Signatures for Google Workspace & Gmail",
    description:
      "Generate professional, dark-mode compatible HTML email signatures for Gmail and Google Workspace. Never clipped at 102KB, zero blue telephone links, 1-click rich-text paste.",
    url: "https://www.sigsignature.com/gmail-signature-generator",
    siteName: "Sig Signature",
    type: "website",
    images: [
      {
        url: "https://www.sigsignature.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Sig Signature Gmail Signature Generator",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gmail Signature Generator | Free HTML Signatures for Google Workspace & Gmail",
    description:
      "Generate professional, dark-mode compatible HTML email signatures for Gmail. Zero clipping, dark mode certified, 1-click direct paste.",
    images: ["https://www.sigsignature.com/og-image.png"],
  },
};

const GMAIL_INSTALL_TABS: InstallTab[] = [
  {
    id: "gmail-web",
    label: "Gmail on Desktop (Web)",
    badge: "Most Popular",
    steps: [
      {
        stepNumber: "1",
        title: "Copy formatted signature in SigSignature",
        instruction:
          "Design your signature, then click 'Copy Signature'. SigSignature pipes formatted HTML directly to your clipboard using the browser's native text/html MIME type.",
        tip: "You do not need to inspect source code or copy raw HTML text.",
      },
      {
        stepNumber: "2",
        title: "Open Gmail Settings",
        instruction:
          "Open Gmail in Chrome, Safari, or Edge. Click the Gear icon (⚙) in the top right corner and click 'See all settings'.",
      },
      {
        stepNumber: "3",
        title: "Navigate to the Signature section",
        instruction:
          "Under the General tab, scroll down to the 'Signature' block. Click '+ Create new' and name your signature (e.g., 'Work Signature').",
      },
      {
        stepNumber: "4",
        title: "Paste into the signature editor",
        instruction:
          "Click inside the rich-text editing box and press Ctrl + V (Windows) or Cmd + V (Mac). Your logo, fonts, social icons, and links will paste with 100% fidelity.",
      },
      {
        stepNumber: "5",
        title: "Set signature defaults",
        instruction:
          "Directly beneath the text box under 'Signature defaults', select your newly created signature for both 'For new emails use' and 'On reply/forward use'.",
      },
      {
        stepNumber: "6",
        title: "Save changes",
        instruction:
          "Scroll to the very bottom of the page and click 'Save Changes'. Compose a new message to confirm your signature appears automatically.",
        tip: "Gmail remembers your signature across all desktop browser tabs instantly.",
      },
    ],
  },
  {
    id: "gmail-mobile",
    label: "Gmail Mobile App (iPhone & Android)",
    badge: "Auto-Sync",
    steps: [
      {
        stepNumber: "1",
        title: "Verify desktop signature is saved",
        instruction:
          "First, set up your signature on Gmail Web using the Desktop instructions. The Gmail app automatically syncs web signatures by default.",
      },
      {
        stepNumber: "2",
        title: "Open Gmail App Settings",
        instruction:
          "In the Gmail app on your iPhone, iPad, or Android device, tap the Menu icon (☰) in the top left, scroll down, and tap 'Settings'.",
      },
      {
        stepNumber: "3",
        title: "Select your Google Account",
        instruction:
          "Tap the specific email account you configured. Look for the 'Signature settings' or 'Mobile Signature' option.",
      },
      {
        stepNumber: "4",
        title: "Disable plain-text mobile signature override",
        instruction:
          "Ensure the 'Mobile Signature' toggle is turned OFF (or left completely blank). When blank, Gmail automatically attaches your rich HTML desktop signature to all mobile outgoing emails.",
        tip: "If you enter text into the mobile signature box, Gmail will override your HTML signature with plain text.",
      },
    ],
  },
  {
    id: "google-workspace",
    label: "Google Workspace (Domain Admin)",
    badge: "Enterprise",
    steps: [
      {
        stepNumber: "1",
        title: "Access Google Admin Console",
        instruction:
          "Sign in to admin.google.com with your super-admin credentials. Navigate to Apps → Google Workspace → Gmail.",
      },
      {
        stepNumber: "2",
        title: "Navigate to Compliance Settings",
        instruction:
          "Scroll to 'Compliance' or 'Routing', then find the 'Append footer' rule. Click Configure or Add Another Rule.",
      },
      {
        stepNumber: "3",
        title: "Deploy Team Signatures with SigSignature",
        instruction:
          "Alternatively, use SigSignature's Team Signatures platform: export standardized signatures for every employee via invite link or CSV export, ensuring individual personalization without manual IT burden.",
        tip: "SigSignature Team Signatures lets SDRs and executives customize direct booking links while keeping corporate branding locked.",
      },
    ],
  },
];

const GMAIL_FAQS: FaqItem[] = [
  {
    question: "Do I need to install a browser extension to add an HTML signature to Gmail?",
    answer:
      "No. Unlike older generators that require invasive Chrome extensions with read/write access to your inbox, SigSignature writes directly to your browser's clipboard using the standard W3C Clipboard API (text/html MIME type). You simply click 'Copy Signature', open your Gmail settings, and press Ctrl+V (or Cmd+V). No extensions or third-party permissions are ever required.",
  },
  {
    question: "Why does Gmail clip email messages and how does SigSignature prevent it?",
    answer:
      "Gmail automatically truncates any email message whose total raw HTML size exceeds 102 KB, replacing the footer with an unsightly '[Message clipped] View entire message' link. Generic signature generators frequently trigger this by embedding images as massive base64 data URIs directly inside the HTML (often adding 80KB+ to every single email).\n\nSigSignature compiles ultra-lean HTML tables and hosts your headshots, company logos, and social icons via a high-speed global CDN with long-term caching. The resulting signature payload is typically under 6 KB, ensuring your emails never get clipped in Gmail.",
  },
  {
    question: "How do I stop Gmail from turning my phone numbers into ugly blue underlined links?",
    answer:
      "When Gmail's webmail parser detects phone numbers, physical addresses, or URLs, it automatically wraps them in anchor tags with default blue underlines (#1155cc), clash-styling your company branding. SigSignature injects defensive inline CSS with explicit text-decoration: none and color inheritance directly into phone and address elements. This forces Gmail's parser to respect your chosen brand color palette.",
  },
  {
    question: "Does this Gmail signature generator work with Google Workspace accounts?",
    answer:
      "Yes. SigSignature is 100% compatible with both personal free @gmail.com accounts and custom-domain Google Workspace (formerly G Suite) business accounts. Whether you are an individual consultant or managing a 50-person sales team, signatures paste seamlessly into your Google Workspace user settings.",
  },
  {
    question: "Will my signature look distorted when the recipient views it in Dark Mode on mobile?",
    answer:
      "Gmail on iOS and Android applies automated color inversion algorithms in Dark Mode, which can turn transparent logos into invisible silhouettes or wash out light-colored text. SigSignature designs use high-contrast defensive containers and explicit RGB color declarations so your text remains legible and your brand assets stay crisp across both Light and Dark themes.",
  },
  {
    question: "Why did my previous signature look blurry on Retina displays?",
    answer:
      "If you upload a 50x50 pixel image and display it on a high-density Retina screen (like a modern MacBook, iPhone, or 4K monitor), the display scales each pixel by 2x or 3x, resulting in fuzzy logos and avatars. SigSignature automatically renders images with 2x physical pixel density and sets explicit logical HTML display dimensions (e.g. 100x100px asset constrained to 50x50px), ensuring razor-sharp rendering on every screen.",
  },
];

export default function GmailSignatureGeneratorPage() {
  const popularTemplates = AVAILABLE_TEMPLATES.slice(0, 3);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": GMAIL_FAQS.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  };

  return (
    <div className="relative isolate flex min-h-screen flex-col bg-[#F8FAFC] font-body text-slate-900 selection:bg-brand selection:text-white">
      {/* Background ambient lighting matching design system */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[900px] overflow-hidden"
      >
        <div className="absolute -right-[200px] -top-[240px] h-[480px] w-[560px] rounded-full bg-[#C4DFFB] opacity-50 blur-[80px] lg:-right-[372px] lg:-top-[475px] lg:h-[946px] lg:w-[1103px] lg:blur-[162px]" />
        <div className="absolute -right-[100px] -top-[170px] h-[300px] w-[320px] rounded-full bg-[#F0F8F5] opacity-50 blur-[80px] lg:-right-[216px] lg:-top-[350px] lg:h-[598px] lg:w-[616px] lg:blur-[162px]" />
      </div>

      <Navbar />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://www.sigsignature.com" },
          { name: "Gmail Signature Generator", url: "https://www.sigsignature.com/gmail-signature-generator" },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main className="flex-1">
        {/* 1. HERO SECTION */}
        <section className="pt-28 pb-14 sm:pt-32 sm:pb-16 lg:pt-36 lg:pb-20">
          <div className="mx-auto max-w-[1288px] px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              {/* Left Column: Title, Subtitle, CTA */}
              <div className="lg:col-span-6 text-left">
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/70 px-3.5 py-1 text-xs font-semibold text-[#245FD4] shadow-2xs mb-4">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#245FD4]" />
                  <span>GOOGLE WORKSPACE & GMAIL CERTIFIED</span>
                </div>
                <h1 className="font-heading text-4xl sm:text-5xl lg:text-[54px] font-semibold text-slate-900 tracking-tight leading-[1.12]">
                  The Gmail Signature <br />
                  Generator That <br />
                  <span className="text-[#245FD4]">Never Clips or Breaks.</span>
                </h1>
                <p className="mt-5 font-body text-base sm:text-[17px] text-[#475569] leading-relaxed max-w-xl">
                  Defensive table architecture, auto-linked telephone protection, and ultra-lean inline CSS compiled to stay far beneath Gmail&apos;s 102KB clipping ceiling. Copy directly into your Gmail settings with 1 click—no browser extension required.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                  <Link
                    href="/template"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-cta-gradient bg-gradient-to-r from-[#245FD4] to-[#022977] px-8 py-3.5 font-body text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
                  >
                    <span>Generate Gmail Signature</span>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </Link>
                  <Link
                    href="/template"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3.5 font-body text-sm font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition"
                  >
                    <span>Browse Gmail Templates</span>
                  </Link>
                </div>

                <div className="mt-6 flex items-center gap-4 text-xs text-slate-500 font-body">
                  <span className="flex items-center gap-1.5">
                    <svg className="h-4 w-4 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Zero Chrome Extension</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <svg className="h-4 w-4 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Dark Mode Safe</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <svg className="h-4 w-4 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>100% Free Forever</span>
                  </span>
                </div>
              </div>

              {/* Right Column: Live Gmail Composer Mockup */}
              <div className="lg:col-span-6">
                <GmailComposerMockup />
              </div>
            </div>
          </div>
        </section>

        {/* 2. THE 4 GMAIL RENDERING PITFALLS (AND HOW SIGSIGNATURE SOLVES THEM) */}
        <section className="py-16 sm:py-20 bg-white border-y border-slate-200/80">
          <div className="mx-auto max-w-[1288px] px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-[#245FD4]" style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}>
                Deliverability & Rendering Architecture
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-semibold text-slate-900 tracking-tight mt-2">
                Why Standard Signature Generators Break in Gmail
              </h2>
              <p className="mt-3 font-body text-sm sm:text-base text-[#64748B] leading-relaxed">
                Gmail is the world&apos;s most widely used email client, but its HTML parser has rigid limitations. Here is how we engineer around every one of them.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Card 1: 102KB Clipping */}
              <div className="rounded-2xl border border-slate-200/90 bg-[#FAFBFD] p-6 shadow-2xs hover:border-[#245FD4]/40 transition duration-200">
                <div className="h-10 w-10 rounded-xl bg-blue-50 text-[#245FD4] flex items-center justify-center font-bold mb-4">
                  102k
                </div>
                <h3 className="font-heading text-base font-bold text-slate-900 mb-2">
                  No 102KB Truncation
                </h3>
                <p className="font-body text-xs sm:text-[13px] text-slate-600 leading-relaxed">
                  Gmail clips messages exceeding 102KB, replacing footers with &apos;[Message clipped]&apos;. Generic generators paste bloated base64 data URIs. SigSignature hosts assets on a global CDN, delivering lightweight signatures under 6KB.
                </p>
              </div>

              {/* Card 2: Rogue Blue Underlines */}
              <div className="rounded-2xl border border-slate-200/90 bg-[#FAFBFD] p-6 shadow-2xs hover:border-[#245FD4]/40 transition duration-200">
                <div className="h-10 w-10 rounded-xl bg-blue-50 text-[#245FD4] flex items-center justify-center mb-4">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <h3 className="font-heading text-base font-bold text-slate-900 mb-2">
                  Zero Blue Underlines
                </h3>
                <p className="font-body text-xs sm:text-[13px] text-slate-600 leading-relaxed">
                  Mobile Gmail forcibly injects browser default blue link underlines on phone numbers and addresses. SigSignature injects inline anchor overrides so your exact brand color palette is strictly preserved.
                </p>
              </div>

              {/* Card 3: Mobile Font Scaling */}
              <div className="rounded-2xl border border-slate-200/90 bg-[#FAFBFD] p-6 shadow-2xs hover:border-[#245FD4]/40 transition duration-200">
                <div className="h-10 w-10 rounded-xl bg-blue-50 text-[#245FD4] flex items-center justify-center mb-4">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="5" y="2" width="14" height="20" rx="2" />
                    <line x1="12" y1="18" x2="12.01" y2="18" />
                  </svg>
                </div>
                <h3 className="font-heading text-base font-bold text-slate-900 mb-2">
                  Mobile Font Protection
                </h3>
                <p className="font-body text-xs sm:text-[13px] text-slate-600 leading-relaxed">
                  Gmail mobile strips &lt;style&gt; blocks in the &lt;head&gt; and bumps sub-13px text up to 14px, causing layouts to collapse. We compile inline CSS on every single cell with robust system fallback stacks.
                </p>
              </div>

              {/* Card 4: Dark Mode Rendering */}
              <div className="rounded-2xl border border-slate-200/90 bg-[#FAFBFD] p-6 shadow-2xs hover:border-[#245FD4]/40 transition duration-200">
                <div className="h-10 w-10 rounded-xl bg-blue-50 text-[#245FD4] flex items-center justify-center mb-4">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                </div>
                <h3 className="font-heading text-base font-bold text-slate-900 mb-2">
                  Dark Mode Contrast
                </h3>
                <p className="font-body text-xs sm:text-[13px] text-slate-600 leading-relaxed">
                  Gmail on mobile inverts background tones automatically, which can wash out text or turn transparent dark logos into invisible voids. Our templates incorporate contrast-protective bounds.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. STEP-BY-STEP INSTALLATION TABS */}
        <section className="py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-[1288px] px-4 sm:px-6 lg:px-8">
            <InstallationTabs
              headline="How to Add Your HTML Signature to Gmail in 60 Seconds"
              subtitle="Follow these simple step-by-step instructions to install your new professional signature across desktop, mobile, or company-wide Google Workspace."
              tabs={GMAIL_INSTALL_TABS}
            />
          </div>
        </section>

        {/* 4. CURATED GMAIL TEMPLATES SHOWCASE */}
        <section className="py-16 sm:py-20 bg-white border-y border-slate-200/80">
          <div className="mx-auto max-w-[1288px] px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#245FD4]" style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}>
                  Battle-Tested Templates
                </span>
                <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-semibold text-slate-900 tracking-tight mt-1.5">
                  Gmail-Certified Email Signatures
                </h2>
                <p className="mt-2 font-body text-sm sm:text-base text-slate-600">
                  Every template is pre-compiled to comply with Gmail&apos;s rendering engine out of the box.
                </p>
              </div>
              <Link
                href="/template"
                className="mt-4 sm:mt-0 inline-flex items-center gap-1.5 font-heading text-sm font-semibold text-[#245FD4] hover:text-[#00359F] transition"
              >
                <span>View all 20+ templates</span>
                <span>→</span>
              </Link>
            </div>

            <CuratedTemplatesGrid templates={popularTemplates} />
          </div>
        </section>

        {/* 5. TECHNICAL COMPARISON TABLE */}
        <section className="py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-[1000px] px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
                SigSignature vs Generic Signature Generators
              </h2>
              <p className="mt-2 font-body text-sm text-slate-600">
                Why thousands of modern professionals switch from legacy generators to SigSignature.
              </p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-[#F8FAFC] border-b border-slate-200 text-slate-700 font-heading">
                  <tr>
                    <th className="py-3.5 px-4 sm:px-6 font-bold">Feature / Capability</th>
                    <th className="py-3.5 px-4 sm:px-6 font-bold text-slate-400">Generic Generators</th>
                    <th className="py-3.5 px-4 sm:px-6 font-bold text-[#245FD4]">SigSignature</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-body text-slate-600">
                  <tr>
                    <td className="py-3 px-4 sm:px-6 font-medium text-slate-900">Installation Method</td>
                    <td className="py-3 px-4 sm:px-6 text-slate-500">Requires Chrome Extension or raw code</td>
                    <td className="py-3 px-4 sm:px-6 text-emerald-600 font-semibold">1-Click Direct Clipboard Paste (text/html)</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 sm:px-6 font-medium text-slate-900">Gmail 102KB Truncation Safety</td>
                    <td className="py-3 px-4 sm:px-6 text-rose-500 font-medium">Fails (80KB+ base64 image strings)</td>
                    <td className="py-3 px-4 sm:px-6 text-emerald-600 font-semibold">Safe (&lt; 6KB HTML with CDN assets)</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 sm:px-6 font-medium text-slate-900">Phone & Address Link Protection</td>
                    <td className="py-3 px-4 sm:px-6 text-slate-500">Ugly blue underlines injected by Gmail</td>
                    <td className="py-3 px-4 sm:px-6 text-emerald-600 font-semibold">Defensive inline anchor override</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 sm:px-6 font-medium text-slate-900">Dark Mode Compatibility</td>
                    <td className="py-3 px-4 sm:px-6 text-slate-500">Logos turn invisible in Dark Mode</td>
                    <td className="py-3 px-4 sm:px-6 text-emerald-600 font-semibold">Contrast-safe padding & boundaries</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 sm:px-6 font-medium text-slate-900">Pricing & Restrictions</td>
                    <td className="py-3 px-4 sm:px-6 text-slate-500">Watermarks on free tier or $15/mo</td>
                    <td className="py-3 px-4 sm:px-6 text-emerald-600 font-semibold">100% Free Forever, No Watermark</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* 6. FAQ SECTION */}
        <section className="py-16 sm:py-20 bg-white border-t border-slate-200/80">
          <div className="mx-auto max-w-[1288px] px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs font-bold uppercase tracking-wider text-[#245FD4]" style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}>
                Got Questions?
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-semibold text-slate-900 tracking-tight mt-1.5">
                Frequently Asked Questions about Gmail Signatures
              </h2>
            </div>

            <FaqAccordion items={GMAIL_FAQS} />
          </div>
        </section>

        {/* 7. BOTTOM CONVERSION CTA BANNER */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-[1288px] px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl bg-gradient-to-br from-[#00143C] via-[#00359F] to-[#245FD4] p-8 sm:p-12 lg:p-16 text-center text-white shadow-xl relative overflow-hidden">
              <div className="relative z-10 max-w-2xl mx-auto">
                <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
                  Build your Gmail signature in under 60 seconds.
                </h2>
                <p className="mt-4 font-body text-base text-blue-100 leading-relaxed">
                  No extensions, no messy code, and no monthly fees. Pick a template, enter your contact information, and paste directly into Gmail.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    href="/template"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 font-body text-sm font-bold text-[#00359F] shadow-md transition hover:bg-slate-100"
                  >
                    <span>Create Your Free Signature</span>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </Link>
                  <Link
                    href="/design-studio"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-white/40 bg-white/10 px-8 py-4 font-body text-sm font-semibold text-white backdrop-blur-xs hover:bg-white/20 transition"
                  >
                    <span>Build From Scratch</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <div className="w-full border-t border-[#D7D7D7]" />
      <Footer />
    </div>
  );
}
