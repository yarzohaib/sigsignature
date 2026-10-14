"use client";

export default function HeroSection() {
  return (
    <section className="text-left shrink-0">
      {/* Welcome Heading with wave emoji placed AFTER text */}
      <h1
        className="flex items-center gap-2.5 text-[#1E293B]"
        style={{
          fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
          fontWeight: 700,
          fontSize: "30px",
          lineHeight: "36px",
          letterSpacing: "0%",
          verticalAlign: "middle",
        }}
      >
        <span>Welcome to Sig Signature!</span>
        <span className="text-[28px] select-none inline-block" role="img" aria-label="wave">
          👋
        </span>
      </h1>

      {/* Subtitles matching Commissioner 18px typography with space after description */}
      <div className="mt-2 space-y-1 pb-2 sm:pb-3 2xl:pb-4">
        <p
          className="text-[#64748B]"
          style={{
            fontFamily: "var(--font-commissioner), Commissioner, sans-serif",
            fontWeight: 400,
            fontSize: "18px",
            lineHeight: "24px",
            letterSpacing: "0%",
            verticalAlign: "middle",
          }}
        >
          Let&apos;s build your first professional email signature.
        </p>
        <p
          className="text-[#64748B]"
          style={{
            fontFamily: "var(--font-commissioner), Commissioner, sans-serif",
            fontWeight: 400,
            fontSize: "18px",
            lineHeight: "24px",
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
