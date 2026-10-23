"use client";

import Image from "next/image";
import type { Team, TeamMember } from "@/types/team";

interface TeamMemberThumbnailProps {
  team: Team;
  member: TeamMember;
}

/**
 * Renders a crisp, visually-styled thumbnail for a team member's signature.
 * Uses the same card design language (350×174 aspect ratio) as the template gallery.
 * Derives theme, colors and layout from the team's base signature data.
 */
export default function TeamMemberThumbnail({ team, member }: TeamMemberThumbnailProps) {
  const baseData = team.data as {
    themeColor?: string;
    companyName?: string;
    templateId?: string;
    design?: { theme?: string };
    socials?: Record<string, string>;
  };

  const themeColor = baseData.themeColor || "#245FD4";
  const companyName = baseData.companyName?.trim() || "";
  const templateId = team.templateId || baseData.templateId || "";

  const fullName = member.name?.trim() || "";
  const jobTitle = member.jobTitle?.trim() || "";
  const email = member.email?.trim() || "";
  const phone = member.phone?.trim() || "";
  const avatarUrl = member.photoUrl?.trim() || "";

  // Derive member socials into a flat map
  const memberSocials: Record<string, string> = {};
  for (const s of member.socials || []) {
    if (s.url?.trim()) {
      const key = s.platform === "x" ? "twitter" : s.platform;
      memberSocials[key] = s.url.trim();
    }
  }

  // Dark theme detection
  const isDarkTheme =
    (team.kind === "studio" && baseData.design?.theme === "dark") ||
    templateId === "modern-dark" ||
    templateId === "bold-gradient";

  // Corporate Elegant gets split card treatment
  const isCorporateElegant = templateId === "corporate-elegant";

  const bgColor = isDarkTheme ? "#0B132B" : "#FFFFFF";
  const nameColor = isDarkTheme ? "#FFFFFF" : "#1E293B";
  const titleColor = isDarkTheme ? "#94A3B8" : themeColor;
  const textColor = isDarkTheme ? "#94A3B8" : "#64748B";
  const iconColor = isDarkTheme ? "#64748B" : themeColor;

  // Initials fallback
  const initials = fullName
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0] || "")
    .join("")
    .toUpperCase() || "U";

  // --- Corporate Elegant: Split card ---
  if (isCorporateElegant) {
    const corpColor = themeColor || "#163BA4";
    return (
      <div className="flex h-full w-full overflow-hidden select-none">
        <div
          className="flex w-[34%] items-center justify-center p-3 text-center"
          style={{ backgroundColor: corpColor }}
        >
          <span
            className="text-[10px] font-extrabold uppercase tracking-widest text-white leading-tight"
            style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
          >
            {companyName || "COMPANY"}
          </span>
        </div>
        <div className="flex w-[66%] flex-col justify-center bg-white p-4">
          <p
            className="text-[14px] font-bold text-[#1E293B] leading-tight truncate"
            style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
          >
            {fullName || "Member Name"}
          </p>
          <p
            className="mt-0.5 text-[11px] font-medium text-slate-500 leading-tight truncate"
            style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
          >
            {jobTitle || "Job Title"}
          </p>
          <div className="mt-2 space-y-1">
            {phone && (
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                <svg className="h-3 w-3 shrink-0" style={{ color: corpColor }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span className="truncate">{phone}</span>
              </div>
            )}
            {email && (
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                <svg className="h-3 w-3 shrink-0" style={{ color: corpColor }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <span className="truncate">{email}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // --- Default card layout ---
  return (
    <div
      className="flex h-full w-full items-center p-5 select-none"
      style={{ backgroundColor: bgColor }}
    >
      <div className="flex items-center gap-3.5 min-w-0 w-full">
        {/* Avatar */}
        {avatarUrl ? (
          <div
            className={`relative shrink-0 overflow-hidden ${
              isDarkTheme
                ? "rounded-full border-2 shadow-[0_0_10px_rgba(139,92,246,0.45)]"
                : "rounded-lg border shadow-2xs"
            }`}
            style={{
              width: 52,
              height: 52,
              borderColor: isDarkTheme ? themeColor : "#E2E8F0",
            }}
          >
            <Image
              src={avatarUrl}
              alt={fullName || "Member"}
              fill
              className="object-cover"
              sizes="52px"
            />
          </div>
        ) : (
          <div
            className="flex shrink-0 items-center justify-center text-base font-bold text-white shadow-2xs"
            style={{
              width: 52,
              height: 52,
              background: `linear-gradient(135deg, ${themeColor} 0%, #022977 100%)`,
              borderRadius: isDarkTheme ? "50%" : "10px",
            }}
          >
            {initials}
          </div>
        )}

        {/* Info */}
        <div className="min-w-0 flex-1">
          <p
            className="text-[14px] font-bold leading-tight truncate"
            style={{
              color: nameColor,
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            }}
          >
            {fullName || "Member Name"}
          </p>
          <p
            className="mt-0.5 text-[11px] font-medium leading-tight truncate"
            style={{
              color: titleColor,
              fontFamily: "var(--font-commissioner), Commissioner, sans-serif",
            }}
          >
            {jobTitle || "Job Title"}
          </p>

          {/* Contact rows */}
          <div className="mt-2 space-y-1">
            {phone && (
              <div className="flex items-center gap-1.5 text-[10px]" style={{ color: textColor }}>
                <svg className="h-3 w-3 shrink-0" style={{ color: iconColor }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span className="truncate">{phone}</span>
              </div>
            )}
            {email && (
              <div className="flex items-center gap-1.5 text-[10px]" style={{ color: textColor }}>
                <svg className="h-3 w-3 shrink-0" style={{ color: iconColor }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <span className="truncate">{email}</span>
              </div>
            )}
          </div>

          {/* Social badges (from member's own socials) */}
          {(memberSocials.linkedin || memberSocials.twitter || memberSocials.github) && (
            <div className="mt-2.5 flex items-center gap-1.5">
              {memberSocials.linkedin && (
                <span
                  className="flex h-4 w-4 items-center justify-center rounded text-[8px] font-bold text-white shadow-2xs"
                  style={{ backgroundColor: isDarkTheme ? "#1E293B" : themeColor }}
                >
                  in
                </span>
              )}
              {memberSocials.twitter && (
                <span
                  className="flex h-4 w-4 items-center justify-center rounded text-[8px] font-bold text-white shadow-2xs"
                  style={{ backgroundColor: isDarkTheme ? "#1E293B" : themeColor }}
                >
                  𝕏
                </span>
              )}
              {memberSocials.github && (
                <span
                  className="flex h-4 w-4 items-center justify-center rounded text-[8px] font-bold text-white shadow-2xs"
                  style={{ backgroundColor: isDarkTheme ? "#1E293B" : themeColor }}
                >
                  gh
                </span>
              )}
            </div>
          )}
        </div>

        {/* Company block (shown on light themes with company name) */}
        {companyName && !isDarkTheme && (
          <div className="hidden sm:flex flex-col items-center justify-center border-l border-slate-200 pl-4 py-2 shrink-0 max-w-[85px]">
            <span
              className="block text-[10px] font-extrabold uppercase tracking-wider text-[#1E293B] text-center leading-tight"
              style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
            >
              {companyName.length > 12 ? companyName.slice(0, 12) + "…" : companyName}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
