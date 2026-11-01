"use client";

import { useEffect, useState, useRef, useCallback, Suspense } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ToastItem } from "@/lib/toast";

function readFlashToast(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const msg = sessionStorage.getItem("sig_flash_toast");
    if (msg) {
      sessionStorage.removeItem("sig_flash_toast");
      return msg;
    }
  } catch {
    // Ignore sessionStorage access errors
  }
  return null;
}

function ToastCard({
  toast,
  onDismiss,
}: {
  toast: ToastItem;
  onDismiss: () => void;
}) {
  if (toast.type === "copied") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-auto flex items-center gap-3.5 rounded-2xl border border-slate-200/80 bg-white p-4 text-left shadow-[0_10px_30px_rgba(0,0,0,0.08)] animate-in slide-in-from-bottom-3 fade-in duration-200"
        style={{ width: "min(440px, calc(100vw - 2.5rem))" }}
      >
        {/* Green Checkmark Circle Badge */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EBF8EE] text-[#22C55E]">
          <svg
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="9" />
            <polyline points="9 12 11 14 15 10" />
          </svg>
        </div>

        {/* Text Content */}
        <div className="flex-1 min-w-0 pr-2">
          <h4
            className="text-[15px] font-bold text-[#1E293B] leading-snug"
            style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
          >
            {toast.title || "Signature copied!"}
          </h4>
          <p
            className="text-[12.5px] font-normal text-[#64748B] leading-snug mt-0.5"
            style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
          >
            {toast.subtitle || toast.message || "Paste it into your email client settings."}
          </p>
        </div>

        {/* Close "X" Button */}
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 -mr-1 -mt-3.5 p-1 text-slate-400 hover:text-slate-600 transition rounded-lg hover:bg-slate-50"
          aria-label="Close notification"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    );
  }

  if (toast.type === "info") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-auto flex items-center gap-3 rounded-2xl border border-blue-200 bg-white px-4 py-3 shadow-xl animate-in slide-in-from-bottom-3 fade-in duration-200 max-w-[min(440px,calc(100vw-2.5rem))]"
      >
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#245FD4]">
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            aria-hidden="true"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <span
          className="text-xs font-semibold text-[#1E293B] flex-1 min-w-0"
          style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
        >
          {toast.message}
        </span>
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 p-1 text-slate-400 hover:text-slate-600 transition rounded-lg hover:bg-slate-50"
          aria-label="Close notification"
        >
          <svg
            className="h-3.5 w-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    );
  }

  if (toast.type === "error") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-auto flex items-center gap-3 rounded-2xl border border-red-200 bg-white px-4 py-3 shadow-xl animate-in slide-in-from-bottom-3 fade-in duration-200 max-w-[min(440px,calc(100vw-2.5rem))]"
      >
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <span
          className="text-xs font-semibold text-[#1E293B] flex-1 min-w-0"
          style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
        >
          {toast.message}
        </span>
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 p-1 text-slate-400 hover:text-slate-600 transition rounded-lg hover:bg-slate-50"
          aria-label="Close notification"
        >
          <svg
            className="h-3.5 w-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    );
  }

  // Default: Dark toast (used for duplicate, delete, general feedback)
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-auto flex items-center gap-3 rounded-xl bg-[#1E293B] px-4 py-3 text-sm text-white shadow-xl animate-in slide-in-from-bottom-3 fade-in duration-200 max-w-[min(440px,calc(100vw-2.5rem))]"
    >
      <svg
        className="h-4 w-4 text-emerald-400 shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        aria-hidden="true"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
      <span className="flex-1 min-w-0 text-sm font-medium">{toast.message}</span>
      {toast.action && (
        <Link
          href={toast.action.href}
          className="ml-2 inline-flex items-center rounded-lg bg-gradient-to-r from-[#245FD4] to-[#022977] px-2.5 py-1 text-xs font-semibold text-white hover:opacity-95 transition shrink-0"
        >
          {toast.action.label}
        </Link>
      )}
      <button
        type="button"
        onClick={onDismiss}
        className="shrink-0 ml-1 p-0.5 text-slate-400 hover:text-white transition"
        aria-label="Dismiss notification"
      >
        <svg
          className="h-3.5 w-3.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}

function FlashToastContent() {
  const pathname = usePathname();
  const [toasts, setToasts] = useState<ToastItem[]>(() => {
    const initial = readFlashToast();
    if (!initial) return [];
    return [
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        type: "info",
        message: initial,
        duration: 4000,
        createdAt: Date.now(),
      },
    ];
  });

  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const removeToast = useCallback((id: string) => {
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((toastItem: ToastItem) => {
    let isDuplicate = false;
    setToasts((prev) => {
      // Prevent duplicate toasts with the identical message
      if (prev.some((t) => t.message === toastItem.message)) {
        isDuplicate = true;
        return prev;
      }
      // Keep up to 4 toasts at once to maintain clean UI
      const trimmed = prev.length >= 4 ? prev.slice(1) : prev;
      return [...trimmed, toastItem];
    });

    if (isDuplicate) return;

    const duration = toastItem.duration || 4000;
    const timer = setTimeout(() => {
      removeToast(toastItem.id);
    }, duration);

    timersRef.current.set(toastItem.id, timer);
  }, [removeToast]);

  // Check for session flash messages on pathname change
  useEffect(() => {
    const timer = setTimeout(() => {
      const msg = readFlashToast();
      if (msg) {
        addToast({
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          type: "info",
          message: msg,
          duration: 4000,
          createdAt: Date.now(),
        });
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [pathname, addToast]);

  // Listen to global toast events
  useEffect(() => {
    function handleGlobalToast(e: Event) {
      const customEvent = e as CustomEvent<ToastItem>;
      if (customEvent.detail) {
        addToast(customEvent.detail);
      }
    }

    function handleGlobalDismiss(e: Event) {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        removeToast(customEvent.detail);
      }
    }

    function handleSigToast(e: Event) {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        addToast({
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          type: "dark",
          message: customEvent.detail,
          duration: 4000,
          createdAt: Date.now(),
        });
      }
    }

    function handleFlashToastEvent(e: Event) {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        addToast({
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          type: "info",
          message: customEvent.detail,
          duration: 4000,
          createdAt: Date.now(),
        });
      }
    }

    window.addEventListener("sig_global_toast", handleGlobalToast);
    window.addEventListener("sig_global_toast_dismiss", handleGlobalDismiss);
    window.addEventListener("sig_toast", handleSigToast);
    window.addEventListener("sig_flash_toast", handleFlashToastEvent);

    return () => {
      window.removeEventListener("sig_global_toast", handleGlobalToast);
      window.removeEventListener("sig_global_toast_dismiss", handleGlobalDismiss);
      window.removeEventListener("sig_toast", handleSigToast);
      window.removeEventListener("sig_flash_toast", handleFlashToastEvent);
    };
  }, [addToast, removeToast]);

  // Cleanup timers on unmount
  useEffect(() => {
    const currentTimers = timersRef.current;
    return () => {
      currentTimers.forEach((t) => clearTimeout(t));
      currentTimers.clear();
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div
      role="region"
      aria-label="Notifications"
      className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-[100] flex flex-col-reverse items-end gap-3 pointer-events-none max-w-[calc(100vw-2.5rem)]"
    >
      {toasts.map((item) => (
        <ToastCard
          key={item.id}
          toast={item}
          onDismiss={() => removeToast(item.id)}
        />
      ))}
    </div>
  );
}

export default function FlashToast() {
  return (
    <Suspense fallback={null}>
      <FlashToastContent />
    </Suspense>
  );
}
