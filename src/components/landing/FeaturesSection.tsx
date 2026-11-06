import Image from "next/image";
import SectionBadge from "./SectionBadge";
import {
  Reveal,
  FeatureGrid,
  FeatureCard,
  FeatureCardVisual,
  FeatureIconTile,
} from "@/components/motion";

export default function FeaturesSection() {
  return (
    <section id="features" className="scroll-mt-28 sm:scroll-mt-32 lg:scroll-mt-36 overflow-x-clip bg-[#FCFCFC] py-10 sm:py-12 lg:py-12 3xl:py-12">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-12 2xl:max-w-[1536px] 3xl:max-w-[1720px]">
        {/* Section Header */}
        <div className="text-center">
          <Reveal y={16} blur={6} className="mb-2.5 sm:mb-3 inline-block">
            <SectionBadge
              label="FEATURES"
              className="border-[#CBD5E1] shadow-[0_1px_2px_rgba(15,23,42,0.06)]"
            />
          </Reveal>
          <Reveal y={24} blur={8} delay={0.1}>
            <h2 className="mx-auto w-full max-w-[1400px] font-heading text-[clamp(1.8rem,1.125rem+2.25vw,2.7rem)] lg:text-[43px] xl:text-[49px] 2xl:text-[56px] 3xl:text-[61px] font-semibold tracking-tight text-slate-900 leading-tight lg:leading-[1.12] [text-wrap:balance]">
              <span className="block lg:whitespace-nowrap">Tools to Create and Customize Your</span>
              <span className="block text-[#1243A3]">Email Signature</span>
            </h2>
          </Reveal>
          <Reveal y={24} blur={8} delay={0.15}>
            <p className="mx-auto mt-4 max-w-2xl font-body text-base text-slate-600 sm:text-lg">
              Looking for a free email signature creator? Sig Signature gives you complete creative control to design, customize, and export professional email signatures in minutes.
            </p>
          </Reveal>
        </div>

        {/* Bento Grid with Asymmetric Boxes */}
        <FeatureGrid className="mt-8 grid grid-cols-1 gap-6 sm:mt-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* ROW 1 */}
          {/* Card 1 (WIDE - 7 cols in Figma 687px) */}
          <FeatureCard colSpan="lg:col-span-7" direction="left" aria-label="Start with a Template or Blank Layout">
            <div>
              <div className="flex items-center gap-2">
                <FeatureIconTile>
                  <Image src="/Template.svg" alt="Pre-designed email signature templates icon" width={20} height={20} className="h-5 w-5" />
                </FeatureIconTile>
                <span className="font-body text-sm font-semibold tracking-wider text-slate-400 uppercase">
                  FEATURE
                </span>
              </div>
              <h3 className="font-heading mt-3 text-2xl font-semibold text-slate-900 sm:text-3xl">
                Start with a Template or Blank Layout
              </h3>
              <p className="font-body mt-3 text-sm leading-relaxed text-[#878787] sm:text-base">
                Choose a starting design or build your own layout. Arrange your information to suit your role and brand. Create a professional email signature with a template that fits your brand.
              </p>
            </div>

            {/* Template Thumbnails Preview */}
            <FeatureCardVisual className="mt-8 grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-3">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-brand" />
                  <span className="text-[10px] font-semibold text-slate-700">Minimal</span>
                </div>
                <div className="mt-3 space-y-1">
                  <div className="h-1.5 w-12 rounded-full bg-slate-300" />
                  <div className="h-1 w-16 rounded-full bg-slate-200" />
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
                  <span className="text-[10px] font-semibold text-slate-700">Executive</span>
                </div>
                <div className="mt-3 space-y-1">
                  <div className="h-1.5 w-10 rounded-full bg-slate-300" />
                  <div className="h-1 w-14 rounded-full bg-slate-200" />
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                  <span className="text-[10px] font-semibold text-slate-700">Editorial</span>
                </div>
                <div className="mt-3 space-y-1">
                  <div className="h-1.5 w-14 rounded-full bg-slate-300" />
                  <div className="h-1 w-12 rounded-full bg-slate-200" />
                </div>
              </div>
            </FeatureCardVisual>
          </FeatureCard>

          {/* Card 2 (NARROW - 5 cols in Figma) */}
          <FeatureCard colSpan="lg:col-span-5" direction="right" aria-label="Preview Changes While You Edit">
            <div>
              <div className="flex items-center gap-2">
                <FeatureIconTile>
                  <Image src="/Live.svg" alt="Live signature preview icon" width={22} height={14} className="h-4 w-auto" />
                </FeatureIconTile>
                <span className="font-body text-sm font-semibold tracking-wider text-slate-400 uppercase">
                  FEATURE
                </span>
              </div>
              <h3 className="font-heading mt-3 text-2xl font-semibold text-slate-900 sm:text-3xl">
                Preview Changes While You Edit
              </h3>
              <p className="font-body mt-3 text-sm leading-relaxed text-[#878787] sm:text-base">
                See your design update as you change its content and appearance. After installation, send a test email to check how it displays in your email app.
              </p>
            </div>

            {/* Live Preview Box */}
            <FeatureCardVisual className="mt-8 rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
              <div className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white p-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#020817]">
                  <Image
                    src="/the-nevon-mark.svg"
                    alt="The Nevon logo"
                    width={32}
                    height={24}
                    className="h-6 w-8 object-contain"
                  />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs font-bold text-slate-900 sm:text-sm">
                    The Nevon
                  </p>
                  <p className="truncate text-[11px] text-[#878787]">
                    www.thenevon.com
                  </p>
                </div>
              </div>
            </FeatureCardVisual>
          </FeatureCard>

          {/* ROW 2 */}
          {/* Card 3 (NARROW - 5 cols in Figma) */}
          <FeatureCard colSpan="lg:col-span-5" direction="left" aria-label="Customize Your Brand Details">
            <div>
              <div className="flex items-center gap-2">
                <FeatureIconTile>
                  <Image src="/Customization.svg" alt="Custom branding and styling options icon" width={20} height={20} className="h-5 w-5" />
                </FeatureIconTile>
                <span className="font-body text-sm font-semibold tracking-wider text-slate-400 uppercase">
                  FEATURE
                </span>
              </div>
              <h3 className="font-heading mt-3 text-2xl font-semibold text-slate-900 sm:text-3xl">
                Customize Your Brand Details
              </h3>
              <p className="font-body mt-3 text-sm leading-relaxed text-[#878787] sm:text-base">
                Adjust colors, fonts, logos, social icons, banners, and layouts using the editor’s visual controls. Create a branded email signature with details that reflect your business.
              </p>
            </div>

            {/* Color Swatch Circles */}
            <FeatureCardVisual className="mt-8 flex items-center gap-3">
              <span className="h-7 w-7 rounded-full bg-[#245FD4] ring-2 ring-brand ring-offset-2" />
              <span className="h-7 w-7 rounded-full bg-[#10B981] transition hover:scale-110" />
              <span className="h-7 w-7 rounded-full bg-[#8B5CF6] transition hover:scale-110" />
              <span className="h-7 w-7 rounded-full bg-[#D97706] transition hover:scale-110" />
              <span className="h-7 w-7 rounded-full bg-[#0F172A] transition hover:scale-110" />
            </FeatureCardVisual>
          </FeatureCard>

          {/* Card 4 (WIDE - 7 cols in Figma with CodeSnippet.svg) */}
          <FeatureCard colSpan="lg:col-span-7" direction="right" aria-label="Export Your Signature as HTML">
            <div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <FeatureIconTile>
                  <span className="font-mono text-xs font-semibold">&lt;/&gt;</span>
                </FeatureIconTile>
                <span className="font-body text-sm font-semibold tracking-wider uppercase">
                  FEATURE
                </span>
              </div>
              <h3 className="font-heading mt-3 text-2xl font-semibold text-slate-900 sm:text-3xl">
                Export Your Signature as HTML
              </h3>
              <p className="font-body mt-3 text-sm leading-relaxed text-[#878787] sm:text-base">
                Export an HTML version for use in an email app that supports formatted signatures. Check your app’s installation options and test the result before using it in everyday emails.
              </p>
            </div>

            {/* Code Snippet SVG Graphic */}
            <FeatureCardVisual className="mt-6 overflow-hidden rounded-xl border border-slate-900/10 bg-[#0A0A0B]">
              <Image
                src="/CodeSnippet.svg"
                alt="Production ready HTML code snippet preview"
                width={642}
                height={128}
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="h-auto w-full object-contain"
              />
            </FeatureCardVisual>
          </FeatureCard>

          {/* ROW 3 */}
          {/* Card 5 (EQUAL 50% - 6 cols in Figma) */}
          <FeatureCard colSpan="lg:col-span-6" direction="left" aria-label="Download an Image Version">
            <div>
              <div className="flex items-center gap-2">
                <FeatureIconTile>
                  <Image src="/stash_image-light.svg" alt="Custom photo and logo upload icon" width={20} height={20} className="h-5 w-5" />
                </FeatureIconTile>
                <span className="font-body text-sm font-semibold tracking-wider text-slate-400 uppercase">
                  FEATURE
                </span>
              </div>
              <h3 className="font-heading mt-3 text-2xl font-semibold text-slate-900 sm:text-3xl">
                Download an Image Version
              </h3>
              <p className="font-body mt-3 text-sm leading-relaxed text-[#878787] sm:text-base">
                Export your design as an image when you need a visual version. An image does not preserve individual text links as separately clickable elements.
              </p>
            </div>

            {/* Mock Image Export Card */}
            <FeatureCardVisual className="mt-8 rounded-2xl border border-slate-200/90 bg-slate-50/70 p-4">
              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3.5">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-brand-dark to-brand" />
                  <div>
                    <p className="text-xs font-bold text-slate-900 sm:text-sm">
                      The Nevon
                    </p>
                    <p className="text-[11px] text-[#878787]">PNG / JPEG (2x Retina)</p>
                  </div>
                </div>
                <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-brand">
                  Export
                </span>
              </div>
            </FeatureCardVisual>
          </FeatureCard>

          {/* Card 6 (EQUAL 50% - 6 cols in Figma) */}
          <FeatureCard colSpan="lg:col-span-6" direction="right" aria-label="Save and Update Your Signatures">
            <div>
              <div className="flex items-center gap-2">
                <FeatureIconTile>
                  <Image src="/arcticons_nothing-icons.svg" alt="Clean design without bloat icon" width={20} height={20} className="h-5 w-5" />
                </FeatureIconTile>
                <span className="font-body text-sm font-semibold tracking-wider text-slate-400 uppercase">
                  FEATURE
                </span>
              </div>
              <h3 className="font-heading mt-3 text-2xl font-semibold text-slate-900 sm:text-3xl">
                Save Multiple Signatures
              </h3>
              <p className="font-body mt-3 text-sm leading-relaxed text-[#878787] sm:text-base">
                Store multiple signatures, whether built from a template or from scratch, in your dashboard, and update them anytime.
              </p>
            </div>

            {/* Signature list preview items */}
            <FeatureCardVisual className="mt-8 w-[78%] space-y-2">
              <div className="flex items-center justify-between rounded-xl border border-[#D8D8D8] bg-gradient-to-r from-[#F1F0ED] to-white px-4 py-2.5 text-xs font-medium text-slate-700">
                <span>Personal Signature</span>
                <svg className="h-3.5 w-3.5 text-slate-500" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="m5 7.5 5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-[#D8D8D8] bg-white px-4 py-2.5 text-xs font-medium text-slate-700">
                <span>Business Signatures</span>
                <svg className="h-3.5 w-3.5 text-slate-500" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="m5 7.5 5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-[#D8D8D8] bg-white px-4 py-2.5 text-xs font-medium text-slate-700">
                <span>Marketing Signatures</span>
                <svg className="h-3.5 w-3.5 text-slate-500" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="m5 7.5 5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </FeatureCardVisual>
          </FeatureCard>
        </FeatureGrid>
      </div>
    </section>
  );
}
