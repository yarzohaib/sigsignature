import Link from "next/link";
import SignaturePreview from "./SignaturePreview";
import Logo from "./Logo";
import { FacebookIcon, InstagramIcon, LinkedInIcon, XIcon } from "./icons";

type AuthShellProps = {
  children: React.ReactNode;
};

export default function AuthShell({ children }: AuthShellProps) {
  return (
    <main className="flex min-h-screen flex-col lg:grid lg:grid-cols-[54fr_46fr]">
      {/* Header for phones and tablets */}
      <header className="bg-brand-gradient px-5 py-3 sm:px-8 sm:py-3.5 lg:hidden">
        <Link href="/" className="inline-block transition hover:opacity-90">
          <Logo />
        </Link>
      </header>

      {/* Left panel, large screens only */}
      <section className="relative hidden overflow-hidden bg-[#F4F4F3] lg:flex">
        {/* Glow circles from Figma: Ellipse 179 (bottom), 178 (middle), 177 (top). Figma blur 300 = 150px in CSS */}
<div className="pointer-events-none absolute -left-[33.46%] -top-[278px] h-[945px] w-[135.94%] rounded-full bg-brand blur-[150px]" />
<div className="pointer-events-none absolute left-0 top-[210px] h-[512px] w-[72.53%] rounded-full bg-brand-light blur-[150px]" />
<div className="pointer-events-none absolute -left-[13.15%] top-[302px] h-[452px] w-[75.52%] rounded-full bg-white blur-[150px]" />
        {/* Content: three separate blocks spread across the full height */}
        <div className="relative z-10 flex flex-1 flex-col justify-between gap-10 px-8 pt-7 pb-10 xl:px-[76px] xl:pt-10 xl:pb-16">
          {/* 1. Logo */}
          <div>
            <Link href="/" className="inline-block transition hover:opacity-90">
              <Logo />
            </Link>
          </div>

          {/* 2. Signature preview */}
          <div>
            <SignaturePreview />
          </div>

          {/* 3. Headline */}
          <div>
            <h2 className="max-w-[543px] bg-linear-to-b from-brand to-brand-dark bg-clip-text font-heading text-[36px] font-semibold leading-[44px] text-transparent xl:text-[56px] xl:leading-[64px]">
              Your Professional Email Signature Starts Here.
            </h2>
            <nav aria-label="Sig Signature social media" className="mt-6 flex items-center gap-3">
              <a
                href="https://www.linkedin.com/company/sig-signature/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Sig Signature on LinkedIn"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-brand/20 bg-white/70 text-brand transition hover:bg-white"
              >
                <LinkedInIcon className="h-[18px] w-[18px]" />
              </a>
              <a
                href="https://x.com/SigSignature_"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Sig Signature on X"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-brand/20 bg-white/70 text-brand transition hover:bg-white"
              >
                <XIcon className="h-[17px] w-[17px]" />
              </a>
              <a
                href="https://www.instagram.com/sigsignature_com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Sig Signature on Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-brand/20 bg-white/70 text-brand transition hover:bg-white"
              >
                <InstagramIcon className="h-[18px] w-[18px]" />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61595216736684"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Sig Signature on Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-brand/20 bg-white/70 text-brand transition hover:bg-white"
              >
                <FacebookIcon className="h-[18px] w-[18px]" />
              </a>
            </nav>
          </div>
        </div>
      </section>

      {/* Right panel with the form */}
      <section className="flex flex-1 items-center justify-center bg-surface px-5 py-10 sm:px-6 sm:py-12">
        {children}
      </section>
    </main>
  );
}
