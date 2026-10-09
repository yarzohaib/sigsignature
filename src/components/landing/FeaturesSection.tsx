import Image from "next/image";
import SectionBadge from "./SectionBadge";

export default function FeaturesSection() {
  return (
    <section id="features" className="scroll-mt-24 bg-[#FCFCFC] py-16 sm:py-24">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Section Header */}
        <div className="text-center">
          <SectionBadge label="FEATURES" className="mb-4" />
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl lg:text-[54px] lg:leading-[1.12]">
            Everything You Need to Build the{" "}
            <span className="text-brand">Perfect Signature.</span>
          </h2>
        </div>

        {/* Bento Grid with Asymmetric Boxes */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:mt-16 lg:grid-cols-12 lg:gap-8">
          {/* ROW 1 */}
          {/* Card 1 (WIDE - 7 cols in Figma 687px) */}
          <div className="flex flex-col justify-between rounded-[20px] border border-[#C1C1C1] bg-white p-7 shadow-none sm:p-8 lg:col-span-7">
            <div>
              <div className="flex items-center gap-2">
                <Image src="/Template.svg" alt="" width={16} height={16} className="h-4 w-4" />
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
            <div className="mt-8 grid grid-cols-3 gap-3">
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
            </div>
          </div>

          {/* Card 2 (NARROW - 5 cols in Figma) */}
          <div className="flex flex-col justify-between rounded-[20px] border border-[#C1C1C1] bg-white p-7 shadow-none sm:p-8 lg:col-span-5">
            <div>
              <div className="flex items-center gap-2">
                <Image src="/Live.svg" alt="" width={18} height={11} className="h-3 w-auto" />
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
            <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
              <div className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white p-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
                  SN
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs font-bold text-slate-900 sm:text-sm">
                    Satya Nadella
                  </p>
                  <p className="truncate text-[11px] text-[#878787]">
                    satya@microsoft.com
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ROW 2 */}
          {/* Card 3 (NARROW - 5 cols in Figma) */}
          <div className="flex flex-col justify-between rounded-[20px] border border-[#C1C1C1] bg-white p-7 shadow-none sm:p-8 lg:col-span-5">
            <div>
              <div className="flex items-center gap-2">
                <Image src="/Customization.svg" alt="" width={18} height={18} className="h-4 w-4" />
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
            <div className="mt-8 flex items-center gap-3">
              <span className="h-7 w-7 rounded-full bg-[#245FD4] ring-2 ring-brand ring-offset-2" />
              <span className="h-7 w-7 rounded-full bg-[#10B981] transition hover:scale-110" />
              <span className="h-7 w-7 rounded-full bg-[#8B5CF6] transition hover:scale-110" />
              <span className="h-7 w-7 rounded-full bg-[#D97706] transition hover:scale-110" />
              <span className="h-7 w-7 rounded-full bg-[#0F172A] transition hover:scale-110" />
            </div>
          </div>

          {/* Card 4 (WIDE - 7 cols in Figma with CodeSnippet.svg) */}
          <div className="flex flex-col justify-between rounded-[20px] border border-[#C1C1C1] bg-white p-7 shadow-none sm:p-8 lg:col-span-7">
            <div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <span className="font-mono text-xs font-semibold">&lt;/&gt;</span>
                <span className="font-body text-xs font-semibold tracking-wider uppercase">
                  FEATURE
                </span>
              </div>
              <h3 className="font-heading mt-3 text-xl font-semibold text-slate-900 sm:text-2xl">
                Production-Ready HTML Export
              </h3>
              <p className="font-body mt-3 text-sm leading-relaxed text-[#878787] sm:text-base">
                Copy clean, working HTML code: inline-styled, client-tested code
                that&apos;s compatible with Gmail, Outlook, Apple Mail, and more.
                Paste it in, and it works the first time, every time.
              </p>
            </div>

            {/* Code Snippet SVG Graphic */}
            <div className="mt-6 overflow-hidden rounded-xl border border-slate-900/10 bg-[#0A0A0B]">
              <Image
                src="/CodeSnippet.svg"
                alt="Production ready HTML code snippet preview"
                width={642}
                height={128}
                className="h-auto w-full object-contain"
              />
            </div>
          </div>

          {/* ROW 3 */}
          {/* Card 5 (NARROW - 5 cols in Figma) */}
          <div className="flex flex-col justify-between rounded-[20px] border border-[#C1C1C1] bg-white p-7 shadow-none sm:p-8 lg:col-span-5">
            <div>
              <div className="flex items-center gap-2">
                <Image src="/stash_image-light.svg" alt="" width={18} height={18} className="h-4 w-4" />
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
            <div className="mt-8 rounded-2xl border border-slate-200/90 bg-slate-50/70 p-4">
              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3.5">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-brand-dark to-brand" />
                  <div>
                    <p className="text-xs font-bold text-slate-900 sm:text-sm">
                      Satya Nadella
                    </p>
                    <p className="text-[11px] text-[#878787]">PNG / JPEG (2x Retina)</p>
                  </div>
                </div>
                <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-brand">
                  Export
                </span>
              </div>
            </div>
          </div>

          {/* Card 6 (WIDE - 7 cols in Figma) */}
          <div className="flex flex-col justify-between rounded-[20px] border border-[#C1C1C1] bg-white p-7 shadow-none sm:p-8 lg:col-span-7">
            <div>
              <div className="flex items-center gap-2">
                <Image src="/arcticons_nothing-icons.svg" alt="" width={18} height={18} className="h-4 w-4" />
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
            <div className="mt-8 space-y-2">
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
