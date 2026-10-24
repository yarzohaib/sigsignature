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
    <section className="rounded-2xl 2xl:rounded-3xl border border-[#E2E8F0] bg-white p-3.5 sm:p-4 xl:p-4.5 2xl:p-5 shadow-xs shrink-0" aria-label="Getting Started Steps">
      <h3
        className="text-[#1E293B] font-bold text-[17px] xl:text-[19px] 2xl:text-[20px] leading-tight"
        style={{
          fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
          letterSpacing: "0%",
          verticalAlign: "middle",
        }}
      >
        Getting Started
      </h3>

      {/* Steps Container */}
      <div className="mt-2.5 sm:mt-3 xl:mt-3.5">
        {/* Desktop / Tablet layout with connecting dashed lines */}
        <div className="hidden md:grid md:grid-cols-5 md:gap-3 lg:gap-4 xl:gap-6 2xl:gap-8">
          {steps.map((step, idx) => (
            <div key={step.number} className="flex flex-col items-start text-left">
              {/* Step Badge row with connector to next step */}
              <div className="relative flex w-full items-center">
                <div
                  className={`relative z-10 flex h-8 w-8 xl:h-9 xl:w-9 2xl:h-10 2xl:w-10 shrink-0 items-center justify-center rounded-full text-[12px] xl:text-[13px] 2xl:text-[14px] font-bold shadow-xs ${
                    step.completed
                      ? "bg-[#163BA4] text-white ring-3 xl:ring-4 ring-white"
                      : "bg-[#E2E8F0] text-[#64748B] ring-3 xl:ring-4 ring-white"
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

                {/* Dashed connector line to next circle (only between steps 1-4, stops at step 5) */}
                {idx < steps.length - 1 && (
                  <div
                    className="absolute top-1/2 -translate-y-1/2 left-3.5 xl:left-4 2xl:left-5 w-full z-0 border-t-2 border-dashed border-[#E2E8F0]"
                    aria-hidden="true"
                  />
                )}
              </div>

              {/* Description above title */}
              <p
                className="mt-1.5 xl:mt-2 text-[11px] xl:text-[12px] 2xl:text-[13px] leading-tight text-[#64748B] line-clamp-2"
                style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
              >
                {step.subtext}
              </p>

              {/* Title below description */}
              <h4
                className="mt-0.5 xl:mt-1 text-[13px] xl:text-[14px] 2xl:text-[15px] font-bold text-[#1E293B] leading-tight"
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




// "use client";

// export default function GettingStartedSteps() {
//   const steps = [
//     {
//       number: 1,
//       completed: true,
//       subtext: "You've successfully created your account.",
//       title: "Account Created",
//     },
//     {
//       number: 2,
//       completed: false,
//       subtext: "Design your first email signature.",
//       title: "Create Signature",
//     },
//     {
//       number: 3,
//       completed: false,
//       subtext: "Download your signature in HTML format.",
//       title: "Export HTML",
//     },
//     {
//       number: 4,
//       completed: false,
//       subtext: "Add your signature to Gmail or Outlook.",
//       title: "Install Signature",
//     },
//     {
//       number: 5,
//       completed: false,
//       subtext: "Your professional signature is live.",
//       title: "You're Ready!",
//     },
//   ];

//   return (
//     <section className="rounded-2xl 2xl:rounded-3xl 3xl:rounded-[2rem] border border-[#E2E8F0] bg-white p-3.5 sm:p-4 xl:p-4.5 2xl:p-5 3xl:p-[clamp(20px,1.3vw,38px)] shadow-xs shrink-0" aria-label="Getting Started Steps">
//       <h3
//         className="text-[#1E293B] font-bold text-[17px] xl:text-[19px] 2xl:text-[20px] 3xl:text-[clamp(22px,1.3vw,38px)] leading-tight"
//         style={{
//           fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
//           letterSpacing: "0%",
//           verticalAlign: "middle",
//         }}
//       >
//         Getting Started
//       </h3>

//       {/* Steps Container */}
//       <div className="mt-2.5 sm:mt-3 xl:mt-3.5 3xl:mt-[clamp(14px,0.8vw,26px)]">
//         {/* Desktop / Tablet layout with connecting dashed lines */}
//         <div className="relative hidden md:block">
//           {/* Continuous dashed line spanning across all circles from Step 1 center to Final Tick center */}
//           <div
//             className="pointer-events-none absolute top-4 xl:top-[18px] 2xl:top-5 3xl:top-[clamp(22px,1.25vw,35px)] -translate-y-1/2 left-4 xl:left-[18px] 2xl:left-5 3xl:left-[clamp(22px,1.25vw,35px)] right-4 xl:right-[18px] 2xl:right-5 3xl:right-[clamp(22px,1.25vw,35px)] z-0 border-t-2 3xl:border-t-3 border-dashed border-[#E2E8F0]"
//             aria-hidden="true"
//           />

//           <div className="grid md:grid-cols-5 md:gap-3 lg:gap-4 xl:gap-6 2xl:gap-8 3xl:gap-[clamp(32px,2vw,60px)]">
//             {steps.map((step, idx) => (
//               <div key={step.number} className="flex flex-col items-start text-left">
//                 {/* Step Badge row */}
//                 <div className="relative flex w-full items-center">
//                   <div
//                     className={`relative z-10 flex h-8 w-8 xl:h-9 xl:w-9 2xl:h-10 2xl:w-10 3xl:h-[clamp(44px,2.5vw,70px)] 3xl:w-[clamp(44px,2.5vw,70px)] shrink-0 items-center justify-center rounded-full text-[12px] xl:text-[13px] 2xl:text-[14px] 3xl:text-[clamp(15px,0.95vw,26px)] font-bold shadow-xs ${
//                       step.completed
//                         ? "bg-[#163BA4] text-white ring-4 xl:ring-4 3xl:ring-6 ring-white"
//                         : "bg-[#E2E8F0] text-[#64748B] ring-4 xl:ring-4 3xl:ring-6 ring-white"
//                     }`}
//                     style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
//                   >
//                     {step.number}
//                   </div>

//                   {/* For the last column (step 5), render the final tick milestone at the right edge */}
//                   {idx === steps.length - 1 && (
//                     <div
//                       className="absolute top-1/2 -translate-y-1/2 right-0 z-10 flex h-8 w-8 xl:h-9 xl:w-9 2xl:h-10 2xl:w-10 3xl:h-[clamp(44px,2.5vw,70px)] 3xl:w-[clamp(44px,2.5vw,70px)] shrink-0 items-center justify-center rounded-full bg-[#163BA4] text-white ring-4 xl:ring-4 3xl:ring-6 ring-white shadow-xs"
//                       style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
//                       aria-label="Completed milestone"
//                     >
//                       <svg
//                         className="h-4 w-4 3xl:h-[clamp(20px,1.2vw,34px)] 3xl:w-[clamp(20px,1.2vw,34px)]"
//                         viewBox="0 0 24 24"
//                         fill="none"
//                         stroke="currentColor"
//                         strokeWidth="3"
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                       >
//                         <polyline points="20 6 9 17 4 12" />
//                       </svg>
//                     </div>
//                   )}
//                 </div>

//                 {/* Description above title (fixed 2-line height so all titles align perfectly on the same line) */}
//                 <p
//                   className="mt-1.5 xl:mt-2 3xl:mt-[clamp(8px,0.5vw,16px)] text-[11px] xl:text-[12px] 2xl:text-[13px] 3xl:text-[clamp(13px,0.8vw,22px)] leading-tight text-[#64748B] line-clamp-2 min-h-[30px] xl:min-h-[34px] 2xl:min-h-[36px] flex items-start"
//                   style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
//                 >
//                   {step.subtext}
//                 </p>

//                 {/* Title below description (aligned on the same baseline across all 5 steps) */}
//                 <h4
//                   className="mt-0.5 xl:mt-1 3xl:mt-[clamp(4px,0.3vw,10px)] text-[13px] xl:text-[14px] 2xl:text-[15px] 3xl:text-[clamp(15px,0.95vw,26px)] font-bold text-[#1E293B] leading-tight"
//                   style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
//                 >
//                   {step.title}
//                 </h4>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Mobile Layout (stacked / list) */}
//         <div className="flex flex-col space-y-4 md:hidden">
//           {steps.map((step) => (
//             <div key={step.number} className="flex items-start gap-3.5">
//               <div className="flex flex-col items-center">
//                 <div
//                   className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
//                     step.completed ? "bg-[#163BA4] text-white" : "bg-[#E2E8F0] text-[#64748B]"
//                   }`}
//                   style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
//                 >
//                   {step.number}
//                 </div>
//                 {/* Vertical dashed connector line continued throughout */}
//                 <div className="my-1 h-5 w-0.5 border-l-2 border-dashed border-[#E2E8F0]" />
//               </div>
//               <div className="pt-0.5">
//                 <h4
//                   className="text-[14px] font-bold text-[#1E293B]"
//                   style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
//                 >
//                   {step.title}
//                 </h4>
//                 <p
//                   className="text-[12px] leading-[17px] text-[#64748B]"
//                   style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
//                 >
//                   {step.subtext}
//                 </p>
//               </div>
//             </div>
//           ))}

//           {/* Final Tick Milestone Circle on mobile */}
//           <div className="flex items-start gap-3.5">
//             <div className="flex flex-col items-center">
//               <div
//                 className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#163BA4] text-white text-xs font-bold ring-2 ring-white shadow-xs"
//                 style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
//                 aria-label="Completed milestone"
//               >
//                 <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
//                   <polyline points="20 6 9 17 4 12" />
//                 </svg>
//               </div>
//             </div>
//             <div className="pt-1.5">
//               <h4
//                 className="text-[13px] font-bold text-[#64748B]"
//                 style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
//               >
//                 All Done!
//               </h4>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }
