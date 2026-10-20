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
    <section className="bg-[#FCFCFC] py-16 sm:py-24">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Centered Section Badge at the top */}
        <div className="mb-12 flex justify-center sm:mb-16">
          <Reveal y={16} blur={6}>
            <SectionBadge label="SOLUTION" />
          </Reveal>
        </div>

        {/* 2-Column Content (Equal 50/50 width) */}
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-16">
          {/* Left Column: Signature Preview Card with floating badges (slides from right on desktop, rises on mobile) */}
          <ColumnReveal
            direction="right"
            className="flex items-center justify-center"
          >
            <SignaturePreview floating />
          </ColumnReveal>

          {/* Right Column: Left-aligned Heading & Checklist (slides from left on desktop, rises on mobile) */}
          <ColumnReveal
            direction="left"
            className="flex flex-col items-start text-left"
          >
            <h2 className="font-heading text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl lg:text-[46px] xl:text-[50px] lg:leading-[1.12]">
              There&apos;s a <span className="text-[#1243A3]">Better Way.</span>
            </h2>

            <p className="font-body mt-5 text-base leading-relaxed text-[#878787] sm:text-lg">
              Sig Signature is a self-service email signature builder that lets
              anyone from freelancers to entire teams.
            </p>

            <RevealGroup stagger={0.1} as="ul" className="mt-6 space-y-4">
              <RevealItem
                as="li"
                y={12}
                blur={4}
                duration={0.4}
                className="flex items-center gap-3 font-body text-base font-normal text-slate-800 sm:text-[18px]"
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
                className="flex items-center gap-3 font-body text-base font-normal text-slate-800 sm:text-[18px]"
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
                className="flex items-center gap-3 font-body text-base font-normal text-slate-800 sm:text-[18px]"
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

            <div className="mt-8">
              <Link
                href="/signup"
                className="group inline-flex items-center gap-2.5 rounded-full bg-cta-gradient bg-gradient-to-r from-[#245FD4] to-[#022977] px-6 py-3 font-body text-sm font-semibold text-white shadow-sm transition hover:opacity-95 hover:shadow-md"
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
