import Image from "next/image";

type LogoProps = {
  className?: string;
};

export default function Logo({ className = "" }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 xl:gap-3 ${className}`}>
      <Image
        src="/logo.svg"
        alt="Sig Signature logo"
        width={64}
        height={36}
        priority
        className="h-auto w-10 sm:w-12 xl:w-16"
      />
      <span className="font-body text-base font-semibold text-white sm:text-lg xl:text-xl">
        Sig Signature
      </span>
    </div>
  );
}