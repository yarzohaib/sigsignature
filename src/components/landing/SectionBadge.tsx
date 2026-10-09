type SectionBadgeProps = {
  label: string;
  className?: string;
};

export default function SectionBadge({ label, className = "" }: SectionBadgeProps) {
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-3.5 py-1 text-xs font-semibold tracking-wider text-brand uppercase shadow-2xs backdrop-blur-xs ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-brand" />
      <span>{label}</span>
    </div>
  );
}
