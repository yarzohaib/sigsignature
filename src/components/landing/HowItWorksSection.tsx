import SectionBadge from "./SectionBadge";

const steps = [
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
      "Copy the HTML code or download the image. Paste it into Gmail, Outlook, or any email client done.",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="scroll-mt-24 bg-[#FCFCFC] py-16 sm:py-24">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Section Header */}
        <div className="text-center">
          <SectionBadge label="HOW IT WORKS" className="mb-4" />
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl lg:text-[54px] lg:leading-[1.12]">
            From Zero to Signature in{" "}
            <span className="text-brand">3 Steps.</span>
          </h2>
        </div>

        {/* 3 Step Flow */}
        <div className="mt-12 grid grid-cols-1 gap-8 sm:mt-16 md:grid-cols-3 lg:gap-8">
          {steps.map((item) => (
            <div
              key={item.step}
              className="relative flex flex-col items-start rounded-[20px] border border-[#C1C1C1]/80 bg-white p-7 shadow-none transition hover:border-blue-300 sm:p-8"
            >
              {/* Number Badge */}
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand font-heading text-lg font-bold text-white shadow-none">
                {item.step}
              </div>

              {/* Title & Description */}
              <h3 className="font-heading mt-6 text-xl font-semibold text-slate-900">
                {item.title}
              </h3>
              <p className="font-body mt-3 text-sm leading-relaxed text-[#878787] sm:text-base">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
