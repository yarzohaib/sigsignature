import { useOptionalUser } from "@/contexts/UserContext";
import { getStoredUser } from "@/app/lib/auth";

/**
 * Global Premium Feature Flag & Hook
 */
export const PREMIUM_ENABLED = false;

/**
 * Hook to determine if the currently authenticated user has an active Premium plan,
 * including 1-Month Free Pro referral trials.
 */
export function useIsPremium(): boolean {
  const optionalUser = useOptionalUser();
  const user = optionalUser?.user || getStoredUser();

  if (!user) return false;

  // Check if user has an active pro trial from referral
  if (user.isProTrialActive) return true;

  if (user.proTrialUntil) {
    const expiresAt = new Date(user.proTrialUntil).getTime();
    if (expiresAt > Date.now()) {
      return true;
    }
  }

  return false;
}
