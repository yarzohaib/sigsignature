import Link from "next/link";
import SectionBadge from "./SectionBadge";
import SignaturePreview from "@/components/auth/SignaturePreview";
import {
  Reveal,
  RevealGroup,
  RevealItem,
  ColumnReveal,
  CheckPop,
} from "@/components/motion";

export default function SolutionSection() {
  return (
    <section className="bg-[#FCFCFC] py-14 sm:py-16 lg:py-24 3xl:py-28">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-12 2xl:max-w-[1536px] 3xl:max-w-[1720px]">
        {/* Centered Section Badge at the top */}
        <div className="mb-10 sm:mb-14 lg:mb-16 flex justify-center">
          <Reveal y={16} blur={6}>
            <SectionBadge label="SOLUTION" />
          </Reveal>
        </div>

        {/* 2-Column Content (Equal 50/50 width) */}
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-16 2xl:gap-20">
          {/* Left Column: Signature Preview Card with floating badges (slides from right on desktop, rises on mobile) */}
          <ColumnReveal
            direction="right"
            className="flex w-full max-w-full items-center justify-center overflow-hidden"
          >
            <SignaturePreview floating className="!shadow-none" />
          </ColumnReveal>

          {/* Right Column: Left-aligned Heading & Checklist (slides from left on desktop, rises on mobile) */}
          <ColumnReveal
            direction="left"
            className="mx-auto flex w-full flex-col items-start text-left"
          >
            <h2 className="font-heading text-[clamp(1.625rem,1.1rem+2.3vw,3.125rem)] lg:text-[46px] xl:text-[50px] 2xl:text-[56px] 3xl:text-[62px] font-semibold tracking-tight text-slate-900 leading-tight lg:leading-[1.12] [text-wrap:balance]">
              There&apos;s a <span className="text-[#1243A3]">Better Way.</span>
            </h2>

            <p className="font-body mt-4 sm:mt-5 text-[15px] sm:text-base lg:text-base xl:text-lg 2xl:text-[20px] 3xl:text-[22px] leading-relaxed text-[#878787]">
              Sig Signature is a self-service email signature builder that lets
              anyone from freelancers to entire teams.
            </p>

            <RevealGroup stagger={0.1} as="ul" className="mt-6 space-y-3.5 sm:space-y-4">
              <RevealItem
                as="li"
                y={12}
                blur={4}
                duration={0.4}
                className="flex items-center gap-3 font-body text-[15px] sm:text-base lg:text-[18px] 3xl:text-[20px] font-normal text-slate-800"
              >
                <CheckPop className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#245FD4] text-white">
                  <svg
                    className="h-3 w-3 stroke-[3]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                </CheckPop>
                <span>Start with a template</span>
              </RevealItem>

              <RevealItem
                as="li"
                y={12}
                blur={4}
                duration={0.4}
                className="flex items-center gap-3 font-body text-[15px] sm:text-base lg:text-[18px] 3xl:text-[20px] font-normal text-slate-800"
              >
                <CheckPop className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#245FD4] text-white">
                  <svg
                    className="h-3 w-3 stroke-[3]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                </CheckPop>
                <span>Build from scratch</span>
              </RevealItem>

              <RevealItem
                as="li"
                y={12}
                blur={4}
                duration={0.4}
                className="flex items-center gap-3 font-body text-[15px] sm:text-base lg:text-[18px] 3xl:text-[20px] font-normal text-slate-800"
              >
                <CheckPop className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#245FD4] text-white">
                  <svg
                    className="h-3 w-3 stroke-[3]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                </CheckPop>
                <span>Create professional signature in minutes</span>
              </RevealItem>
            </RevealGroup>

            <div className="mt-8 flex w-full sm:w-auto">
              <Link
                href="/signup"
                className="group inline-flex min-h-[44px] w-full max-w-[360px] sm:max-w-none items-center justify-center gap-2.5 rounded-full bg-cta-gradient bg-gradient-to-r from-[#245FD4] to-[#022977] px-6 py-3 font-body text-sm font-semibold text-white shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 sm:w-auto [@media(hover:hover)]:hover:opacity-95 [@media(hover:hover)]:hover:shadow-md active:scale-95"
              >
                <span>Try the Editor</span>
                <svg
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          </ColumnReveal>
        </div>
      </div>
    </section>
  );
}
