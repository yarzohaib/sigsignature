import type { Metadata } from "next";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import SectionBadge from "@/components/landing/SectionBadge";
import ContactForm from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us | Sig Signature",
  description:
    "Get in touch with the Sig Signature team for technical support, business partnerships, or product inquiries.",
};

const contactChannels = [
  {
    department: "Product Support",
    email: "support@thenevon.com",
    scope: "Assistance with signature installation, formatting bugs, and billing inquiries.",
    icon: (
      <svg
        className="h-6 w-6 text-white"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
        />
      </svg>
    ),
  },
  {
    department: "Business & Partnerships",
    email: "partnerships@thenevon.com",
    scope: "Custom team deployments, bulk licensing, and integration inquiries.",
    icon: (
      <svg
        className="h-6 w-6 text-white"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006A47.886 47.886 0 0012 13.5c-2.348 0-4.632-.168-6.863-.494m0 0a2.18 2.18 0 01-.75-1.661V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0015 3h-6a2.25 2.25 0 00-2.25 2.25v1.5m7.5 0a48.667 48.667 0 00-7.5 0"
        />
      </svg>
    ),
  },
  {
    department: "Press & Media",
    email: "press@thenevon.com",
    scope: "Media inquiries, brand asset requests, and interview coordination.",
    icon: (
      <svg
        className="h-6 w-6 text-white"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z"
        />
      </svg>
    ),
  },
];

export default function ContactPage() {
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
                <SectionBadge label="CONTACT US" />
              </div>

              <h1 className="font-heading text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-[54px] lg:leading-[1.12]">
                <span className="text-cta-gradient bg-gradient-to-r from-[#245FD4] to-[#022977] bg-clip-text text-transparent">
                  Get in touch
                </span>{" "}
                with our team.
              </h1>

              <p className="mx-auto mt-6 max-w-2xl font-body text-base leading-relaxed text-slate-600 sm:text-lg lg:text-[19px]">
                Have a technical question, partnership proposal, or feedback regarding Sig Signature?
                Contact our team directly through our dedicated channels or inquiry form.
              </p>
            </div>
          </div>
        </section>

        {/* DIRECT CONTACT CHANNELS */}
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 xl:px-12">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
              {contactChannels.map((item) => (
                <div
                  key={item.department}
                  className="flex flex-col justify-between rounded-3xl border border-[#245FD4]/30 bg-gradient-to-b from-white to-blue-50/30 p-8 shadow-xs"
                >
                  <div>
                    <div
                      style={{
                        background: "linear-gradient(180deg, #245FD4 0%, #022977 100%)",
                      }}
                      className="flex h-12 w-12 items-center justify-center rounded-2xl shadow-xs"
                    >
                      {item.icon}
                    </div>

                    <h2 className="font-heading mt-6 text-xl font-semibold text-slate-900 sm:text-2xl">
                      {item.department}
                    </h2>
                    <p className="mt-2.5 font-body text-sm leading-relaxed text-slate-600 sm:text-base">
                      {item.scope}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-blue-100">
                    <a
                      href={`mailto:${item.email}`}
                      className="inline-flex items-center gap-2 font-body text-sm font-semibold text-[#1243A3] transition hover:text-[#245FD4]"
                    >
                      <span>{item.email}</span>
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2.5"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                      </svg>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* DIRECT INQUIRY FORM */}
        <section className="py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 xl:px-12">
            <div className="mx-auto max-w-3xl text-center">
              <SectionBadge label="DIRECT INQUIRY" className="mb-4" />
              <h2 className="font-heading text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl lg:text-[46px] lg:leading-[1.15]">
                Send Us a Message
              </h2>
              <p className="mt-4 font-body text-base text-[#878787] sm:text-lg">
                Fill in the details below and our team will get back to you within 1 to 2 business days.
              </p>
            </div>

            <div className="mx-auto mt-12 max-w-3xl">
              <ContactForm />
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
