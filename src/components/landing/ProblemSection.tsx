import Image from "next/image";
import SectionBadge from "./SectionBadge";
import { Reveal } from "@/components/motion";

const problems = [
  {
    title: "Expensive",
    description:
      "Hiring a developer costs $100 - $120 per signature. Need 10 for your team? That's $1,000+ just to look professional in your inbox.",
    icon: "/ExpensiveIcon.svg",
    iconAlt: "Expensive cost icon",
  },
  {
    title: "Slow",
    description:
      "Brief the developer. Wait days. Review. Request changes. Wait again. By the time it's done, you've missed the urgency.",
    icon: "/SlowIcon.svg",
    iconAlt: "Slow turnaround icon",
  },
  {
    title: "Inconsistent",
    description:
      "Send a template to your team and expect everyone to follow it the same way. In reality, everyone interprets it & leading to inconsistent results.",
    icon: "/InconsistentIcon.svg",
    iconAlt: "Inconsistent design icon",
  },
];

export default function ProblemSection() {
  return (
    <section className="bg-[#FCFCFC] py-14 sm:py-16 lg:py-24 3xl:py-28">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 xl:px-12 2xl:max-w-[1536px] 3xl:max-w-[1720px]">
        {/* Section Header */}
        <div className="text-center">
          <Reveal className="mb-3 sm:mb-4 inline-block">
            <SectionBadge label="PROBLEM" />
          </Reveal>
          <Reveal staggerIndex={1}>
            <h2 className="font-heading text-[clamp(1.625rem,1.1rem+2.3vw,3.375rem)] lg:text-[54px] 2xl:text-[60px] 3xl:text-[66px] font-semibold tracking-tight text-slate-900 leading-tight lg:leading-[1.15] [text-wrap:balance]">
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
                className="flex h-full flex-col rounded-[20px] border border-[#C1C1C1]/80 bg-white p-6 shadow-none transition-[transform,box-shadow,border-color] duration-200 ease-out focus-within:ring-2 focus-within:ring-brand [@media(hover:hover)]:hover:-translate-y-1 [@media(hover:hover)]:hover:border-blue-300 [@media(hover:hover)]:hover:shadow-[0_16px_32px_-8px_rgba(2,41,119,0.12)] sm:p-8"
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
                  <div className="flex-1">
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
