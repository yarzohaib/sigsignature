"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SectionBadge from "./SectionBadge";
import { Reveal } from "@/components/motion";
import { AVAILABLE_TEMPLATES } from "@/lib/templatesData";
import { TemplateItem } from "@/types/template";
import TemplateGalleryCard from "@/components/templates/TemplateGalleryCard";
import PreviewSignatureModal from "@/components/studio/PreviewSignatureModal";
import { generateTemplateHtml } from "@/lib/templates/renderTemplateHtml";
import { getStoredUser } from "@/app/lib/auth";

const CATEGORIES = ["All", "Minimal", "Corporate", "Creative", "Bold"] as const;
type CategoryTab = (typeof CATEGORIES)[number];

export default function PopularTemplatesSection() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<CategoryTab>("All");
  const [previewingTemplate, setPreviewingTemplate] = useState<TemplateItem | null>(null);

  const displayedTemplates = useMemo(() => {
    let list = AVAILABLE_TEMPLATES;
    if (selectedCategory !== "All") {
      list = list.filter((tpl) => tpl.category === selectedCategory);
    }
    // Sort to prioritize popular/featured, then take top 6
    const sorted = [...list].sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
    return sorted.slice(0, 6);
  }, [selectedCategory]);

  const handleUseTemplate = (template: TemplateItem) => {
    router.push(`/templates?template=${encodeURIComponent(template.id)}`);
  };

  return (
    <section
      id="templates"
      className="scroll-mt-28 sm:scroll-mt-32 lg:scroll-mt-36 overflow-x-clip bg-[#FCFCFC] py-14 sm:py-16 lg:py-24 3xl:py-28"
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-12 2xl:max-w-[1536px] 3xl:max-w-[1720px]">
        {/* Section Header */}
        <div className="text-center">
          <Reveal y={16} blur={6} className="mb-2.5 sm:mb-3 inline-block">
            <SectionBadge
              label="TEMPLATES"
              className="border-[#CBD5E1] shadow-[0_1px_2px_rgba(15,23,42,0.06)]"
            />
          </Reveal>
          <Reveal y={24} blur={8} delay={0.1}>
            <h2 className="mx-auto w-full max-w-[1400px] font-heading text-[clamp(1.8rem,1.125rem+2.25vw,2.7rem)] lg:text-[43px] xl:text-[49px] 2xl:text-[56px] 3xl:text-[61px] font-semibold tracking-tight text-slate-900 leading-tight lg:leading-[1.12] [text-wrap:balance]">
              <span>Stand Out in Every Inbox with</span>{" "}
              <span className="text-[#1243A3]">Signature Templates</span>
            </h2>
          </Reveal>
          <Reveal y={24} blur={8} delay={0.15}>
            <p className="mx-auto mt-4 max-w-2xl font-body text-base text-slate-600 sm:text-lg">
              Deliverability-tested across Gmail, Outlook, Apple Mail, and mobile screens. Pick any style, customize in seconds, and make every email a branded opportunity.
            </p>
          </Reveal>
        </div>

        {/* Category Pills Filter */}
        <div className="mt-8 sm:mt-10 flex w-full items-center justify-start gap-2 overflow-x-auto py-2 px-1 scroll-px-4 scrollbar-none sm:justify-center">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 rounded-full px-5 py-2 text-xs sm:text-sm font-semibold transition cursor-pointer ${
                selectedCategory === cat
                  ? "bg-[#245FD4] text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-100 hover:text-slate-900"
              }`}
              style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Templates Grid: 6 cards (1 col mobile, 2 col tablet, 3 col desktop) */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayedTemplates.map((template) => (
            <TemplateGalleryCard
              key={template.id}
              template={template}
              onUseTemplate={handleUseTemplate}
              onPreview={setPreviewingTemplate}
            />
          ))}
        </div>

        {/* Bottom CTA Action Bar */}
        <div className="mt-12 sm:mt-14 flex flex-col items-center justify-center text-center">
          <Link
            href="/templates"
            className="group inline-flex min-h-[44px] items-center justify-center gap-2.5 rounded-full bg-cta-gradient bg-gradient-to-r from-[#245FD4] to-[#022977] px-8 py-3.5 font-body text-sm sm:text-base font-semibold text-white shadow-sm transition-[opacity] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 [@media(hover:hover)]:hover:opacity-95 active:scale-95"
          >
            <span>View All Templates</span>
            <svg
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>

          <p
            className="mt-3 text-xs sm:text-sm text-slate-500 font-medium"
            style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
          >
            Free to customize · 100% deliverable HTML · No credit card required
          </p>
        </div>
      </div>

      {/* Signature Preview Modal */}
      {previewingTemplate && (
        <PreviewSignatureModal
          isOpen={Boolean(previewingTemplate)}
          onClose={() => setPreviewingTemplate(null)}
          html={generateTemplateHtml(previewingTemplate.defaultData, { preview: true })}
          showCanvasTab={false}
        />
      )}
    </section>
  );
}
