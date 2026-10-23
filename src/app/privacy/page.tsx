import type { Metadata } from "next";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import SectionBadge from "@/components/landing/SectionBadge";

export const metadata: Metadata = {
  title: "Privacy Policy | SigSignature",
  description:
    "Learn how Sig Signature and The Nevon collect, use, store, and protect your personal data and uploaded assets.",
  alternates: {
    canonical: "https://www.sigsignature.com/privacy",
  },
};

const providers = [
  {
    name: "Stripe",
    function: "Payment Processing & Subscriptions",
    compliance: "PCI-DSS Level 1 Compliant",
  },
  {
    name: "Vercel / Cloudflare",
    function: "Cloud Hosting & Global CDN Delivery",
    compliance: "SOC 2 Type II, ISO 27001",
  },
  {
    name: "Transactional Mail Providers",
    function: "Account Verification & System Emails",
    compliance: "GDPR & SOC 2 Compliant",
  },
];

export default function PrivacyPage() {
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
                <SectionBadge label="DATA GOVERNANCE" />
              </div>

              <h1 className="font-heading text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-[54px] lg:leading-[1.12]">
                <span className="text-cta-gradient bg-gradient-to-r from-[#245FD4] to-[#022977] bg-clip-text text-transparent">
                  Privacy Policy
                </span>
              </h1>

              <p className="mt-4 font-body text-sm font-medium text-slate-500 sm:text-base">
                {/* Effective Date: October 2026 · The Nevon Data Protection Standard */}
              </p>

              <div className="mt-8 rounded-3xl border border-[#C1C1C1]/60 bg-white/95 p-6 text-left shadow-sm backdrop-blur-xs sm:p-8 md:p-10">
                <p className="font-body text-base leading-relaxed text-slate-700 sm:text-lg">
                  <strong className="font-semibold text-slate-900">The Nevon</strong> is committed to protecting your privacy. This Privacy Policy explains our data
                  practices regarding the collection, use, and disclosure of personal information when you use Sig
                  Signature.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* POLICY SECTIONS */}
        <section className="py-8 pb-20 sm:pb-24">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-12">
            <div className="mx-auto max-w-4xl space-y-8">
              {/* 1. Information We Collect */}
              <div className="rounded-3xl border border-[#C1C1C1]/80 bg-white p-7 shadow-xs sm:p-10">
                <span className="font-heading text-xs font-bold uppercase tracking-wider text-[#1243A3]">
                  Section 01
                </span>
                <h2 className="font-heading mt-2 text-xl font-semibold text-slate-900 sm:text-2xl">
                  Information We Collect
                </h2>
                <div className="mt-4 space-y-3 font-body text-base leading-relaxed text-slate-600">
                  <p>
                    <strong className="text-slate-900">Account Data:</strong> When registering, we collect your name,
                    email address, and cryptographically salted credentials.
                  </p>
                  <p>
                    <strong className="text-slate-900">Signature Content:</strong> Contact details you input (job
                    titles, phone numbers, addresses, social handles) to compile your signature.
                  </p>
                  <p>
                    <strong className="text-slate-900">Uploaded Media:</strong> Profile avatars, corporate logos, and
                    promotional banner images uploaded to our content delivery network.
                  </p>
                  <p>
                    <strong className="text-slate-900">Technical Telemetry:</strong> Anonymized IP addresses, browser
                    types, device viewports, and interaction telemetry to monitor application stability and performance.
                  </p>
                </div>
              </div>

              {/* 2. How We Use Your Information */}
              <div className="rounded-3xl border border-[#C1C1C1]/80 bg-white p-7 shadow-xs sm:p-10">
                <span className="font-heading text-xs font-bold uppercase tracking-wider text-[#1243A3]">
                  Section 02
                </span>
                <h2 className="font-heading mt-2 text-xl font-semibold text-slate-900 sm:text-2xl">
                  How We Use Your Information
                </h2>
                <div className="mt-4 space-y-3 font-body text-base leading-relaxed text-slate-600">
                  <ul className="list-inside list-disc space-y-2 pl-2">
                    <li>To authenticate your identity, operate your user account, and persist your saved signatures.</li>
                    <li>To compile and deliver standards-compliant HTML signature code and rendered image assets.</li>
                    <li>To process billing transactions and subscription state securely through Stripe.</li>
                    <li>To dispatch essential transactional emails (account verification, password reset, receipts).</li>
                  </ul>
                  {/* <div className="mt-4 rounded-2xl border border-blue-200 bg-blue-50/60 p-4">
                    <p className="font-heading text-xs font-bold uppercase tracking-wider text-[#1243A3]">
                      Zero Monetization Guarantee
                    </p> 
                    <p className="mt-1 font-body text-sm text-slate-700">
                      We do not sell, rent, or monetize your personal information or signature data to third-party
                      advertisers or data brokers under any circumstances.
                    </p>
                  </div> */}

                </div>
              </div>

              {/* 3. Data Storage & Security */}
              <div className="rounded-3xl border border-[#C1C1C1]/80 bg-white p-7 shadow-xs sm:p-10">
                <span className="font-heading text-xs font-bold uppercase tracking-wider text-[#1243A3]">
                  Section 03
                </span>
                <h2 className="font-heading mt-2 text-xl font-semibold text-slate-900 sm:text-2xl">
                  Data Storage &amp; Security
                </h2>
                <div className="mt-4 font-body text-base leading-relaxed text-slate-600">
                  <p>
                    All data transmitted between your browser and our servers is protected using TLS 1.3 encryption.
                    Passwords are cryptographically salted and hashed using modern memory-hard algorithms. Uploaded
                    image assets are served through secure, globally distributed CDN storage with strict access controls.
                    We maintain regular vulnerability assessments to prevent unauthorized access, disclosure, or alteration
                    of your data.
                  </p>
                </div>
              </div>

              {/* 4. Third-Party Service Providers */}
              <div className="rounded-3xl border border-[#C1C1C1]/80 bg-white p-7 shadow-xs sm:p-10">
                <span className="font-heading text-xs font-bold uppercase tracking-wider text-[#1243A3]">
                  Section 04
                </span>
                <h2 className="font-heading mt-2 text-xl font-semibold text-slate-900 sm:text-2xl">
                  Third-Party Service Providers
                </h2>
                <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
                  <table className="w-full text-left font-body text-sm">
                    <thead className="border-b border-slate-200 bg-slate-50 font-heading text-xs font-bold uppercase text-slate-700">
                      <tr>
                        <th className="px-5 py-3">Provider</th>
                        <th className="px-5 py-3">Function</th>
                        <th className="px-5 py-3">Compliance Standard</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-600">
                      {providers.map((p) => (
                        <tr key={p.name}>
                          <td className="px-5 py-3.5 font-semibold text-slate-900">{p.name}</td>
                          <td className="px-5 py-3.5">{p.function}</td>
                          <td className="px-5 py-3.5 font-medium text-[#1243A3]">{p.compliance}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 5. Your Data Rights */}
              <div className="rounded-3xl border border-[#C1C1C1]/80 bg-white p-7 shadow-xs sm:p-10">
                <span className="font-heading text-xs font-bold uppercase tracking-wider text-[#1243A3]">
                  Section 05
                </span>
                <h2 className="font-heading mt-2 text-xl font-semibold text-slate-900 sm:text-2xl">
                  Your Data Rights (GDPR &amp; CCPA/CPRA)
                </h2>
                <div className="mt-4 space-y-3 font-body text-base leading-relaxed text-slate-600">
                  <p>Depending on your jurisdiction, you have the right to:</p>
                  <ul className="list-inside list-disc space-y-1.5 pl-2">
                    <li>Access the personal information we hold about you.</li>
                    <li>Request the correction of inaccurate or incomplete personal data.</li>
                    <li>Request the complete erasure of your account, saved signatures, and uploaded image assets.</li>
                    <li>Export your signature configuration data in a structured, machine-readable format.</li>
                  </ul>
                  <p className="pt-2">
                    To exercise any of these rights, manage your account directly via Settings or contact our Data
                    Privacy team at:{" "}
                    <a href="mailto:teams@thenevon.com" className="font-semibold text-[#1243A3] underline">
                      teams@thenevon.com
                    </a>
                    .
                  </p>
                </div>
              </div>

              {/* 6. Contact Us */}
              <div className="rounded-3xl border border-[#245FD4]/30 bg-gradient-to-b from-white to-blue-50/30 p-8 text-center sm:p-10">
                <h3 className="font-heading text-xl font-semibold text-slate-900 sm:text-2xl">
                  Privacy Inquiries &amp; Data Requests
                </h3>
                <p className="mt-2 font-body text-slate-600">
                  For questions or concerns regarding this Privacy Policy or our data protection practices, please contact our team.
                </p>
                <div className="mt-6 flex justify-center">
                  <a
                    href="mailto:teams@thenevon.com"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-cta-gradient bg-gradient-to-r from-[#245FD4] to-[#022977] px-8 py-3.5 font-body text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
                  >
                    <span>Contact Privacy Team</span>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
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
