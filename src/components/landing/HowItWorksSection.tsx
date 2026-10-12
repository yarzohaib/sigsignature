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
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl lg:text-[54px] lg:leading-[1.15]">
            From Zero to Signature in
            <br />
            <span className="text-[#1243A3]">3 Steps.</span>
          </h2>
        </div>

        {/* 3 Step Flow without outlined boxes */}
        <div className="relative mx-auto mt-14 max-w-[1200px] sm:mt-16">
          {/* Continuous horizontal line running across below the number circles (desktop) */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-0 right-0 top-[96px] hidden h-[1px] bg-[#C1C1C1] md:block"
          />

          <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8 lg:gap-14 xl:gap-16">
            {steps.map((item) => (
              <div key={item.step} className="relative flex flex-col items-start">
                {/* 74x74 Number Circle matching Figma */}
                <div
                  style={{
                    background:
                      "linear-gradient(180deg, #245FD4 0%, #022977 100%)",
                  }}
                  className="flex h-[74px] w-[74px] items-center justify-center rounded-full border border-[#C1C1C1] shadow-xs"
                >
                  <span className="font-heading text-2xl font-bold text-white sm:text-[28px]">
                    {item.step}
                  </span>
                </div>

                {/* Title & Description */}
                <h3 className="font-heading mt-6 text-xl font-semibold text-slate-900 md:mt-11 sm:text-2xl">
                  {item.title}
                </h3>
                <p className="font-body mt-3 text-sm leading-relaxed text-[#878787] sm:text-base">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
