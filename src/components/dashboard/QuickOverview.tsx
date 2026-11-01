"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSignatureRepository } from "@/lib/signatures/repository";
import { AVAILABLE_TEMPLATES } from "@/lib/templatesData";
import { getTeam } from "@/app/lib/api";
import { syncLifetimeSignatureCount } from "@/lib/signatures/lifetimeTracker";
import { getStoredUser } from "@/app/lib/auth";

const CACHE_SIG_KEY = "sig_cached_signatures_count";
const CACHE_TEAMS_KEY = "sig_cached_teams_count";

export default function QuickOverview() {
  // Initialize with cached numbers from localStorage to prevent flashing '0' on page load / refresh
  const [totalSignatures, setTotalSignatures] = useState<number>(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem(CACHE_SIG_KEY);
        if (cached !== null) {
          const parsed = parseInt(cached, 10);
          if (!isNaN(parsed)) return parsed;
        }
      } catch {
        // ignore localStorage access error
      }
    }
    return 1;
  });

  const [personalTemplatesCount, setPersonalTemplatesCount] = useState<number>(
    AVAILABLE_TEMPLATES.length || 17
  );

  const [teamsCount, setTeamsCount] = useState<number>(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem(CACHE_TEAMS_KEY);
        if (cached !== null) {
          const parsed = parseInt(cached, 10);
          if (!isNaN(parsed)) return parsed;
        }
      } catch {
        // ignore localStorage access error
      }
    }
    return 0;
  });

  useEffect(() => {
    let isMounted = true;

    async function fetchOverviewStats() {
      // 1. Total Signatures Count
      try {
        const repo = getSignatureRepository();
        const list = await repo.list();
        if (isMounted) {
          const user = getStoredUser();
          const effectiveCount = syncLifetimeSignatureCount(list.length, user?.id);
          setTotalSignatures(effectiveCount);
          try {
            localStorage.setItem(CACHE_SIG_KEY, effectiveCount.toString());
          } catch {
            // ignore localStorage quota/disabled errors
          }
        }
      } catch {
        // keep fallback or cached count
      }

      // 2. Personal Templates
      if (isMounted) {
        setPersonalTemplatesCount(AVAILABLE_TEMPLATES.length);
      }

      // 3. Teams Count
      try {
        const teamData = await getTeam();
        if (isMounted) {
          const count = teamData && teamData.members ? teamData.members.length : 0;
          setTeamsCount(count);
          try {
            localStorage.setItem(CACHE_TEAMS_KEY, count.toString());
          } catch {
            // ignore localStorage errors
          }
        }
      } catch {
        if (isMounted) {
          setTeamsCount(0);
        }
      }
    }

    fetchOverviewStats();

    const handleUpdate = () => {
      fetchOverviewStats();
    };

    window.addEventListener("sig_count_update", handleUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener("sig_count_update", handleUpdate);
    };
  }, []);

  return (
    <section className="w-full shrink-0" aria-label="Quick overview">
      {/* Heading: Quick overview */}
      <h2
        className="text-[#1E293B] mb-3 sm:mb-3.5 font-bold text-[18px] sm:text-[20px] tracking-tight"
        style={{
          fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
          lineHeight: "100%",
        }}
      >
        Quick overview
      </h2>

      {/* 4 Separate Overview Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 xl:gap-5 w-full">
        {/* Card 1: Signatures */}
        <Link
          href="/signatures"
          className="flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs hover:shadow-md hover:border-[#CBD5E1] transition-all group"
        >
          <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
            {/* Soft Blue Icon Container */}
            <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-[14px] bg-[#EFF6FF] text-[#245FD4]">
              <svg
                className="h-5.5 w-5.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M4 19.5h16" />
                <path d="M4 15.5C6 14 7.5 8 9.5 8s2.5 7 4 7 2-4 3.5-4c1 0 1.5 2.5 3 2.5" />
              </svg>
            </div>

            {/* Content: Label -> Value -> Subtitle */}
            <div className="flex flex-col min-w-0">
              <span
                className="text-[#64748B] font-medium text-[12.5px] sm:text-[13px] leading-tight truncate"
                style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
              >
                Signatures
              </span>
              <span
                className="mt-1 text-[#0F172A] font-bold text-[20px] sm:text-[22px] leading-none truncate"
                style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
              >
                {totalSignatures}
              </span>
              <span
                className="mt-1 text-[#94A3B8] text-[11px] sm:text-[11.5px] leading-tight truncate"
                style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
              >
                of 3 on the Free plan
              </span>
            </div>
          </div>

          {/* Chevron Right */}
          <svg
            className="h-4 w-4 shrink-0 text-[#94A3B8] group-hover:text-[#64748B] transition-transform group-hover:translate-x-0.5 ml-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </Link>

        {/* Card 2: Templates */}
        <Link
          href="/templates"
          className="flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs hover:shadow-md hover:border-[#CBD5E1] transition-all group"
        >
          <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
            {/* Soft Purple Icon Container */}
            <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-[14px] bg-[#F5F3FF] text-[#8B5CF6]">
              <svg
                className="h-5.5 w-5.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect width="18" height="18" x="3" y="3" rx="4" />
                <path d="M3 9h18" />
                <path d="M9 21V9" />
              </svg>
            </div>

            {/* Content: Label -> Value -> Subtitle */}
            <div className="flex flex-col min-w-0">
              <span
                className="text-[#64748B] font-medium text-[12.5px] sm:text-[13px] leading-tight truncate"
                style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
              >
                Templates
              </span>
              <span
                className="mt-1 text-[#0F172A] font-bold text-[20px] sm:text-[22px] leading-none truncate"
                style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
              >
                {personalTemplatesCount}
              </span>
              <span
                className="mt-1 text-[#94A3B8] text-[11px] sm:text-[11.5px] leading-tight truncate"
                style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
              >
                Ready to customize
              </span>
            </div>
          </div>

          {/* Chevron Right */}
          <svg
            className="h-4 w-4 shrink-0 text-[#94A3B8] group-hover:text-[#64748B] transition-transform group-hover:translate-x-0.5 ml-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </Link>

        {/* Card 3: Team members */}
        <Link
          href="/team-signatures"
          className="flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs hover:shadow-md hover:border-[#CBD5E1] transition-all group"
        >
          <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
            {/* Soft Green Icon Container */}
            <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-[14px] bg-[#ECFDF5] text-[#10B981]">
              <svg
                className="h-5.5 w-5.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>

            {/* Content: Label -> Value -> Subtitle */}
            <div className="flex flex-col min-w-0">
              <span
                className="text-[#64748B] font-medium text-[12.5px] sm:text-[13px] leading-tight truncate"
                style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
              >
                Team members
              </span>
              <span
                className="mt-1 text-[#0F172A] font-bold text-[20px] sm:text-[22px] leading-none truncate"
                style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
              >
                {teamsCount}
              </span>
              <span
                className="mt-1 text-[#94A3B8] text-[11px] sm:text-[11.5px] leading-tight truncate"
                style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
              >
                Invite people to your team
              </span>
            </div>
          </div>

          {/* Chevron Right */}
          <svg
            className="h-4 w-4 shrink-0 text-[#94A3B8] group-hover:text-[#64748B] transition-transform group-hover:translate-x-0.5 ml-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </Link>

        {/* Card 4: Help center */}
        <Link
          href="/help"
          className="flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs hover:shadow-md hover:border-[#CBD5E1] transition-all group"
        >
          <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
            {/* Soft Amber Icon Container */}
            <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-[14px] bg-[#FFFBEB] text-[#D97706]">
              <svg
                className="h-5.5 w-5.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="4" />
                <line x1="4.93" y1="4.93" x2="9.17" y2="9.17" />
                <line x1="14.83" y1="9.17" x2="19.07" y2="4.93" />
                <line x1="14.83" y1="14.83" x2="19.07" y2="19.07" />
                <line x1="4.93" y1="19.07" x2="9.17" y2="14.83" />
              </svg>
            </div>

            {/* Content: Label -> Value -> Subtitle */}
            <div className="flex flex-col min-w-0">
              <span
                className="text-[#64748B] font-medium text-[12.5px] sm:text-[13px] leading-tight truncate"
                style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
              >
                Help center
              </span>
              <span
                className="mt-1 text-[#0F172A] font-bold text-[18px] sm:text-[20px] leading-none truncate"
                style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
              >
                Guides
              </span>
              <span
                className="mt-1 text-[#94A3B8] text-[11px] sm:text-[11.5px] leading-tight truncate"
                style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
              >
                Setup and troubleshooting
              </span>
            </div>
          </div>

          {/* Chevron Right */}
          <svg
            className="h-4 w-4 shrink-0 text-[#94A3B8] group-hover:text-[#64748B] transition-transform group-hover:translate-x-0.5 ml-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
