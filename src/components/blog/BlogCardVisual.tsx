import React from "react";
import Image from "next/image";

interface BlogCardVisualProps {
  type: string;
  coverImage?: string;
  title: string;
}

export default function BlogCardVisual({ type, coverImage, title }: BlogCardVisualProps) {
  if (coverImage) {
    return (
      <div aria-hidden="true" className="relative aspect-video w-full overflow-hidden rounded-2xl bg-slate-900">
        <Image
          src={coverImage}
          alt={title}
          fill
          quality={95}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-102"
        />
      </div>
    );
  }

  switch (type) {
    case "nevon-signature":
      return (
        <div aria-hidden="true" className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-[#EEF2F6] p-5 sm:p-6 flex items-center justify-center transition-transform duration-300 group-hover:scale-102">
          {/* Signature Preview Card */}
          <div className="w-full max-w-[320px] rounded-xl border border-slate-200/90 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              {/* 3D Blue Sphere Avatar */}
              <div
                className="h-11 w-11 shrink-0 rounded-full shadow-inner"
                style={{
                  background:
                    "radial-gradient(circle at 35% 35%, #3B82F6 0%, #1E40AF 45%, #0B1C43 100%)",
                }}
              />
              <div className="min-w-0 flex-1">
                <p className="font-heading text-xs font-bold text-slate-900 truncate">
                  The Nevon
                </p>
                <p className="font-body text-[10px] text-slate-400">
                  Leadership
                </p>
                <p className="font-body text-[10px] text-[#245FD4] font-medium truncate mt-0.5">
                  thenevon@gmail.com
                </p>
              </div>
            </div>

            {/* Quick Action Pills */}
            <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between gap-1.5">
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 font-body text-[9px] font-semibold text-slate-600">
                Home
              </span>
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 font-body text-[9px] font-semibold text-slate-600">
                Help
              </span>
              <span className="rounded-full bg-[#EBF3FE] px-2.5 py-0.5 font-body text-[9px] font-semibold text-[#245FD4]">
                Contact
              </span>
            </div>
          </div>
        </div>
      );

    case "html-vs-image":
      return (
        <div aria-hidden="true" className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-[#091C3E] p-4 sm:p-5 flex items-center justify-center transition-transform duration-300 group-hover:scale-102">
          <div className="grid grid-cols-2 gap-3 w-full max-w-[320px]">
            {/* HTML Tile */}
            <div className="flex flex-col items-center justify-center rounded-xl bg-[#0F2856] border border-blue-400/20 p-4 text-center shadow-inner">
              <span className="font-mono text-base font-bold text-[#60A5FA]">
                &lt;/&gt;
              </span>
              <span className="mt-1 font-heading text-sm sm:text-base font-bold text-white">
                HTML
              </span>
              <span className="mt-1 font-body text-[8px] font-semibold uppercase tracking-wider text-[#93C5FD]">
                FLEXIBLE &amp; SCALABLE
              </span>
            </div>

            {/* Image Tile */}
            <div className="flex flex-col items-center justify-center rounded-xl bg-[#0F2856] border border-blue-400/20 p-4 text-center shadow-inner">
              <svg className="h-5 w-5 text-[#60A5FA]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <span className="mt-1 font-heading text-sm sm:text-base font-bold text-white">
                Image
              </span>
              <span className="mt-1 font-body text-[8px] font-semibold uppercase tracking-wider text-[#93C5FD]">
                A VISUAL SNAPSHOT
              </span>
            </div>
          </div>
        </div>
      );

    case "envelope-at":
      return (
        <div aria-hidden="true" className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-[#EBE7E0] flex items-center justify-center transition-transform duration-300 group-hover:scale-102">
          {/* Diagonal White Envelope */}
          <div className="relative w-56 h-36 bg-[#FAFAF9] rounded-lg shadow-md -rotate-6 border border-slate-200/60 overflow-hidden flex items-center justify-center">
            {/* Envelope Flap Lines */}
            <div className="absolute inset-0 border-t-2 border-slate-200/70" />
            <div
              className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-[#F5F5F4] to-[#E7E5E4] opacity-40"
              style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
            />

            {/* 3D Blue @ Symbol */}
            <div
              className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-xl"
              style={{
                background:
                  "radial-gradient(circle at 30% 30%, #3B82F6 0%, #1D4ED8 60%, #0F2A6B 100%)",
                boxShadow: "0 10px 25px -5px rgba(29, 78, 216, 0.5), inset 0 2px 4px rgba(255, 255, 255, 0.4)",
              }}
            >
              <span className="font-heading text-2xl font-bold select-none">@</span>
            </div>
          </div>
        </div>
      );

    case "calm-rollout":
      return (
        <div aria-hidden="true" className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-[#ECE8E1] p-5 flex items-center justify-center transition-transform duration-300 group-hover:scale-102">
          {/* Letter / Envelope Document */}
          <div className="relative w-56 h-32 bg-white rounded-lg shadow-md border-t-4 border-[#245FD4] p-3 -rotate-3 border-x border-b border-slate-200/80">
            <div className="h-2 w-16 bg-[#245FD4]/30 rounded-full" />
            <div className="mt-2 space-y-1.5">
              <div className="h-1.5 w-36 bg-slate-200 rounded-full" />
              <div className="h-1.5 w-28 bg-slate-200 rounded-full" />
              <div className="h-1.5 w-20 bg-slate-200 rounded-full" />
            </div>

            {/* Minimalist Stylus / Pen */}
            <div
              className="absolute -right-2 -bottom-2 h-1.5 w-28 bg-gradient-to-r from-slate-700 to-slate-400 rounded-full shadow-md"
              style={{ transform: "rotate(28deg)" }}
            />
          </div>
        </div>
      );

    case "campaign-banner":
      return (
        <div aria-hidden="true" className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-[#DCE8F9] p-4 flex items-center justify-center transition-transform duration-300 group-hover:scale-102">
          {/* Centered Navy Banner */}
          <div className="w-full max-w-[300px] rounded-xl bg-[#091D45] p-4 text-white shadow-md border border-blue-400/20">
            <span className="inline-block rounded-full bg-blue-500/20 px-2 py-0.5 font-body text-[9px] font-bold tracking-wider uppercase text-[#93C5FD]">
              NEXT UP / LIVE SESSION
            </span>
            <div className="mt-2 flex items-center justify-between">
              <h4 className="font-heading text-sm font-semibold tracking-tight text-white">
                Ideas worth opening.
              </h4>
              <span className="text-white text-base">↗</span>
            </div>
          </div>
        </div>
      );

    case "good-hierarchy":
      return (
        <div aria-hidden="true" className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-[#091D45] p-5 flex flex-col items-center justify-center text-center transition-transform duration-300 group-hover:scale-102">
          <span className="font-heading text-4xl sm:text-5xl font-bold tracking-tight text-white select-none">
            Aa.
          </span>
          <div className="mt-3 flex items-center gap-2 font-body text-xs font-semibold">
            <span className="text-white">Name</span>
            <span className="text-blue-400" aria-hidden="true">&bull;</span>
            <span className="text-[#60A5FA]">Role</span>
            <span className="text-blue-400" aria-hidden="true">&bull;</span>
            <span className="text-slate-400">Details</span>
          </div>
        </div>
      );

    default:
      return (
        <div aria-hidden="true" className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-[#245FD4] to-[#022977] p-5 flex items-center justify-center text-white">
          <span className="font-heading text-lg font-bold">Sig Signature</span>
        </div>
      );
  }
}
