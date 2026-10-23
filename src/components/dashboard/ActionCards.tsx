"use client";

import Link from "next/link";
import Image from "next/image";

export default function ActionCards() {
  return (
    <section className="grid grid-cols-1 gap-4 lg:gap-5 xl:gap-6 2xl:gap-6 3xl:gap-[clamp(24px,1.5vw,44px)] lg:grid-cols-2 w-full shrink-0" aria-label="Signature Creation Options">
      {/* Card 1: Start From a Template */}
      <div className="flex flex-col justify-between rounded-2xl 2xl:rounded-3xl 3xl:rounded-[2rem] border border-[#E2E8F0] bg-white p-5 sm:p-6 lg:p-5 xl:p-6 2xl:p-6 3xl:p-[clamp(24px,1.5vw,44px)] shadow-xs transition hover:shadow-md">
        <div className="flex flex-col">
          {/* Top Illustration: Frame.svg with comfortable natural height */}
          <div className="flex w-full items-center justify-center overflow-hidden rounded-xl 2xl:rounded-2xl 3xl:rounded-3xl bg-[#F8FAFC] h-[135px] sm:h-[155px] lg:h-[145px] xl:h-[165px] 2xl:h-[180px] p-2 3xl:p-4">
            <Image
              src="/Frame.svg"
              alt="Templates preview"
              width={463}
              height={195}
              className="h-full w-auto lg:w-full max-h-full max-w-full object-contain select-none"
              priority
            />
          </div>

          {/* Heading with responsive icon */}
          <div className="mt-4 lg:mt-4 xl:mt-5 3xl:mt-[clamp(14px,0.9vw,28px)] flex items-start gap-3.5 xl:gap-3.5 3xl:gap-[clamp(14px,0.9vw,24px)] shrink-0">
            {/* Responsive rounded icon container */}
            <div className="flex shrink-0 items-center justify-center bg-[#EFF6FF] text-[#245FD4] w-12 h-12 lg:w-11 lg:h-11 xl:w-12 xl:h-12 2xl:w-12 2xl:h-12 3xl:w-[clamp(48px,2.8vw,80px)] 3xl:h-[clamp(48px,2.8vw,80px)] rounded-xl 3xl:rounded-2xl">
              <svg className="h-6 w-6 lg:h-5.5 lg:w-5.5 xl:h-6 xl:w-6 3xl:h-[clamp(24px,1.4vw,40px)] 3xl:w-[clamp(24px,1.4vw,40px)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="14" width="7" height="7" rx="1.5" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" />
              </svg>
            </div>
            <div className="min-w-0">
              <h3
                className="text-[#1E293B] font-bold text-[18px] sm:text-[20px] lg:text-[18px] xl:text-[20px] 2xl:text-[20px] 3xl:text-[clamp(22px,1.3vw,38px)] leading-tight"
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
                className="mt-1.5 text-[14px] lg:text-[13.5px] xl:text-[14.5px] 2xl:text-[15px] 3xl:text-[clamp(15px,0.9vw,26px)] leading-snug text-[#64748B]"
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
        <div className="mt-5 lg:mt-5 xl:mt-6 shrink-0">
          <Link
            href="/templates"
            className="flex h-[44px] sm:h-[46px] lg:h-[44px] xl:h-[46px] 2xl:h-12 3xl:h-[clamp(48px,2.8vw,80px)] w-full items-center justify-center gap-2 3xl:gap-3 rounded-full bg-cta-gradient bg-gradient-to-r from-[#245FD4] to-[#022977] px-6 lg:px-5 3xl:px-8 text-center text-white shadow-xs transition hover:opacity-95 font-medium text-[15px] sm:text-[16px] lg:text-[14.5px] xl:text-[15.5px] 2xl:text-[16px] 3xl:text-[clamp(16px,0.95vw,26px)] leading-tight"
            style={{
              fontFamily: "var(--font-commissioner), Commissioner, sans-serif",
              letterSpacing: "0%",
            }}
          >
            <span>Browse Templates</span>
            <svg className="h-4 w-4 3xl:h-[clamp(16px,1vw,26px)] 3xl:w-[clamp(16px,1vw,26px)] transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Card 2: Create from Scratch */}
      <div className="flex flex-col justify-between rounded-2xl 2xl:rounded-3xl 3xl:rounded-[2rem] border border-[#E2E8F0] bg-white p-5 sm:p-6 lg:p-5 xl:p-6 2xl:p-6 3xl:p-[clamp(24px,1.5vw,44px)] shadow-xs transition hover:shadow-md">
        <div className="flex flex-col">
          {/* Top Illustration: signature.svg with comfortable natural height */}
          <div className="flex w-full items-center justify-center overflow-hidden rounded-xl 2xl:rounded-2xl 3xl:rounded-3xl bg-[#F8FAFC] h-[135px] sm:h-[155px] lg:h-[145px] xl:h-[165px] 2xl:h-[180px] p-2 3xl:p-4">
            <Image
              src="/signature.svg"
              alt="Create from scratch preview"
              width={463}
              height={195}
              className="h-full w-auto lg:w-full max-h-full max-w-full object-contain select-none"
              priority
            />
          </div>

          {/* Heading with responsive icon */}
          <div className="mt-4 lg:mt-4 xl:mt-5 3xl:mt-[clamp(14px,0.9vw,28px)] flex items-start gap-3.5 xl:gap-3.5 3xl:gap-[clamp(14px,0.9vw,24px)] shrink-0">
            {/* Responsive rounded icon container */}
            <div className="flex shrink-0 items-center justify-center bg-[#EFF6FF] text-[#245FD4] w-12 h-12 lg:w-11 lg:h-11 xl:w-12 xl:h-12 2xl:w-12 2xl:h-12 3xl:w-[clamp(48px,2.8vw,80px)] 3xl:h-[clamp(48px,2.8vw,80px)] rounded-xl 3xl:rounded-2xl">
              <svg className="h-6 w-6 lg:h-5.5 lg:w-5.5 xl:h-6 xl:w-6 3xl:h-[clamp(24px,1.4vw,40px)] 3xl:w-[clamp(24px,1.4vw,40px)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            </div>
            <div className="min-w-0">
              <h3
                className="text-[#1E293B] font-bold text-[18px] sm:text-[20px] lg:text-[18px] xl:text-[20px] 2xl:text-[20px] 3xl:text-[clamp(22px,1.3vw,38px)] leading-tight"
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
                className="mt-1.5 text-[14px] lg:text-[13.5px] xl:text-[14.5px] 2xl:text-[15px] 3xl:text-[clamp(15px,0.9vw,26px)] leading-snug text-[#64748B]"
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
        <div className="mt-5 lg:mt-5 xl:mt-6 shrink-0">
          <Link
            href="/design-studio"
            className="flex h-[44px] sm:h-[46px] lg:h-[44px] xl:h-[46px] 2xl:h-12 3xl:h-[clamp(48px,2.8vw,80px)] w-full items-center justify-center gap-2 3xl:gap-3 rounded-full border border-[#022977] bg-white px-6 lg:px-5 3xl:px-8 text-center text-[#022977] shadow-xs transition hover:bg-blue-50/50 font-medium text-[15px] sm:text-[16px] lg:text-[14.5px] xl:text-[15.5px] 2xl:text-[16px] 3xl:text-[clamp(16px,0.95vw,26px)] leading-tight"
            style={{
              fontFamily: "var(--font-commissioner), Commissioner, sans-serif",
              letterSpacing: "0%",
            }}
          >
            <span>Start From Scratch</span>
            <svg className="h-4 w-4 3xl:h-[clamp(16px,1vw,26px)] 3xl:w-[clamp(16px,1vw,26px)] transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
