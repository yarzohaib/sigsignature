"use client";

import { useState } from "react";
import SectionBadge from "./SectionBadge";
import { FaqJsonLd } from "@/components/seo/StructuredData";

export const FAQ_DATA = [
  {
    question: "How do I add an HTML signature to Outlook without broken formatting?",
    answer:
      "SigSignature generates nested, table-based HTML with Microsoft Outlook (MSO) inline formatting. To install it, use our 1-click 'Copy HTML' or formatted clipboard copy, open Outlook (Windows, Mac, or Web), navigate to Settings > Signatures, and paste directly. The styling and column spacing remain pixel-perfect.",
  },
  {
    question: "Why do email signatures get clipped or distorted in Gmail?",
    answer:
      "Gmail clips emails exceeding 102KB and strips external <style> tags. SigSignature inlines all CSS styles directly into table cells and audits the total code footprint to stay under 10KB. This guarantees your email is delivered in full without '[Message clipped]' warnings.",
  },
  {
    question: "Is SigSignature completely free to use?",
    answer:
      "Yes. The Free Forever plan gives you up to 3 active signatures, access to clean professional templates, unlimited edits, and instant HTML or PNG exports with zero forced branding or watermarks.",
  },
  {
    question: "Will my avatar and social icons show up as file attachments?",
    answer:
      "No. Email clients show paperclip attachments when images are embedded as raw base64 or email MIME attachments. SigSignature hosts your Retina-ready icons and avatars on a low-latency global CDN with absolute URLs, so recipients see clean images with zero attachments.",
  },
  {
    question: "What email clients and apps are supported?",
    answer:
      "SigSignature is pre-tested across 40+ email clients, including Gmail, Microsoft Outlook (Windows, Mac, Office 365, Web), Apple Mail (macOS and iOS), Mozilla Thunderbird, Yahoo Mail, and Samsung Mail.",
  },
  {
    question: "Can I manage email signatures for an entire company or team?",
    answer:
      "Yes. Our Premium plan provides centralized team management where administrators can standardize corporate branding, assign templates to members, and update contact information across all company signatures simultaneously.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      aria-label="Frequently Asked Questions"
      className="relative z-10 w-full bg-surface py-20 sm:py-24 lg:py-28"
    >
      {/* Inject Schema.org FAQPage Structured Data */}
      <FaqJsonLd faqs={FAQ_DATA} />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <SectionBadge label="FAQS" />
          <h2 className="font-heading mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Frequently Asked <span className="text-[#245FD4]">Questions</span>
          </h2>
          <p className="font-body mt-4 max-w-2xl text-base text-slate-600 sm:text-lg">
            Everything you need to know about deliverability, email client compatibility, and creating clean HTML signatures.
          </p>
        </div>

        {/* Accordion List */}
        <div className="mt-12 space-y-4">
          {FAQ_DATA.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.question}
                className="rounded-2xl border border-slate-200/80 bg-white transition-all duration-200 hover:border-slate-300 shadow-2xs"
              >
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between p-5 sm:p-6 text-left cursor-pointer select-none"
                >
                  <span className="font-heading text-base sm:text-lg font-semibold text-slate-900 pr-4">
                    {faq.question}
                  </span>
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                      isOpen ? "bg-[#245FD4] text-white rotate-180 shadow-xs" : "bg-slate-100 text-slate-600 rotate-0"
                    }`}
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2.5"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>
                <div
                  className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="border-t border-slate-100 px-5 pt-3.5 pb-5 sm:px-6 sm:pt-4 sm:pb-6 text-sm sm:text-base text-slate-600 leading-relaxed font-body">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
