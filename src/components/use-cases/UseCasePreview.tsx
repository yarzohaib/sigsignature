"use client";

import { useState } from "react";

export type SignatureStyle = "minimal" | "executive" | "compact";

interface UseCasePreviewProps {
  initialStyle: SignatureStyle;
  containerVariant?: "light" | "dark";
}

export default function UseCasePreview({
  initialStyle,
  containerVariant = "light",
}: UseCasePreviewProps) {
  const [activeStyle, setActiveStyle] = useState<SignatureStyle>(initialStyle);

  const isDark = containerVariant === "dark" || activeStyle === "executive";

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
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-sm transition-all duration-300">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div
                className="h-12 w-12 sm:h-14 sm:w-14 shrink-0 rounded-full shadow-inner"
                style={{
                  background:
                    "radial-gradient(circle at 35% 35%, #3B82F6 0%, #1E40AF 45%, #0B1C43 100%)",
                }}
              />
              <div>
                <h3 className="font-heading text-base font-bold text-slate-900">
                  The Nevon
                </h3>
                <p className="font-body text-xs font-medium text-slate-500">
                  Leadership Platform · Ceo
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-[11px] font-medium text-slate-600 shadow-2xs">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Active</span>
            </span>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-slate-100 pt-3 font-body text-xs text-slate-500">
            <span className="text-[#245FD4] font-medium">thenevon@gmail.com</span>
            <span className="text-slate-300">|</span>
            <span>+655 863 1279</span>
          </div>
          <p className="mt-1 font-body text-xs text-slate-400">www.thenevon.com</p>

          <div className="mt-4 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1E50BA] px-3.5 py-1 text-xs font-semibold text-white shadow-2xs">
              <span>Book a call</span>
              <span aria-hidden="true">&gt;</span>
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded bg-slate-100 text-xs font-bold text-slate-700">
              in
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded bg-slate-100 text-xs font-bold text-slate-700">
              𝕏
            </span>
          </div>
        </div>
      )}

      {/* 2. EXECUTIVE TEMPLATE VIEW */}
      {activeStyle === "executive" && (
        <div className="rounded-2xl border border-blue-800/60 bg-[#0A2D74] p-5 sm:p-6 text-white shadow-inner transition-all duration-300">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div
                className="h-12 w-12 sm:h-14 sm:w-14 shrink-0 rounded-full shadow-md"
                style={{
                  background:
                    "radial-gradient(circle at 35% 35%, #60A5FA 0%, #2563EB 45%, #0A1C40 100%)",
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
            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-700/60 bg-blue-950/60 px-2.5 py-0.5 text-[11px] font-medium text-blue-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>Active</span>
            </span>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-blue-800/50 pt-3 font-body text-xs text-blue-100/90">
            <span className="text-[#60A5FA] font-medium">thenevon@gmail.com</span>
            <span className="text-blue-700">|</span>
            <span>+655 863 1279</span>
          </div>
          <p className="mt-1 font-body text-xs text-blue-300/70">www.thenevon.com</p>

          <div className="mt-4 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#245FD4] to-[#1E50BA] px-3.5 py-1 text-xs font-semibold text-white shadow-2xs">
              <span>Book a call</span>
              <span aria-hidden="true">&gt;</span>
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded bg-blue-900/80 text-xs font-bold text-white">
              in
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded bg-blue-900/80 text-xs font-bold text-white">
              𝕏
            </span>
          </div>
        </div>
      )}

      {/* 3. COMPACT TEMPLATE VIEW */}
      {activeStyle === "compact" && (
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-sm transition-all duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <div
              className="h-16 w-16 sm:h-20 sm:w-20 shrink-0 rounded-full shadow-inner"
              style={{
                background:
                  "radial-gradient(circle at 35% 35%, #3B82F6 0%, #1E40AF 45%, #0B1C43 100%)",
              }}
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-heading text-base font-bold text-slate-900">
                  The Nevon
                </h3>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-medium text-slate-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span>Active</span>
                </span>
              </div>
              <p className="font-body text-xs font-medium text-slate-500">
                Leadership Platform · Ceo
              </p>

              <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 font-body text-[11px] text-slate-500">
                <span className="text-[#245FD4]">thenevon@gmail.com</span>
                <span className="text-slate-300">|</span>
                <span>+655 863 1279</span>
                <span className="text-slate-300">|</span>
                <span>thenevon.com</span>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-[#1E50BA] px-3 py-1 text-[11px] font-semibold text-white">
                  <span>Book a call</span>
                  <span aria-hidden="true">&gt;</span>
                </span>
                <span className="flex h-6 w-6 items-center justify-center rounded bg-slate-100 text-[11px] font-bold text-slate-700">
                  in
                </span>
                <span className="flex h-6 w-6 items-center justify-center rounded bg-slate-100 text-[11px] font-bold text-slate-700">
                  𝕏
                </span>
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
          className={`rounded-xl py-2.5 text-center transition-all duration-200 ${
            activeStyle === "minimal"
              ? "bg-gradient-to-r from-[#1E50BA] to-[#0A2558] font-semibold text-white shadow-sm ring-2 ring-[#245FD4]/30"
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
          className={`rounded-xl py-2.5 text-center transition-all duration-200 ${
            activeStyle === "executive"
              ? "bg-gradient-to-r from-[#245FD4] to-[#1E50BA] font-semibold text-white shadow-sm ring-2 ring-[#245FD4]/30"
              : containerVariant === "dark"
              ? "border border-white/20 bg-white/5 text-white/80 hover:bg-white/10"
              : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
          }`}
        >
          Executive
        </button>

        <button
          type="button"
          onClick={() => setActiveStyle("compact")}
          className={`rounded-xl py-2.5 text-center transition-all duration-200 ${
            activeStyle === "compact"
              ? "bg-gradient-to-r from-[#1E50BA] to-[#0A2558] font-semibold text-white shadow-sm ring-2 ring-[#245FD4]/30"
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
