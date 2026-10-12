import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#FCFCFC] pt-16 font-body text-slate-600">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center">
          <Link
            href="#"
            className="inline-flex items-center gap-2.5 transition hover:opacity-90"
          >
            <Image
              src="/logo.svg"
              alt="Sig Signature logo"
              width={54}
              height={30}
              className="h-8 w-auto"
            />
            <span className="font-heading text-2xl font-semibold text-[#022977]">
              Sig Signature
            </span>
          </Link>
          <p className="mt-3 max-w-none text-center font-body text-[14px] leading-normal text-[#878787] sm:whitespace-nowrap">
            Professional email signatures ensure every email reflects a consistent and professional brand identity.
          </p>
        </div>

        {/* 3 Horizontal Navigation Groups Matching Figma */}
        <div className="mt-12 flex flex-col items-center justify-center gap-10 md:flex-row md:items-start md:justify-around lg:gap-14">
          {/* Products Group */}
          <div className="flex flex-col items-center text-center">
            <h4 className="font-body text-xl sm:text-2xl lg:text-[24px] font-medium leading-[100%] tracking-normal text-black">
              Products
            </h4>
            <div className="mt-4 sm:mt-5 flex flex-wrap items-center justify-center gap-4 sm:gap-6 lg:gap-7">
              <Link
                href="#features"
                className="font-body text-sm sm:text-base lg:text-[18px] font-normal leading-[100%] tracking-normal text-center text-[#353A3E] transition hover:text-brand"
              >
                Features
              </Link>
              <Link
                href="#pricing"
                className="font-body text-sm sm:text-base lg:text-[18px] font-normal leading-[100%] tracking-normal text-center text-[#353A3E] transition hover:text-brand"
              >
                Pricing
              </Link>
              <Link
                href="/login"
                className="font-body text-sm sm:text-base lg:text-[18px] font-normal leading-[100%] tracking-normal text-center text-[#353A3E] transition hover:text-brand"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="font-body text-sm sm:text-base lg:text-[18px] font-normal leading-[100%] tracking-normal text-center text-[#353A3E] transition hover:text-brand"
              >
                Sign Up
              </Link>
            </div>
          </div>

          {/* Company Group */}
          <div className="flex flex-col items-center text-center">
            <h4 className="font-body text-xl sm:text-2xl lg:text-[24px] font-medium leading-[100%] tracking-normal text-black">
              Company
            </h4>
            <div className="mt-4 sm:mt-5 flex flex-wrap items-center justify-center gap-4 sm:gap-6 lg:gap-7">
              <Link
                href="#about"
                className="font-body text-sm sm:text-base lg:text-[18px] font-normal leading-[100%] tracking-normal text-center text-[#353A3E] transition hover:text-brand"
              >
                About
              </Link>
              <Link
                href="#careers"
                className="font-body text-sm sm:text-base lg:text-[18px] font-normal leading-[100%] tracking-normal text-center text-[#353A3E] transition hover:text-brand"
              >
                Careers
              </Link>
              <Link
                href="#contact"
                className="font-body text-sm sm:text-base lg:text-[18px] font-normal leading-[100%] tracking-normal text-center text-[#353A3E] transition hover:text-brand"
              >
                Contact Us
              </Link>
              <Link
                href="#updates"
                className="font-body text-sm sm:text-base lg:text-[18px] font-normal leading-[100%] tracking-normal text-center text-[#353A3E] transition hover:text-brand"
              >
                Updates
              </Link>
            </div>
          </div>

          {/* Resources Group */}
          <div className="flex flex-col items-center text-center">
            <h4 className="font-body text-xl sm:text-2xl lg:text-[24px] font-medium leading-[100%] tracking-normal text-black">
              Resources
            </h4>
            <div className="mt-4 sm:mt-5 flex flex-wrap items-center justify-center gap-4 sm:gap-6 lg:gap-7">
              <Link
                href="#features"
                className="font-body text-sm sm:text-base lg:text-[18px] font-normal leading-[100%] tracking-normal text-center text-[#353A3E] transition hover:text-brand"
              >
                Email Signature
              </Link>
              <Link
                href="/templates"
                className="font-body text-sm sm:text-base lg:text-[18px] font-normal leading-[100%] tracking-normal text-center text-[#353A3E] transition hover:text-brand"
              >
                Templates
              </Link>
              <Link
                href="/signup"
                className="font-body text-sm sm:text-base lg:text-[18px] font-normal leading-[100%] tracking-normal text-center text-[#353A3E] transition hover:text-brand"
              >
                Free Signature
              </Link>
            </div>
          </div>
        </div>

        {/* Social Media Icons */}
        <div className="mt-10 flex justify-center gap-4">
          {/* Facebook */}
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#C1C1C1] text-slate-700 transition hover:border-brand hover:text-brand"
          >
            <span className="font-heading text-xs font-bold">f</span>
          </a>

          {/* Instagram */}
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#C1C1C1] text-slate-700 transition hover:border-brand hover:text-brand"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.8"
              stroke="currentColor"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
          </a>

          {/* LinkedIn */}
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#C1C1C1] text-slate-700 transition hover:border-brand hover:text-brand"
          >
            <span className="font-heading text-xs font-bold">in</span>
          </a>
        </div>
      </div>

      {/* FULL WIDTH Horizontal Divider Line */}
      <div className="mt-12 w-full border-t border-[#D7D7D7]" />

      {/* Bottom Legal & Copyright Bar */}
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 xl:px-12 py-6">
        <div className="flex flex-col items-center justify-between gap-4 text-xs sm:text-sm text-[#878787] sm:flex-row">
          <p>© 2026 Sig Signature. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <Link href="#privacy" className="transition hover:text-brand">
              Privacy Policy
            </Link>
            <Link href="#terms" className="transition hover:text-brand">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
