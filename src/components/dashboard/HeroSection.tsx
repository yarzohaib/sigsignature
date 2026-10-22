"use client";

export default function HeroSection() {
  return (
    <section className="text-left shrink-0">
      {/* Welcome Heading with wave emoji placed AFTER text */}
      <h1 className="flex items-center gap-2.5 sm:gap-3 2xl:gap-4 font-montserrat font-bold text-2xl sm:text-3xl xl:text-4xl 2xl:text-5xl 3xl:text-6xl text-[#1E293B] tracking-tight leading-tight">
        <span>Welcome to Sig Signature!</span>
        <span
          className="text-2xl sm:text-3xl xl:text-4xl 2xl:text-5xl 3xl:text-6xl select-none inline-block"
          role="img"
          aria-label="wave"
        >
          👋
        </span>
      </h1>

      {/* Subtitles matching Commissioner typography with dynamic responsive scaling */}
      <div className="mt-2 xl:mt-3 2xl:mt-4 space-y-1 sm:space-y-1.5 2xl:space-y-2 pb-2 sm:pb-3 2xl:pb-4">
        <p className="font-commissioner font-normal text-sm sm:text-base xl:text-lg 2xl:text-xl 3xl:text-2xl text-[#64748B] leading-relaxed">
          Let&apos;s build your first professional email signature.
        </p>
        <p className="font-commissioner font-normal text-sm sm:text-base xl:text-lg 2xl:text-xl 3xl:text-2xl text-[#64748B] leading-relaxed">
          Choose how you&apos;d like to get started.
        </p>
      </div>
    </section>
  );
}
