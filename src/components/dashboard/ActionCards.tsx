"use client";

import Link from "next/link";
import Image from "next/image";

export default function ActionCards() {
  return (
    <section className="grid grid-cols-1 gap-3.5 sm:gap-4 lg:gap-4 xl:gap-5 2xl:gap-6 lg:grid-cols-2 flex-1 min-h-0 w-full" aria-label="Signature Creation Options">
      {/* Card 1: Start From a Template */}
      <div className="flex flex-1 min-h-0 flex-col justify-between rounded-2xl 2xl:rounded-3xl border border-[#E2E8F0] bg-white p-3.5 sm:p-4 lg:p-4 xl:p-5 2xl:p-6 shadow-xs transition hover:shadow-md">
        <div className="flex flex-1 min-h-0 flex-col">
          {/* Top Illustration: Frame.svg with flexible auto-adjusting height */}
          <div className="flex flex-1 min-h-[110px] w-full items-center justify-center overflow-hidden rounded-xl 2xl:rounded-2xl bg-[#F8FAFC] p-2">
            <Image
              src="/Frame.svg"
              alt="Templates preview"
              width={463}
              height={195}
              className="h-full w-full max-h-full max-w-full object-contain select-none"
              priority
            />
          </div>

          {/* Heading with responsive icon */}
          <div className="mt-2.5 sm:mt-3 xl:mt-3.5 flex items-start gap-3 xl:gap-3.5 shrink-0">
            {/* Responsive rounded icon container */}
            <div className="flex shrink-0 items-center justify-center bg-[#EFF6FF] text-[#245FD4] w-10 h-10 xl:w-11 xl:h-11 2xl:w-12 2xl:h-12 rounded-xl">
              <svg className="h-5 w-5 xl:h-6 xl:w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="14" width="7" height="7" rx="1.5" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" />
              </svg>
            </div>
            <div className="min-w-0">
              <h3
                className="text-[#1E293B] font-bold text-[17px] xl:text-[19px] 2xl:text-[20px] 3xl:text-[22px] leading-tight"
                style={{
                  fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                  letterSpacing: "0%",
                  verticalAlign: "middle",
                }}
              >
                Start From a Template
              </h3>
              {/* Space after description */}
              <p
                className="mt-0.5 xl:mt-1 text-[13px] xl:text-[14px] 2xl:text-[15px] leading-snug text-[#64748B]"
                style={{
                  fontFamily: "var(--font-commissioner), Commissioner, sans-serif",
                  fontWeight: 400,
                }}
              >
                Browse our library of professionally designed templates. Customize one in minutes.
              </p>
            </div>
          </div>
        </div>

        {/* Browse Templates Button with landing page gradient */}
        <div className="mt-2.5 sm:mt-3 xl:mt-3.5 shrink-0">
          <Link
            href="/templates"
            className="flex h-10 xl:h-11 2xl:h-12 w-full items-center justify-center gap-2 rounded-full border border-transparent bg-cta-gradient bg-gradient-to-r from-[#245FD4] to-[#022977] px-5 text-center text-white shadow-xs transition hover:opacity-95 font-medium text-[14px] xl:text-[15px] 2xl:text-[16px] leading-tight"
            style={{
              fontFamily: "var(--font-commissioner), Commissioner, sans-serif",
              letterSpacing: "0%",
            }}
          >
            <span>Browse Templates</span>
            <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Card 2: Create from Scratch */}
      <div className="flex flex-1 min-h-0 flex-col justify-between rounded-2xl 2xl:rounded-3xl border border-[#E2E8F0] bg-white p-3.5 sm:p-4 lg:p-4 xl:p-5 2xl:p-6 shadow-xs transition hover:shadow-md">
        <div className="flex flex-1 min-h-0 flex-col">
          {/* Top Illustration: signature.svg with flexible auto-adjusting height */}
          <div className="flex flex-1 min-h-[110px] w-full items-center justify-center overflow-hidden rounded-xl 2xl:rounded-2xl bg-[#F8FAFC] p-2">
            <Image
              src="/signature.svg"
              alt="Designing signature editor preview"
              width={463}
              height={180}
              className="h-full w-full max-h-full max-w-full object-contain select-none"
              priority
            />
          </div>

          {/* Heading with responsive icon */}
          <div className="mt-2.5 sm:mt-3 xl:mt-3.5 flex items-start gap-3 xl:gap-3.5 shrink-0">
            {/* Responsive rounded icon container */}
            <div className="flex shrink-0 items-center justify-center bg-[#EFF6FF] text-[#245FD4] w-10 h-10 xl:w-11 xl:h-11 2xl:w-12 2xl:h-12 rounded-xl">
              <svg className="h-5 w-5 xl:h-6 xl:w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            </div>
            <div className="min-w-0">
              <h3
                className="text-[#1E293B] font-bold text-[17px] xl:text-[19px] 2xl:text-[20px] 3xl:text-[22px] leading-tight"
                style={{
                  fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                  letterSpacing: "0%",
                  verticalAlign: "middle",
                }}
              >
                Create from Scratch
              </h3>
              {/* Space after description */}
              <p
                className="mt-0.5 xl:mt-1 text-[13px] xl:text-[14px] 2xl:text-[15px] leading-snug text-[#64748B]"
                style={{
                  fontFamily: "var(--font-commissioner), Commissioner, sans-serif",
                  fontWeight: 400,
                }}
              >
                No template? No problem. Create a professional email signature with our easy-to-use builder.
              </p>
            </div>
          </div>
        </div>

        {/* Start From Scratch Button with text color #022977 */}
        <div className="mt-2.5 sm:mt-3 xl:mt-3.5 shrink-0">
          <Link
            href="/design-studio"
            className="flex h-10 xl:h-11 2xl:h-12 w-full items-center justify-center gap-2 rounded-full border border-[#022977] bg-white px-5 text-center text-[#022977] shadow-xs transition hover:bg-blue-50/50 font-medium text-[14px] xl:text-[15px] 2xl:text-[16px] leading-tight"
            style={{
              fontFamily: "var(--font-commissioner), Commissioner, sans-serif",
              letterSpacing: "0%",
            }}
          >
            <span>Start From Scratch</span>
            <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
