import React from "react";

export default function HelpHero() {
  return (
    <section aria-labelledby="help-hero-heading" className="flex flex-col">
      <h1
        id="help-hero-heading"
        className="page-heading text-[#0B1A3D]"
      >
        <span>A Little Help. </span>
        <span className="text-[#245FD4]">A Great Signature.</span>
      </h1>
      <p
        className="mt-2 text-sm sm:text-[15px] text-[#64748B] leading-relaxed"
        style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
      >
        Find practical answers for designing, exporting, and using your email signature.
      </p>
    </section>
  );
}
