"use client";

import { useState } from "react";

export default function OutlookGeneratorHeroMockup() {
  const [activeTab, setActiveTab] = useState<"details" | "design" | "links">("details");
  const [fullName, setFullName] = useState("The Nevon");
  const [jobTitle, setJobTitle] = useState("Leadership Platform");
  const [company, setCompany] = useState("The Nevon");
  const [email, setEmail] = useState("thenevon@outlook.com");
  const [selectedColor, setSelectedColor] = useState("#245FD4");

  const colors = ["#245FD4", "#1E293B", "#6366F1", "#0F172A"];

  return (
    <div className="w-full max-w-[620px] mx-auto rounded-2xl border border-slate-200/90 bg-white shadow-xl overflow-hidden font-body text-slate-800">
      {/* Browser chrome header */}
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#EF4444]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#F59E0B]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#10B981]" />
        </div>
        <div className="rounded-md bg-white border border-slate-200/60 px-4 py-0.5 text-[11px] text-slate-500 shadow-2xs font-mono">
          www.sigsignature.com
        </div>
        <div className="w-10" />
      </div>

      {/* Editor & Preview Split View */}
      <div className="grid grid-cols-1 md:grid-cols-12 min-h-[380px]">
        {/* Left pane: Mini Editor Form */}
        <div className="md:col-span-5 border-b md:border-b-0 md:border-r border-slate-100 p-4 sm:p-5 flex flex-col justify-between bg-slate-50/30">
          <div>
            {/* Tabs */}
            <div className="flex items-center gap-3 border-b border-slate-200/60 pb-2 mb-4 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab("details")}
                className={`transition cursor-pointer pb-0.5 ${
                  activeTab === "details"
                    ? "text-[#245FD4] border-b-2 border-[#245FD4]"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                Details
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("design")}
                className={`transition cursor-pointer pb-0.5 ${
                  activeTab === "design"
                    ? "text-[#245FD4] border-b-2 border-[#245FD4]"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                Design
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("links")}
                className={`transition cursor-pointer pb-0.5 ${
                  activeTab === "links"
                    ? "text-[#245FD4] border-b-2 border-[#245FD4]"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                Links
              </button>
            </div>

            {/* Inputs */}
            <div className="space-y-2.5">
              <div>
                <label className="block text-[10px] font-medium text-slate-500 mb-0.5">Full name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-900 outline-none focus:border-[#245FD4]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-medium text-slate-500 mb-0.5">Job title</label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-900 outline-none focus:border-[#245FD4]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-medium text-slate-500 mb-0.5">Company</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-900 outline-none focus:border-[#245FD4]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-medium text-slate-500 mb-0.5">Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-900 outline-none focus:border-[#245FD4]"
                />
              </div>

              {/* Color dots */}
              <div className="pt-1">
                <span className="block text-[10px] font-medium text-slate-500 mb-1">Brand color</span>
                <div className="flex items-center gap-1.5">
                  {colors.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setSelectedColor(c)}
                      className={`h-4 w-4 rounded-full transition cursor-pointer ${
                        selectedColor === c ? "ring-2 ring-offset-1 ring-slate-400" : ""
                      }`}
                      style={{ backgroundColor: c }}
                      aria-label={`Select color ${c}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[9px] text-slate-400">
            Your details. Your brand. One clear signature.
          </div>
        </div>

        {/* Right pane: Outlook Composer Body & Live Signature Preview */}
        <div className="md:col-span-7 p-4 sm:p-5 flex flex-col justify-between bg-white">
          {/* Simulated Email Message */}
          <div>
            <div className="space-y-1 text-[11px] text-slate-600 font-body leading-relaxed mb-4">
              <p className="font-semibold text-slate-800">Hi Sarah,</p>
              <p>Great speaking earlier today. As promised, I have attached our infrastructure roadmap.</p>
              <p>Let me know if Thursday afternoon works for a brief walk-through with our systems engineering team.</p>
              <p className="pt-1 text-slate-500">Best regards,</p>
            </div>

            {/* Signature Preview Card */}
            <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-xs">
              <div className="flex items-start gap-3">
                {/* Logo / Avatar with gradient */}
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white font-heading font-bold text-xs shadow-xs"
                  style={{ backgroundColor: selectedColor }}
                >
                  <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <rect x="3" y="3" width="7" height="7" rx="1.5" />
                    <rect x="14" y="3" width="7" height="7" rx="1.5" />
                    <rect x="14" y="14" width="7" height="7" rx="1.5" />
                    <rect x="3" y="14" width="7" height="7" rx="1.5" />
                  </svg>
                </div>

                <div className="min-w-0 flex-1 space-y-0.5">
                  <h4 className="font-heading text-sm font-bold text-slate-900 leading-tight">
                    {fullName || "Your Name"}
                  </h4>
                  <p className="text-[11px] font-medium text-slate-500 leading-tight">
                    {jobTitle || "Your Title"}
                  </p>
                  <p className="text-[10px] text-slate-400 leading-tight">
                    {company || "Your Company"}
                  </p>
                  <div className="pt-1.5 space-y-0.5 text-[10px] text-slate-500">
                    <p>{email || "you@company.com"}</p>
                    <p>+1 202 555 0148 · www.thenevon.com</p>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <span
                      className="text-[10px] font-semibold cursor-pointer hover:underline"
                      style={{ color: selectedColor }}
                    >
                      Explore our work →
                    </span>
                    <div className="flex items-center gap-2 text-slate-400">
                      <span className="text-[10px] font-bold">in</span>
                      <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Send Action Button */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#002B7F] px-4 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#002060] transition cursor-pointer"
            >
              <span>SEND</span>
              <svg className="h-3 w-3 fill-current" viewBox="0 0 24 24">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
