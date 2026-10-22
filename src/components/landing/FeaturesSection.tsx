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
    <section id="features" className="scroll-mt-24 overflow-x-clip bg-[#FCFCFC] py-14 sm:py-16 lg:py-24 3xl:py-28">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 xl:px-12 2xl:max-w-[1536px] 3xl:max-w-[1720px]">
        {/* Section Header */}
        <div className="text-center">
          <Reveal y={16} blur={6} className="mb-3 sm:mb-4 inline-block">
            <SectionBadge label="FEATURES" />
          </Reveal>
          <Reveal y={24} blur={8} delay={0.1}>
            <h2 className="font-heading text-[clamp(1.625rem,1.1rem+2.3vw,3.375rem)] lg:text-[54px] 2xl:text-[60px] 3xl:text-[66px] font-semibold tracking-tight text-slate-900 leading-tight lg:leading-[1.12] [text-wrap:balance]">
              Everything You Need to Build the{" "}
              <span className="text-[#1243A3]">Perfect Signature.</span>
            </h2>
          </Reveal>
        </div>

        {/* Bento Grid with Asymmetric Boxes */}
        <FeatureGrid className="mt-10 grid grid-cols-1 gap-6 sm:mt-14 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* ROW 1 */}
          {/* Card 1 (WIDE - 7 cols in Figma 687px) */}
          <FeatureCard colSpan="lg:col-span-7" direction="left" aria-label="Templates or From Scratch">
            <div>
              <div className="flex items-center gap-2">
                <FeatureIconTile>
                  <Image src="/Template.svg" alt="" width={16} height={16} className="h-4 w-4" />
                </FeatureIconTile>
                <span className="font-body text-xs font-semibold tracking-wider text-slate-400 uppercase">
                  FEATURE
                </span>
              </div>
              <h3 className="font-heading mt-3 text-xl font-semibold text-slate-900 sm:text-2xl">
                Templates or From Scratch
              </h3>
              <p className="font-body mt-3 text-sm leading-relaxed text-[#878787] sm:text-base">
                Choose a professionally designed template, or start from a blank
                canvas and build your signature completely from scratch. Either
                way, you&apos;re in full control.
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
          <FeatureCard colSpan="lg:col-span-5" direction="right" aria-label="Live Preview">
            <div>
              <div className="flex items-center gap-2">
                <FeatureIconTile>
                  <Image src="/Live.svg" alt="" width={18} height={11} className="h-3 w-auto" />
                </FeatureIconTile>
                <span className="font-body text-xs font-semibold tracking-wider text-slate-400 uppercase">
                  FEATURE
                </span>
              </div>
              <h3 className="font-heading mt-3 text-xl font-semibold text-slate-900 sm:text-2xl">
                Live Preview
              </h3>
              <p className="font-body mt-3 text-sm leading-relaxed text-[#878787] sm:text-base">
                Every change updates instantly. What you see is exactly what
                lands in the inbox.
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
          <FeatureCard colSpan="lg:col-span-5" direction="left" aria-label="Full Customization">
            <div>
              <div className="flex items-center gap-2">
                <FeatureIconTile>
                  <Image src="/Customization.svg" alt="" width={18} height={18} className="h-4 w-4" />
                </FeatureIconTile>
                <span className="font-body text-xs font-semibold tracking-wider text-slate-400 uppercase">
                  FEATURE
                </span>
              </div>
              <h3 className="font-heading mt-3 text-xl font-semibold text-slate-900 sm:text-2xl">
                Full Customization
              </h3>
              <p className="font-body mt-3 text-sm leading-relaxed text-[#878787] sm:text-base">
                Make it completely yours. Customize colors, fonts, logos, social
                icons, banners, and layouts—no coding required.
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
          <FeatureCard colSpan="lg:col-span-7" direction="right" aria-label="Production-Ready HTML Export">
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
                Production-Ready HTML Export
              </h3>
              <p className="font-body mt-3 text-sm leading-relaxed text-[#878787] sm:text-base">
                Copy clean, working signature: inline-styled, client-tested signature
                that&apos;s compatible with Gmail, Outlook, Apple Mail, and more.
                Paste it in, and it works the first time, every time.
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
          <FeatureCard colSpan="lg:col-span-6" direction="left" aria-label="High-Quality Image Export">
            <div>
              <div className="flex items-center gap-2">
                <FeatureIconTile>
                  <Image src="/stash_image-light.svg" alt="" width={18} height={18} className="h-4 w-4" />
                </FeatureIconTile>
                <span className="font-body text-xs font-semibold tracking-wider text-slate-400 uppercase">
                  FEATURE
                </span>
              </div>
              <h3 className="font-heading mt-3 text-xl font-semibold text-slate-900 sm:text-2xl">
                High-Quality Image Export
              </h3>
              <p className="font-body mt-3 text-sm leading-relaxed text-[#878787] sm:text-base">
                Need an image version? Download a high-quality export in one
                click.
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
          <FeatureCard colSpan="lg:col-span-6" direction="right" aria-label="Save Multiple Signatures">
            <div>
              <div className="flex items-center gap-2">
                <FeatureIconTile>
                  <Image src="/arcticons_nothing-icons.svg" alt="" width={18} height={18} className="h-4 w-4" />
                </FeatureIconTile>
                <span className="font-body text-xs font-semibold tracking-wider text-slate-400 uppercase">
                  FEATURE
                </span>
              </div>
              <h3 className="font-heading mt-3 text-xl font-semibold text-slate-900 sm:text-2xl">
                Save Multiple Signatures
              </h3>
              <p className="font-body mt-3 text-sm leading-relaxed text-[#878787] sm:text-base">
                Store multiple signatures, whether built from a template or from
                scratch, in your dashboard, and update them anytime.
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
