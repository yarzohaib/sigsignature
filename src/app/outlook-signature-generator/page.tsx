import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { BreadcrumbJsonLd } from "@/components/seo/StructuredData";
import OutlookComposerMockup from "@/components/seo-landing/OutlookComposerMockup";
import InstallationTabs, { InstallTab } from "@/components/seo-landing/InstallationTabs";
import FaqAccordion, { FaqItem } from "@/components/seo-landing/FaqAccordion";
import { AVAILABLE_TEMPLATES } from "@/lib/templatesData";
import CuratedTemplatesGrid from "@/components/seo-landing/CuratedTemplatesGrid";

export const metadata: Metadata = {
  title: "Outlook Signature Generator | Bulletproof HTML Signatures for Microsoft 365 & Outlook",
  description:
    "Generate professional HTML email signatures engineered for Microsoft Outlook 365, Windows desktop, and Mac. Solves Word engine flexbox collapse and 4K logo scaling.",
  alternates: {
    canonical: "https://www.sigsignature.com/outlook-signature-generator",
  },
  openGraph: {
    title: "Outlook Signature Generator | Bulletproof HTML Signatures for Microsoft 365 & Outlook",
    description:
      "Generate professional HTML email signatures engineered for Microsoft Outlook 365, Windows desktop, and Mac. Solves Word engine flexbox collapse and 4K logo scaling.",
    url: "https://www.sigsignature.com/outlook-signature-generator",
    siteName: "Sig Signature",
    type: "website",
    images: [
      {
        url: "https://www.sigsignature.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Sig Signature Outlook Signature Generator",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Outlook Signature Generator | Bulletproof HTML Signatures for Microsoft 365 & Outlook",
    description:
      "Generate professional HTML email signatures engineered for Microsoft Outlook. Zero flexbox collapse, zero logo blowout, 100% free.",
    images: ["https://www.sigsignature.com/og-image.png"],
  },
};

const OUTLOOK_INSTALL_TABS: InstallTab[] = [
  {
    id: "outlook-windows",
    label: "Outlook 365 / Desktop (Windows)",
    badge: "Word Engine",
    steps: [
      {
        stepNumber: "1",
        title: "Copy your signature in SigSignature",
        instruction:
          "Pick an Outlook-certified template and click 'Copy Signature'. SigSignature packages formatted HTML and MSO conditionals directly to your clipboard.",
      },
      {
        stepNumber: "2",
        title: "Open Signatures in Outlook Desktop",
        instruction:
          "Open Microsoft Outlook on your Windows PC. Click File → Options → Mail → Signatures... (or click the 'Signature' dropdown in the ribbon while writing an email).",
      },
      {
        stepNumber: "3",
        title: "Create a new signature",
        instruction:
          "Under 'Select signature to edit', click 'New' and type a descriptive name (e.g. 'Corporate Signature').",
      },
      {
        stepNumber: "4",
        title: "Paste into the signature field",
        instruction:
          "Click inside the lower 'Edit signature' box and press Ctrl + V. The rigid table layout, brand colors, and constrained images will paste with pixel precision.",
        tip: "Do not resize the logo with your mouse in Outlook's editor; our explicit HTML width attributes are already mathematically locked.",
      },
      {
        stepNumber: "5",
        title: "Set account defaults",
        instruction:
          "Under 'Choose default signature' on the right, assign your signature to your email account for 'New messages' and 'Replies/forwards'.",
      },
      {
        stepNumber: "6",
        title: "Click OK to save",
        instruction:
          "Click 'OK' to close the dialog, then compose a new email to verify your signature renders cleanly.",
      },
    ],
  },
  {
    id: "outlook-web",
    label: "Outlook on the Web & New Outlook",
    badge: "Browser & OWA",
    steps: [
      {
        stepNumber: "1",
        title: "Open Outlook Web Settings",
        instruction:
          "Sign in to outlook.office.com (or open the 'New Outlook for Windows' client). Click the Gear icon (⚙) in the top-right toolbar.",
      },
      {
        stepNumber: "2",
        title: "Navigate to Signatures",
        instruction:
          "In the Settings pane, select 'Accounts' (or 'Mail') → 'Signatures' (or 'Compose and reply').",
      },
      {
        stepNumber: "3",
        title: "Create and Paste",
        instruction:
          "Click '+ New signature', name your signature, click into the editor box, and press Ctrl + V (or Cmd + V).",
      },
      {
        stepNumber: "4",
        title: "Configure defaults and Save",
        instruction:
          "Under 'Select default signatures', assign your signature to new messages and replies, then click 'Save'.",
        tip: "Outlook Web uses modern browser rendering (Chromium/Edge), while maintaining full visual parity with recipients viewing on desktop.",
      },
    ],
  },
  {
    id: "outlook-mac",
    label: "Outlook for Mac",
    badge: "macOS WebKit",
    steps: [
      {
        stepNumber: "1",
        title: "Open Outlook Preferences",
        instruction:
          "In Outlook for Mac, click 'Outlook' in the top Apple menu bar → 'Settings' (or 'Preferences', shortcut Cmd + ,).",
      },
      {
        stepNumber: "2",
        title: "Select Signatures",
        instruction:
          "Click on the 'Signatures' icon under the Email section.",
      },
      {
        stepNumber: "3",
        title: "Add and Paste Signature",
        instruction:
          "Click the '+' button below the signature list, name it, and paste your signature using Cmd + V into the right-hand preview panel.",
      },
      {
        stepNumber: "4",
        title: "Assign Default Account",
        instruction:
          "Under 'Choose default signature', select your signature for 'New messages' and 'Replies/forwards'. Close the window to save automatically.",
      },
    ],
  },
];

const OUTLOOK_FAQS: FaqItem[] = [
  {
    question: "Why do email signatures frequently break or look distorted in Microsoft Outlook?",
    answer:
      "Unlike modern webmail clients that use browser engines (Chromium or WebKit), desktop versions of Microsoft Outlook on Windows (including Outlook 365, 2021, 2019, and 2016) parse HTML using the Microsoft Word typesetting engine (wwlib.dll), an architectural legacy dating back to Office 2007.\n\nBecause Word was engineered for physical print pagination rather than web layout, it completely ignores modern CSS properties like Flexbox, CSS Grid, and max-width. Div-based signatures collapse into unformatted vertical stacks, and unconstrained logos blow up to full image pixel resolution.",
  },
  {
    question: "How does SigSignature prevent the 4K / High-DPI logo blowout bug in Outlook?",
    answer:
      "A classic email signature bug occurs when a 400x400px logo asset is restricted via CSS (e.g. style='max-width: 80px;'). Microsoft Word discards max-width, reading the physical image file dimensions and rendering the logo at full 400px width. Furthermore, on Windows machines with 125% or 150% display scaling, Word calculates dimensions in 96 DPI points.\n\nSigSignature neutralizes this bug by embedding rigid HTML attribute dimensions (width='80' height='80') in tandem with inline CSS style declarations (width: 80px; height: 80px; max-width: 80px;). Word respects the physical HTML attributes, locking your logo strictly to its intended pixel size.",
  },
  {
    question: "Why does Outlook change my custom Google or Adobe fonts to Times New Roman?",
    answer:
      "Microsoft Outlook desktop blocks external web font downloads (like @import or <link href='fonts.googleapis.com'>) by default as an enterprise security measure. When a template specifies only a custom web font (such as 'Inter' or 'Montserrat'), Word fails to locate the font file on the Windows machine and reverts to its default typeface: Times New Roman.\n\nSigSignature solves this by compiling defensive multi-tier font stacks with universal Microsoft-native fallback typefaces (e.g. font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Calibri, Arial, sans-serif;). If a recipient's Outlook restricts custom fonts, your signature seamlessly renders in Segoe UI or Calibri with identical line-height and letter-spacing.",
  },
  {
    question: "Does SigSignature work with both Classic Outlook and the New Outlook for Windows?",
    answer:
      "Yes. The 'New Outlook for Windows' (which shares a codebase with Outlook on the Web) uses the Microsoft Edge WebView2 rendering engine, while 'Classic Outlook 365' continues to use the Word rendering engine. SigSignature code is built with defensive dual-engine compilation: modern HTML for web and WebKit clients, coupled with MSO table structures for Classic desktop Outlook.",
  },
  {
    question: "Why does Outlook add random 15px to 20px blank white gaps between my signature lines?",
    answer:
      "In Word's document typography model, <div>, <p>, and <tr> tags inherit default paragraph spacing and margin-collapsing behaviors. SigSignature eliminates phantom whitespace by injecting mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse; on every table element, and zeroing margins and line-height padding across all contact cells.",
  },
  {
    question: "Can our IT department deploy these signatures across all Microsoft 365 Exchange users?",
    answer:
      "Yes. You can export complete, clean HTML source files for deployment via Microsoft 365 Exchange Online Mail Flow Rules (disclaimer actions). Alternatively, our SigSignature Team Signatures dashboard allows administrators to generate personalized signature links for every sales rep or team member with corporate branding locked.",
  },
];

export default function OutlookSignatureGeneratorPage() {
  const corporateTemplates = AVAILABLE_TEMPLATES.filter(
    (t) => t.category === "Corporate" || t.category === "Minimal"
  ).slice(0, 3);

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
          { name: "Outlook Signature Generator", url: "https://www.sigsignature.com/outlook-signature-generator" },
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
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/70 px-3.5 py-1 text-xs font-semibold text-[#0078D4] shadow-2xs mb-4">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#0078D4]" />
                  <span>MICROSOFT 365, WINDOWS & MAC CERTIFIED</span>
                </div>
                <h1 className="font-heading text-4xl sm:text-5xl lg:text-[54px] font-semibold text-slate-900 tracking-tight leading-[1.12]">
                  The Outlook Signature <br />
                  Generator Engineered for <br />
                  <span className="text-[#0078D4]">Microsoft Word.</span>
                </h1>
                <p className="mt-5 font-body text-base sm:text-[17px] text-[#475569] leading-relaxed max-w-xl">
                  Outlook desktop uses Microsoft Word 2007 (wwlib.dll) to parse HTML emails. We compile rigid nested tables, explicit HTML dimensions, and MSO spacing resets so your signature never explodes, squishes, or reverts to Times New Roman.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                  <Link
                    href="/templates"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-cta-gradient bg-gradient-to-r from-[#0078D4] to-[#022977] px-8 py-3.5 font-body text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
                  >
                    <span>Generate Outlook Signature</span>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </Link>
                  <Link
                    href="/templates"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3.5 font-body text-sm font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition"
                  >
                    <span>Browse Corporate Templates</span>
                  </Link>
                </div>

                <div className="mt-6 flex items-center gap-4 text-xs text-slate-500 font-body">
                  <span className="flex items-center gap-1.5">
                    <svg className="h-4 w-4 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Zero Flexbox Collapse</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <svg className="h-4 w-4 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>High-DPI Logo Lock</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <svg className="h-4 w-4 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>100% Free Forever</span>
                  </span>
                </div>
              </div>

              {/* Right Column: Live Outlook Composer Mockup */}
              <div className="lg:col-span-6">
                <OutlookComposerMockup />
              </div>
            </div>
          </div>
        </section>

        {/* 2. THE 4 CRITICAL OUTLOOK RENDERING TRAPS */}
        <section className="py-16 sm:py-20 bg-white border-y border-slate-200/80">
          <div className="mx-auto max-w-[1288px] px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0078D4]" style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}>
                The Engineering Behind Corporate Email
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-semibold text-slate-900 tracking-tight mt-2">
                4 Critical Ways Microsoft Word Destroys Email Signatures
              </h2>
              <p className="mt-3 font-body text-sm sm:text-base text-[#64748B] leading-relaxed">
                Over 60% of corporate desktop email opens happen in Outlook. Here is why generic web code fails in Outlook desktop—and how SigSignature neutralizes each problem.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Card 1: Logo Blowout */}
              <div className="rounded-2xl border border-slate-200/90 bg-[#FAFBFD] p-6 shadow-2xs hover:border-[#0078D4]/40 transition duration-200">
                <div className="h-10 w-10 rounded-xl bg-blue-50 text-[#0078D4] flex items-center justify-center font-bold mb-4">
                  DPI
                </div>
                <h3 className="font-heading text-base font-bold text-slate-900 mb-2">
                  High-DPI Logo Blowout
                </h3>
                <p className="font-body text-xs sm:text-[13px] text-slate-600 leading-relaxed">
                  Word discards CSS max-width. On 125% or 150% Windows display scaling, unconstrained images render at full physical dimensions, taking over the recipient&apos;s screen. We compile explicit HTML width/height attributes that Word cannot ignore.
                </p>
              </div>

              {/* Card 2: Flexbox Collapse */}
              <div className="rounded-2xl border border-slate-200/90 bg-[#FAFBFD] p-6 shadow-2xs hover:border-[#0078D4]/40 transition duration-200">
                <div className="h-10 w-10 rounded-xl bg-blue-50 text-[#0078D4] flex items-center justify-center mb-4">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="18" rx="1" />
                    <rect x="14" y="3" width="7" height="18" rx="1" />
                  </svg>
                </div>
                <h3 className="font-heading text-base font-bold text-slate-900 mb-2">
                  Flexbox & Grid Collapse
                </h3>
                <p className="font-body text-xs sm:text-[13px] text-slate-600 leading-relaxed">
                  Modern CSS display: flex completely collapses in Outlook, dropping logos above text and turning horizontal columns into vertical mush. We build rigid nested table cells with exact pixel column widths.
                </p>
              </div>

              {/* Card 3: 20px Phantom Gap Bug */}
              <div className="rounded-2xl border border-slate-200/90 bg-[#FAFBFD] p-6 shadow-2xs hover:border-[#0078D4]/40 transition duration-200">
                <div className="h-10 w-10 rounded-xl bg-blue-50 text-[#0078D4] flex items-center justify-center mb-4">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="4" y1="6" x2="20" y2="6" />
                    <line x1="4" y1="18" x2="20" y2="18" />
                    <line x1="12" y1="6" x2="12" y2="18" strokeDasharray="2 2" />
                  </svg>
                </div>
                <h3 className="font-heading text-base font-bold text-slate-900 mb-2">
                  20px Whitespace Gaps
                </h3>
                <p className="font-body text-xs sm:text-[13px] text-slate-600 leading-relaxed">
                  Word injects print-document paragraph margins into HTML tags, producing unprompted blank spacing. We inject mso-table-lspace: 0pt and mso-table-rspace: 0pt resets to guarantee laser-tight spacing.
                </p>
              </div>

              {/* Card 4: Times New Roman Reversion */}
              <div className="rounded-2xl border border-slate-200/90 bg-[#FAFBFD] p-6 shadow-2xs hover:border-[#0078D4]/40 transition duration-200">
                <div className="h-10 w-10 rounded-xl bg-blue-50 text-[#0078D4] flex items-center justify-center mb-4">
                  <span className="font-serif font-bold text-base">Aa</span>
                </div>
                <h3 className="font-heading text-base font-bold text-slate-900 mb-2">
                  Times New Roman Reversion
                </h3>
                <p className="font-body text-xs sm:text-[13px] text-slate-600 leading-relaxed">
                  Outlook blocks external web font downloads, turning missing fonts into serif Times New Roman. Our multi-tiered typography stacks cleanly fall back to Segoe UI and Calibri with perfect line height.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. STEP-BY-STEP INSTALLATION TABS */}
        <section className="py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-[1288px] px-4 sm:px-6 lg:px-8">
            <InstallationTabs
              headline="How to Install Your Signature in Any Outlook Version"
              subtitle="Whether you are using classic Outlook 365 on Windows, the New Outlook for Windows, or Outlook for Mac, follow these direct copy-paste instructions."
              tabs={OUTLOOK_INSTALL_TABS}
            />
          </div>
        </section>

        {/* 4. CURATED CORPORATE OUTLOOK TEMPLATES */}
        <section className="py-16 sm:py-20 bg-white border-y border-slate-200/80">
          <div className="mx-auto max-w-[1288px] px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#0078D4]" style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}>
                  Executive & Corporate
                </span>
                <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-semibold text-slate-900 tracking-tight mt-1.5">
                  Outlook-Certified Signature Designs
                </h2>
                <p className="mt-2 font-body text-sm sm:text-base text-slate-600">
                  Pre-configured with rigid table grids and MSO conditional comments.
                </p>
              </div>
              <Link
                href="/templates"
                className="mt-4 sm:mt-0 inline-flex items-center gap-1.5 font-heading text-sm font-semibold text-[#0078D4] hover:text-[#022977] transition"
              >
                <span>View all corporate templates</span>
                <span>→</span>
              </Link>
            </div>

            <CuratedTemplatesGrid templates={corporateTemplates} />
          </div>
        </section>

        {/* 5. TECHNICAL COMPARISON TABLE */}
        <section className="py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-[1000px] px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
                Outlook Compatibility Matrix
              </h2>
              <p className="mt-2 font-body text-sm text-slate-600">
                How SigSignature compares against legacy HTML signature tools.
              </p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-[#F8FAFC] border-b border-slate-200 text-slate-700 font-heading">
                  <tr>
                    <th className="py-3.5 px-4 sm:px-6 font-bold">Rendering Criteria</th>
                    <th className="py-3.5 px-4 sm:px-6 font-bold text-slate-400">Generic Generators</th>
                    <th className="py-3.5 px-4 sm:px-6 font-bold text-[#0078D4]">SigSignature</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-body text-slate-600">
                  <tr>
                    <td className="py-3 px-4 sm:px-6 font-medium text-slate-900">Layout Engine</td>
                    <td className="py-3 px-4 sm:px-6 text-rose-500 font-medium">CSS Flexbox (Breaks in Outlook)</td>
                    <td className="py-3 px-4 sm:px-6 text-emerald-600 font-semibold">Nested HTML Tables (100% Word Compatible)</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 sm:px-6 font-medium text-slate-900">Logo Dimension Safeguards</td>
                    <td className="py-3 px-4 sm:px-6 text-rose-500 font-medium">max-width only (Blows up on 4K)</td>
                    <td className="py-3 px-4 sm:px-6 text-emerald-600 font-semibold">Rigid HTML attributes + CSS constraints</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 sm:px-6 font-medium text-slate-900">Vector & Icon Support</td>
                    <td className="py-3 px-4 sm:px-6 text-rose-500 font-medium">Inline SVG (Renders red X box in Outlook)</td>
                    <td className="py-3 px-4 sm:px-6 text-emerald-600 font-semibold">2x Retina CDN-hosted PNG icons</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 sm:px-6 font-medium text-slate-900">Whitespace Control</td>
                    <td className="py-3 px-4 sm:px-6 text-slate-500">Unprompted 20px gaps from Word margins</td>
                    <td className="py-3 px-4 sm:px-6 text-emerald-600 font-semibold">Explicit mso-table-lspace/rspace resets</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 sm:px-6 font-medium text-slate-900">Fallback Typography</td>
                    <td className="py-3 px-4 sm:px-6 text-slate-500">Reverts to Times New Roman</td>
                    <td className="py-3 px-4 sm:px-6 text-emerald-600 font-semibold">Native Segoe UI / Calibri font stacks</td>
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
              <span className="text-xs font-bold uppercase tracking-wider text-[#0078D4]" style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}>
                Technical FAQ
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-semibold text-slate-900 tracking-tight mt-1.5">
                Frequently Asked Questions about Outlook Signatures
              </h2>
            </div>

            <FaqAccordion items={OUTLOOK_FAQS} />
          </div>
        </section>

        {/* 7. BOTTOM CONVERSION CTA BANNER */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-[1288px] px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl bg-gradient-to-br from-[#00143C] via-[#00359F] to-[#0078D4] p-8 sm:p-12 lg:p-16 text-center text-white shadow-xl relative overflow-hidden">
              <div className="relative z-10 max-w-2xl mx-auto">
                <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
                  Never send a broken signature to an Outlook client again.
                </h2>
                <p className="mt-4 font-body text-base text-blue-100 leading-relaxed">
                  Generate pixel-perfect signatures compiled specifically for Microsoft Outlook and enterprise Microsoft 365 environments.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    href="/templates"
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
