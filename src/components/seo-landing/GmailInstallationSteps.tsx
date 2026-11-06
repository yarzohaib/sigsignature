"use client";

import { useState } from "react";

export default function GmailInstallationSteps() {
  const [activeTab, setActiveTab] = useState<"web" | "mobile">("web");

  const webSteps = [
    {
      num: "01",
      title: "Open Gmail Settings",
      desc: "Log in to your Gmail account on your desktop browser. Click the Settings gear icon in the upper-right corner and select 'See all settings'.",
    },
    {
      num: "02",
      title: "Go to the Signature Section",
      desc: "Under the 'General' tab, scroll down until you reach the 'Signature' section. Click '+ Create new' and enter a name for your signature.",
    },
    {
      num: "03",
      title: "Paste Your HTML Signature",
      desc: "In Sig Signature, click 'Copy Signature'. Then return to Gmail, click inside the signature composition box, and press Ctrl+V (Cmd+V on Mac) to paste.",
    },
    {
      num: "04",
      title: "Set Defaults and Save",
      desc: "Under 'Signature defaults', choose your new signature for new emails and replies. Scroll to the bottom of the page and click 'Save Changes'.",
    },
  ];

  const mobileSteps = [
    {
      num: "01",
      title: "Set Up Desktop Signature First",
      desc: "Ensure you have saved your formatted signature on Gmail Web. The Gmail mobile app synchronizes with your web signature by default.",
    },
    {
      num: "02",
      title: "Open the Gmail Mobile App",
      desc: "Open the Gmail app on your iOS or Android device. Tap the hamburger menu icon (☰) in the search bar and select 'Settings'.",
    },
    {
      num: "03",
      title: "Select Your Email Account",
      desc: "Tap your Google Workspace or personal email address, then locate the 'Signature settings' section.",
    },
    {
      num: "04",
      title: "Verify Auto-Sync Defaults",
      desc: "Ensure 'Mobile Signature' is toggled off if you want Gmail to automatically attach your rich HTML desktop signature across all outgoing mobile emails.",
    },
  ];

  const currentSteps = activeTab === "web" ? webSteps : mobileSteps;

  return (
    <div className="w-full">
      {/* Platform Toggle Pills */}
      <div className="flex justify-center mb-10">
        <div className="inline-flex rounded-full border border-slate-200/90 bg-white p-1.5 shadow-xs gap-1">
          <button
            type="button"
            onClick={() => setActiveTab("web")}
            className={`rounded-full px-6 py-2.5 text-xs sm:text-sm font-semibold transition cursor-pointer ${
              activeTab === "web"
                ? "bg-[#245FD4] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
            style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
          >
            Gmail on Web & Desktop
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("mobile")}
            className={`rounded-full px-6 py-2.5 text-xs sm:text-sm font-semibold transition cursor-pointer ${
              activeTab === "mobile"
                ? "bg-[#245FD4] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
            style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
          >
            Gmail for Mobile (iOS & Android)
          </button>
        </div>
      </div>

      {/* 4 Stacked Step Cards matching Screenshot 3 & 4 */}
      <div className="space-y-4 max-w-4xl mx-auto">
        {currentSteps.map((step) => (
          <div
            key={step.num}
            className="flex items-start gap-5 sm:gap-6 rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-2xs transition-all hover:border-slate-300"
          >
            {/* Number Pill */}
            <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-full border border-[#245FD4]/30 bg-[#EFF6FF] text-[#245FD4] font-heading font-bold text-sm sm:text-base">
              {step.num}
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1 pt-1">
              <h3
                className="font-heading text-base sm:text-lg font-bold text-slate-900"
                style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
              >
                {step.title}
              </h3>
              <p
                className="mt-1.5 font-body text-xs sm:text-sm text-slate-600 leading-relaxed"
                style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
              >
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
