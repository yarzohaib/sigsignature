"use client";

import { useState } from "react";

const styles = ["Minimal", "Execute", "Compact"];

export default function SignaturePreview() {
  const [active, setActive] = useState("Minimal");

  return (
    <div className="w-full max-w-[624px] rounded-[40px] bg-[#EFEDE9] p-6 shadow-[0_24px_60px_rgba(2,41,119,0.18)]">
      <div className="rounded-[28px] border border-line/60 bg-surface p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-linear-to-br from-brand to-brand-dark" />
            <div>
              <p className="text-[15px] font-semibold text-slate-900">Satya Nadella</p>
              <p className="text-[11px] text-slate-600">Head of Microsoft • CEO</p>
            </div>
          </div>
          <span className="flex items-center gap-1.5 rounded-full border border-line px-2.5 py-0.5 text-[10px] text-slate-700">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
            Active
          </span>
        </div>

        <div className="mt-10 text-[10px] text-slate-700">
          <p>satya@gmail.com <span className="mx-2 text-line">|</span> +655 863 1279</p>
          <p className="mt-2">www.microsoft.com</p>
        </div>

        <div className="mt-5 flex items-center gap-3">
          <span className="bg-brand-gradient rounded-full px-3 py-1.5 text-[9px] font-semibold text-white">
            Book a call ›
          </span>
          <span className="text-[10px] font-bold text-brand">in</span>
          <span className="text-[11px] font-bold text-slate-900">X</span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        {styles.map((style) => (
          <button
            key={style}
            type="button"
            onClick={() => setActive(style)}
            className={`h-12 rounded-[13px] border text-sm font-medium transition ${
              active === style
                ? "bg-brand-gradient border-transparent text-white"
                : "border-line bg-[#F4F2EE] text-slate-800 hover:bg-white"
            }`}
          >
            {style}
          </button>
        ))}
      </div>
    </div>
  );
}