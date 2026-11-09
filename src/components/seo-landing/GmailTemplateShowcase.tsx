"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { getStoredUser } from "@/app/lib/auth";

interface TemplateShowcaseCard {
  id: string;
  name: string;
  description: string;
  badge?: string;
  theme: "light" | "dark" | "brand";
  person: {
    name: string;
    role: string;
    company: string;
    email: string;
    phone: string;
  };
}

const SHOWCASE_TEMPLATES: TemplateShowcaseCard[] = [
  {
    id: "minimal",
    name: "Minimal",
    description: "A personal photo, clear contact details, and only one primary link to your work.",
    theme: "light",
    person: {
      name: "Sofia Bennett",
      role: "Creative Director",
      company: "Forma Studio",
      email: "sofia@forma.example.com",
      phone: "+1 202 555 0148",
    },
  },
  {
    id: "essential",
    name: "Essential",
    description: "A text-first signature that keeps replies focused and easy to read.",
    badge: "Most Popular",
    theme: "dark",
    person: {
      name: "Lisa Halley",
      role: "Operations Lead",
      company: "Forma Studio",
      email: "lisa@forma.example.com",
      phone: "+1 202 555 0148",
    },
  },
  {
    id: "brand",
    name: "Brand",
    description: "A restrained text layout for busy threads and frequent follow-ups.",
    theme: "brand",
    person: {
      name: "Daniel Morgan",
      role: "Creative Director",
      company: "Forma Studio",
      email: "daniel@forma.example.com",
      phone: "+1 202 555 0148",
    },
  },
];

export default function GmailTemplateShowcase() {
  const router = useRouter();

  const handleSelectTemplate = (templateId: string) => {
    const user = getStoredUser();
    const targetTpl = templateId === "essential" ? "modern-dark" : templateId === "brand" ? "bold-gradient" : "minimal-clean";
    if (!user) {
      try {
        localStorage.setItem("sig_selected_template", targetTpl);
      } catch {}
      router.push(`/login?redirect=${encodeURIComponent(`/templates?template=${targetTpl}`)}`);
      return;
    }
    router.push(`/templates?template=${encodeURIComponent(targetTpl)}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
      {SHOWCASE_TEMPLATES.map((item) => {
        const isDark = item.theme === "dark";
        return (
          <div
            key={item.id}
            onClick={() => handleSelectTemplate(item.id)}
            className="group flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all duration-200 cursor-pointer"
          >
            {/* Visual Signature Mockup Container */}
            <div
              className={`rounded-xl p-4 sm:p-5 transition-all mb-5 ${
                isDark
                  ? "bg-[#062058] text-white border border-blue-900/50 shadow-xs"
                  : "bg-slate-50/70 text-slate-900 border border-slate-100"
              }`}
            >
              <div className="flex items-start gap-3.5">
                {/* Visual Avatar / Logo */}
                {item.id === "minimal" && (
                  <div className="h-11 w-11 shrink-0 rounded-full bg-gradient-to-br from-amber-200 to-amber-400 flex items-center justify-center font-bold text-amber-900 text-xs shadow-2xs">
                    SB
                  </div>
                )}
                {item.id === "essential" && (
                  <div className="h-11 w-11 shrink-0 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center font-bold text-white text-xs shadow-2xs">
                    LH
                  </div>
                )}
                {item.id === "brand" && (
                  <div className="h-11 w-11 shrink-0 rounded-xl bg-gradient-to-br from-[#245FD4] to-[#022977] flex items-center justify-center font-bold text-white text-xs shadow-2xs">
                    <span className="text-sm font-black">Z</span>
                  </div>
                )}

                <div className="min-w-0 flex-1 space-y-0.5">
                  <h4 className={`font-heading text-sm font-bold leading-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                    {item.person.name}
                  </h4>
                  <p className={`text-[11px] font-medium leading-tight ${isDark ? "text-blue-200/80" : "text-slate-500"}`}>
                    {item.person.role}
                  </p>
                  <p className={`text-[10px] leading-tight ${isDark ? "text-blue-300/60" : "text-slate-400"}`}>
                    {item.person.company}
                  </p>
                  <div className={`pt-2 space-y-0.5 text-[10px] ${isDark ? "text-blue-100/80" : "text-slate-500"}`}>
                    <p>{item.person.email}</p>
                    <p>{item.person.phone}</p>
                  </div>
                  <div className="pt-2 flex items-center justify-between">
                    <span className={`text-[10px] font-semibold ${isDark ? "text-blue-300" : "text-[#245FD4]"}`}>
                      Explore our work →
                    </span>
                    <div
                      className={`flex h-[22px] w-[22px] items-center justify-center rounded-sm ${isDark ? "bg-white" : ""}`}
                      aria-label="LinkedIn"
                    >
                      <svg
                        className="h-[18px] w-[18px]"
                        viewBox="0 0 24 24"
                        fill="#0A66C2"
                        aria-hidden="true"
                      >
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Card Title & Description */}
            <div>
              <div className="flex items-center justify-between">
                <h3
                  className="font-heading text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#245FD4] transition-colors"
                  style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                >
                  {item.name}
                </h3>
                <svg
                  className="h-4 w-4 text-slate-400 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#245FD4]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              </div>
              <p
                className="mt-1 text-xs text-slate-500 leading-relaxed font-body"
                style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
              >
                {item.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
