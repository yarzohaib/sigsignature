import SectionBadge from "./SectionBadge";
import { Reveal } from "@/components/motion";
import HowItWorksTimeline, { StepItem } from "./HowItWorksTimeline";

const steps: StepItem[] = [
  {
    step: "1",
    title: "Sign Up Free",
    description: "Create your account in seconds. No credit card required.",
  },
  {
    step: "2",
    title: "Design Your Signature",
    description:
      "Pick a template to move fast, or build completely from scratch. Customize colors, fonts, and icons, and watch it update in real time.",
  },
  {
    step: "3",
    title: "Export & Use It Anywhere",
    description:
      "Copy the signature or download the image. Paste it into Gmail, Outlook, or any email client done.",
  },
];

export default function HowItWorksSection() {
  return (
    <HowItWorksTimeline steps={steps}>
      {/* Section Header */}
      <div className="text-center">
        <Reveal y={16} blur={6} className="mb-3 sm:mb-4 inline-block">
          <SectionBadge label="HOW IT WORKS" />
        </Reveal>
        <Reveal y={24} blur={8} delay={0.1}>
          <h2 className="font-heading text-[clamp(1.625rem,1.1rem+2.3vw,3.375rem)] lg:text-[54px] 3xl:text-[60px] font-semibold tracking-tight text-slate-900 leading-tight lg:leading-[1.15] [text-wrap:balance]">
            From Zero to Signature in
            <br />
            <span className="text-[#1243A3]">3 Steps.</span>
          </h2>
        </Reveal>
      </div>
    </HowItWorksTimeline>
  );
}
