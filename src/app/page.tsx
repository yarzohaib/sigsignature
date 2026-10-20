import type { Metadata, Viewport } from "next";
import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import ProblemSection from "@/components/landing/ProblemSection";
import SolutionSection from "@/components/landing/SolutionSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import ComparisonSection from "@/components/landing/ComparisonSection";
import PricingSection from "@/components/landing/PricingSection";
import CtaBanner from "@/components/landing/CtaBanner";
import Footer from "@/components/landing/Footer";
import FlashToast from "@/components/common/FlashToast";
import LandingMotionConfig from "@/components/motion/LandingMotionConfig";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "Free Email Signature Generator | SigSignature",
  description:
    "Create up to 3 professional signatures with SigSignature’s free email signature generator. Customize templates, preview live, and export HTML or images.",
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

      {/* Main Page Flow */}
      <main className="flex-1">
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <FeaturesSection />
        <HowItWorksSection />
        <ComparisonSection />
        <PricingSection />
        <CtaBanner />
      </main>

      {/* Separate Footer Component */}
      <Footer />

      {/* Flash Toast for global redirects like account deletion */}
      <FlashToast />
    </div>
    </LandingMotionConfig>
  );
}