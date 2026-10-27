"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { getSignatureRepository } from "@/lib/signatures/repository";
import {
  ONBOARDING_EVENT,
  OPEN_ONBOARDING_EVENT,
  getOnboardingFlags,
  hasSeenOnboarding,
  markOnboardingSeen,
  markOnboardingStep,
  type OnboardingFlags,
} from "@/lib/onboarding";

type Step = {
  id: "account" | "create" | "export" | "install" | "ready";
  title: string;
  done: string;
  todo: string;
  cta?: { label: string; href: string };
  manualLabel?: string;
  onManual?: () => void;
  complete: boolean;
  icon: React.ReactNode;
};

const headingFont = { fontFamily: "var(--font-montserrat), Montserrat, sans-serif" };
const bodyFont = { fontFamily: "var(--font-commissioner), Commissioner, sans-serif" };

const svg = {
  className: "h-[18px] w-[18px]",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const Icons = {
  account: (
    <svg {...svg}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  create: (
    <svg {...svg}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  ),
  export: (
    <svg {...svg}>
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  install: (
    <svg {...svg}>
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  ),
  ready: (
    <svg {...svg}>
      <path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4L12 2z" />
    </svg>
  ),
  check: (
    <svg {...svg} strokeWidth={3}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  close: (
    <svg {...svg} className="h-4 w-4">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  ),
};

type Props = {
  /** Id (or email) of the logged in user. The "seen" flag is stored per user. */
  userId: string;
};

export default function GettingStartedModal({ userId }: Props) {
  const [open, setOpen] = useState(false);
  const [signatureCount, setSignatureCount] = useState(0);
  const [flags, setFlags] = useState<OnboardingFlags>({ exported: false, installed: false });
  const dialogRef = useRef<HTMLDivElement>(null);

  const loadFlags = useCallback(() => setFlags(getOnboardingFlags()), []);

  const loadCount = useCallback(async () => {
    try {
      const list = await getSignatureRepository().list();
      setSignatureCount(list.length);
      return list.length;
    } catch {
      return null;
    }
  }, []);

  const close = useCallback(() => {
    markOnboardingSeen(userId); // whatever way it closes, it never auto opens again
    setOpen(false);
  }, [userId]);

  // First visit check + live updates
  useEffect(() => {
    let alive = true;
    loadFlags();

    (async () => {
      const count = await loadCount();
      if (!alive || count === null) return;
      const f = getOnboardingFlags();
      const finished = count > 0 && f.exported && f.installed;
      // Auto open only for a user who has not seen it and has not already finished setup
      if (!hasSeenOnboarding(userId) && !finished) setOpen(true);
    })();

    const onFlags = () => loadFlags();
    const onCount = () => loadCount();
    const onReopen = () => {
      loadFlags();
      loadCount();
      setOpen(true);
    };
    window.addEventListener(ONBOARDING_EVENT, onFlags);
    window.addEventListener("sig_count_update", onCount);
    window.addEventListener(OPEN_ONBOARDING_EVENT, onReopen);
    return () => {
      alive = false;
      window.removeEventListener(ONBOARDING_EVENT, onFlags);
      window.removeEventListener("sig_count_update", onCount);
      window.removeEventListener(OPEN_ONBOARDING_EVENT, onReopen);
    };
  }, [userId, loadFlags, loadCount]);

  // Escape to close, lock page scroll, move focus into the dialog
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
      previous?.focus?.();
    };
  }, [open, close]);

  const hasSignature = signatureCount > 0;
  const exported = hasSignature && flags.exported;
  const installed = exported && flags.installed;

  const steps: Step[] = useMemo(
    () => [
      {
        id: "account",
        title: "Account created",
        done: "Your account is set up and verified.",
        todo: "Create your account.",
        complete: true,
        icon: Icons.account,
      },
      {
        id: "create",
        title: "Create a signature",
        done: `${signatureCount} saved ${signatureCount === 1 ? "signature" : "signatures"} in your library.`,
        todo: "Start from a template or design your own from scratch.",
        cta: { label: "Create signature", href: "/templates" },
        complete: hasSignature,
        icon: Icons.create,
      },
      {
        id: "export",
        title: "Copy & export signature",
        done: "You copied or exported your signature.",
        todo: "Copy the HTML or download an image of your signature.",
        cta: { label: "Copy & export", href: "/signatures" },
        complete: exported,
        icon: Icons.export,
      },
      {
        id: "install",
        title: "Paste in your inbox",
        done: "Your signature is live in your email client.",
        todo: "Paste it into Gmail, Outlook or Apple Mail.",
        cta: { label: "See paste guide", href: "/help" },
        manualLabel: "I've pasted it",
        onManual: () => markOnboardingStep("installed"),
        complete: installed,
        icon: Icons.install,
      },
      {
        id: "ready",
        title: "You're ready",
        done: "Every email you send now looks professional.",
        todo: "Finish the steps above to go live.",
        complete: installed,
        icon: Icons.ready,
      },
    ],
    [signatureCount, hasSignature, exported, installed]
  );

  const completed = steps.filter((s) => s.complete).length;
  const total = steps.length;
  const percent = Math.round((completed / total) * 100);
  const allDone = completed === total;
  const currentIndex = steps.findIndex((s) => !s.complete);
  const currentStep = currentIndex === -1 ? null : steps[currentIndex];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="onboarding-overlay"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0B1220]/55 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="onboarding-title"
            tabIndex={-1}
            className="max-h-[92vh] w-full max-w-[1040px] overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl outline-none sm:p-8"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2
                  id="onboarding-title"
                  className="text-[22px] font-bold leading-[28px] text-[#1E293B]"
                  style={headingFont}
                >
                  {allDone ? "You're all set!" : "Welcome to Sig Signature"}
                </h2>
                <p className="mt-1 text-[14px] leading-[20px] text-[#64748B]" style={bodyFont}>
                  {allDone
                    ? "Your signature is live. Create more or invite your team whenever you like."
                    : `Let's get your first signature live in a few minutes. Next up: ${currentStep?.title.toLowerCase()}.`}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <span
                  className="hidden rounded-full bg-[#EFF6FF] px-3 py-1 text-[12px] font-semibold text-[#245FD4] sm:inline"
                  style={bodyFont}
                  aria-live="polite"
                >
                  {completed} of {total} complete
                </span>
                {!allDone && (
                  <button
                    type="button"
                    onClick={close}
                    className="rounded-lg px-3 py-1.5 text-[13px] font-semibold text-[#64748B] transition hover:bg-slate-100 hover:text-[#1E293B]"
                    style={bodyFont}
                  >
                    Skip
                  </button>
                )}
                <button
                  type="button"
                  onClick={close}
                  aria-label="Close"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-[#64748B] transition hover:bg-slate-100 hover:text-[#1E293B]"
                >
                  {Icons.close}
                </button>
              </div>
            </div>

            {/* Progress bar */}
            <div
              className="mt-5 h-2 w-full overflow-hidden rounded-full bg-[#E2E8F0]"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={percent}
              aria-label="Onboarding progress"
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#245FD4] to-[#022977] transition-[width] duration-700 ease-out"
                style={{ width: `${Math.max(percent, 4)}%` }}
              />
            </div>

            {/* Steps */}
            <ol className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-5 md:gap-4">
              {steps.map((step, idx) => {
                const isCurrent = idx === currentIndex;
                const isDone = step.complete;
                const isLocked = !isDone && !isCurrent;

                return (
                  <li
                    key={step.id}
                    aria-current={isCurrent ? "step" : undefined}
                    className={`flex flex-col rounded-xl border p-4 transition-all duration-300 ${
                      isCurrent
                        ? "border-[#245FD4] bg-[#F5F9FF] shadow-[0_8px_24px_-12px_rgba(36,95,212,0.35)]"
                        : isDone
                        ? "border-[#DBE6FB] bg-white"
                        : "border-[#E2E8F0] bg-[#FAFBFC]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`flex h-9 w-9 items-center justify-center rounded-full ${
                          isDone
                            ? "bg-[#163BA4] text-white"
                            : isCurrent
                            ? "bg-white text-[#245FD4] ring-2 ring-[#245FD4]"
                            : "bg-[#E2E8F0] text-[#94A3B8]"
                        }`}
                      >
                        {isDone ? Icons.check : step.icon}
                      </span>
                      <span
                        className={`text-[11px] font-semibold uppercase tracking-wide ${
                          isDone ? "text-[#163BA4]" : isCurrent ? "text-[#245FD4]" : "text-[#94A3B8]"
                        }`}
                        style={bodyFont}
                      >
                        {isDone ? "Done" : isCurrent ? "Up next" : `Step ${idx + 1}`}
                      </span>
                    </div>

                    <h3
                      className={`mt-3 text-[15px] font-bold leading-[20px] ${
                        isLocked ? "text-[#64748B]" : "text-[#1E293B]"
                      }`}
                      style={headingFont}
                    >
                      {step.title}
                    </h3>
                    <p className="mt-1 flex-1 text-[13px] leading-[18px] text-[#64748B]" style={bodyFont}>
                      {isDone ? step.done : step.todo}
                    </p>

                    {isCurrent && step.cta && (
                      <div className="mt-3 flex flex-col gap-2">
                        <Link
                          href={step.cta.href}
                          onClick={close}
                          className="inline-flex h-9 items-center justify-center rounded-full bg-gradient-to-r from-[#245FD4] to-[#022977] px-4 text-[13px] font-semibold text-white transition hover:opacity-95"
                          style={bodyFont}
                        >
                          {step.cta.label} →
                        </Link>
                        {step.onManual && (
                          <button
                            type="button"
                            onClick={step.onManual}
                            className="text-[12px] font-semibold text-[#245FD4] underline-offset-2 hover:underline"
                            style={bodyFont}
                          >
                            {step.manualLabel}
                          </button>
                        )}
                      </div>
                    )}
                  </li>
                );
              })}
            </ol>

            {allDone && (
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={close}
                  className="inline-flex h-10 items-center rounded-full bg-gradient-to-r from-[#245FD4] to-[#022977] px-6 text-[14px] font-semibold text-white transition hover:opacity-95"
                  style={bodyFont}
                >
                  Go to dashboard
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
