import Image from "next/image";
import SectionBadge from "./SectionBadge";
import { Reveal } from "@/components/motion";

const problems = [
  {
    title: "Variable costs",
    description:
      "Custom signature development costs depend on project scope and developer rates, which can make budgeting harder.",
    icon: "/ExpensiveIcon.svg",
    iconAlt: "Expensive cost icon",
  },
  {
    title: "Coordination",
    description:
      "A custom build may involve briefing, review, and revisions. Timing depends on the requirements and developer availability.",
    icon: "/SlowIcon.svg",
    iconAlt: "Slow turnaround icon",
  },
  {
    title: "Keeping a consistent look",
    description:
      "Keeping team signatures aligned can require shared templates and a clear process for making updates.",
    icon: "/InconsistentIcon.svg",
    iconAlt: "Inconsistent design icon",
  },
];

export default function ProblemSection() {
  return (
    <section className="bg-[#FCFCFC] py-14 sm:py-16 lg:py-24 3xl:py-28">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-12 2xl:max-w-[1536px] 3xl:max-w-[1720px]">
        {/* Section Header */}
        <div className="text-center">
          <Reveal className="mb-3 sm:mb-4 inline-block">
            <SectionBadge label="PROBLEM" />
          </Reveal>
          <Reveal staggerIndex={1}>
            <h2 className="font-heading text-[clamp(1.8rem,1.125rem+2.25vw,2.7rem)] lg:text-[43px] xl:text-[49px] 2xl:text-[56px] 3xl:text-[61px] font-semibold tracking-tight text-slate-900 leading-tight lg:leading-[1.15] [text-wrap:balance]">
              Email Signatures Are Quietly
              <br />
              <span className="text-[#1243A3]">Broken</span>
            </h2>
          </Reveal>
        </div>

        {/* 3 Problem Cards */}
        <div className="mt-10 grid grid-cols-1 gap-6 sm:mt-14 lg:grid-cols-3 lg:gap-8">
          {problems.map((problem, idx) => (
            <Reveal key={problem.title} staggerIndex={idx} className="h-full max-w-[600px] mx-auto lg:max-w-none w-full">
              <div
                className="flex h-full flex-col rounded-[20px] border border-[#C1C1C1]/80 bg-white p-6 shadow-none transition-[box-shadow,border-color] duration-200 ease-out focus-within:ring-2 focus-within:ring-brand [@media(hover:hover)]:hover:border-blue-300 [@media(hover:hover)]:hover:shadow-[0_16px_32px_-8px_rgba(2,41,119,0.12)] sm:p-8"
              >
                <div className="flex h-full flex-col sm:flex-row sm:gap-5 sm:items-start">
                  {/* Blue icon container circle matching How It Works gradient */}
                  <div
                    style={{
                      background:
                        "linear-gradient(180deg, #245FD4 0%, #022977 100%)",
                    }}
                    className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-full border border-[#C1C1C1] shadow-xs mb-5 sm:mb-0 sm:mt-1"
                  >
                    <Image
                      src={problem.icon}
                      alt={problem.iconAlt}
                      width={28}
                      height={28}
                      className="h-6 w-6 sm:h-7 sm:w-7 object-contain"
                    />
                  </div>

                  {/* Title & Description */}
                  <div className="flex-1 sm:flex sm:flex-col sm:justify-center">
                    <h3 className="font-heading text-lg sm:text-xl 3xl:text-2xl font-semibold text-slate-900">
                      {problem.title}
                    </h3>
                    <p className="font-body mt-2.5 sm:mt-3 text-[15px] sm:text-base 3xl:text-[17px] leading-relaxed text-[#878787]">
                      {problem.description}
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
