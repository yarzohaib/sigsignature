"use client";

import { useEffect, useState } from "react";

export default function FlashToast() {
  const [toastMessage, setToastMessage] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      const msg = sessionStorage.getItem("sig_flash_toast");
      if (msg) {
        sessionStorage.removeItem("sig_flash_toast");
        return msg;
      }
    }
    return null;
  });

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  if (!toastMessage) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-blue-200 bg-white px-4 py-3 shadow-xl animate-in slide-in-from-bottom-3 duration-200"
    >
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#245FD4]">
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <span
        className="text-xs font-semibold text-[#1E293B]"
        style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
      >
        {toastMessage}
      </span>
    </div>
  );
}
