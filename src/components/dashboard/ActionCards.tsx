"use client";

import Link from "next/link";
import Image from "next/image";

export default function ActionCards() {
  return (
    <section className="grid grid-cols-1 gap-4 lg:gap-5 2xl:gap-6 lg:grid-cols-2 shrink-0" aria-label="Signature Creation Options">
      {/* Card 1: Start From a Template */}
      <div className="flex flex-col justify-between rounded-2xl border border-[#E2E8F0] bg-white p-4.5 sm:p-5.5 xl:p-6 2xl:p-7 shadow-xs transition hover:shadow-md">
        <div>
          {/* Top Illustration: Frame.svg */}
          <div className="flex w-full items-center justify-center overflow-hidden rounded-xl bg-[#F8FAFC] h-[130px] sm:h-[145px] xl:h-[160px] 2xl:h-[175px]">
            <Image
              src="/Frame.svg"
              alt="Templates preview"
              width={463}
              height={195}
              className="h-full w-auto max-h-[130px] sm:max-h-[145px] xl:max-h-[160px] 2xl:max-h-[175px] object-contain"
              priority
            />
          </div>

          {/* Heading with 48x48 icon */}
          <div className="mt-3.5 sm:mt-4 2xl:mt-5 flex items-start gap-3.5 2xl:gap-4">
            {/* 48x48 rounded 12px icon as specified */}
            <div
              className="flex shrink-0 items-center justify-center bg-[#EFF6FF] text-[#245FD4]"
              style={{
                width: "48px",
                height: "48px",
                opacity: 1,
                borderRadius: "12px",
              }}
            >
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="14" width="7" height="7" rx="1.5" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" />
              </svg>
            </div>
            <div>
              <h3
                className="text-[#1E293B]"
                style={{
                  fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                  fontWeight: 700,
                  fontSize: "20px",
                  lineHeight: "26.67px",
                  letterSpacing: "0%",
                  verticalAlign: "middle",
                }}
              >
                Start From a Template
              </h3>
              {/* Space after description */}
              <p
                className="mt-1 text-[14px] leading-[20px] text-[#64748B] pb-1 sm:pb-2"
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
        <div className="mt-4 sm:mt-5 2xl:mt-6">
          <Link
            href="/templates"
            className="flex h-[44px] sm:h-[46px] 2xl:h-[48px] w-full items-center justify-center gap-2 rounded-full border border-transparent bg-cta-gradient bg-gradient-to-r from-[#245FD4] to-[#022977] px-6 text-center text-white shadow-xs transition hover:opacity-95"
            style={{
              fontFamily: "var(--font-commissioner), Commissioner, sans-serif",
              fontWeight: 500,
              fontSize: "16px",
              lineHeight: "21.33px",
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
      <div className="flex flex-col justify-between rounded-2xl border border-[#E2E8F0] bg-white p-4.5 sm:p-5.5 xl:p-6 2xl:p-7 shadow-xs transition hover:shadow-md">
        <div>
          {/* Top Illustration: signature.svg */}
          <div className="flex w-full items-center justify-center overflow-hidden rounded-xl bg-[#F8FAFC] h-[130px] sm:h-[145px] xl:h-[160px] 2xl:h-[175px]">
            <Image
              src="/signature.svg"
              alt="Designing signature editor preview"
              width={463}
              height={180}
              className="h-full w-auto max-h-[130px] sm:max-h-[145px] xl:max-h-[160px] 2xl:max-h-[175px] object-contain"
              priority
            />
          </div>

          {/* Heading with 48x48 icon */}
          <div className="mt-3.5 sm:mt-4 2xl:mt-5 flex items-start gap-3.5 2xl:gap-4">
            {/* 48x48 rounded 12px icon as specified */}
            <div
              className="flex shrink-0 items-center justify-center bg-[#EFF6FF] text-[#245FD4]"
              style={{
                width: "48px",
                height: "48px",
                opacity: 1,
                borderRadius: "12px",
              }}
            >
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            </div>
            <div>
              <h3
                className="text-[#1E293B]"
                style={{
                  fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                  fontWeight: 700,
                  fontSize: "20px",
                  lineHeight: "26.67px",
                  letterSpacing: "0%",
                  verticalAlign: "middle",
                }}
              >
                Create from Scratch
              </h3>
              {/* Space after description */}
              <p
                className="mt-1 text-[14px] leading-[20px] text-[#64748B] pb-1 sm:pb-2"
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
        <div className="mt-4 sm:mt-5 2xl:mt-6">
          <Link
            href="/design-studio"
            className="flex h-[44px] sm:h-[46px] 2xl:h-[48px] w-full items-center justify-center gap-2 rounded-full border border-[#022977] bg-white px-6 text-center text-[#022977] shadow-xs transition hover:bg-blue-50/50"
            style={{
              fontFamily: "var(--font-commissioner), Commissioner, sans-serif",
              fontWeight: 500,
              fontSize: "16px",
              lineHeight: "21.33px",
              letterSpacing: "0%",
              color: "#022977",
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
