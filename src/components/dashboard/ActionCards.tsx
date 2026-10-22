"use client";

import Link from "next/link";
import Image from "next/image";

export default function ActionCards() {
  return (
    <section
      className="grid grid-cols-1 gap-4 lg:gap-5 xl:gap-6 2xl:gap-8 3xl:gap-10 lg:grid-cols-2 shrink-0"
      aria-label="Signature Creation Options"
    >
      {/* Card 1: Start From a Template */}
      <div className="flex flex-col justify-between rounded-2xl 2xl:rounded-3xl border border-[#E2E8F0] bg-white p-4.5 sm:p-5.5 xl:p-6 2xl:p-8 3xl:p-10 shadow-xs transition hover:shadow-md">
        <div>
          {/* Top Illustration: Frame.svg */}
          <div className="flex w-full items-center justify-center overflow-hidden rounded-xl 2xl:rounded-2xl bg-[#F8FAFC] h-[135px] sm:h-[150px] lg:h-[175px] xl:h-[220px] 2xl:h-[280px] 3xl:h-[350px] transition-all">
            <Image
              src="/Frame.svg"
              alt="Templates preview"
              width={463}
              height={195}
              className="h-full w-auto max-h-full max-w-full object-contain p-2 sm:p-3 xl:p-4 2xl:p-6 select-none"
              priority
            />
          </div>

          {/* Heading with scalable icon */}
          <div className="mt-3.5 sm:mt-4 xl:mt-5 2xl:mt-6 3xl:mt-7 flex items-start gap-3.5 xl:gap-4 2xl:gap-5 3xl:gap-6">
            <div className="flex shrink-0 items-center justify-center bg-[#EFF6FF] text-[#245FD4] w-12 h-12 xl:w-14 xl:h-14 2xl:w-16 2xl:h-16 3xl:w-20 3xl:h-20 rounded-xl 2xl:rounded-2xl">
              <svg
                className="h-6 w-6 xl:h-7 xl:w-7 2xl:h-8 2xl:w-8 3xl:h-10 3xl:w-10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="14" width="7" height="7" rx="1.5" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-montserrat font-bold text-lg sm:text-xl xl:text-2xl 2xl:text-3xl 3xl:text-4xl text-[#1E293B] leading-snug">
                Start From a Template
              </h3>
              <p className="font-commissioner font-normal mt-1 sm:mt-1.5 2xl:mt-2 text-xs sm:text-[14px] xl:text-base 2xl:text-lg 3xl:text-xl leading-relaxed text-[#64748B] pb-1 sm:pb-2 max-w-2xl">
                Browse our library of professionally designed templates. Customize one in minutes.
              </p>
            </div>
          </div>
        </div>

        {/* Browse Templates Button with landing page gradient */}
        <div className="mt-4 sm:mt-5 xl:mt-6 2xl:mt-7 3xl:mt-8">
          <Link
            href="/templates"
            className="group flex h-11 sm:h-12 xl:h-13 2xl:h-15 3xl:h-17 w-full items-center justify-center gap-2 2xl:gap-3 rounded-full border border-transparent bg-cta-gradient bg-gradient-to-r from-[#245FD4] to-[#022977] px-6 xl:px-8 text-center text-white shadow-xs transition hover:opacity-95 font-commissioner font-medium text-sm sm:text-base xl:text-lg 2xl:text-xl 3xl:text-2xl"
          >
            <span>Browse Templates</span>
            <svg
              className="h-4 w-4 xl:h-5 xl:w-5 2xl:h-6 2xl:w-6 transition-transform group-hover:translate-x-1"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Card 2: Create from Scratch */}
      <div className="flex flex-col justify-between rounded-2xl 2xl:rounded-3xl border border-[#E2E8F0] bg-white p-4.5 sm:p-5.5 xl:p-6 2xl:p-8 3xl:p-10 shadow-xs transition hover:shadow-md">
        <div>
          {/* Top Illustration: signature.svg */}
          <div className="flex w-full items-center justify-center overflow-hidden rounded-xl 2xl:rounded-2xl bg-[#F8FAFC] h-[135px] sm:h-[150px] lg:h-[175px] xl:h-[220px] 2xl:h-[280px] 3xl:h-[350px] transition-all">
            <Image
              src="/signature.svg"
              alt="Designing signature editor preview"
              width={463}
              height={180}
              className="h-full w-auto max-h-full max-w-full object-contain p-2 sm:p-3 xl:p-4 2xl:p-6 select-none"
              priority
            />
          </div>

          {/* Heading with scalable icon */}
          <div className="mt-3.5 sm:mt-4 xl:mt-5 2xl:mt-6 3xl:mt-7 flex items-start gap-3.5 xl:gap-4 2xl:gap-5 3xl:gap-6">
            <div className="flex shrink-0 items-center justify-center bg-[#EFF6FF] text-[#245FD4] w-12 h-12 xl:w-14 xl:h-14 2xl:w-16 2xl:h-16 3xl:w-20 3xl:h-20 rounded-xl 2xl:rounded-2xl">
              <svg
                className="h-6 w-6 xl:h-7 xl:w-7 2xl:h-8 2xl:w-8 3xl:h-10 3xl:w-10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-montserrat font-bold text-lg sm:text-xl xl:text-2xl 2xl:text-3xl 3xl:text-4xl text-[#1E293B] leading-snug">
                Create from Scratch
              </h3>
              <p className="font-commissioner font-normal mt-1 sm:mt-1.5 2xl:mt-2 text-xs sm:text-[14px] xl:text-base 2xl:text-lg 3xl:text-xl leading-relaxed text-[#64748B] pb-1 sm:pb-2 max-w-2xl">
                No template? No problem. Create a professional email signature with our easy-to-use builder.
              </p>
            </div>
          </div>
        </div>

        {/* Start From Scratch Button with text color #022977 */}
        <div className="mt-4 sm:mt-5 xl:mt-6 2xl:mt-7 3xl:mt-8">
          <Link
            href="/design-studio"
            className="group flex h-11 sm:h-12 xl:h-13 2xl:h-15 3xl:h-17 w-full items-center justify-center gap-2 2xl:gap-3 rounded-full border border-[#022977] bg-white px-6 xl:px-8 text-center text-[#022977] shadow-xs transition hover:bg-blue-50/50 font-commissioner font-medium text-sm sm:text-base xl:text-lg 2xl:text-xl 3xl:text-2xl"
          >
            <span>Start From Scratch</span>
            <svg
              className="h-4 w-4 xl:h-5 xl:w-5 2xl:h-6 2xl:w-6 transition-transform group-hover:translate-x-1"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}