import Link from "next/link";

export default function CtaBanner() {
  return (
    <section
      className="relative w-full overflow-hidden px-4 py-16 text-center text-white sm:py-20 lg:py-24"
      style={{
        background: "linear-gradient(90deg, #245FD4 0%, #00359F 50%, #00143C 100%)",
        boxShadow: "inset 13px 12px 35.1px 0 rgba(0, 0, 0, 0.24)",
      }}
    >
      <div className="mx-auto max-w-4xl px-4">
        {/* Slightly reduced headline size matching Figma */}
        <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl lg:text-[36px] xl:text-[38px] leading-tight sm:leading-[1.2]">
          Your Email Signature Is the Last Thing People See,
          <br className="hidden sm:inline" /> Make It Count.
        </h2>

        <p className="font-body mt-4 text-sm text-blue-100 sm:text-base">
          Join professionals who&apos;ve stopped overpaying for email signatures.
          Create yours free in minutes.
        </p>

        {/* Sleek, 275px x 46px pill button matching Figma Frame properties */}
        <div className="mt-8 flex justify-center">
          <Link
            href="/signup"
            style={{
              background:
                "linear-gradient(180deg, #FFFFFF 0%, #D9F4FD 50%, #FDFEFF 100%)",
            }}
            className="inline-flex h-[46px] w-[275px] items-center justify-center rounded-full font-body text-sm sm:text-[15px] font-semibold text-[#00359F] shadow-sm transition-transform hover:scale-105 active:scale-95"
          >
            Create Your Free Signature
          </Link>
        </div>

        <p className="mt-3.5 font-body text-xs text-blue-200/90 sm:text-sm">
          No credit card. No designer. No developer. Just you.
        </p>
      </div>
    </section>
  );
}
