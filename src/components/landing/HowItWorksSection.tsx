import SectionBadge from "./SectionBadge";
import { Reveal } from "@/components/motion";
import HowItWorksTimeline, { StepItem } from "./HowItWorksTimeline";

const steps: StepItem[] = [
  {
    step: "1",
    title: "Create Your Free Account",
    description:
      "Sign up or log in to SigSignature to access the free email signature generator. Create up to three professional email signatures and manage them from your dashboard.",
  },
  {
    step: "2",
    title: "Choose and Customize Your Design",
    description:
      "Select a ready-made email signature template or start with a blank canvas. Personalize the layout to match your professional identity, style, or company branding.",
  },
  {
    step: "3",
    title: "Add Your Details and Preview",
    description:
      "Use the Design Studio to add your name, job title, contact details, company logo, and social media links. Adjust fonts and colors while checking your changes in the live preview.",
  },
  {
    step: "4",
    title: "Export and Use Your Signature",
    description:
      "Save your signature and export it as HTML or PNG for free. Add it to Gmail, Outlook, or Apple Mail, and send a test email to check its appearance.",
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
            <span className="block">How to Create a Free Email Signature</span>
            <span className="block text-[#1243A3]">in 4 Easy Steps</span>
          </h2>
        </Reveal>
      </div>
    </HowItWorksTimeline>
  );
}


// import SectionBadge from "./SectionBadge";
// import { Reveal } from "@/components/motion";
// import HowItWorksTimeline, { StepItem } from "./HowItWorksTimeline";

// const steps: StepItem[] = [
//   {
//     step: "1",
//     title: "Sign Up Free",
//     description: "Create your account in seconds. No credit card required.",
//   },
//   {
//     step: "2",
//     title: "Choose Your Starting Point",
//     description:
//       "Pick a template to move fast, or build completely from scratch in the design studio.",
//   },
//   {
//     step: "3",
//     title: "Customize and Preview",
//     description:
//       "Adjust colors, fonts, your photo and social icons, and watch it update in real time.",
//   },
//   {
//     step: "4",
//     title: "Copy and Use It Anywhere",
//     description:
//       "Copy the signature or download the HTML file. Paste it into Gmail, Outlook or any email client. Done.",
//   },
// ];

// export default function HowItWorksSection() {
//   return (
//     <HowItWorksTimeline steps={steps}>
//       {/* Section Header */}
//       <div className="text-center">
//         <Reveal y={16} blur={6} className="mb-3 inline-block">
//           <SectionBadge label="HOW IT WORKS" />
//         </Reveal>
//         <Reveal y={24} blur={8} delay={0.1}>
//           <h2 className="font-heading text-[clamp(1.5rem,1.05rem+2vw,2.75rem)] font-semibold leading-tight tracking-tight text-slate-900 lg:text-[44px] lg:leading-[1.15] xl:text-[48px] [text-wrap:balance]">
//             From Zero to Signature in{" "}
//             <span className="text-[#1243A3]">4 Steps.</span>
//           </h2>
//         </Reveal>
//       </div>
//     </HowItWorksTimeline>
//   );
// }