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
    <section className="rounded-2xl 3xl:rounded-3xl border border-[#E2E8F0] bg-white p-4.5 sm:p-5.5 xl:p-6 2xl:p-7 3xl:p-[clamp(28px,1.8vw,48px)] shadow-xs shrink-0" aria-label="Getting Started Steps">
      <h3
        className="text-[#1E293B] font-bold text-[20px] leading-[26.67px] 3xl:text-[clamp(22px,1.2vw,36px)] 3xl:leading-[1.3]"
        style={{
          fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
          letterSpacing: "0%",
          verticalAlign: "middle",
        }}
      >
        Getting Started
      </h3>

      {/* Steps Container */}
      <div className="mt-3.5 sm:mt-4 2xl:mt-5 3xl:mt-[clamp(20px,1.2vw,36px)]">
        {/* Desktop / Tablet layout with connecting dashed lines */}
        <div className="hidden md:grid md:grid-cols-5 md:gap-4 lg:gap-6 2xl:gap-8 3xl:gap-[clamp(32px,2vw,56px)]">
          {steps.map((step, idx) => (
            <div key={step.number} className="flex flex-col items-start text-left">
              {/* Step Badge row with connector to next step */}
              <div className="relative flex w-full items-center">
                <div
                  className={`relative z-10 flex h-9 w-9 2xl:h-10 2xl:w-10 3xl:h-[clamp(48px,2.5vw,76px)] 3xl:w-[clamp(48px,2.5vw,76px)] shrink-0 items-center justify-center rounded-full text-[13px] 2xl:text-[14px] 3xl:text-[clamp(16px,0.9vw,26px)] font-bold shadow-xs ${
                    step.completed
                      ? "bg-[#163BA4] text-white ring-4 ring-white"
                      : "bg-[#E2E8F0] text-[#64748B] ring-4 ring-white"
                  }`}
                  style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                >
                  {step.completed ? (
                    <svg className="h-4 w-4 3xl:h-[clamp(20px,1.1vw,34px)] 3xl:w-[clamp(20px,1.1vw,34px)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    step.number
                  )}
                </div>

                {/* Dashed connector line to next circle (only between steps 1-4, stops at step 5) */}
                {idx < steps.length - 1 && (
                  <div
                    className="absolute top-1/2 -translate-y-1/2 left-4 2xl:left-5 3xl:left-[clamp(24px,1.25vw,38px)] -right-6 lg:-right-8 2xl:-right-[42px] 3xl:-right-[clamp(48px,2.5vw,72px)] z-0 border-t-2 3xl:border-t-3 border-dashed border-[#E2E8F0]"
                    aria-hidden="true"
                  />
                )}
              </div>

              {/* Description above title */}
              <p
                className="mt-2.5 3xl:mt-3.5 4xl:mt-4 text-[12px] 2xl:text-[13px] 3xl:text-[clamp(14px,0.8vw,22px)] leading-[17px] 2xl:leading-[18px] 3xl:leading-[1.4] text-[#64748B] min-h-[34px] 2xl:min-h-[36px] 3xl:min-h-[clamp(40px,2.2vw,64px)]"
                style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
              >
                {step.subtext}
              </p>

              {/* Title below description */}
              <h4
                className="mt-1 3xl:mt-1.5 text-[14px] 2xl:text-[15px] 3xl:text-[clamp(16px,0.95vw,24px)] font-bold text-[#1E293B]"
                style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
              >
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
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    step.completed ? "bg-[#163BA4] text-white" : "bg-[#E2E8F0] text-[#64748B]"
                  }`}
                  style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                >
                  {step.completed ? (
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
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
                <h4
                  className="text-[14px] font-bold text-[#1E293B]"
                  style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                >
                  {step.title}
                </h4>
                <p
                  className="text-[12px] leading-[17px] text-[#64748B]"
                  style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                >
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
