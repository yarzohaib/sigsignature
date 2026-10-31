import SectionBadge from "./SectionBadge";
import ComparisonTable from "./ComparisonTable";
import Reveal from "@/components/motion/Reveal";

const rows = [
  {
    criteria: "Cost",
    developer: "Depends on project scope and developer rates",
    sigSignature: "Free for up to 3 signatures",
  },
  {
    criteria: "Setup Time",
    developer: "Depends on design and development requirements",
    sigSignature: "Create a signature in minutes",
  },
  {
    criteria: "Customization",
    developer: "Custom-coded layouts and features",
    sigSignature: "Visual editor with templates and design tools",
  },
  {
    criteria: "Updates",
    developer: "May require HTML editing or developer support",
    sigSignature: "Edit saved signatures anytime",
  },
  {
    criteria: "Team Signatures",
    developer: "Requires a custom management solution",
    sigSignature: "Team management with Premium",
  },
  {
    criteria: "HTML Output",
    developer: "Depends on implementation and testing",
    sigSignature: "HTML and image export options",
  },
  {
    criteria: "Control",
    developer: "Depends on code ownership and access",
    sigSignature: "Manage signatures from your dashboard",
  },
];

export default function ComparisonSection() {
  return (
    <section className="bg-[#F8FAFD] py-8 sm:py-16 lg:bg-[#FCFCFC] lg:py-24 3xl:py-28">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-12 2xl:max-w-[1536px] 3xl:max-w-[1720px]">
        {/* Section Header */}
        <div className="mx-auto max-w-[1360px] text-center">
          <Reveal y={16} blur={6} className="mb-3 sm:mb-4 inline-block">
            <SectionBadge label="COMPARISON" />
          </Reveal>
          <Reveal y={24} blur={8} delay={0.1}>
            <h2 className="font-heading text-[clamp(1.8rem,1.125rem+2.25vw,2.7rem)] font-semibold leading-[1.08] tracking-tight text-slate-900 [text-wrap:balance] lg:text-[43px] lg:leading-[1.12] xl:text-[49px] 2xl:text-[56px] 3xl:text-[61px]">
              <span className="block">Create Professional Email Signatures</span>
              <span className="block text-[#1243A3]">Without Hiring a Developer</span>
            </h2>
          </Reveal>
          <p className="mx-auto mt-3 max-w-[330px] font-body text-[13px] leading-relaxed text-slate-600 sm:max-w-none sm:text-base lg:mt-4">
            Compare custom HTML email signature development with SigSignature’s online email signature generator. Choose the approach that best fits your design needs, budget, and workflow.
          </p>
        </div>

        {/* Comparison Table */}
        <ComparisonTable rows={rows} />

        <a
          href="/signup"
          className="mt-5 flex h-12 w-full items-center justify-center rounded-full bg-gradient-to-r from-[#315EEA] to-[#102D82] font-heading text-sm font-semibold text-white shadow-[0_8px_18px_rgba(36,95,212,0.22)] md:hidden"
        >
          Start Free
        </a>
      </div>
    </section>
  );
}

