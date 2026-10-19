"use client";

interface PlanUsageCardProps {
  signatures: number;
  signatureLimit: number;
  isWaitlisted: boolean;
  isJoiningWaitlist: boolean;
  onJoinWaitlist: () => void;
}

export default function PlanUsageCard({
  signatures,
  signatureLimit,
  isWaitlisted,
  isJoiningWaitlist,
  onJoinWaitlist,
}: PlanUsageCardProps) {
  const percentUsed =
    signatureLimit > 0
      ? Math.min(100, Math.round((signatures / signatureLimit) * 100))
      : 0;

  return (
    <div className="rounded-2xl border border-[#E1E6EF] bg-white p-6 shadow-xs">
      {/* Header with Title and Free Plan Badge */}
      <div className="flex items-center justify-between pb-3">
        <h2
          className="text-[18px] font-semibold text-[#172238]"
          style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
        >
          Plan &amp; usage
        </h2>
        <span
          className="rounded-full bg-[#EFF6FF] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#245FD4]"
          style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
        >
          Free Plan
        </span>
      </div>

      {/* Price line */}
      <div className="flex items-baseline gap-1 py-1">
        <span
          className="text-[26px] font-bold text-[#172238] leading-none"
          style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
        >
          $0
        </span>
        <span
          className="text-[13px] text-[#6B7280]"
          style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
        >
          / forever
        </span>
      </div>

      {/* Usage line */}
      <div className="mt-4 flex items-center justify-between text-xs">
        <span
          className="text-[#6B7280]"
          style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
        >
          Saved signatures
        </span>
        <span
          className="font-bold text-[#172238]"
          style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
        >
          {signatures} / {signatureLimit}
        </span>
      </div>

      {/* Progress bar */}
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-[#245FD4] transition-all duration-300"
          style={{ width: `${percentUsed}%` }}
        />
      </div>

      {/* Explanatory text */}
      <p
        className="mt-4 text-[12px] leading-relaxed text-[#6B7280]"
        style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
      >
        Premium is coming soon. Join the waitlist for more room to create.
      </p>

      {/* Join the waitlist button */}
      <div className="mt-4">
        {isWaitlisted ? (
          <button
            type="button"
            disabled
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-100 py-2.5 px-4 text-xs font-semibold text-slate-500 cursor-not-allowed"
            style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
          >
            <svg className="h-4 w-4 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>You are on the waitlist</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onJoinWaitlist}
            disabled={isJoiningWaitlist}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#022977] py-2.5 px-4 text-xs font-semibold text-white shadow-xs transition hover:bg-opacity-95 active:scale-95 disabled:opacity-60"
            style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
          >
            {isJoiningWaitlist ? (
              <>
                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Joining...</span>
              </>
            ) : (
              <span>Join the waitlist</span>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
