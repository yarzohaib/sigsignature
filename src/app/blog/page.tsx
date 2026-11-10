import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { BlogPageJsonLd, BreadcrumbJsonLd } from "@/components/seo/StructuredData";
import BlogListSection from "@/components/blog/BlogListSection";

export const metadata: Metadata = {
  title: "The Journal | Email Signatures, Design & Engineering | Sig Signature",
  description:
    "A fresh perspective on email signatures, thoughtful branding, deliverability engineering, and the details that make work feel more professional.",
  alternates: {
    canonical: "https://www.sigsignature.com/blog",
  },
  openGraph: {
    title: "The Journal | Email Signatures, Design & Engineering | Sig Signature",
    description:
      "A fresh perspective on email signatures, thoughtful branding, deliverability engineering, and the details that make work feel more professional.",
    url: "https://www.sigsignature.com/blog",
    siteName: "Sig Signature",
    images: [
      {
        url: "https://www.sigsignature.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "The Journal - Sig Signature",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Journal | Email Signatures, Design & Engineering | Sig Signature",
    description:
      "A fresh perspective on email signatures, thoughtful branding, and deliverability engineering.",
    images: ["https://www.sigsignature.com/og-image.png"],
  },
};

export default function BlogPage() {
  return (
    <div className="relative isolate flex min-h-screen flex-col bg-[#FCFCFD] font-body text-slate-900 selection:bg-brand selection:text-white">
      {/* Background ambient lighting matching Figma design system */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[900px] overflow-hidden"
      >
        <div className="absolute -right-[200px] -top-[240px] h-[480px] w-[560px] rounded-full bg-[#C4DFFB] opacity-50 blur-[80px] lg:-right-[372px] lg:-top-[475px] lg:h-[946px] lg:w-[1103px] lg:blur-[162px]" />
        <div className="absolute -right-[100px] -top-[170px] h-[300px] w-[320px] rounded-full bg-[#F0F8F5] opacity-50 blur-[80px] lg:-right-[216px] lg:-top-[350px] lg:h-[598px] lg:w-[616px] lg:blur-[162px]" />
      </div>

      <Navbar />
      <BlogPageJsonLd />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://www.sigsignature.com" },
          { name: "Blog", url: "https://www.sigsignature.com/blog" },
        ]}
      />

      <main className="flex-1">
        {/* 1. HERO SECTION matching Figma Screenshot 1 */}
        <section className="pt-16 pb-8 sm:pt-10 sm:pb-10 lg:pt-12 lg:pb-12 text-center">
          <div className="mx-auto max-w-[1288px] px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
              {/* Heading: Good Emails. Great Endings. */}
              <h1
                className="font-heading text-4xl sm:text-5xl lg:text-[56px] font-semibold text-[#101B30] tracking-[-0.05em] leading-[1.16]"
                style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
              >
                <span>Good Emails.</span>{" "}
                <span className="text-[#245FD4]">Great Endings.</span>
              </h1>

              {/* Subtitle matching Figma */}
              <p
                className="mx-auto mt-4 max-w-xl font-body text-sm sm:text-base leading-relaxed text-[#5A5A5A]"
                style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
              >
                A fresh perspective on email signatures, thoughtful branding and the details that make work feel more professional.
              </p>

              {/* Pill Button matching Figma: Explore The Journal */}
              <div className="mt-7 sm:mt-8 flex justify-center">
                <a
                  href="#journal"
                  className="inline-flex items-center gap-2 rounded-full bg-cta-gradient px-7 py-3 text-xs sm:text-sm font-semibold text-white shadow-sm transition hover:opacity-95 active:scale-98"
                  style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                >
                  <span>Explore The Journal</span>
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 2. STORIES & SEARCH SECTION matching Figma Screenshot 2 & 3 */}
        <BlogListSection />

        {/* 3. BLUE CTA BANNER matching Figma Screenshot 4 */}
        <section
          className="py-16 sm:py-20 lg:py-24 text-white text-center"
          style={{
            background:
              "linear-gradient(100.16deg, #245FD4 1.32%, #00359F 50.19%, #00143C 100%)",
          }}
        >
          <div className="mx-auto max-w-[1288px] px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h2
                className="font-heading text-3xl sm:text-4xl lg:text-[48px] font-semibold text-white tracking-tight leading-[1.15]"
                style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
              >
                Your Email Signature Is the Last Thing People See, <br />
                Make It Count.
              </h2>
              <p
                className="mx-auto mt-4 max-w-xl font-body text-sm sm:text-base text-white/85 leading-relaxed"
                style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
              >
                Join professionals who&apos;ve stopped overpaying for email signatures. Create yours free in minutes.
              </p>
              <div className="mt-8 flex justify-center">
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 font-body text-sm font-semibold text-[#00359F] shadow-sm transition hover:bg-slate-50 hover:shadow-md active:scale-98"
                  style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                >
                  <span>Create Your Free Signature</span>
                </Link>
              </div>
              <p
                className="mt-4 font-body text-xs text-white/70"
                style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
              >
                No credit card. No designer. No developer. Just you.
              </p>
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
