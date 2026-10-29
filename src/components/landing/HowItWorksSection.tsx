import SectionBadge from "./SectionBadge";
import { Reveal } from "@/components/motion";
import HowItWorksTimeline, { StepItem } from "./HowItWorksTimeline";

const steps: StepItem[] = [
  {
    step: "1",
    title: "Create Your Free Account",
    description: "Sign up to access the editor and save your signatures in your dashboard.",
  },
  {
    step: "2",
    title: "Choose and Customize Your Design",
    description:
      "Select a template or start from scratch. Add your name, role, contact details, and relevant links, then adjust the layout and colors.",
  },
  {
    step: "3",
    title: "Export and Test Your Signature",
    description:
      "Export HTML or an image and add it using your email app’s signature settings. Send a test email to check the layout, images, and links.",
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
          <h2 className="font-heading text-[clamp(1.75rem,1.1rem+2vw,2.5rem)] lg:text-[38px] xl:text-[45px] 2xl:text-[52px] 3xl:text-[58px] font-semibold tracking-tight text-slate-900 leading-tight lg:leading-[1.15] [text-wrap:balance]">
            How to Create a{" "}
            <span className="text-[#1243A3]">Free Email Signature</span>
          </h2>
        </Reveal>
      </div>
    </HowItWorksTimeline>
  );
}
