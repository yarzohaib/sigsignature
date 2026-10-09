import SignaturePreview from "./SignaturePreview";
import Logo from "./Logo";

type AuthShellProps = {
  children: React.ReactNode;
};

export default function AuthShell({ children }: AuthShellProps) {
  return (
    <main className="flex min-h-screen flex-col lg:grid lg:grid-cols-[54fr_46fr]">
      {/* Header for phones and tablets */}
      <header className="bg-brand-gradient px-5 py-4 sm:px-8 sm:py-5 lg:hidden">
        <Logo />
      </header>

      {/* Left panel, large screens only */}
      <section className="relative hidden overflow-hidden bg-[#F4F4F3] lg:flex">
        {/* Glow circles sized in percentages so they scale with the panel */}
        <div className="pointer-events-none absolute -left-[33%] -top-[31%] h-[107%] w-[135%] rounded-full bg-brand blur-[150px]" />
        <div className="pointer-events-none absolute left-0 top-[24%] h-[58%] w-[72%] rounded-full bg-brand-light blur-[150px]" />
        <div className="pointer-events-none absolute -bottom-[17%] left-[13%] h-[47%] w-[90%] rounded-full bg-white blur-[150px]" />

        {/* Content: three separate blocks spread across the full height */}
        <div className="relative z-10 flex flex-1 flex-col justify-between gap-10 px-8 py-10 xl:px-[76px] xl:py-16">
          {/* 1. Logo */}
          <div>
            <Logo />
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