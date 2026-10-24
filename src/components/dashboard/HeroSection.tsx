"use client";

export default function HeroSection() {
  return (
    <section className="text-left shrink-0">
      {/* Welcome Heading with wave emoji placed AFTER text */}
      <h1
        className="page-heading flex items-center gap-2.5 text-[#1E293B]"
      >
        <span>Welcome to Sig Signature!</span>
        <span className="text-[28px] sm:text-[32px] select-none inline-block" role="img" aria-label="wave">
          👋
        </span>
      </h1>

      {/* Subtitles matching Commissioner typography */}
      <div className="mt-1 sm:mt-1.5 space-y-0.5">
        <p
          className="text-[#64748B] text-[14px] sm:text-[16px] xl:text-[17px] 2xl:text-[18px] leading-snug"
          style={{
            fontFamily: "var(--font-commissioner), Commissioner, sans-serif",
            fontWeight: 400,
            letterSpacing: "0%",
            verticalAlign: "middle",
          }}
        >
          Let&apos;s build your first professional email signature.
        </p>
        <p
          className="text-[#64748B] text-[14px] sm:text-[16px] xl:text-[17px] 2xl:text-[18px] leading-snug"
          style={{
            fontFamily: "var(--font-commissioner), Commissioner, sans-serif",
            fontWeight: 400,
            letterSpacing: "0%",
            verticalAlign: "middle",
          }}
        >
          Choose how you&apos;d like to get started.
        </p>
      </div>
    </section>
  );
}

// "use client";

// export default function HeroSection() {
//   return (
//     <section className="text-left shrink-0">
//       {/* Welcome Heading with wave emoji placed AFTER text */}
//       <h1
//         className="flex items-center gap-2.5 3xl:gap-[clamp(10px,0.6vw,20px)] text-[#1E293B] font-bold text-[24px] sm:text-[28px] xl:text-[30px] 2xl:text-[32px] 3xl:text-[clamp(34px,2.1vw,64px)] leading-tight"
//         style={{
//           fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
//           letterSpacing: "0%",
//           verticalAlign: "middle",
//         }}
//       >
//         <span>Welcome to Sig Signature!</span>
//         <span className="text-[24px] sm:text-[28px] xl:text-[30px] 2xl:text-[32px] 3xl:text-[clamp(32px,2vw,60px)] select-none inline-block" role="img" aria-label="wave">
//           👋
//         </span>
//       </h1>

//       {/* Subtitles matching Commissioner typography */}
//       <div className="mt-1 sm:mt-1.5 3xl:mt-[clamp(6px,0.4vw,14px)] space-y-0.5 3xl:space-y-[clamp(2px,0.2vw,8px)]">
//         <p
//           className="text-[#64748B] text-[14px] sm:text-[16px] xl:text-[17px] 2xl:text-[18px] 3xl:text-[clamp(18px,1.05vw,30px)] leading-snug"
//           style={{
//             fontFamily: "var(--font-commissioner), Commissioner, sans-serif",
//             fontWeight: 400,
//             letterSpacing: "0%",
//             verticalAlign: "middle",
//           }}
//         >
//           Let&apos;s build your first professional email signature.
//         </p>
//         <p
//           className="text-[#64748B] text-[14px] sm:text-[16px] xl:text-[17px] 2xl:text-[18px] 3xl:text-[clamp(18px,1.05vw,30px)] leading-snug"
//           style={{
//             fontFamily: "var(--font-commissioner), Commissioner, sans-serif",
//             fontWeight: 400,
//             letterSpacing: "0%",
//             verticalAlign: "middle",
//           }}
//         >
//           Choose how you&apos;d like to get started.
//         </p>
//       </div>
//     </section>
//   );
// }
