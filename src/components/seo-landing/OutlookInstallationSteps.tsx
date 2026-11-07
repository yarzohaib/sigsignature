"use client";

import { useState } from "react";

export default function OutlookInstallationSteps() {
  const [activeTab, setActiveTab] = useState<"desktop" | "web">("desktop");

  const desktopSteps = [
    {
      num: "01",
      title: "Open Outlook Settings",
      desc: 'In the Outlook desktop app, click "File" in the top menu, select "Options", and navigate to "Mail". Click the "Signatures..." button on the right.',
    },
    {
      num: "02",
      title: "Go to the Signature Section",
      desc: 'Under the "Email Signature" tab, click "New", enter a descriptive name for your signature (e.g., "Work Signature"), and click OK.',
    },
    {
      num: "03",
      title: "Paste Your HTML Signature",
      desc: 'In Sig Signature, click "Copy Signature". Then return to Outlook, click inside the signature composition box, and press Ctrl+V (Cmd+V on Mac) to paste.',
    },
    {
      num: "04",
      title: "Set Defaults and Save",
      desc: 'Under "Choose default signature", select your email account and assign your new signature for new emails and replies. Click OK to save.',
    },
  ];

  const webSteps = [
    {
      num: "01",
      title: "Open Outlook Web Settings",
      desc: 'Sign in to Outlook on the web (outlook.office.com or Microsoft 365). Click the gear icon (⚙) in the top-right toolbar and select "View all Outlook settings".',
    },
    {
      num: "02",
      title: "Go to Compose and Reply",
      desc: 'Navigate to "Mail" in the left column, then select "Compose and reply". Click "+ New signature" and give it a name.',
    },
    {
      num: "03",
      title: "Paste Your HTML Signature",
      desc: 'In Sig Signature, click "Copy Signature". Return to Outlook Web, click inside the signature text area, and press Ctrl+V (Cmd+V on Mac) to paste.',
    },
    {
      num: "04",
      title: "Set Defaults and Save",
      desc: 'Under "Select default signatures", choose your new signature for new messages and for replies/forwards. Click "Save" at the bottom.',
    },
  ];

  const currentSteps = activeTab === "desktop" ? desktopSteps : webSteps;

  return (
    <div className="w-full">
      {/* Platform Toggle Pills */}
      <div className="flex justify-center mb-10">
        <div className="inline-flex rounded-full border border-slate-200/90 bg-white p-1.5 shadow-xs gap-1">
          <button
            type="button"
            onClick={() => setActiveTab("desktop")}
            className={`rounded-full px-6 py-2.5 text-xs sm:text-sm font-semibold transition cursor-pointer ${
              activeTab === "desktop"
                ? "bg-[#245FD4] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
            style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
          >
            Outlook Desktop (Windows & Mac)
          </button>
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
            Outlook Web (Microsoft 365)
          </button>
        </div>
      </div>

      {/* 4 Installation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {currentSteps.map((step) => (
          <div
            key={step.num}
            className="flex flex-col justify-start rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-2xs hover:border-slate-300 transition-all text-left"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EFF6FF] border border-[#245FD4]/20 text-[#245FD4] font-heading text-sm font-bold mb-5">
              {step.num}
            </div>
            <h3
              className="font-heading text-base font-bold text-slate-900 leading-snug"
              style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
            >
              {step.title}
            </h3>
            <p
              className="mt-2.5 font-body text-xs text-slate-600 leading-relaxed max-w-[280px]"
              style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
            >
              {step.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
