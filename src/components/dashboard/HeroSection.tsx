"use client";

export default function HeroSection() {
  return (
    <section className="text-left shrink-0">
      {/* Welcome Heading with wave emoji placed AFTER text */}
      <h1
        className="flex items-center gap-2.5 text-[#1E293B] font-bold text-[30px] leading-[36px] 3xl:text-[clamp(36px,2vw,64px)] 3xl:leading-[1.2]"
        style={{
          fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
          letterSpacing: "0%",
          verticalAlign: "middle",
        }}
      >
        <span>Welcome to Sig Signature!</span>
        <span className="text-[28px] 3xl:text-[clamp(34px,1.9vw,60px)] select-none inline-block" role="img" aria-label="wave">
          👋
        </span>
      </h1>

      {/* Subtitles matching Commissioner 18px typography with space after description */}
      <div className="mt-2 3xl:mt-3 4xl:mt-4 space-y-1 3xl:space-y-1.5 pb-2 sm:pb-3 2xl:pb-4 3xl:pb-5 4xl:pb-6">
        <p
          className="text-[#64748B] text-[18px] leading-[24px] 3xl:text-[clamp(19px,1.05vw,30px)] 3xl:leading-[1.4]"
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
          className="text-[#64748B] text-[18px] leading-[24px] 3xl:text-[clamp(19px,1.05vw,30px)] 3xl:leading-[1.4]"
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
