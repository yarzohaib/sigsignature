import Image from "next/image";

type LogoProps = {
  className?: string;
  variant?: "white" | "blue";
};

export default function Logo({ className = "", variant = "white" }: LogoProps) {
  const isWhite = variant === "white";

  return (
    <div className={`flex items-center gap-2 xl:gap-3 ${className}`}>
      <Image
        src={isWhite ? "/logo-white.svg" : "/logo.svg"}
        alt="Sig Signature logo"
        width={64}
        height={36}
        priority
        className="h-auto w-10 sm:w-12 xl:w-16"
      />
      <span
        className={`font-body text-base font-semibold sm:text-lg xl:text-xl ${
          isWhite ? "text-white" : "text-brand-dark"
        }`}
      >
        Sig Signature
      </span>
    </div>
  );
}