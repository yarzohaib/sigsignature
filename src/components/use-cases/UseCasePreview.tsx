"use client";

import { useState } from "react";

export type SignatureStyle = "minimal" | "executive" | "compact";

interface UseCasePreviewProps {
  initialStyle: SignatureStyle;
  containerVariant?: "light" | "dark";
}

function SocialLinks({ isDark }: { isDark: boolean }) {
  const linkClass = `inline-flex cursor-pointer items-center justify-center text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 ${
    isDark ? "text-white/90 hover:text-white" : "text-slate-700 hover:text-slate-900"
  }`;

  return (
    <div className="flex items-center gap-3">
      <a
        href="https://www.linkedin.com/company/sig-signature/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Sig Signature on LinkedIn"
        className={linkClass}
      >
        in
      </a>
      <a
        href="https://www.instagram.com/sigsignature_com/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Sig Signature on Instagram"
        className={linkClass}
      >
        <svg className="block h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
        </svg>
      </a>
      <a
        href="https://x.com/SigSignature_"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Sig Signature on X"
        className={linkClass}
      >
        𝕏
      </a>
    </div>
  );
}

export default function UseCasePreview({
  initialStyle,
  containerVariant = "light",
}: UseCasePreviewProps) {
  const [activeStyle, setActiveStyle] = useState<SignatureStyle>(initialStyle);

  const isDark = containerVariant === "dark";

  return (
    <div
      className={`rounded-3xl p-6 sm:p-8 transition-colors duration-300 shadow-sm ${
        containerVariant === "dark"
          ? "border border-blue-900/50 bg-[#021845]"
          : "border border-slate-200/90 bg-[#F4F8FD]/80"
      }`}
    >
      {/* 1. MINIMAL TEMPLATE VIEW */}
      {activeStyle === "minimal" && (
        <div
          className={`rounded-2xl p-5 sm:p-6 transition-all duration-300 ${
            isDark
              ? "border border-white/20 bg-[#062058] text-white shadow-xl"
              : "border border-slate-200/80 bg-white shadow-sm"
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div
                className={`h-12 w-12 sm:h-14 sm:w-14 shrink-0 rounded-full ${
                  isDark ? "shadow-md" : "shadow-inner"
                }`}
                style={{
                  background:
                    "radial-gradient(circle at 35% 35%, #2563EB 0%, #0F357D 50%, #040F28 100%)",
                }}
              />
              <div>
                <h3
                  className={`font-heading text-base font-bold ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  The Nevon
                </h3>
                <p
                  className={`font-body text-xs font-medium ${
                    isDark ? "text-blue-200/80" : "text-slate-500"
                  }`}
                >
                  Leadership Platform · Ceo
                </p>
              </div>
            </div>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium shadow-sm ${
                isDark
                  ? "border border-slate-200/90 bg-white text-slate-800"
                  : "border border-slate-200 bg-white text-slate-700 shadow-2xs"
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>Active</span>
            </span>
          </div>

          <div
            className={`mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 pt-3 font-body text-xs ${
              isDark ? "text-blue-100/90" : "text-slate-700"
            }`}
          >
            <span
              className={`font-medium ${
                isDark ? "text-white/90" : "text-slate-800"
              }`}
            >
              thenevon@gmail.com
            </span>
            <span className={isDark ? "text-blue-400/60" : "text-slate-300"}>|</span>
            <span>+655 863 1279</span>
          </div>
          <p
            className={`mt-1 font-body text-xs ${
              isDark ? "text-blue-200/70" : "text-slate-500"
            }`}
          >
            www.thenevon.com
          </p>

          <div className="mt-4 flex items-center gap-3">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full bg-[#002B7F] px-3.5 py-1 text-xs font-semibold text-white shadow-2xs ${
                isDark ? "border border-white/20" : ""
              }`}
            >
              <span>Book a call</span>
              <svg className="h-2.5 w-2.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 3l14 9-14 9V3z" />
              </svg>
            </span>
            <SocialLinks isDark={isDark} />
          </div>
        </div>
      )}

      {/* 2. EXECUTIVE TEMPLATE VIEW */}
      {activeStyle === "executive" && (
        <div className="rounded-2xl border border-white/20 bg-[#062058] p-5 sm:p-6 text-white shadow-xl transition-all duration-300">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div
                className="h-12 w-12 sm:h-14 sm:w-14 shrink-0 rounded-full shadow-md"
                style={{
                  background:
                    "radial-gradient(circle at 35% 35%, #2563EB 0%, #0F357D 50%, #040F28 100%)",
                }}
              />
              <div>
                <h3 className="font-heading text-base font-bold text-white">
                  The Nevon
                </h3>
                <p className="font-body text-xs font-medium text-blue-200/80">
                  Leadership Platform · Ceo
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/90 bg-white px-2.5 py-0.5 text-[11px] font-medium text-slate-800 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>Active</span>
            </span>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 pt-3 font-body text-xs text-blue-100/90">
            <span className="font-medium text-white/90">thenevon@gmail.com</span>
            <span className="text-blue-400/60">|</span>
            <span>+655 863 1279</span>
          </div>
          <p className="mt-1 font-body text-xs text-blue-200/70">www.thenevon.com</p>

          <div className="mt-4 flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#002B7F] border border-white/20 px-3.5 py-1 text-xs font-semibold text-white shadow-2xs">
              <span>Book a call</span>
              <svg className="h-2.5 w-2.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 3l14 9-14 9V3z" />
              </svg>
            </span>
            <SocialLinks isDark />
          </div>
        </div>
      )}

      {/* 3. COMPACT TEMPLATE VIEW */}
      {activeStyle === "compact" && (
        <div
          className={`rounded-2xl p-5 sm:p-6 transition-all duration-300 ${
            isDark
              ? "border border-white/20 bg-[#062058] text-white shadow-xl"
              : "border border-slate-200/80 bg-white shadow-sm"
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <div
              className={`h-16 w-16 sm:h-20 sm:w-20 shrink-0 rounded-full ${
                isDark ? "shadow-md" : "shadow-inner"
              }`}
              style={{
                background:
                  "radial-gradient(circle at 35% 35%, #2563EB 0%, #0F357D 50%, #040F28 100%)",
              }}
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <h3
                  className={`font-heading text-base font-bold ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  The Nevon
                </h3>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                    isDark
                      ? "border border-slate-200/90 bg-white text-slate-800 shadow-sm"
                      : "border border-slate-200 bg-white text-slate-700"
                  }`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span>Active</span>
                </span>
              </div>
              <p
                className={`font-body text-xs font-medium ${
                  isDark ? "text-blue-200/80" : "text-slate-500"
                }`}
              >
                Leadership Platform · Ceo
              </p>

              <div
                className={`mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 font-body text-[11px] ${
                  isDark ? "text-blue-100/90" : "text-slate-700"
                }`}
              >
                <span
                  className={`font-medium ${
                    isDark ? "text-white/90" : "text-slate-800"
                  }`}
                >
                  thenevon@gmail.com
                </span>
                <span className={isDark ? "text-blue-400/60" : "text-slate-300"}>|</span>
                <span>+655 863 1279</span>
                <span className={isDark ? "text-blue-400/60" : "text-slate-300"}>|</span>
                <span>thenevon.com</span>
              </div>

              <div className="mt-3 flex items-center gap-3">
                <span
                  className={`inline-flex items-center gap-1 rounded-full bg-[#002B7F] px-3 py-1 text-[11px] font-semibold text-white ${
                    isDark ? "border border-white/20" : ""
                  }`}
                >
                  <span>Book a call</span>
                  <svg className="h-2 w-2 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M5 3l14 9-14 9V3z" />
                  </svg>
                </span>
                <SocialLinks isDark={isDark} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Segmented Switcher / Tabs */}
      <div className="mt-5 grid grid-cols-3 gap-3 font-body text-xs font-medium">
        <button
          type="button"
          onClick={() => setActiveStyle("minimal")}
          className={`rounded-xl py-2.5 text-center transition-all duration-200 cursor-pointer ${
            activeStyle === "minimal"
              ? "bg-gradient-to-r from-[#245FD4] to-[#1E50BA] font-semibold text-white shadow-sm ring-2 ring-[#245FD4]/30"
              : containerVariant === "dark"
              ? "border border-white/20 bg-white/5 text-white/80 hover:bg-white/10"
              : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
          }`}
        >
          Minimal
        </button>

        <button
          type="button"
          onClick={() => setActiveStyle("executive")}
          className={`rounded-xl py-2.5 text-center transition-all duration-200 cursor-pointer ${
            activeStyle === "executive"
              ? "bg-gradient-to-r from-[#245FD4] to-[#1E50BA] font-semibold text-white shadow-sm ring-2 ring-[#245FD4]/30"
              : containerVariant === "dark"
              ? "border border-white/20 bg-white/5 text-white/80 hover:bg-white/10"
              : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
          }`}
        >
          Execute
        </button>

        <button
          type="button"
          onClick={() => setActiveStyle("compact")}
          className={`rounded-xl py-2.5 text-center transition-all duration-200 cursor-pointer ${
            activeStyle === "compact"
              ? "bg-gradient-to-r from-[#245FD4] to-[#1E50BA] font-semibold text-white shadow-sm ring-2 ring-[#245FD4]/30"
              : containerVariant === "dark"
              ? "border border-white/20 bg-white/5 text-white/80 hover:bg-white/10"
              : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
          }`}
        >
          Compact
        </button>
      </div>
    </div>
  );
}
