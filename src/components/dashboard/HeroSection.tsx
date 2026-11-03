"use client";

import { useOptionalUser } from "@/contexts/UserContext";
import { getStoredUser } from "@/app/lib/auth";
import { UserProfile } from "@/app/lib/api";

/**
 * Extracts initials according to specification:
 * - Single word (e.g. "John"): returns 1 letter ("J")
 * - Two words (e.g. "John Doe"): returns 2 letters ("JD")
 * - 3+ words (e.g. "John Alpha Doe"): returns 2 letters from first 2 words ("JA")
 */
export function getUserInitials(name: string): string {
  if (!name) return "MZ";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "MZ";
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
}

export default function HeroSection() {
  const optionalUser = useOptionalUser();
  const storedUser: UserProfile | null = getStoredUser();

  const user = optionalUser?.user || storedUser;

  // 1. First Name for heading ("Welcome back, Muhammad.")
  const rawFirstName =
    user?.firstName?.trim() ||
    (optionalUser?.displayName ? optionalUser.displayName.trim().split(/\s+/)[0] : "") ||
    "Muhammad";
  const displayFirstName = rawFirstName.replace(/\.+$/, "");

  // 2. Full Name for Email card design ("Muhammad Zohaib")
  const fullName =
    (user?.firstName || user?.lastName
      ? [user.firstName, user.lastName]
          .filter((s): s is string => typeof s === "string" && s.trim().length > 0)
          .map((s) => s.trim())
          .join(" ")
      : optionalUser?.displayName?.trim()) ||
    "Muhammad Zohaib";

  // 3. User initials for profile icon ("MZ", "J", "JD", "JA")
  const initials = getUserInitials(fullName);

  return (
    <section
      className="relative w-full rounded-[20px] sm:rounded-[22px] overflow-hidden shadow-xs shrink-0"
      style={{
        background: "linear-gradient(95.52deg, #245FD4 0.74%, #00359F 48.18%, #00143C 100%)",
      }}
    >
      {/* Subtle Dot Grid Pattern on the dark right side */}
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-full sm:w-2/3 lg:w-1/2 opacity-20"
        style={{
          backgroundImage: "radial-gradient(circle, #FFFFFF 1.5px, transparent 1.5px)",
          backgroundSize: "19px 19px",
          maskImage: "linear-gradient(to right, transparent 0%, black 50%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 50%)",
        }}
      />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-8 px-6 sm:px-10 lg:px-12 xl:px-14 py-7 sm:py-8 lg:py-8 xl:py-9">
        {/* Left: Welcome heading & subtitle */}
        <div className="text-left min-w-0 flex-1 max-w-xl">
          <h1
            className="text-white font-bold text-[26px] sm:text-[30px] lg:text-[34px] xl:text-[36px] leading-[1.12] tracking-tight"
            style={{
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            }}
          >
            <span className="block">Welcome back,</span>
            <span className="block truncate max-w-full sm:max-w-md lg:max-w-lg" title={`${displayFirstName}.`}>
              {displayFirstName}.
            </span>
          </h1>

          <p
            className="mt-2.5 sm:mt-3 text-[#DCE7F9] sm:text-white/85 text-[13px] sm:text-[14px] lg:text-[15px] font-normal leading-relaxed max-w-[340px] sm:max-w-[420px]"
            style={{
              fontFamily: "var(--font-commissioner), Commissioner, sans-serif",
            }}
          >
            Your next signature is a few clicks away. Pick a template or design your own.
          </p>
        </div>

        {/* Right: Signature Mockup Cards (Dark card behind + White card front) */}
        <div className="relative flex justify-center sm:justify-end shrink-0 select-none pt-2 pb-2 sm:pt-0 sm:pb-0 pr-2 lg:pr-4">
          <div className="relative">
            {/* 1. Dark Mockup Card (Tilted behind at -6 degrees) */}
            <div
              className="absolute -left-10 sm:-left-12 -top-3.5 sm:-top-4 w-[230px] sm:w-[250px] h-[120px] sm:h-[130px] rounded-2xl bg-[#0B132B] border border-white/10 shadow-2xl p-3.5 sm:p-4 transform -rotate-6 origin-bottom-left pointer-events-none"
            >
              <div className="flex items-center gap-3">
                {/* Cyan Avatar Circle */}
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#38BDF8] shrink-0" />
                {/* Skeleton preview lines */}
                <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                  <div className="h-2 w-16 sm:w-20 bg-white/90 rounded-full" />
                  <div className="h-1.5 w-10 sm:w-12 bg-slate-500/60 rounded-full" />
                </div>
              </div>
              {/* Divider line */}
              <div className="h-[1.5px] w-28 sm:w-32 bg-slate-700/60 rounded-full mt-3.5" />
            </div>

            {/* 2. White Signature Card (In front, tilted at ~1.8 degrees) */}
            <div
              className="relative z-10 w-[255px] sm:w-[285px] rounded-2xl bg-white shadow-[0_12px_36px_rgba(0,0,0,0.25)] p-3.5 sm:p-4 transform rotate-[1.8deg]"
            >
              {/* User Identity Row */}
              <div className="flex items-center gap-3">
                {/* Profile Icon with User Initials */}
                <div
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#184EB6] shrink-0 flex items-center justify-center text-white font-bold text-[12px] sm:text-[13px] tracking-tight select-none shadow-xs"
                  style={{
                    fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                  }}
                >
                  {initials}
                </div>

                {/* User Full Name & Title */}
                <div className="flex flex-col min-w-0 flex-1">
                  <span
                    className="text-[#0F172A] font-bold text-[13px] sm:text-[14px] leading-tight truncate"
                    style={{
                      fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                    }}
                  >
                    {fullName}
                  </span>
                  <span
                    className="text-[#64748B] text-[10px] sm:text-[11px] leading-tight mt-0.5 truncate"
                    style={{
                      fontFamily: "var(--font-commissioner), Commissioner, sans-serif",
                    }}
                  >
                    Your title · Your company
                  </span>
                </div>
              </div>

              {/* Horizontal Divider Bar */}
              <div className="h-[2px] w-36 sm:w-44 bg-[#E2E8F0] rounded-full my-2.5 sm:my-3" />

              {/* Action Button & Soft Icons */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="bg-[#184EB6] text-white text-[9.5px] sm:text-[10px] font-semibold px-2.5 sm:px-3 py-1 rounded-full shadow-xs whitespace-nowrap">
                  Book a call
                </div>
                <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-[4px] bg-[#DBE9FE] shrink-0" />
                <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-[4px] bg-[#DBE9FE] shrink-0" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
