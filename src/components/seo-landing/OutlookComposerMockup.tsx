"use client";

import { useState } from "react";

export default function OutlookComposerMockup() {
  const [outlookVersion, setOutlookVersion] = useState<"desktop" | "web" | "mac">("desktop");

  return (
    <div className="w-full">
      {/* Outlook Version Toggle */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500" style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}>
            Microsoft Outlook Rendering Lab
          </span>
        </div>
        <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5 shadow-2xs">
          <button
            type="button"
            onClick={() => setOutlookVersion("desktop")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-semibold transition cursor-pointer ${
              outlookVersion === "desktop"
                ? "bg-[#0078D4] text-white shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
            style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
          >
            <span>Outlook 365 (Word Engine)</span>
          </button>
          <button
            type="button"
            onClick={() => setOutlookVersion("web")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-semibold transition cursor-pointer ${
              outlookVersion === "web"
                ? "bg-[#0078D4] text-white shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
            style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
          >
            <span>New Outlook (Web)</span>
          </button>
          <button
            type="button"
            onClick={() => setOutlookVersion("mac")}
            className={`hidden sm:flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-semibold transition cursor-pointer ${
              outlookVersion === "mac"
                ? "bg-[#0078D4] text-white shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
            style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
          >
            <span>Outlook for Mac</span>
          </button>
        </div>
      </div>

      {/* Outlook Window Frame */}
      <div className="w-full rounded-2xl border border-slate-200/90 bg-white shadow-lg overflow-hidden">
        {/* Outlook Ribbon Header */}
        <div className="bg-[#0078D4] px-4 py-2 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <span className="font-heading text-xs font-bold tracking-wide">
              {outlookVersion === "desktop" ? "Outlook Desktop (Word Engine)" : outlookVersion === "web" ? "Outlook on the Web" : "Outlook for Mac"}
            </span>
            <span className="hidden sm:inline-block text-[11px] bg-white/20 px-2 py-0.5 rounded text-white/90">
              MSO Protected
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-white/30" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/30" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/30" />
          </div>
        </div>

        {/* Outlook Ribbon Actions Toolbar */}
        <div className="bg-[#F3F2F1] px-4 py-2 border-b border-slate-200 flex items-center gap-3 text-xs text-slate-700">
          <button
            type="button"
            className="flex items-center gap-1.5 rounded bg-[#0078D4] px-3.5 py-1 text-xs font-semibold text-white shadow-2xs hover:bg-[#006abc]"
          >
            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
            <span>Send</span>
          </button>
          <div className="h-4 w-[1px] bg-slate-300" />
          <span className="hidden sm:flex items-center gap-1 text-slate-600 hover:text-slate-900 cursor-pointer">
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
            </svg>
            <span>Attach File</span>
          </span>
          <span className="hidden sm:inline-block text-slate-600 hover:text-slate-900 cursor-pointer">Insert</span>
          <span className="hidden sm:inline-block text-slate-600 hover:text-slate-900 cursor-pointer">Options</span>
          <span className="hidden sm:inline-block text-slate-600 hover:text-slate-900 cursor-pointer">Format Text</span>
        </div>

        {/* Outlook Recipient Fields */}
        <div className="px-4 py-1.5 border-b border-slate-100 flex items-center text-xs">
          <span className="w-14 text-slate-400 font-semibold">From:</span>
          <span className="text-slate-700">Marcus Vance &lt;m.vance@vancestrategic.com&gt;</span>
        </div>
        <div className="px-4 py-1.5 border-b border-slate-100 flex items-center text-xs">
          <span className="w-14 text-slate-400 font-semibold">To:</span>
          <span className="text-slate-700 font-medium">enterprise.procurement@globalholdings.com</span>
        </div>
        <div className="px-4 py-1.5 border-b border-slate-100 flex items-center text-xs">
          <span className="w-14 text-slate-400 font-semibold">Subject:</span>
          <span className="text-slate-800 font-semibold">Executed Master Advisory Agreement & Implementation Schedule</span>
        </div>

        {/* Email Message Content */}
        <div className="p-4 sm:p-6 text-xs sm:text-[13px] text-slate-700 space-y-3 font-body leading-relaxed">
          <p>Dear Procurement Team,</p>
          <p>
            Please find attached the fully countersigned Master Services Agreement and associated Schedule A. Our executive committee has signed off on the milestone timeline for Q4.
          </p>
          <p>
            We look forward to initiating sprint zero next Monday. Please reach out directly on my office line if you require additional verification.
          </p>
          <p className="pt-1 text-slate-500">Kind regards,</p>

          {/* Embedded Signature (Strict Table Architecture simulating MSO comments) */}
          <div className="pt-2">
            <div className="rounded-xl border border-slate-200/90 bg-[#FAFBFD] p-4 sm:p-5">
              <table cellPadding={0} cellSpacing={0} style={{ borderCollapse: "collapse", width: "100%", maxWidth: "520px" }}>
                <tbody>
                  <tr>
                    {/* Logo / Monogram Cell */}
                    <td style={{ verticalAlign: "top", width: "72px", paddingRight: "16px" }}>
                      <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-[#0078D4] to-[#022977] flex items-center justify-center text-white shadow-2xs font-heading font-extrabold text-xl">
                        VS
                      </div>
                    </td>

                    {/* Rigid MSO Vertical Divider */}
                    <td style={{ width: "2px", backgroundColor: "#022977", verticalAlign: "top" }} />

                    {/* Contact & Executive Detail Cell */}
                    <td style={{ verticalAlign: "top", paddingLeft: "16px" }}>
                      <div style={{ fontFamily: "Segoe UI, Calibri, Arial, sans-serif" }}>
                        <div style={{ fontSize: "15px", fontWeight: "bold", color: "#0F172A", lineHeight: "1.2" }}>
                          Marcus Vance
                        </div>
                        <div style={{ fontSize: "11px", fontWeight: "600", color: "#0078D4", marginTop: "2px" }}>
                          Managing Partner · Vance Strategic Advisory
                        </div>

                        {/* Two-column contact layout */}
                        <table cellPadding={0} cellSpacing={0} style={{ borderCollapse: "collapse", marginTop: "8px", width: "100%", fontSize: "11px", color: "#475569" }}>
                          <tbody>
                            <tr>
                              <td style={{ paddingBottom: "2px", color: "#0078D4", fontWeight: "bold", width: "20px" }}>D:</td>
                              <td style={{ paddingBottom: "2px", color: "#1E293B" }}>+1 (212) 849-2041</td>
                              <td style={{ paddingBottom: "2px", paddingLeft: "12px", color: "#0078D4", fontWeight: "bold", width: "20px" }}>W:</td>
                              <td style={{ paddingBottom: "2px", color: "#1E293B" }}>www.vancestrategic.com</td>
                            </tr>
                            <tr>
                              <td style={{ color: "#0078D4", fontWeight: "bold" }}>O:</td>
                              <td style={{ color: "#1E293B" }}>One World Trade Center, Suite 8400, New York, NY</td>
                              <td style={{ paddingLeft: "12px", color: "#0078D4", fontWeight: "bold" }}>E:</td>
                              <td style={{ color: "#0078D4" }}>m.vance@vancestrategic.com</td>
                            </tr>
                          </tbody>
                        </table>

                        {/* Confidentiality Notice */}
                        <div style={{ marginTop: "10px", fontSize: "9px", color: "#94A3B8", lineHeight: "1.4", borderTop: "1px solid #E2E8F0", paddingTop: "6px" }}>
                          CONFIDENTIALITY NOTICE: This transmission is intended solely for the person or entity to which it is addressed. It may contain privileged material exempt from disclosure under applicable law.
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Outlook Status Footer */}
        <div className="bg-[#F8FAFC] px-4 py-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-[11px] font-medium text-slate-600">Zero DPI logo scaling · No Word flexbox collapse</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">HTML table width=&quot;520&quot; · MSO 0pt spacing</span>
        </div>
      </div>
    </div>
  );
}
