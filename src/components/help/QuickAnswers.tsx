"use client";

import React, { useState } from "react";
import { QUICK_ANSWERS } from "@/lib/helpData";

export default function QuickAnswers() {
  const [openId, setOpenId] = useState<string | null>(QUICK_ANSWERS[0]?.id || null);

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section aria-labelledby="quick-answers-heading" className="flex flex-col">
      <div className="flex items-center justify-between mb-3.5">
        <h2
          id="quick-answers-heading"
          className="text-lg font-bold text-[#1E293B]"
          style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
        >
          Quick answers
        </h2>
      </div>

      <div className="rounded-2xl border border-[#E2E8F0] bg-white divide-y divide-[#F1F5F9] overflow-hidden">
        {QUICK_ANSWERS.map((item) => {
          const isOpen = openId === item.id;
          const buttonId = `faq-btn-${item.id}`;
          const panelId = `faq-panel-${item.id}`;

          return (
            <div key={item.id} className="transition-colors">
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggleItem(item.id)}
                className="flex w-full items-center justify-between gap-4 p-4 sm:p-4.5 text-left transition hover:bg-slate-50/60 focus-visible:outline-none focus-visible:bg-slate-50"
              >
                <span
                  className={`text-[13px] sm:text-sm font-semibold transition-colors ${
                    isOpen ? "text-[#245FD4]" : "text-[#1E293B]"
                  }`}
                  style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                >
                  {item.question}
                </span>

                <span className="flex h-5 w-5 shrink-0 items-center justify-center">
                  {isOpen ? (
                    <svg
                      className="h-3.5 w-3.5 text-[#245FD4]"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      aria-hidden="true"
                    >
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  ) : (
                    <svg
                      className="h-3.5 w-3.5 text-[#94A3B8]"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      aria-hidden="true"
                    >
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  )}
                </span>
              </button>

              {isOpen && (
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className="px-4 pb-4 sm:px-4.5 sm:pb-4.5 text-xs sm:text-[13px] text-[#64748B] leading-relaxed animate-in fade-in duration-150"
                  style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                >
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
