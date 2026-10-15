import type { Metadata } from "next";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import SectionBadge from "@/components/landing/SectionBadge";

export const metadata: Metadata = {
  title: "Terms of Service | Sig Signature",
  description:
    "Terms of Service governing the use of Sig Signature web application and services provided by The Nevon.",
};

const termsSections = [
  {
    number: "01",
    title: "Description of Service",
    content: (
      <p>
        Sig Signature provides users with a web-based email signature creation, management, and code
        compilation tool. The Service is provided in two tiers: a Free Tier with restricted signature
        quantities and core features, and a Pro Tier providing expanded signature creation, premium
        styling templates, and administrative features subject to recurring subscription fees.
      </p>
    ),
  },
  {
    number: "02",
    title: "User Accounts & Responsibilities",
    content: (
      <p>
        To access certain features of the Service, you must register for an account using a valid email
        address. You are responsible for safeguarding your login credentials and for all activities that
        occur under your account. You agree to provide accurate, current, and complete information during
        registration and to update such information to maintain its accuracy.
      </p>
    ),
  },
  {
    number: "03",
    title: "Acceptable Use Policy",
    content: (
      <div className="space-y-3">
        <p>You agree not to use the Service to create, distribute, or facilitate:</p>
        <ul className="list-inside list-disc space-y-2 pl-2 text-slate-600">
          <li>
            Unsolicited commercial communications, bulk spam, or deceptive marketing campaigns in violation
            of CAN-SPAM or GDPR regulations.
          </li>
          <li>
            Phishing schemes, credential harvesting, malware delivery, or fraudulent identity representations.
          </li>
          <li>Defamatory, obscene, harassing, or unlawful content.</li>
          <li>
            Any attempt to reverse engineer, disrupt, compromise, or circumvent rate limits and security controls
            of the Service.
          </li>
        </ul>
        <p className="pt-2 font-medium text-slate-800">
          We reserve the right to immediately suspend or terminate accounts that violate this Acceptable Use
          Policy without prior notice or liability.
        </p>
      </div>
    ),
  },
  {
    number: "04",
    title: "Subscriptions, Billing & Cancellations",
    content: (
      <p>
        Pro Tier subscriptions are billed on a recurring periodic basis (monthly or annually) through our
        third-party payment processor, Stripe. By subscribing, you authorize automatic recurring billing
        using your designated payment method. You may cancel your subscription at any time via the in-app
        billing portal. Cancellations take effect at the conclusion of the current billing cycle, and no
        refunds are issued for partial billing periods unless required by applicable law.
      </p>
    ),
  },
  {
    number: "05",
    title: "Intellectual Property Rights",
    content: (
      <p>
        You retain full ownership of all text, logos, trademarks, and imagery you upload or configure within
        your email signatures. By using the Service, you grant us a worldwide, non-exclusive license solely
        to host, process, and display your assets as necessary to provide the Service. The Nevon retains all
        rights, title, and interest in and to the Sig Signature platform, design architecture, software code,
        and brand trademarks.
      </p>
    ),
  },
  {
    number: "06",
    title: "Disclaimer of Warranties & Limitation of Liability",
    content: (
      <p>
        The Service is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis without warranties of
        any kind, whether express or implied. While we take commercially reasonable measures to ensure
        cross-client compatibility, we do not warrant that signatures will render identically across every
        proprietary or legacy email client configuration. To the maximum extent permitted by applicable law,
        The Nevon shall not be liable for any indirect, incidental, special, consequential, or punitive
        damages resulting from your use or inability to use the Service.
      </p>
    ),
  },
  {
    number: "07",
    title: "Governing Law & Inquiries",
    content: (
      <p>
        These Terms shall be governed by and construed in accordance with applicable laws. Inquiries regarding
        these Terms should be sent to:{" "}
        <a href="mailto:legal@thenevon.com" className="font-semibold text-[#1243A3] underline">
          legal@thenevon.com
        </a>
        .
      </p>
    ),
  },
];

export default function TermsPage() {
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
                <SectionBadge label="LEGAL AGREEMENT" />
              </div>

              <h1 className="font-heading text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-[54px] lg:leading-[1.12]">
                <span className="text-cta-gradient bg-gradient-to-r from-[#245FD4] to-[#022977] bg-clip-text text-transparent">
                  Terms of Service
                </span>
              </h1>

              <p className="mt-4 font-body text-sm font-medium text-slate-500 sm:text-base">
                {/* Effective Date: October 2026 · The Nevon Legal Governance */}
              </p>

              <div className="mt-8 rounded-3xl border border-[#C1C1C1]/60 bg-white/95 p-6 text-left shadow-sm backdrop-blur-xs sm:p-8 md:p-10">
                <p className="font-body text-base leading-relaxed text-slate-700 sm:text-lg">
                  Please read these Terms of Service carefully before accessing or using the
                  Sig Signature website and application , operated by{" "}
                  <strong className="font-semibold text-slate-900">The Nevon</strong>. By registering for an account or using
                  the Service, you agree to be bound by these Terms.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* TERMS SECTIONS */}
        <section className="py-8 pb-20 sm:pb-24">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 xl:px-12">
            <div className="mx-auto max-w-4xl space-y-8">
              {termsSections.map((sec) => (
                <div
                  key={sec.number}
                  className="rounded-3xl border border-[#C1C1C1]/80 bg-white p-7 shadow-xs sm:p-10"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-heading text-xs font-bold uppercase tracking-wider text-[#1243A3]">
                      Section {sec.number}
                    </span>
                  </div>

                  <h2 className="font-heading mt-2 text-xl font-semibold text-slate-900 sm:text-2xl">
                    {sec.title}
                  </h2>

                  <div className="mt-4 font-body text-base leading-relaxed text-slate-600">
                    {sec.content}
                  </div>
                </div>
              ))}

              {/* Contact Footer Box */}
              <div className="rounded-3xl border border-[#245FD4]/30 bg-gradient-to-b from-white to-blue-50/30 p-8 text-center sm:p-10">
                <h3 className="font-heading text-xl font-semibold text-slate-900 sm:text-2xl">
                  Questions regarding our terms?
                </h3>
                <p className="mt-2 font-body text-slate-600">
                  Our legal team is available to assist with contractual, governance, or compliance questions.
                </p>
                <div className="mt-6 flex justify-center">
                  <a
                    href="mailto:legal@thenevon.com"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-cta-gradient bg-gradient-to-r from-[#245FD4] to-[#022977] px-8 py-3.5 font-body text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
                  >
                    <span>Contact legal@thenevon.com</span>
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
