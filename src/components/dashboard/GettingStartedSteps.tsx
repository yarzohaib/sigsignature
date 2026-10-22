"use client";

export default function GettingStartedSteps() {
  const steps = [
    {
      number: 1,
      completed: true,
      subtext: "You've successfully created your account.",
      title: "Account Created",
    },
    {
      number: 2,
      completed: false,
      subtext: "Design your first email signature.",
      title: "Create Signature",
    },
    {
      number: 3,
      completed: false,
      subtext: "Download your signature in HTML format.",
      title: "Export HTML",
    },
    {
      number: 4,
      completed: false,
      subtext: "Add your signature to Gmail or Outlook.",
      title: "Install Signature",
    },
    {
      number: 5,
      completed: false,
      subtext: "Your professional signature is live.",
      title: "You're Ready!",
    },
  ];

  return (
    <section
      className="rounded-2xl 2xl:rounded-3xl border border-[#E2E8F0] bg-white p-4.5 sm:p-5.5 xl:p-6 2xl:p-8 3xl:p-10 shadow-xs shrink-0"
      aria-label="Getting Started Steps"
    >
      <h3 className="font-montserrat font-bold text-lg sm:text-xl xl:text-2xl 2xl:text-3xl 3xl:text-4xl text-[#1E293B] leading-snug">
        Getting Started
      </h3>

      {/* Steps Container */}
      <div className="mt-3.5 sm:mt-4 xl:mt-5 2xl:mt-6">
        {/* Desktop / Tablet layout with connecting dashed lines */}
        <div className="hidden md:grid md:grid-cols-5 md:gap-4 lg:gap-6 xl:gap-8 2xl:gap-10 3xl:gap-12">
          {steps.map((step, idx) => (
            <div key={step.number} className="flex flex-col items-start text-left">
              {/* Step Badge row with connector to next step */}
              <div className="relative flex w-full items-center">
                <div
                  className={`relative z-10 flex h-9 w-9 sm:h-10 sm:w-10 xl:h-12 xl:w-12 2xl:h-14 2xl:w-14 3xl:h-16 3xl:w-16 shrink-0 items-center justify-center rounded-full text-xs sm:text-sm xl:text-base 2xl:text-lg 3xl:text-xl font-bold font-montserrat shadow-xs ring-4 2xl:ring-6 3xl:ring-8 ring-white ${
                    step.completed
                      ? "bg-[#163BA4] text-white"
                      : "bg-[#E2E8F0] text-[#64748B]"
                  }`}
                >
                  {step.completed ? (
                    <svg
                      className="h-4 w-4 xl:h-5 xl:w-5 2xl:h-6 2xl:w-6 3xl:h-7 3xl:w-7"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    step.number
                  )}
                </div>

                {/* Dashed connector line to next circle (only between steps 1-4, stops at step 5) */}
                {idx < steps.length - 1 && (
                  <div
                    className="absolute top-1/2 -translate-y-1/2 left-4 sm:left-5 xl:left-6 2xl:left-7 3xl:left-8 -right-4 sm:-right-6 lg:-right-8 xl:-right-10 2xl:-right-12 3xl:-right-14 z-0 border-t-2 xl:border-t-[3px] border-dashed border-[#E2E8F0]"
                    aria-hidden="true"
                  />
                )}
              </div>

              {/* Description above title */}
              <p className="font-commissioner font-normal mt-2.5 2xl:mt-3 text-xs sm:text-[13px] xl:text-sm 2xl:text-base 3xl:text-lg leading-relaxed text-[#64748B] min-h-[34px] sm:min-h-[38px] xl:min-h-[42px] 2xl:min-h-[48px]">
                {step.subtext}
              </p>

              {/* Title below description */}
              <h4 className="font-montserrat font-bold mt-1 2xl:mt-1.5 text-sm xl:text-base 2xl:text-lg 3xl:text-xl text-[#1E293B]">
                {step.title}
              </h4>
            </div>
          ))}
        </div>

        {/* Mobile Layout (stacked / list) */}
        <div className="flex flex-col space-y-4 md:hidden">
          {steps.map((step, idx) => (
            <div key={step.number} className="flex items-start gap-3.5">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold font-montserrat ${
                    step.completed ? "bg-[#163BA4] text-white" : "bg-[#E2E8F0] text-[#64748B]"
                  }`}
                >
                  {step.completed ? (
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    step.number
                  )}
                </div>
                {idx < steps.length - 1 && (
                  <div className="my-1 h-5 w-0.5 border-l-2 border-dashed border-[#E2E8F0]" />
                )}
              </div>
              <div className="pt-0.5">
                <h4 className="font-montserrat font-bold text-sm text-[#1E293B]">
                  {step.title}
                </h4>
                <p className="font-commissioner text-xs leading-[17px] text-[#64748B]">
                  {step.subtext}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}