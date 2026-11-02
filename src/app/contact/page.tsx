import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import ContactForm from "@/components/contact/ContactForm";
import { ContactPageJsonLd, BreadcrumbJsonLd } from "@/components/seo/StructuredData";

export const metadata: Metadata = {
  title: "Contact Us | Sig Signature",
  description:
    "Get in touch with the Sig Signature team for technical support, business partnerships, or product inquiries.",
  alternates: {
    canonical: "https://www.sigsignature.com/contact",
  },
  openGraph: {
    title: "Contact Us | Sig Signature",
    description:
      "Get in touch with the Sig Signature team for technical support, custom template designs, and corporate partnership inquiries.",
    url: "https://www.sigsignature.com/contact",
    siteName: "Sig Signature",
    images: [
      {
        url: "https://www.sigsignature.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Contact Sig Signature Support",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us | Sig Signature",
    description:
      "Get in touch with the Sig Signature team for technical support and product inquiries.",
    images: ["https://www.sigsignature.com/og-image.png"],
  },
};

export default function ContactPage() {
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
      <ContactPageJsonLd />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://www.sigsignature.com" },
          { name: "Contact Us", url: "https://www.sigsignature.com/contact" },
        ]}
      />

      <main className="flex-1">
        {/* On mobile: pt-28 sm:pt-32 lg:pt-36 ensures ample top breathing room below the fixed floating mobile navbar */}
        <section className="pt-28 pb-14 sm:pt-32 sm:pb-16 lg:pt-36 lg:pb-24">
          <div className="mx-auto max-w-[1288px] px-4 sm:px-6 lg:px-8">
            {/* Header: Title & Subtitle */}
            <div className="max-w-3xl">
              <h1 className="font-heading text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl lg:text-[42px] lg:leading-[1.17]">
                Good conversations. <span className="text-[#245FD4]">Better signatures.</span>
              </h1>
              <p className="mt-3 font-body text-sm text-[#5A5A5A] sm:text-base leading-relaxed">
                Need a hand, have a product question, or want to share an idea? You&apos;re in the right place to connect.
              </p>
            </div>

            {/* Main 2-Column Responsive Layout */}
            <div className="mt-10 lg:mt-12 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
              {/* Left Column: Info Cards & Quick Help */}
              <div className="order-2 lg:order-1 lg:col-span-4 space-y-6">
                {/* Card 1: How can we help? */}
                <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs">
                  <h2 className="font-heading text-lg font-bold text-slate-900 tracking-tight">
                    How can we help?
                  </h2>
                  <div className="mt-5 space-y-5">
                    {/* Item 1 */}
                    <div className="flex items-start gap-3.5">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EFF6FF] text-[#245FD4]">
                        <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-heading text-sm font-bold text-slate-900">
                          A little technical help
                        </h3>
                        <p className="mt-0.5 font-body text-xs text-slate-500 leading-relaxed">
                          Tell us about your editor, export, or email-client issue.
                        </p>
                      </div>
                    </div>

                    {/* Item 2 */}
                    <div className="flex items-start gap-3.5">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EFF6FF] text-[#245FD4]">
                        <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.439a3 3 0 00-4.5 0m4.5 0H9.75m4.5 0v.75A2.25 2.25 0 0112 21.75a2.25 2.25 0 01-2.25-2.25v-.75m7.5-6.75a6 6 0 10-12 0c0 2.22 1.206 4.156 3 5.197v.553a1.5 1.5 0 001.5 1.5h3a1.5 1.5 0 001.5-1.5v-.553c1.794-1.041 3-2.977 3-5.197z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-heading text-sm font-bold text-slate-900">
                          An idea worth sharing
                        </h3>
                        <p className="mt-0.5 font-body text-xs text-slate-500 leading-relaxed">
                          Suggest a template, improvement, or a new way to use signatures.
                        </p>
                      </div>
                    </div>

                    {/* Item 3 */}
                    <div className="flex items-start gap-3.5">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EFF6FF] text-[#245FD4]">
                        <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-heading text-sm font-bold text-slate-900">
                          Privacy &amp; data
                        </h3>
                        <p className="mt-0.5 font-body text-xs text-slate-500 leading-relaxed">
                          Ask about your information or make an account data request.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 2: The answer may be one click away. */}
                <div className="rounded-3xl border border-blue-200/70 bg-[#EFF6FF] p-6 sm:p-7 shadow-xs">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#245FD4] shadow-2xs">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                    </svg>
                  </div>
                  <h3 className="font-heading mt-3.5 text-base font-bold text-slate-900 tracking-tight">
                    The answer may be one click away.
                  </h3>
                  <p className="mt-1 font-body text-xs text-slate-600 leading-relaxed">
                    Explore setup guides for Gmail and Outlook, export tips, and common questions.
                  </p>
                  <Link
                    href="/help"
                    className="mt-4 inline-flex items-center gap-1.5 font-heading text-xs font-semibold text-[#245FD4] hover:underline"
                  >
                    <span>Visit Help &amp; Support</span>
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
                </div>

                {/* Security note */}
                <div className="flex items-center gap-2 text-[11px] text-slate-400 font-body px-1">
                  <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                  <span>Please don&apos;t send passwords, payment details, or sensitive personal information.</span>
                </div>
              </div>

              {/* Right Column: Interactive Contact Form */}
              <div className="order-1 lg:order-2 lg:col-span-8">
                <ContactForm />
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
