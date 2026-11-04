"use client";

import { useState } from "react";
import Image from "next/image";

export default function GmailComposerMockup() {
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");

  return (
    <div className="w-full">
      {/* Device View Toggle */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500" style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}>
            Live Gmail Client Rendering
          </span>
        </div>
        <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5 shadow-2xs">
          <button
            type="button"
            onClick={() => setViewMode("desktop")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-semibold transition cursor-pointer ${
              viewMode === "desktop"
                ? "bg-[#245FD4] text-white shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
            style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
            <span>Gmail Web</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("mobile")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-semibold transition cursor-pointer ${
              viewMode === "mobile"
                ? "bg-[#245FD4] text-white shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
            style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="5" y="2" width="14" height="20" rx="2" />
              <line x1="12" y1="18" x2="12.01" y2="18" />
            </svg>
            <span>Gmail Mobile</span>
          </button>
        </div>
      </div>

      {/* Gmail Window Frame */}
      <div
        className={`mx-auto rounded-2xl border border-slate-200/90 bg-white shadow-lg transition-all duration-300 overflow-hidden ${
          viewMode === "mobile" ? "max-w-[380px]" : "w-full"
        }`}
      >
        {/* Gmail Window Title Bar */}
        <div className="flex items-center justify-between bg-[#F2F6FC] px-4 py-2.5 border-b border-slate-200/80">
          <div className="flex items-center gap-2">
            <span className="font-heading text-xs font-semibold text-slate-800">
              {viewMode === "mobile" ? "Gmail for iOS / Android" : "New Message"}
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-400 pointer-events-none select-none cursor-default" aria-hidden="true">
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 3 21 3 21 9" />
              <polyline points="9 21 3 21 3 15" />
              <line x1="21" y1="3" x2="14" y2="10" />
              <line x1="3" y1="21" x2="10" y2="14" />
            </svg>
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </div>
        </div>

        {/* Email Header Fields */}
        <div className="px-4 py-2 border-b border-slate-100 flex items-center text-xs">
          <span className="w-16 text-slate-400 font-medium">To</span>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-0.5 text-slate-700">
            <span>sarah.jenkins@acme-ventures.com</span>
          </div>
        </div>
        <div className="px-4 py-2 border-b border-slate-100 flex items-center text-xs">
          <span className="w-16 text-slate-400 font-medium">Subject</span>
          <span className="text-slate-800 font-medium">Q4 Deliverables & Technical Architecture Review</span>
        </div>

        {/* Message Body */}
        <div className="p-4 sm:p-5 text-xs sm:text-[13px] text-slate-700 space-y-3 font-body leading-relaxed">
          <p>Hi Sarah,</p>
          <p>
            Great speaking earlier today. As promised, I have attached our infrastructure roadmap and SOC2 compliance package for your technical review.
          </p>
          <p>
            Let me know if Thursday afternoon works for a brief walk-through with our systems engineering team.
          </p>
          <p className="pt-1 text-slate-500">Best regards,</p>

          {/* Embedded Signature (Table layout simulating exact compiled HTML output) */}
          <div className="pt-2">
            <div className="rounded-xl border border-slate-100 bg-[#FCFDFE] p-3.5 sm:p-4">
              <table cellPadding={0} cellSpacing={0} style={{ borderCollapse: "collapse", width: "100%", maxWidth: "480px" }}>
                <tbody>
                  <tr>
                    {/* Avatar Column */}
                    <td style={{ verticalAlign: "top", width: "68px", paddingRight: "14px" }}>
                      <div className="h-14 w-14 rounded-full overflow-hidden border border-slate-200 shadow-2xs relative bg-slate-100">
                        <Image
                          src="/damon-sterling.png"
                          alt="David Sterling headshot"
                          width={56}
                          height={56}
                          className="h-full w-full object-cover"
                          unoptimized
                        />
                      </div>
                    </td>

                    {/* Divider Column */}
                    <td style={{ width: "2px", backgroundColor: "#245FD4", verticalAlign: "top" }} />

                    {/* Information Column */}
                    <td style={{ verticalAlign: "top", paddingLeft: "14px" }}>
                      <div style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
                        <div style={{ fontSize: "14px", fontWeight: "bold", color: "#111827", lineHeight: "1.2" }}>
                          David Sterling
                        </div>
                        <div style={{ fontSize: "11px", fontWeight: "600", color: "#245FD4", marginTop: "2px", letterSpacing: "0.2px" }}>
                          VP of Product Engineering · Acuity Systems
                        </div>

                        {/* Contact details with explicit styling to prevent Gmail auto-link color override */}
                        <div style={{ fontSize: "11px", color: "#64748B", marginTop: "6px", lineHeight: "1.5" }}>
                          <div>
                            <span style={{ color: "#94A3B8", marginRight: "6px" }}>P:</span>
                            <span style={{ color: "#334155", textDecoration: "none" }}>+1 (415) 890-4321</span>
                          </div>
                          <div>
                            <span style={{ color: "#94A3B8", marginRight: "6px" }}>E:</span>
                            <span style={{ color: "#245FD4", textDecoration: "none" }}>david.sterling@acuitysystems.com</span>
                          </div>
                          <div>
                            <span style={{ color: "#94A3B8", marginRight: "6px" }}>W:</span>
                            <span style={{ color: "#334155", textDecoration: "none" }}>www.acuitysystems.com</span>
                          </div>
                        </div>

                        {/* Social Badges & Meeting Link */}
                        <div style={{ marginTop: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
                          <span style={{ display: "inline-block", background: "#0A66C2", color: "#ffffff", fontSize: "10px", fontWeight: "bold", padding: "2px 6px", borderRadius: "3px" }}>
                            in
                          </span>
                          <span style={{ display: "inline-block", background: "#0F172A", color: "#ffffff", fontSize: "10px", fontWeight: "bold", padding: "2px 6px", borderRadius: "3px" }}>
                            𝕏
                          </span>
                          <span style={{ fontSize: "10px", color: "#245FD4", fontWeight: "bold", background: "#EFF6FF", padding: "2px 8px", borderRadius: "9999px", border: "1px solid #BFDBFE" }}>
                            Book 15 min call →
                          </span>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Gmail Bottom Action Bar */}
        <div className="flex items-center justify-between border-t border-slate-100 bg-white px-4 py-2.5 pointer-events-none select-none cursor-default">
          <div className="flex items-center gap-1.5 pointer-events-none select-none cursor-default">
            <div
              className="inline-flex items-center gap-2 rounded-full bg-[#0B57D0] px-5 py-1.5 text-xs font-semibold text-white shadow-2xs pointer-events-none select-none cursor-default"
              aria-hidden="true"
            >
              <span>Send</span>
              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
            <div className="hidden sm:flex items-center gap-1 text-slate-400 pl-2 pointer-events-none select-none cursor-default" aria-hidden="true">
              <span className="p-1 font-bold text-xs pointer-events-none select-none cursor-default">A</span>
              <span className="p-1 text-xs pointer-events-none select-none cursor-default">📎</span>
              <span className="p-1 text-xs pointer-events-none select-none cursor-default">🔗</span>
              <span className="p-1 text-xs pointer-events-none select-none cursor-default">😀</span>
              <span className="p-1 text-xs pointer-events-none select-none cursor-default">▲</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <span className="text-[11px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              100% Gmail Validated
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
