import type { Metadata } from "next";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { BreadcrumbJsonLd } from "@/components/seo/StructuredData";
import PrivacyPolicyContent from "@/components/legal/PrivacyPolicyContent";

export const metadata: Metadata = {
  title: "Privacy Policy | Sig Signature",
  description:
    "Learn how Sig Signature and The Nevon collect, use, store, and protect your personal data and uploaded assets.",
  alternates: {
    canonical: "https://www.sigsignature.com/privacy",
  },
  openGraph: {
    title: "Privacy Policy | Sig Signature",
    description:
      "Learn how Sig Signature and The Nevon collect, use, store, and protect your personal data and uploaded assets.",
    url: "https://www.sigsignature.com/privacy",
    siteName: "Sig Signature",
    type: "website",
    images: [
      {
        url: "https://www.sigsignature.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Sig Signature Privacy Policy",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | Sig Signature",
    description:
      "Learn how Sig Signature and The Nevon collect, use, and protect your personal data.",
    images: ["https://www.sigsignature.com/og-image.png"],
  },
};

export default function PrivacyPage() {
  return (
    <div className="relative isolate flex min-h-screen flex-col bg-[#F8FAFC] font-body text-slate-900 selection:bg-brand selection:text-white">
      {/* Background ambient lighting from Figma system */}
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
          { name: "Privacy Policy", url: "https://www.sigsignature.com/privacy" },
        ]}
      />

      <main className="flex-1 pt-24 sm:pt-28 pb-16 sm:pb-24">
        <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
          <div className="rounded-[28px] sm:rounded-[36px] border border-slate-200/80 bg-white p-6 sm:p-10 lg:p-14 shadow-xs">
            <PrivacyPolicyContent />
          </div>
        </div>
      </main>

      <div className="w-full border-t border-[#D7D7D7]" />
      <Footer />
    </div>
  );
}
