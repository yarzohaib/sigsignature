"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSignatureRepository } from "@/lib/signatures/repository";
import { AVAILABLE_TEMPLATES } from "@/lib/templatesData";
import { getTeam } from "@/app/lib/api";

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
    return 0;
  });

  const [personalTemplatesCount, setPersonalTemplatesCount] = useState<number>(AVAILABLE_TEMPLATES.length);

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
          setTotalSignatures(list.length);
          try {
            localStorage.setItem(CACHE_SIG_KEY, list.length.toString());
          } catch {
            // ignore localStorage quota/disabled errors
          }
        }
      } catch {
        // keep fallback or cached count
      }

      // 2. Personal Templates (Default to Available Templates count or user customized)
      if (isMounted) {
        setPersonalTemplatesCount(AVAILABLE_TEMPLATES.length);
      }

      // 3. Teams Count
      try {
        const teamData = await getTeam();
        if (isMounted && teamData) {
          const count = teamData.members ? teamData.members.length : 1;
          setTeamsCount(count);
          try {
            localStorage.setItem(CACHE_TEAMS_KEY, count.toString());
          } catch {
            // ignore localStorage errors
          }
        }
      } catch {
        // keep fallback or cached count
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
    <section className="w-full shrink-0" aria-label="Quick Overview">
      {/* Heading: Quick Overview */}
      <h2
        className="text-[#1E293B] mb-2 sm:mb-2.5 font-bold text-[18px] sm:text-[20px]"
        style={{
          fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
          lineHeight: "100%",
          letterSpacing: "0%",
        }}
      >
        Quick Overview
      </h2>

      {/* Overview Container Card */}
      <div className="w-full rounded-2xl bg-[#F8FAFC] px-5 py-4 sm:px-7 sm:py-5">
        <div className="grid grid-cols-1 divide-y divide-[#E2E8F0] md:grid-cols-4 md:divide-y-0 md:divide-x md:divide-[#E2E8F0] items-center">
          
          {/* Item 1: Total Signatures */}
          <Link
            href="/signatures"
            className="flex items-center justify-between py-3 md:py-0 md:pr-5 group transition hover:opacity-90"
          >
            <div className="flex items-center gap-3.5">
              {/* Icon Container */}
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#245FD4] shadow-xs">
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
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </div>

              {/* Text & Count */}
              <div>
                <p
                  className="text-[#64748B] font-medium text-[16px]"
                  style={{
                    fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                    lineHeight: "100%",
                    letterSpacing: "0%",
                  }}
                >
                  Total Signatures
                </p>
                <p
                  className="mt-1 text-[#1E293B] font-bold text-[20px] sm:text-[22px] leading-tight"
                  style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                >
                  {totalSignatures}
                </p>
              </div>
            </div>

            {/* Chevron Right */}
            <svg
              className="h-4.5 w-4.5 text-[#94A3B8] transition-transform group-hover:translate-x-0.5"
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

          {/* Item 2: Personal Templates */}
          <Link
            href="/templates"
            className="flex items-center justify-between py-3 md:py-0 md:px-5 group transition hover:opacity-90"
          >
            <div className="flex items-center gap-3.5">
              {/* Icon Container */}
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#245FD4] shadow-xs">
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
                  <polygon points="12 2 2 7 12 12 22 7 12 2" />
                  <polyline points="2 17 12 22 22 17" />
                  <polyline points="2 12 12 17 22 12" />
                </svg>
              </div>

              {/* Text & Count */}
              <div>
                <p
                  className="text-[#64748B] font-medium text-[16px]"
                  style={{
                    fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                    lineHeight: "100%",
                    letterSpacing: "0%",
                  }}
                >
                  TotalTemplates
                </p>
                <p
                  className="mt-1 text-[#1E293B] font-bold text-[20px] sm:text-[22px] leading-tight"
                  style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                >
                  {personalTemplatesCount}
                </p>
              </div>
            </div>

            {/* Chevron Right */}
            <svg
              className="h-4.5 w-4.5 text-[#94A3B8] transition-transform group-hover:translate-x-0.5"
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

          {/* Item 3: Teams */}
          <Link
            href="/team-signatures"
            className="flex items-center justify-between py-3 md:py-0 md:px-5 group transition hover:opacity-90"
          >
            <div className="flex items-center gap-3.5">
              {/* Icon Container */}
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#245FD4] shadow-xs">
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
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>

              {/* Text & Count */}
              <div>
                <p
                  className="text-[#64748B] font-medium text-[16px]"
                  style={{
                    fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                    lineHeight: "100%",
                    letterSpacing: "0%",
                  }}
                >
                  Teams
                </p>
                <p
                  className="mt-1 text-[#1E293B] font-bold text-[20px] sm:text-[22px] leading-tight"
                  style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                >
                  {teamsCount}
                </p>
              </div>
            </div>

            {/* Chevron Right */}
            <svg
              className="h-4.5 w-4.5 text-[#94A3B8] transition-transform group-hover:translate-x-0.5"
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

          {/* Item 4: Need Help? */}
          <div className="flex items-center justify-between py-3 md:py-0 md:pl-5">
            <div className="flex items-center gap-3.5">
              {/* Star / Sparkle Icon Container */}
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#245FD4] shadow-xs">
                <svg
                  className="h-5.5 w-5.5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 2L14.2 9.8L22 12L14.2 14.2L12 22L9.8 14.2L2 12L9.8 9.8L12 2Z" />
                </svg>
              </div>

              {/* Need help text */}
              <div>
                <p className="text-[14.5px] font-bold text-[#1E293B] leading-tight" style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>
                  Need help?
                </p>
                <p className="mt-0.5 text-[11.5px] text-[#64748B] leading-tight" style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}>
                  Check out our guides or contact support.
                </p>
                <Link
                  href="/help"
                  className="mt-0.5 inline-flex items-center gap-0.5 text-[11.5px] font-semibold text-[#245FD4] hover:underline"
                  style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                >
                  <span>Visit Help Center</span>
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
