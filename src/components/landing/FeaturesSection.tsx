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
    <section id="features" className="scroll-mt-20 md:scroll-mt-18 overflow-x-clip bg-[#FCFCFC] pt-8 sm:pt-10 lg:pt-12 pb-14 sm:pb-16 lg:pb-24 3xl:pb-28">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-12 2xl:max-w-[1536px] 3xl:max-w-[1720px]">
        {/* Section Header */}
        <div className="text-center">
          <Reveal y={16} blur={6} className="mb-2.5 sm:mb-3 inline-block">
            <SectionBadge label="FEATURES" />
          </Reveal>
          <Reveal y={24} blur={8} delay={0.1}>
            <h2 className="mx-auto max-w-[1500px] font-heading text-[clamp(1.8rem,1.125rem+2.25vw,2.7rem)] lg:text-[43px] xl:text-[49px] 2xl:text-[56px] 3xl:text-[61px] font-semibold tracking-tight text-slate-900 leading-tight lg:leading-[1.12] [text-wrap:balance]">
              Tools to Create and Customize Your{" "}
              <span className="text-[#1243A3]">Email Signature</span>
            </h2>
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
                  <Image src="/Template.svg" alt="Pre-designed email signature templates icon" width={16} height={16} className="h-4 w-4" />
                </FeatureIconTile>
                <span className="font-body text-xs font-semibold tracking-wider text-slate-400 uppercase">
                  FEATURE
                </span>
              </div>
              <h3 className="font-heading mt-3 text-xl font-semibold text-slate-900 sm:text-2xl">
                Start with a Template or Blank Layout
              </h3>
              <p className="font-body mt-3 text-sm leading-relaxed text-[#878787] sm:text-base">
                Choose a starting design or build your own layout. Arrange your information to suit your role and brand.
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
                  <Image src="/Live.svg" alt="Live signature preview icon" width={18} height={11} className="h-3 w-auto" />
                </FeatureIconTile>
                <span className="font-body text-xs font-semibold tracking-wider text-slate-400 uppercase">
                  FEATURE
                </span>
              </div>
              <h3 className="font-heading mt-3 text-xl font-semibold text-slate-900 sm:text-2xl">
                Preview Changes While You Edit
              </h3>
              <p className="font-body mt-3 text-sm leading-relaxed text-[#878787] sm:text-base">
                See your design update as you change its content and appearance. After installation, send a test email to check how it displays in your email app.
              </p>
            </div>

            {/* Live Preview Box */}
            <FeatureCardVisual className="mt-8 rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
              <div className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white p-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
                  MN
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs font-bold text-slate-900 sm:text-sm">
                    Muhammad Nadir
                  </p>
                  <p className="truncate text-[11px] text-[#878787]">
                    sardar@thenevon.com
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
                  <Image src="/Customization.svg" alt="Custom branding and styling options icon" width={18} height={18} className="h-4 w-4" />
                </FeatureIconTile>
                <span className="font-body text-xs font-semibold tracking-wider text-slate-400 uppercase">
                  FEATURE
                </span>
              </div>
              <h3 className="font-heading mt-3 text-xl font-semibold text-slate-900 sm:text-2xl">
                Customize Your Brand Details
              </h3>
              <p className="font-body mt-3 text-sm leading-relaxed text-[#878787] sm:text-base">
                Adjust colors, fonts, logos, social icons, banners, and layouts using the editor’s visual controls.
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
                <span className="font-body text-xs font-semibold tracking-wider uppercase">
                  FEATURE
                </span>
              </div>
              <h3 className="font-heading mt-3 text-xl font-semibold text-slate-900 sm:text-2xl">
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
                  <Image src="/stash_image-light.svg" alt="Custom photo and logo upload icon" width={18} height={18} className="h-4 w-4" />
                </FeatureIconTile>
                <span className="font-body text-xs font-semibold tracking-wider text-slate-400 uppercase">
                  FEATURE
                </span>
              </div>
              <h3 className="font-heading mt-3 text-xl font-semibold text-slate-900 sm:text-2xl">
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
                      Muhammad Nadir
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
                  <Image src="/arcticons_nothing-icons.svg" alt="Clean design without bloat icon" width={18} height={18} className="h-4 w-4" />
                </FeatureIconTile>
                <span className="font-body text-xs font-semibold tracking-wider text-slate-400 uppercase">
                  FEATURE
                </span>
              </div>
              <h3 className="font-heading mt-3 text-xl font-semibold text-slate-900 sm:text-2xl">
                Save and Update Your Signatures
              </h3>
              <p className="font-body mt-3 text-sm leading-relaxed text-[#878787] sm:text-base">
                Keep your saved designs in your dashboard and update them when your role, contact details, or branding changes. The free plan includes up to 3 signatures.
              </p>
            </div>

            {/* Signature list preview items */}
            <FeatureCardVisual className="mt-8 space-y-2">
              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-2.5 text-xs font-medium text-slate-700">
                <span>Personal Signature</span>
                <span className="text-slate-400">⌄</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-2.5 text-xs font-medium text-slate-700">
                <span>Business Signatures</span>
                <span className="text-slate-400">⌄</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-2.5 text-xs font-medium text-slate-700">
                <span>Marketing Signatures</span>
                <span className="text-slate-400">⌄</span>
              </div>
            </FeatureCardVisual>
          </FeatureCard>
        </FeatureGrid>
      </div>
    </section>
  );
}
