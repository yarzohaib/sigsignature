"use client";

interface NotificationsCardProps {
  notifyProductUpdates: boolean;
  notifyTips: boolean;
  onToggleProductUpdates: () => void;
  onToggleTips: () => void;
}

export default function NotificationsCard({
  notifyProductUpdates,
  notifyTips,
  onToggleProductUpdates,
  onToggleTips,
}: NotificationsCardProps) {
  return (
    <div className="rounded-2xl border border-[#E1E6EF] bg-white p-6 shadow-xs">
      {/* Header */}
      <div className="flex items-start gap-3 pb-5 border-b border-[#F1F5F9]">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#245FD4]">
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </div>
        <div>
          <h2
            className="text-[18px] font-semibold text-[#172238] leading-tight"
            style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
          >
            Notifications
          </h2>
          <p
            className="mt-0.5 text-[13px] text-[#6B7280]"
            style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
          >
            Choose the updates you&apos;d like in your inbox.
          </p>
        </div>
      </div>

      {/* Row 1: Product updates */}
      <div className="flex items-center justify-between py-4 border-b border-[#F1F5F9]">
        <div className="pr-4">
          <h4
            className="text-sm font-medium text-[#172238]"
            style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
          >
            Product updates
          </h4>
          <p
            className="mt-0.5 text-xs text-[#6B7280]"
            style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
          >
            New features, templates, and improvements.
          </p>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={notifyProductUpdates}
          onClick={onToggleProductUpdates}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#245FD4] focus:ring-offset-2 ${
            notifyProductUpdates ? "bg-[#245FD4]" : "bg-slate-200"
          }`}
        >
          <span
            aria-hidden="true"
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
              notifyProductUpdates ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* Row 2: Tips & inspiration */}
      <div className="flex items-center justify-between py-4 border-b border-[#F1F5F9]">
        <div className="pr-4">
          <h4
            className="text-sm font-medium text-[#172238]"
            style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
          >
            Tips &amp; inspiration
          </h4>
          <p
            className="mt-0.5 text-xs text-[#6B7280]"
            style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
          >
            Practical ideas for better email signatures.
          </p>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={notifyTips}
          onClick={onToggleTips}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#245FD4] focus:ring-offset-2 ${
            notifyTips ? "bg-[#245FD4]" : "bg-slate-200"
          }`}
        >
          <span
            aria-hidden="true"
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
              notifyTips ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* Row 3: Account & security alerts (Always on) */}
      <div className="flex items-center justify-between pt-4">
        <div className="pr-4">
          <h4
            className="text-sm font-medium text-[#172238]"
            style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
          >
            Account &amp; security alerts
          </h4>
          <p
            className="mt-0.5 text-xs text-[#6B7280]"
            style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
          >
            Essential messages are always enabled.
          </p>
        </div>

        {/* Always on badge */}
        <div className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          <svg className="h-3.5 w-3.5 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}>Always on</span>
        </div>
      </div>
    </div>
  );
}
