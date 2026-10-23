import SectionBadge from "./SectionBadge";
import ComparisonTable from "./ComparisonTable";
import Reveal from "@/components/motion/Reveal";

const rows = [
  {
    criteria: "Cost",
    developer: "$100 – $120 per signature",
    sigSignature: "Free to start",
  },
  {
    criteria: "Time",
    developer: "Days to weeks",
    sigSignature: "Minutes",
  },
  {
    criteria: "Revisions",
    developer: "Back and forth",
    sigSignature: "Instant — edit anytime",
  },
  {
    criteria: "Team signatures",
    developer: "Expensive at scale",
    sigSignature: "Manage all in one place",
  },
  {
    criteria: "HTML quality",
    developer: "Varies by developer",
    sigSignature: "Clean, tested, production-ready",
  },
  {
    criteria: "Ownership",
    developer: "You depend on them",
    sigSignature: "You're in full control",
  },
];

export default function ComparisonSection() {
  return (
    <section className="bg-[#FCFCFC] py-14 sm:py-16 lg:py-24 3xl:py-28">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-12 2xl:max-w-[1536px] 3xl:max-w-[1720px]">
        {/* Section Header */}
        <div className="text-center">
          <Reveal y={16} blur={6} className="mb-3 sm:mb-4 inline-block">
            <SectionBadge label="COMPARISON" />
          </Reveal>
          <Reveal y={24} blur={8} delay={0.1}>
            <h2 className="font-heading text-[clamp(1.625rem,1.1rem+2.3vw,3.375rem)] lg:text-[54px] lg:leading-[1.12] 2xl:text-[60px] 3xl:text-[66px] font-semibold tracking-tight text-slate-900 leading-tight [text-wrap:balance]">
              Why Developers Vs{" "}
              <span className="text-[#1243A3]">Sig Signature</span>
            </h2>
          </Reveal>
        </div>

        {/* Comparison Table */}
        <ComparisonTable rows={rows} />
      </div>
    </section>
  );
}

