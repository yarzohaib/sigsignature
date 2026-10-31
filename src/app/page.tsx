import type { Metadata, Viewport } from "next";
import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import ProblemSection from "@/components/landing/ProblemSection";
import SolutionSection from "@/components/landing/SolutionSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import ComparisonSection from "@/components/landing/ComparisonSection";
import PricingSection from "@/components/landing/PricingSection";
import FaqSection from "@/components/landing/FaqSection";
import CtaBanner from "@/components/landing/CtaBanner";
import Footer from "@/components/landing/Footer";
import LandingMotionConfig from "@/components/motion/LandingMotionConfig";
import { WebApplicationJsonLd, OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/StructuredData";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "Free Email Signature Generator | Sig Signature",
  description:
    "Create up to 3 email signatures free with SigSignature. Customize templates, preview your design, and export HTML or images. No coding required.",
  alternates: {
    canonical: "https://www.sigsignature.com",
  },
  openGraph: {
    title: "Free Email Signature Generator | Sig Signature",
    description:
      "Create up to 3 email signatures free with SigSignature. Customize templates, preview your design, and export HTML or images. No coding required.",
    url: "https://www.sigsignature.com",
    siteName: "Sig Signature",
    images: [
      {
        url: "https://www.sigsignature.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Free Email Signature Generator | Sig Signature",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Email Signature Generator | Sig Signature",
    description:
      "Create up to 3 email signatures free with SigSignature. Customize templates, preview your design, and export HTML or images. No coding required.",
    images: ["https://www.sigsignature.com/og-image.png"],
  },
};

export default function LandingPage() {
  return (
    <LandingMotionConfig>
      <div className="relative isolate flex min-h-screen flex-col bg-surface font-body text-slate-900 selection:bg-brand selection:text-white">
  {/* Hero glows from Figma: Ellipse 68 (below) and Ellipse 67 (on top) */}
  <div
    aria-hidden
    className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[1000px] overflow-hidden"
  >
    <div className="absolute -right-[200px] -top-[240px] h-[480px] w-[560px] rounded-full bg-[#C4DFFB] opacity-50 blur-[80px] lg:-right-[372px] lg:-top-[475px] lg:h-[946px] lg:w-[1103px] lg:blur-[162px]" />
    <div className="absolute -right-[100px] -top-[170px] h-[300px] w-[320px] rounded-full bg-[#F0F8F5] opacity-50 blur-[80px] lg:-right-[216px] lg:-top-[350px] lg:h-[598px] lg:w-[616px] lg:blur-[162px]" />
  </div>
      <Navbar />

      {/* Structured Data for Search Engines & LLM scrapers */}
      <WebSiteJsonLd />
      <WebApplicationJsonLd />
      <OrganizationJsonLd />

      {/* Main Page Flow */}
      <main className="flex-1">
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <FeaturesSection />
        <HowItWorksSection />
        <ComparisonSection />
        <PricingSection />
        <FaqSection />
        <CtaBanner />
      </main>

      {/* Separate Footer Component */}
      <Footer />
    </div>
    </LandingMotionConfig>
  );
}