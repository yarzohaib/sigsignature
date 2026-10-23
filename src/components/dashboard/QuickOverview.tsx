"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSignatureRepository } from "@/lib/signatures/repository";
import { AVAILABLE_TEMPLATES } from "@/lib/templatesData";
import { getTeam } from "@/app/lib/api";

export default function QuickOverview() {
  const [totalSignatures, setTotalSignatures] = useState<number>(0);
  const [personalTemplatesCount, setPersonalTemplatesCount] = useState<number>(AVAILABLE_TEMPLATES.length);
  const [teamsCount, setTeamsCount] = useState<number>(0);

  useEffect(() => {
    let isMounted = true;

    async function fetchOverviewStats() {
      // 1. Total Signatures Count
      try {
        const repo = getSignatureRepository();
        const list = await repo.list();
        if (isMounted) {
          setTotalSignatures(list.length);
        }
      } catch {
        // keep fallback 0
      }

      // 2. Personal Templates (Default to Available Templates count or user customized)
      if (isMounted) {
        setPersonalTemplatesCount(AVAILABLE_TEMPLATES.length);
      }

      // 3. Teams Count
      try {
        const teamData = await getTeam();
        if (isMounted && teamData) {
          // If user belongs to a team or has created one
          setTeamsCount(teamData.members ? teamData.members.length : 1);
        }
      } catch {
        // keep fallback 0
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
        className="text-[#1E293B] mb-2 sm:mb-2.5"
        style={{
          fontFamily: "var(--font-commissioner), Commissioner, sans-serif",
          fontWeight: 700,
          fontStyle: "normal",
          fontSize: "18px",
          lineHeight: "100%",
          letterSpacing: "0%",
        }}
      >
        Quick Overview
      </h2>

      {/* Overview Container Card */}
      <div className="w-full rounded-2xl border border-[#E2E8F0] bg-white px-4 py-3 sm:px-6 sm:py-3.5 shadow-xs">
        <div className="grid grid-cols-1 divide-y divide-[#E2E8F0] md:grid-cols-4 md:divide-y-0 md:divide-x md:divide-[#E2E8F0] items-center">
          
          {/* Item 1: Total Signatures */}
          <Link
            href="/signatures"
            className="flex items-center justify-between py-2.5 md:py-0 md:pr-4 group transition hover:opacity-90"
          >
            <div className="flex items-center gap-3">
              {/* Icon Container */}
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#EFF6FF] text-[#245FD4]">
                <svg
                  className="h-5 w-5"
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
                  className="text-[#64748B]"
                  style={{
                    fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                    fontWeight: 500,
                    fontStyle: "normal",
                    fontSize: "16px",
                    lineHeight: "100%",
                    letterSpacing: "0%",
                  }}
                >
                  Total Signatures
                </p>
                <p
                  className="mt-1 text-[#1E293B] font-bold text-[18px] leading-tight"
                  style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                >
                  {totalSignatures}
                </p>
              </div>
            </div>

            {/* Chevron Right */}
            <svg
              className="h-4 w-4 text-[#94A3B8] transition-transform group-hover:translate-x-0.5"
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
            className="flex items-center justify-between py-2.5 md:py-0 md:px-4 group transition hover:opacity-90"
          >
            <div className="flex items-center gap-3">
              {/* Icon Container */}
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#EFF6FF] text-[#245FD4]">
                <svg
                  className="h-5 w-5"
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
                  className="text-[#64748B]"
                  style={{
                    fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                    fontWeight: 500,
                    fontStyle: "normal",
                    fontSize: "16px",
                    lineHeight: "100%",
                    letterSpacing: "0%",
                  }}
                >
                  Personal Templates
                </p>
                <p
                  className="mt-1 text-[#1E293B] font-bold text-[18px] leading-tight"
                  style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                >
                  {personalTemplatesCount}
                </p>
              </div>
            </div>

            {/* Chevron Right */}
            <svg
              className="h-4 w-4 text-[#94A3B8] transition-transform group-hover:translate-x-0.5"
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
            className="flex items-center justify-between py-2.5 md:py-0 md:px-4 group transition hover:opacity-90"
          >
            <div className="flex items-center gap-3">
              {/* Icon Container */}
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#EFF6FF] text-[#245FD4]">
                <svg
                  className="h-5 w-5"
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
                  className="text-[#64748B]"
                  style={{
                    fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                    fontWeight: 500,
                    fontStyle: "normal",
                    fontSize: "16px",
                    lineHeight: "100%",
                    letterSpacing: "0%",
                  }}
                >
                  Teams
                </p>
                <p
                  className="mt-1 text-[#1E293B] font-bold text-[18px] leading-tight"
                  style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                >
                  {teamsCount}
                </p>
              </div>
            </div>

            {/* Chevron Right */}
            <svg
              className="h-4 w-4 text-[#94A3B8] transition-transform group-hover:translate-x-0.5"
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
          <div className="flex items-center justify-between py-2.5 md:py-0 md:pl-4">
            <div className="flex items-center gap-3">
              {/* Star / Sparkle Icon Container */}
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#EFF6FF] text-[#245FD4]">
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 2L14.2 9.8L22 12L14.2 14.2L12 22L9.8 14.2L2 12L9.8 9.8L12 2Z" />
                </svg>
              </div>

              {/* Need help text */}
              <div>
                <p className="text-[14px] font-bold text-[#1E293B] leading-tight" style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>
                  Need help?
                </p>
                <p className="mt-0.5 text-[11px] text-[#64748B] leading-tight" style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}>
                  Check out our guides or contact support.
                </p>
                <Link
                  href="/help"
                  className="mt-0.5 inline-flex items-center gap-0.5 text-[11px] font-semibold text-[#245FD4] hover:underline"
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
