"use client";

import { useState } from "react";
import SectionBadge from "./SectionBadge";
import { FaqJsonLd } from "@/components/seo/StructuredData";

export const FAQ_DATA = [
  {
    question: "What is Sig Signature, and how does its email signature generator work?",
    answer:
      "Sig Signature is an advanced free email signature creator and generator that helps individuals, freelancers, professionals, and teams create personalized signatures without writing HTML code. After signing up or logging in, choose a ready-made template or start with a blank canvas. Add your contact details, company information, website, and social media links, then customize the fonts, colors, layouts, logos, and profile photos in Design Studio. Preview and save your design, then export it as HTML or an image. Email applications may display the final signature differently, so testing is recommended.",
  },
  {
    question: "Is Sig Signature's email signature generator free?",
    answer:
      "Yes. Registered users can create and save up to three email signatures with Sig Signature's free plan. It includes templates, a blank-canvas option, design customization, live previews, and HTML and PNG/image exports. Free signatures do not automatically include a Sig Signature watermark or branding. Even after creating three signatures, you can still edit, preview, and download the existing designs; creating additional signatures requires a plan with a higher limit.",
  },
  {
    question: "How do I create a professional email signature using Sig Signature?",
    answer:
      "Sign up or log in, open the signature editor, and choose a template or blank canvas. Add your name, job title, company, phone number, email address, and website. If useful, include your company logo, profile photo, and social media links. Use Design Studio to adjust the typography, colors, and layout, then inspect the live preview. Save and export the finished signature as HTML or an image. Send a test email to confirm how it appears in your preferred email application.",
  },
  {
    question: "Can I customize an email signature template or create my own design from scratch?",
    answer:
      "Yes. Sig Signature supports both ready-made templates and blank-canvas creation. Templates provide a starting structure, while a blank canvas lets you build your own layout using the available editor controls. In Design Studio, you can customize fonts, colors, layouts, company logos, profile photos, and social media links. You can review changes in the live preview, save your signature, and return to edit it later.",
  },
  {
    question: "Can I use a Sig Signature email signature in Gmail, Outlook, and Apple Mail?",
    answer:
      "Sig Signature's exported HTML signatures have been tested with Gmail, Microsoft Outlook, and Apple Mail. You can use the HTML export or available copy option with the signature settings in a supported email application. Installation steps differ between apps and versions, and HTML rendering can vary by device, email client, and recipient settings. Testing does not guarantee pixel-identical results in every version, so check a sample email for layout, images, and working links before regular use.",
  },
  {
    question: "Can I add a company logo, profile photo, and clickable social media links?",
    answer:
      "Yes. Design Studio supports company logos, profile photos, and social media links alongside your professional contact information. You can use these elements to reflect your personal or business identity. However, some email applications block external images by default, and image sizing can vary across devices. Keep essential contact details in readable text, verify all link destinations, and send a test email before finalizing your design.",
  },
  {
    question: "What is the difference between HTML and image email signature exports?",
    answer:
      "Sig Signature offers both HTML and PNG/image export on the free plan. HTML is typically more flexible for everyday business email because it can contain selectable text and individual clickable links when supported by the email application. An image export creates a graphic version of the design, but its individual words and links are not separately clickable or selectable. Images can also be blocked by a recipient's email settings. Choose the format that matches your intended use.",
  },
  {
    question: "How many email signatures can I create for free, and can I edit them later?",
    answer:
      "After signing up or logging in, you can create and save up to three email signatures for free. Your saved signatures remain available in the dashboard for editing, previewing, and downloading, even after you reach the three-signature creation limit. This lets you update a title, phone number, company details, or design without creating a new signature. To create additional signatures beyond the free limit, consider the Premium plan.",
  },
  {
    question: "What is included in Sig Signature Premium, and how much does it cost?",
    answer:
      "Sig Signature's Premium plan is available for $10 per month. It includes unlimited signature creation and the Premium features advertised on the website, including additional templates, advanced customization, team signature management, and priority support. The free plan is suitable for users who need up to three signatures, while Premium supports those who need more designs or business-oriented management features. Review the current Pricing page before subscribing for the latest billing terms and plan details.",
  },
  {
    question: "Can businesses manage email signatures for multiple team members?",
    answer:
      "Yes. Team signature management is a working feature of Sig Signature's Premium plan. It lets businesses manage signatures for multiple team members and maintain a more consistent presentation of names, roles, contact information, and company branding. The specific administrative options and permissions should be checked within the current Premium product experience rather than assumed from general descriptions.",
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
      className="relative z-10 w-full bg-surface py-10 sm:py-12 lg:py-12 3xl:py-12"
    >
      {/* Inject Schema.org FAQPage Structured Data */}
      <FaqJsonLd faqs={FAQ_DATA} />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <SectionBadge label="FAQS" />
          <h2 className="font-heading mt-4 text-[clamp(1.8rem,1.125rem+2.25vw,2.7rem)] font-bold tracking-tight text-slate-900 lg:text-[43px] xl:text-[49px] 2xl:text-[56px] 3xl:text-[61px] lg:whitespace-nowrap">
            Frequently Asked <span className="text-[#245FD4]">Questions</span>
          </h2>
          <p className="font-body mt-4 max-w-2xl text-base text-slate-600 sm:text-lg">
            Find answers about creating, customizing, saving, exporting, and managing professional email signatures with Sig Signature.
          </p>
        </div>

        {/* Accordion List */}
        <div className="mx-auto mt-12 max-w-4xl space-y-4">
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
