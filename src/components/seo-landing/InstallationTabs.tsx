"use client";

import { useState } from "react";

export interface InstallStep {
  stepNumber: string;
  title: string;
  instruction: string;
  tip?: string;
}

export interface InstallTab {
  id: string;
  label: string;
  badge?: string;
  steps: InstallStep[];
}

interface InstallationTabsProps {
  headline: string;
  subtitle: string;
  tabs: InstallTab[];
}

export default function InstallationTabs({
  headline,
  subtitle,
  tabs,
}: InstallationTabsProps) {
  const [activeTabId, setActiveTabId] = useState(tabs[0]?.id || "");
  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

  return (
    <div className="w-full">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-semibold text-slate-900 tracking-tight">
          {headline}
        </h2>
        <p className="mt-3 font-body text-sm sm:text-base text-slate-600 leading-relaxed">
          {subtitle}
        </p>

        {/* Tab Pills */}
        <div className="mt-8 inline-flex flex-wrap justify-center rounded-2xl border border-slate-200/90 bg-white p-1.5 shadow-xs gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTabId(tab.id)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold transition cursor-pointer ${
                activeTabId === tab.id
                  ? "bg-[#245FD4] text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
              style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
            >
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                    activeTabId === tab.id
                      ? "bg-white/20 text-white"
                      : "bg-blue-50 text-[#245FD4]"
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Steps Grid */}
      {activeTab && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {activeTab.steps.map((step) => (
            <div
              key={step.stepNumber}
              className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs hover:border-[#245FD4]/40 transition duration-200"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-[#245FD4] font-heading font-bold text-xs">
                    {step.stepNumber}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Step {step.stepNumber}
                  </span>
                </div>
                <h3 className="font-heading text-base font-bold text-slate-900 leading-snug">
                  {step.title}
                </h3>
                <p className="mt-2 font-body text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {step.instruction}
                </p>
              </div>

              {step.tip && (
                <div className="mt-4 rounded-xl bg-[#F8FAFC] border border-slate-100 p-2.5 text-[11px] text-slate-500 font-body">
                  <span className="font-semibold text-[#245FD4]">Pro tip: </span>
                  {step.tip}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
