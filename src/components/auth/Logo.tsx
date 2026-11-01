import Image from "next/image";

type LogoProps = {
  className?: string;
  variant?: "white" | "blue";
};

export default function Logo({ className = "", variant = "white" }: LogoProps) {
  const isWhite = variant === "white";

  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 xl:gap-3.5 ${className}`}>
      <Image
        src={isWhite ? "/logo-white.svg" : "/logo.svg"}
        alt="Sig Signature logo"
        width={48}
        height={26}
        priority
        className="h-6 w-auto sm:h-7 xl:h-8"
      />
      <span
        className={`font-heading text-lg font-semibold sm:text-xl xl:text-2xl ${
          isWhite ? "text-white" : "text-brand-dark"
        }`}
      >
        Sig Signature
      </span>
    </div>
  );
}