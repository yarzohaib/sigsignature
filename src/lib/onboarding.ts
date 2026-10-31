import { getStoredUser, setStoredUser } from "@/app/lib/auth";
import { markOnboardingSeenApi } from "@/app/lib/api";

/**
 * Client-side and backend-synchronized store for onboarding progress.
 * Account creation and signature count are derived from real data. "exported" and
 * "installed" are remembered here, and a per-user "seen" flag makes sure the
 * welcome popup only ever opens once.
 */

export type OnboardingFlag = "exported" | "installed";
export type OnboardingFlags = Record<OnboardingFlag, boolean>;

const FLAGS_KEY = "sig_onboarding";
const SEEN_PREFIX = "sig_onboarding_seen:";
const COMPLETED_PREFIX = "sig_onboarding_completed:";

export const ONBOARDING_EVENT = "sig_onboarding_update";
export const OPEN_ONBOARDING_EVENT = "sig_onboarding_open";

const EMPTY_FLAGS: OnboardingFlags = { exported: false, installed: false };

export function getOnboardingFlags(): OnboardingFlags {
  if (typeof window === "undefined") return EMPTY_FLAGS;
  try {
    const raw = localStorage.getItem(FLAGS_KEY);
    if (!raw) return EMPTY_FLAGS;
    const parsed = JSON.parse(raw) as Partial<OnboardingFlags>;
    return {
      exported: Boolean(parsed.exported),
      installed: Boolean(parsed.installed),
    };
  } catch {
    return EMPTY_FLAGS;
  }
}

/**
 * Call this from the places where the action really happens, for example:
 *   markOnboardingStep("exported") after "Copy HTML" or "Download image" succeeds.
 */
export function markOnboardingStep(flag: OnboardingFlag, value = true) {
  if (typeof window === "undefined") return;
  try {
    const next = { ...getOnboardingFlags(), [flag]: value };
    localStorage.setItem(FLAGS_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(ONBOARDING_EVENT));
  } catch {
    // Ignore storage errors
  }
}

/** True once the popup has been closed in any way (skip, X, finish, or a step button). */
export function hasSeenOnboarding(userId: string): boolean {
  if (typeof window === "undefined" || !userId) return true; // never auto open on the server
  try {
    if (localStorage.getItem(SEEN_PREFIX + userId) === "1") {
      return true;
    }

    // Backend-backed check: if user already has onboardingSeenAt set on their account
    const user = getStoredUser();
    if (user && user.id === userId && user.onboardingSeenAt) {
      localStorage.setItem(SEEN_PREFIX + userId, "1");
      return true;
    }

    return false;
  } catch {
    return true; // if storage is blocked, prefer not nagging on every page load
  }
}

export function markOnboardingSeen(userId: string) {
  if (typeof window === "undefined" || !userId) return;
  try {
    // 1. Immediately record in localStorage so it never opens again on this browser
    localStorage.setItem(SEEN_PREFIX + userId, "1");

    // 2. Update local user profile state
    const user = getStoredUser();
    if (user && user.id === userId) {
      const nowIso = new Date().toISOString();
      setStoredUser({
        ...user,
        onboardingSeenAt: nowIso,
      });
    }

    // 3. Persist to backend database (async, resilient)
    markOnboardingSeenApi().catch((err) => {
      console.warn("[Onboarding] Failed to sync seen flag with backend:", err);
    });
  } catch {
    // Ignore storage errors
  }
}

/** True once the user has finished all steps and acknowledged completion */
export function hasAcknowledgedOnboarding(userId: string): boolean {
  if (typeof window === "undefined" || !userId) return false;
  try {
    if (localStorage.getItem(COMPLETED_PREFIX + userId) === "1") return true;

    // Also hide if user has already created signatures or marked onboarding seen
    const lifetimeRaw = localStorage.getItem("sig_lifetime_signatures_count");
    if (lifetimeRaw && parseInt(lifetimeRaw, 10) > 0) return true;

    const countRaw = localStorage.getItem("sig_signatures_count");
    if (countRaw && parseInt(countRaw, 10) > 0) return true;

    const user = getStoredUser();
    if (user && user.id === userId && user.onboardingSeenAt) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
}

/** Mark that the user has completed all onboarding steps and acknowledged completion */
export function markOnboardingCompleted(userId: string) {
  if (typeof window === "undefined" || !userId) return;
  try {
    localStorage.setItem(COMPLETED_PREFIX + userId, "1");
    markOnboardingSeen(userId);
    window.dispatchEvent(new Event(ONBOARDING_EVENT));
  } catch {
    // Ignore storage errors
  }
}

/** Lets any button (for example a "Setup guide" link in the top bar) reopen the popup. */
export function openOnboarding() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(OPEN_ONBOARDING_EVENT));
}
