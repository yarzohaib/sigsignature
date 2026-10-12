type SectionBadgeProps = {
  label: string;
  className?: string;
};

export default function SectionBadge({ label, className = "" }: SectionBadgeProps) {
  return (
    <div
      className={`inline-flex h-[37px] w-[166px] items-center justify-center gap-3 rounded-full border border-[#C1C1C1] bg-transparent px-4 font-body text-[14px] font-medium uppercase leading-[100%] tracking-normal text-slate-900 ${className}`}
      style={{ backgroundColor: "transparent" }}
    >
      <span className="h-2 w-2 shrink-0 rounded-full bg-[#245FD4]" />
      <span>{label}</span>
    </div>
  );
}

