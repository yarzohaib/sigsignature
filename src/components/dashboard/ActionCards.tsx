"use client";

import Link from "next/link";
import Image from "next/image";

export default function ActionCards() {
  return (
    <section className="grid grid-cols-1 gap-4 lg:gap-5 2xl:gap-6 3xl:gap-8 4xl:gap-10 lg:grid-cols-2 shrink-0" aria-label="Signature Creation Options">
      {/* Card 1: Start From a Template */}
      <div className="flex flex-col justify-between rounded-2xl 3xl:rounded-3xl border border-[#E2E8F0] bg-white p-4.5 sm:p-5.5 xl:p-6 2xl:p-7 3xl:p-[clamp(28px,1.8vw,48px)] shadow-xs transition hover:shadow-md">
        <div>
          {/* Top Illustration: Frame.svg with dynamic aspect ratio scaling */}
          <div className="flex w-full items-center justify-center overflow-hidden rounded-xl 3xl:rounded-2xl bg-[#F8FAFC] h-[130px] sm:h-[145px] xl:h-[160px] 2xl:h-[175px] 3xl:h-auto 3xl:aspect-[16/7] 3xl:min-h-[260px] p-2 sm:p-3 xl:p-4 3xl:p-6">
            <Image
              src="/Frame.svg"
              alt="Templates preview"
              width={463}
              height={195}
              className="h-full w-auto max-h-[130px] sm:max-h-[145px] xl:max-h-[160px] 2xl:max-h-[175px] 3xl:max-h-full object-contain"
              priority
            />
          </div>

          {/* Heading with responsive icon */}
          <div className="mt-3.5 sm:mt-4 2xl:mt-5 3xl:mt-[clamp(20px,1.2vw,36px)] flex items-start gap-3.5 2xl:gap-4 3xl:gap-[clamp(16px,1vw,28px)]">
            {/* Responsive rounded icon container */}
            <div className="flex shrink-0 items-center justify-center bg-[#EFF6FF] text-[#245FD4] w-12 h-12 3xl:w-[clamp(56px,2.8vw,96px)] 3xl:h-[clamp(56px,2.8vw,96px)] rounded-xl 3xl:rounded-2xl">
              <svg className="h-6 w-6 3xl:h-[clamp(28px,1.4vw,48px)] 3xl:w-[clamp(28px,1.4vw,48px)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="14" width="7" height="7" rx="1.5" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" />
              </svg>
            </div>
            <div>
              <h3
                className="text-[#1E293B] font-bold text-[20px] leading-[26.67px] 3xl:text-[clamp(22px,1.2vw,36px)] 3xl:leading-[1.3]"
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
                className="mt-1 text-[14px] leading-[20px] 3xl:text-[clamp(15px,0.8vw,22px)] 3xl:leading-[1.5] text-[#64748B] pb-1 sm:pb-2 3xl:pb-3"
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
        <div className="mt-4 sm:mt-5 2xl:mt-6 3xl:mt-[clamp(24px,1.5vw,44px)]">
          <Link
            href="/templates"
            className="flex h-[44px] sm:h-[46px] 2xl:h-[48px] 3xl:h-[clamp(52px,2.8vw,80px)] w-full items-center justify-center gap-2 rounded-full border border-transparent bg-cta-gradient bg-gradient-to-r from-[#245FD4] to-[#022977] px-6 text-center text-white shadow-xs transition hover:opacity-95 font-medium text-[16px] leading-[21.33px] 3xl:text-[clamp(17px,0.95vw,26px)] 3xl:leading-[1.3]"
            style={{
              fontFamily: "var(--font-commissioner), Commissioner, sans-serif",
              letterSpacing: "0%",
            }}
          >
            <span>Browse Templates</span>
            <svg className="h-4 w-4 3xl:h-[clamp(18px,1vw,28px)] 3xl:w-[clamp(18px,1vw,28px)] transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Card 2: Create from Scratch */}
      <div className="flex flex-col justify-between rounded-2xl 3xl:rounded-3xl border border-[#E2E8F0] bg-white p-4.5 sm:p-5.5 xl:p-6 2xl:p-7 3xl:p-[clamp(28px,1.8vw,48px)] shadow-xs transition hover:shadow-md">
        <div>
          {/* Top Illustration: signature.svg with dynamic aspect ratio scaling */}
          <div className="flex w-full items-center justify-center overflow-hidden rounded-xl 3xl:rounded-2xl bg-[#F8FAFC] h-[130px] sm:h-[145px] xl:h-[160px] 2xl:h-[175px] 3xl:h-auto 3xl:aspect-[16/7] 3xl:min-h-[260px] p-2 sm:p-3 xl:p-4 3xl:p-6">
            <Image
              src="/signature.svg"
              alt="Designing signature editor preview"
              width={463}
              height={180}
              className="h-full w-auto max-h-[130px] sm:max-h-[145px] xl:max-h-[160px] 2xl:max-h-[175px] 3xl:max-h-full object-contain"
              priority
            />
          </div>

          {/* Heading with responsive icon */}
          <div className="mt-3.5 sm:mt-4 2xl:mt-5 3xl:mt-[clamp(20px,1.2vw,36px)] flex items-start gap-3.5 2xl:gap-4 3xl:gap-[clamp(16px,1vw,28px)]">
            {/* Responsive rounded icon container */}
            <div className="flex shrink-0 items-center justify-center bg-[#EFF6FF] text-[#245FD4] w-12 h-12 3xl:w-[clamp(56px,2.8vw,96px)] 3xl:h-[clamp(56px,2.8vw,96px)] rounded-xl 3xl:rounded-2xl">
              <svg className="h-6 w-6 3xl:h-[clamp(28px,1.4vw,48px)] 3xl:w-[clamp(28px,1.4vw,48px)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            </div>
            <div>
              <h3
                className="text-[#1E293B] font-bold text-[20px] leading-[26.67px] 3xl:text-[clamp(22px,1.2vw,36px)] 3xl:leading-[1.3]"
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
                className="mt-1 text-[14px] leading-[20px] 3xl:text-[clamp(15px,0.8vw,22px)] 3xl:leading-[1.5] text-[#64748B] pb-1 sm:pb-2 3xl:pb-3"
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
        <div className="mt-4 sm:mt-5 2xl:mt-6 3xl:mt-[clamp(24px,1.5vw,44px)]">
          <Link
            href="/design-studio"
            className="flex h-[44px] sm:h-[46px] 2xl:h-[48px] 3xl:h-[clamp(52px,2.8vw,80px)] w-full items-center justify-center gap-2 rounded-full border border-[#022977] bg-white px-6 text-center text-[#022977] shadow-xs transition hover:bg-blue-50/50 font-medium text-[16px] leading-[21.33px] 3xl:text-[clamp(17px,0.95vw,26px)] 3xl:leading-[1.3]"
            style={{
              fontFamily: "var(--font-commissioner), Commissioner, sans-serif",
              letterSpacing: "0%",
            }}
          >
            <span>Start From Scratch</span>
            <svg className="h-4 w-4 3xl:h-[clamp(18px,1vw,28px)] 3xl:w-[clamp(18px,1vw,28px)] transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
