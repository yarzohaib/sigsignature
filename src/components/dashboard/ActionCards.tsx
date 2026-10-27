"use client";

import Link from "next/link";
import Image from "next/image";

export default function ActionCards() {
  return (
    <section className="grid w-full grid-cols-1 gap-3.5 sm:gap-4 lg:grid-cols-2 lg:gap-4 xl:gap-5 2xl:gap-6 shrink-0" aria-label="Signature Creation Options">
      {/* Card 1: Start From a Template */}
      <div className="flex flex-col 2xl:flex-row items-stretch justify-between rounded-2xl 2xl:rounded-3xl border border-[#E2E8F0] bg-white p-3.5 sm:p-4 lg:p-4.5 xl:p-5 2xl:min-h-[275px] 2xl:p-7 3xl:min-h-[310px] 3xl:p-8 shadow-xs transition hover:shadow-md gap-3.5 sm:gap-4 xl:gap-4.5 2xl:gap-7">
        {/* Left / Top Illustration: Frame.svg */}
        <div className="flex h-[145px] sm:h-[165px] lg:h-[165px] xl:h-[185px] 2xl:h-auto 2xl:w-[290px] 3xl:w-[340px] 2xl:self-stretch shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#F8FAFC] p-2 2xl:p-3.5 3xl:p-4 2xl:rounded-2xl">
          <Image
            src="/Frame.svg"
            alt="Templates preview"
            width={463}
            height={195}
            className="h-full w-full max-h-full max-w-full object-contain select-none"
            priority
          />
        </div>

        {/* Right / Content Column */}
        <div className="flex flex-1 flex-col justify-between min-w-0 py-0.5 2xl:py-1">
          <div>
            {/* Title with icon visible on mobile/tablet/laptop/desktop and hidden only on 2xl+ extra large monitors */}
            <div className="flex items-start gap-3 2xl:block">
              {/* Responsive rounded icon container (visible on < 2xl screens) */}
              <div className="flex shrink-0 items-center justify-center bg-[#EFF6FF] text-[#245FD4] w-10 h-10 xl:w-11 xl:h-11 rounded-xl 2xl:hidden">
                <svg className="h-5 w-5 xl:h-6 xl:w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" rx="1.5" />
                  <rect x="14" y="3" width="7" height="7" rx="1.5" />
                  <rect x="14" y="14" width="7" height="7" rx="1.5" />
                  <rect x="3" y="14" width="7" height="7" rx="1.5" />
                </svg>
              </div>

              <div className="min-w-0">
                <h3
                  className="text-[#1E293B] font-bold text-[17px] xl:text-[18px] 2xl:text-[21px] 3xl:text-[22px] leading-tight"
                  style={{
                    fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                    letterSpacing: "0%",
                    verticalAlign: "middle",
                  }}
                >
                  Start From a Template
                </h3>
                <p
                  className="mt-1 xl:mt-1.5 2xl:mt-2 text-[13px] xl:text-[13.5px] 2xl:text-[15px] 3xl:text-[15.5px] leading-snug 2xl:leading-relaxed text-[#64748B]"
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
          <div className="mt-3.5 sm:mt-4 xl:mt-4 2xl:mt-5 shrink-0">
            <Link
              href="/templates"
              className="group flex h-10 xl:h-11 2xl:h-[48px] 3xl:h-[50px] w-full items-center justify-center gap-2 rounded-full border border-transparent bg-cta-gradient bg-gradient-to-r from-[#245FD4] to-[#022977] px-5 text-center text-white shadow-xs transition hover:opacity-95 font-medium text-[14px] xl:text-[15px] 2xl:text-[15.5px] leading-tight"
              style={{
                fontFamily: "var(--font-commissioner), Commissioner, sans-serif",
                letterSpacing: "0%",
              }}
            >
              <span>Browse Templates</span>
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Card 2: Create from Scratch */}
      <div className="flex flex-col 2xl:flex-row items-stretch justify-between rounded-2xl 2xl:rounded-3xl border border-[#E2E8F0] bg-white p-3.5 sm:p-4 lg:p-4.5 xl:p-5 2xl:min-h-[275px] 2xl:p-7 3xl:min-h-[310px] 3xl:p-8 shadow-xs transition hover:shadow-md gap-3.5 sm:gap-4 xl:gap-4.5 2xl:gap-7">
        {/* Left / Top Illustration: Dashboard-selection.png with unoptimized full Retina clarity */}
        <div className="flex h-[145px] sm:h-[165px] lg:h-[165px] xl:h-[185px] 2xl:h-auto 2xl:w-[290px] 3xl:w-[340px] 2xl:self-stretch shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#F8FAFC] p-2 2xl:p-3.5 3xl:p-4 2xl:rounded-2xl">
          <Image
            src="/Dashboard-selection.png"
            alt="Create from scratch Design Studio editor preview"
            width={490}
            height={180}
            className="h-full w-full max-h-full max-w-full object-contain select-none"
            priority
            unoptimized
          />
        </div>

        {/* Right / Content Column */}
        <div className="flex flex-1 flex-col justify-between min-w-0 py-0.5 2xl:py-1">
          <div>
            {/* Title with icon visible on mobile/tablet/laptop/desktop and hidden only on 2xl+ extra large monitors */}
            <div className="flex items-start gap-3 2xl:block">
              {/* Responsive rounded icon container (visible on < 2xl screens) */}
              <div className="flex shrink-0 items-center justify-center bg-[#EFF6FF] text-[#245FD4] w-10 h-10 xl:w-11 xl:h-11 rounded-xl 2xl:hidden">
                <svg className="h-5 w-5 xl:h-6 xl:w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
              </div>

              <div className="min-w-0">
                <h3
                  className="text-[#1E293B] font-bold text-[17px] xl:text-[18px] 2xl:text-[21px] 3xl:text-[22px] leading-tight"
                  style={{
                    fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                    letterSpacing: "0%",
                    verticalAlign: "middle",
                  }}
                >
                  Create from Scratch
                </h3>
                <p
                  className="mt-1 xl:mt-1.5 2xl:mt-2 text-[13px] xl:text-[13.5px] 2xl:text-[15px] 3xl:text-[15.5px] leading-snug 2xl:leading-relaxed text-[#64748B]"
                  style={{
                    fontFamily: "var(--font-commissioner), Commissioner, sans-serif",
                    fontWeight: 400,
                  }}
                >
                  Place text, images, buttons and social icons exactly where you want them in Design Studio.
                </p>
              </div>
            </div>
          </div>

          {/* Start From Scratch Button with text color #022977 */}
          <div className="mt-3.5 sm:mt-4 xl:mt-4 2xl:mt-5 shrink-0">
            <Link
              href="/design-studio"
              className="group flex h-10 xl:h-11 2xl:h-[48px] 3xl:h-[50px] w-full items-center justify-center gap-2 rounded-full border border-[#022977] bg-white px-5 text-center text-[#022977] shadow-xs transition hover:bg-blue-50/50 font-medium text-[14px] xl:text-[15px] 2xl:text-[15.5px] leading-tight"
              style={{
                fontFamily: "var(--font-commissioner), Commissioner, sans-serif",
                letterSpacing: "0%",
              }}
            >
              <span>Start From Scratch</span>
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
