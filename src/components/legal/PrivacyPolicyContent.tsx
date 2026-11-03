"use client";

import Link from "next/link";

interface PrivacyPolicyContentProps {
  isDrawer?: boolean;
}

export default function PrivacyPolicyContent({ isDrawer = false }: PrivacyPolicyContentProps) {
  return (
    <div className={`w-full ${isDrawer ? "p-6 sm:p-8 md:p-10" : ""}`}>
      {/* =========================================================================
          HERO BLOCK: "Your Privacy Matters to Us" + "IN BRIEF" summary card
         ========================================================================= */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 pb-10 sm:pb-12 border-b border-slate-200/80">
        <div className="max-w-xl">
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-[56px] font-semibold text-[#0B1A3D] tracking-tight leading-[1.08]">
            Your Privacy <br />
            <span className="text-[#245FD4]">Matters to Us</span>
          </h1>
          <p
            className="mt-4 sm:mt-5 font-body text-sm sm:text-base text-[#64748B] leading-relaxed max-w-lg"
            style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
          >
            At Sig Signature, we value your trust. This Privacy Policy explains how we collect, use, and protect your information when you use our website and services.
          </p>
        </div>

        {/* IN BRIEF Card matching Figma */}
        <div className="w-full lg:w-[320px] shrink-0 rounded-2xl border border-slate-200/90 bg-[#FAFBFD] p-5 sm:p-6 shadow-2xs">
          <span
            className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]"
            style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
          >
            IN BRIEF
          </span>
          <ul
            className="mt-3 space-y-2.5 font-body text-xs sm:text-[13px] text-slate-700 leading-snug"
            style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
          >
            <li className="flex items-start gap-2">
              <span className="text-[#245FD4] font-bold">•</span>
              <span>We never sell your data.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#245FD4] font-bold">•</span>
              <span>Data is encrypted in transit with TLS 1.3.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#245FD4] font-bold">•</span>
              <span>You can access, correct, export or erase your data.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* =========================================================================
          SECTION 01: Information We Collect (4 Grid Cards)
         ========================================================================= */}
      <section className="pt-10 sm:pt-12 pb-10 sm:pb-12 border-b border-slate-200/80">
        <div className="mb-6">
          <span
            className="font-heading text-sm font-bold text-[#245FD4]"
            style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
          >
            01
          </span>
          <h2
            className="mt-1 font-heading text-xl sm:text-2xl font-semibold text-[#0B1A3D] tracking-tight"
            style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
          >
            Information We Collect
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {/* Card 1: Account Data */}
          <div className="flex items-start gap-3.5 sm:gap-4 rounded-xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-2xs hover:border-[#245FD4]/40 transition duration-150">
            <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#245FD4]">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div>
              <h3
                className="font-heading text-sm sm:text-base font-bold text-slate-900"
                style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
              >
                Account Data
              </h3>
              <p
                className="mt-1 font-body text-xs sm:text-[13px] text-[#64748B] leading-relaxed"
                style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
              >
                Your name, email address, and hashed authentication credentials.
              </p>
            </div>
          </div>

          {/* Card 2: Signature Content */}
          <div className="flex items-start gap-3.5 sm:gap-4 rounded-xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-2xs hover:border-[#245FD4]/40 transition duration-150">
            <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#245FD4]">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
              </svg>
            </div>
            <div>
              <h3
                className="font-heading text-sm sm:text-base font-bold text-slate-900"
                style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
              >
                Signature Content
              </h3>
              <p
                className="mt-1 font-body text-xs sm:text-[13px] text-[#64748B] leading-relaxed"
                style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
              >
                Job titles, phone numbers, addresses, and social handles you input.
              </p>
            </div>
          </div>

          {/* Card 3: Uploaded Media */}
          <div className="flex items-start gap-3.5 sm:gap-4 rounded-xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-2xs hover:border-[#245FD4]/40 transition duration-150">
            <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#245FD4]">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
            <div>
              <h3
                className="font-heading text-sm sm:text-base font-bold text-slate-900"
                style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
              >
                Uploaded Media
              </h3>
              <p
                className="mt-1 font-body text-xs sm:text-[13px] text-[#64748B] leading-relaxed"
                style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
              >
                Profile avatars, corporate logos, and promotional banner images on our CDN.
              </p>
            </div>
          </div>

          {/* Card 4: Technical & Usage Telemetry */}
          <div className="flex items-start gap-3.5 sm:gap-4 rounded-xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-2xs hover:border-[#245FD4]/40 transition duration-150">
            <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#245FD4]">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div>
              <h3
                className="font-heading text-sm sm:text-base font-bold text-slate-900"
                style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
              >
                Technical &amp; Usage Telemetry
              </h3>
              <p
                className="mt-1 font-body text-xs sm:text-[13px] text-[#64748B] leading-relaxed"
                style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
              >
                Anonymized IP addresses, browser types, device viewports, and interaction telemetry for stability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 02: How We Use Your Information (2-Column + Highlight Box)
         ========================================================================= */}
      <section className="pt-10 sm:pt-12 pb-10 sm:pb-12 border-b border-slate-200/80">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
          {/* Left Column: Heading */}
          <div className="lg:col-span-5">
            <span
              className="font-heading text-sm font-bold text-[#245FD4]"
              style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
            >
              02
            </span>
            <h2
              className="mt-1 font-heading text-2xl sm:text-3xl lg:text-[36px] font-normal text-[#0B1A3D] leading-tight"
              style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
            >
              How We <br />
              Use Your <br />
              Information
            </h2>
          </div>

          {/* Right Column: Bullets & Highlight Box */}
          <div className="lg:col-span-7 space-y-3 font-body text-xs sm:text-sm text-slate-700 leading-relaxed" style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}>
            <ul className="space-y-2.5">
              <li className="flex items-start gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#245FD4] shrink-0 mt-2" />
                <span>To authenticate your identity, operate your user account, and persist your saved signatures.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#245FD4] shrink-0 mt-2" />
                <span>To compile and deliver standards-compliant HTML signature code and rendered image assets.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#245FD4] shrink-0 mt-2" />
                <span>To process billing transactions and subscription state through Stripe.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#245FD4] shrink-0 mt-2" />
                <span>To dispatch transactional emails: account verification, password reset, billing receipts.</span>
              </li>
            </ul>

            {/* We never sell your data callout */}
            <div className="mt-6 rounded-xl border-l-4 border-[#245FD4] bg-[#F0F5FE] p-4 sm:p-5">
              <h4
                className="font-heading text-sm font-bold text-slate-900"
                style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
              >
                We never sell your data.
              </h4>
              <p
                className="mt-1 text-xs sm:text-[13px] text-[#475569] leading-relaxed"
                style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
              >
                Monetization Policy: We do not sell, rent, or monetize your personal information or signature data to third-party advertisers or data brokers under any circumstances.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 03: Data Storage & Security
         ========================================================================= */}
      <section className="pt-10 sm:pt-12 pb-10 sm:pb-12 border-b border-slate-200/80">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
          <div className="lg:col-span-5">
            <span
              className="font-heading text-sm font-bold text-[#245FD4]"
              style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
            >
              03
            </span>
            <h2
              className="mt-1 font-heading text-2xl sm:text-3xl lg:text-[36px] font-normal text-[#0B1A3D] leading-tight"
              style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
            >
              Data Storage &amp; <br />
              Security
            </h2>
          </div>

          <div
            className="lg:col-span-7 space-y-4 font-body text-xs sm:text-sm text-slate-600 leading-relaxed"
            style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
          >
            <p>
              All data between your browser and our servers is protected using <strong className="text-slate-900 font-semibold">TLS 1.3 encryption</strong>. Uploaded image assets are served through secure, globally distributed CDN storage with strict access controls. Passwords are salted and hashed.
            </p>
            <p>
              We maintain regular vulnerability assessments to prevent unauthorized access, disclosure, or alteration of your data.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 04: Third -Party Services (Table)
         ========================================================================= */}
      <section className="pt-10 sm:pt-12 pb-10 sm:pb-12 border-b border-slate-200/80">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
          <div className="lg:col-span-5">
            <span
              className="font-heading text-sm font-bold text-[#245FD4]"
              style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
            >
              04
            </span>
            <h2
              className="mt-1 font-heading text-2xl sm:text-3xl lg:text-[36px] font-normal text-[#0B1A3D] leading-tight"
              style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
            >
              Third -Party <br />
              Services
            </h2>
          </div>

          <div className="lg:col-span-7">
            <p
              className="font-body text-xs sm:text-sm text-slate-600 leading-relaxed mb-5"
              style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
            >
              We use trusted infrastructure providers to operate the Service. Each maintains industry-recognized security and compliance standards.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-[13px] border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-[#64748B]">
                    <th className="pb-2.5 font-bold uppercase tracking-wider text-[11px]" style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}>PROVIDER</th>
                    <th className="pb-2.5 font-bold uppercase tracking-wider text-[11px]" style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}>FUNCTION</th>
                    <th className="pb-2.5 font-bold uppercase tracking-wider text-[11px]" style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}>COMPLIANCE</th>
                  </tr>
                </thead>
                <tbody
                  className="divide-y divide-slate-100 font-body text-slate-700"
                  style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                >
                  <tr>
                    <td className="py-3 font-semibold text-slate-900 pr-3">Stripe</td>
                    <td className="py-3 text-slate-600 pr-3">Payment Processing &amp; Invoices</td>
                    <td className="py-3 text-slate-500">PCI-DSS Level 1</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-semibold text-slate-900 pr-3">Vercel / Cloudflare</td>
                    <td className="py-3 text-slate-600 pr-3">Cloud Hosting &amp; Global CDN</td>
                    <td className="py-3 text-slate-500">SOC 2 Type II, ISO 27001</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-semibold text-slate-900 pr-3">Resend / SendGrid</td>
                    <td className="py-3 text-slate-600 pr-3">Transactional Email Delivery</td>
                    <td className="py-3 text-slate-500">GDPR, SOC 2</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 05: Your Data Rights (2x2 Grid)
         ========================================================================= */}
      <section className="pt-10 sm:pt-12 pb-10 sm:pb-12 border-b border-slate-200/80">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
          <div className="lg:col-span-5">
            <span
              className="font-heading text-sm font-bold text-[#245FD4]"
              style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
            >
              05
            </span>
            <h2
              className="mt-1 font-heading text-2xl sm:text-3xl lg:text-[36px] font-normal text-[#0B1A3D] leading-tight"
              style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
            >
              Your Data <br />
              Rights
            </h2>
          </div>

          <div className="lg:col-span-7">
            <p
              className="font-body text-xs sm:text-sm text-slate-600 leading-relaxed mb-6"
              style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
            >
              Depending on your jurisdiction (including GDPR and CCPA/CPRA rights), you have the right to:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
              <div>
                <h4
                  className="font-heading text-sm font-bold text-slate-900"
                  style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                >
                  Access
                </h4>
                <p
                  className="mt-1 font-body text-xs text-[#64748B] leading-relaxed"
                  style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                >
                  The personal information we hold about you.
                </p>
              </div>

              <div>
                <h4
                  className="font-heading text-sm font-bold text-slate-900"
                  style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                >
                  Correction
                </h4>
                <p
                  className="mt-1 font-body text-xs text-[#64748B] leading-relaxed"
                  style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                >
                  Request correction of inaccurate or incomplete personal data.
                </p>
              </div>

              <div>
                <h4
                  className="font-heading text-sm font-bold text-slate-900"
                  style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                >
                  Erasure
                </h4>
                <p
                  className="mt-1 font-body text-xs text-[#64748B] leading-relaxed"
                  style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                >
                  Request complete erasure of your account, signatures, and uploaded assets.
                </p>
              </div>

              <div>
                <h4
                  className="font-heading text-sm font-bold text-slate-900"
                  style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                >
                  Export
                </h4>
                <p
                  className="mt-1 font-body text-xs text-[#64748B] leading-relaxed"
                  style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                >
                  Your signature configuration data in a structured, machine-readable format.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 06: Contact Us & "Have Questions?" Banner
         ========================================================================= */}
      <section className="pt-10 sm:pt-12">
        <div className="mb-8">
          <span
            className="font-heading text-sm font-bold text-[#245FD4]"
            style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
          >
            06
          </span>
          <h2
            className="mt-1 font-heading text-xl sm:text-2xl font-semibold text-[#0B1A3D] tracking-tight"
            style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
          >
            Contact Us
          </h2>
          <p
            className="mt-2 font-body text-xs sm:text-sm text-slate-600 leading-relaxed"
            style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
          >
            For questions or concerns regarding this Privacy Policy or our data protection practices, contact The Nevon at{" "}
            <a
              href="mailto:thenevon@sigsignature.com"
              className="text-[#245FD4] font-semibold underline underline-offset-2 decoration-[#245FD4] hover:text-[#022977] hover:decoration-[#022977] transition-colors"
            >
              thenevon@sigsignature.com
            </a>
            .
          </p>
        </div>

        {/* Have Questions? Banner matching Figma */}
        <div className="rounded-2xl border border-blue-100 bg-[#EEF4FF] p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-3.5 sm:gap-4">
            <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-[#245FD4] text-white shadow-2xs">
              <svg className="h-5 w-5 sm:h-6 sm:w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </div>
            <div>
              <h3
                className="font-heading text-base sm:text-lg font-semibold text-[#17233F]"
                style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
              >
                Have Questions?
              </h3>
              <p
                className="mt-0.5 font-body text-xs sm:text-sm text-[#64748B]"
                style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
              >
                If you have any questions about this Privacy Policy, feel free to reach out to us.
              </p>
            </div>
          </div>

          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-full bg-[#245FD4] hover:bg-[#00359F] px-6 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-2xs transition shrink-0 self-stretch sm:self-auto"
            style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
          >
            <span>Contact Us</span>
            <span className="ml-1">→</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
