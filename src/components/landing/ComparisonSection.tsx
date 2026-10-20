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
    <section className="bg-[#FCFCFC] py-16 sm:py-24">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Section Header */}
        <div className="text-center">
          <Reveal y={16} blur={6} className="mb-4 inline-block">
            <SectionBadge label="COMPARISON" />
          </Reveal>
          <Reveal y={24} blur={8} delay={0.1}>
            <h2 className="font-heading text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl lg:text-[54px] lg:leading-[1.12]">
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

