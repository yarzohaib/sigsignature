import Image from "next/image";
import SectionBadge from "./SectionBadge";
import { Reveal, RevealGroup, RevealItem, WordReveal } from "@/components/motion";

const problems = [
  {
    title: "Expensive",
    description:
      "Hiring a developer costs $100 - $150 per signature. Need 10 for your team? That's $1,000+ just to look professional in your inbox.",
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
    <section className="bg-[#FCFCFC] py-16 sm:py-24">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Section Header */}
        <div className="text-center">
          <Reveal y={16} blur={6} className="mb-4 inline-block">
            <SectionBadge label="PROBLEM" />
          </Reveal>
          <Reveal y={24} blur={8} delay={0.1}>
            <h2 className="font-heading text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl lg:text-[54px] lg:leading-[1.15]">
              <WordReveal
                text="Email Signatures Are Quietly"
                as="span"
                duration={0.4}
                stagger={0.04}
              />
              <br />
              <span className="text-[#1243A3]">Broken</span>
            </h2>
          </Reveal>
        </div>

        {/* 3 Problem Cards */}
        <RevealGroup
          stagger={0.08}
          className="mt-12 grid grid-cols-1 gap-6 sm:mt-16 md:grid-cols-3 lg:gap-8"
        >
          {problems.map((problem) => (
            <RevealItem key={problem.title} className="h-full">
              <div
                className="flex h-full flex-col rounded-[20px] border border-[#C1C1C1]/80 bg-white p-7 shadow-none transition-[transform,box-shadow,border-color] duration-200 ease-out hover:-translate-y-1 hover:border-blue-300 hover:shadow-[0_16px_32px_-8px_rgba(2,41,119,0.12)] sm:p-8"
              >
                {/* Blue icon container circle matching How It Works gradient */}
                <div
                  style={{
                    background:
                      "linear-gradient(180deg, #245FD4 0%, #022977 100%)",
                  }}
                  className="flex h-14 w-14 items-center justify-center rounded-full border border-[#C1C1C1] shadow-xs"
                >
                  <Image
                    src={problem.icon}
                    alt={problem.iconAlt}
                    width={28}
                    height={28}
                    className="h-7 w-7 object-contain"
                  />
                </div>

                {/* Title & Description */}
                <h3 className="font-heading mt-6 text-xl font-semibold text-slate-900">
                  {problem.title}
                </h3>
                <p className="font-body mt-3 text-sm leading-relaxed text-[#878787] sm:text-base">
                  {problem.description}
                </p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
