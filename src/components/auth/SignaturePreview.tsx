type SignaturePreviewProps = {
  className?: string;
  floating?: boolean;
};

const styles = ["Minimal", "Execute", "Compact"];

export default function SignaturePreview({ className = "", floating = false }: SignaturePreviewProps) {
  return (
    <div
      className={`w-full max-w-[624px] rounded-[40px] bg-[#EFEDE9] p-6 shadow-[0_24px_60px_rgba(2,41,119,0.18)] ${className}`}
    >
      <div
        className={`rounded-[28px] border border-line/60 bg-surface p-6 ${
          floating ? "animate-float-slow-1" : ""
        }`}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#245FD4] to-[#022977]" />
            <div>
              <p className="text-[15px] font-semibold text-slate-900">Muhammad Nadir</p>
              <p className="text-[11px] text-slate-600">Head of TheNevon • CEO</p>
            </div>
          </div>
          <span
            className={`flex items-center gap-1.5 rounded-full border border-line px-2.5 py-0.5 text-[10px] text-slate-700 ${
              floating ? "animate-float-slow-2" : ""
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
            Active
          </span>
        </div>

        <div className="mt-10 text-[10px] text-slate-700">
          <p>
            nadir@thenevon.com <span className="mx-2 text-line">|</span> +655 863 1279
          </p>
          <p className="mt-2">www.thenevon.com</p>
        </div>

        <div className="mt-5 flex items-center gap-3">
          <span
            className={`rounded-full bg-cta-gradient bg-gradient-to-r from-[#245FD4] to-[#022977] px-3 py-1.5 text-[9px] font-semibold text-white ${
              floating ? "animate-float-slow-2" : ""
            }`}
          >
            Book a call ›
          </span>
          <span className="text-[10px] font-bold text-[#245FD4]">in</span>
          <span className="text-[11px] font-bold text-slate-900">X</span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        {styles.map((style) => (
          <div
            key={style}
            className={`flex h-12 items-center justify-center rounded-[13px] text-sm font-medium select-none cursor-default pointer-events-none ${
              style === "Minimal"
                ? "bg-cta-gradient bg-gradient-to-r from-[#245FD4] to-[#022977] text-white shadow-xs"
                : "border border-line bg-[#F4F2EE] text-slate-800"
            }`}
          >
            {style}
          </div>
        ))}
      </div>
    </div>
  );
}