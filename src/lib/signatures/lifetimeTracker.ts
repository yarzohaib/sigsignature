import { getStoredUser } from "@/app/lib/auth";

const LIFETIME_KEY_PREFIX = "sig_lifetime_created_count_";
const GLOBAL_FALLBACK_KEY = "sig_lifetime_signatures_count";
const CACHED_COUNT_KEY = "sig_cached_signatures_count";

/**
 * Retrieves the lifetime signature creation count for a specific user.
 * Tracks total signatures created by this user and never decreases when signatures are deleted.
 * Note: Scoped strictly per-user to prevent cross-account limit pollution on shared browsers.
 */
export function getLifetimeSignatureCount(userId?: string): number {
  if (typeof window === "undefined") return 0;

  const currentStored = getStoredUser();
  const uid = userId || currentStored?.id;
  if (!uid) return 0;

  try {
    const rawUser = localStorage.getItem(`${LIFETIME_KEY_PREFIX}${uid}`);
    if (rawUser) {
      const userVal = Number.parseInt(rawUser, 10);
      return Number.isFinite(userVal) && userVal >= 0 ? userVal : 0;
    }
    return 0;
  } catch {
    return 0;
  }
}

/**
 * Synchronizes the lifetime count with active signatures list length and/or backend metadata.
 * Ensures the lifetime count never drops below the current active count or previous lifetime count.
 */
export function syncLifetimeSignatureCount(
  activeSignaturesCount: number,
  userId?: string,
  backendLifetime?: number
): number {
  if (typeof window === "undefined") return activeSignaturesCount;

  const currentStored = getStoredUser();
  const uid = userId || currentStored?.id;
  if (!uid) return activeSignaturesCount;

  const currentLifetime = getLifetimeSignatureCount(uid);
  const next = Math.max(currentLifetime, activeSignaturesCount, backendLifetime || 0);

  try {
    localStorage.setItem(`${LIFETIME_KEY_PREFIX}${uid}`, String(next));
  } catch {
    // Ignore storage quota or disabled storage errors
  }

  return next;
}

/**
 * Records that a new signature was created, incrementing the user-scoped lifetime count.
 */
export function recordSignatureCreated(userId?: string): number {
  if (typeof window === "undefined") return 1;

  const currentStored = getStoredUser();
  const uid = userId || currentStored?.id;
  if (!uid) return 1;

  const current = getLifetimeSignatureCount(uid);
  const next = current + 1;

  try {
    localStorage.setItem(`${LIFETIME_KEY_PREFIX}${uid}`, String(next));
  } catch {
    // Ignore storage quota or disabled storage errors
  }

  return next;
}

/**
 * Checks if the user has reached the strict 3-signature lifetime limit.
 * Pro / Premium users (including active Pro trial) are exempt.
 */
export function isSignatureLimitReached(activeCount: number = 0, userId?: string): boolean {
  if (typeof window !== "undefined") {
    try {
      const rawUser = localStorage.getItem("sig_user");
      if (rawUser) {
        const u = JSON.parse(rawUser);
        if (
          u.isProTrialActive ||
          (u.proTrialUntil && new Date(u.proTrialUntil).getTime() > Date.now())
        ) {
          return false;
        }
      }
    } catch {
      // fallback to standard check
    }
  }

  const lifetime = getLifetimeSignatureCount(userId);
  return Math.max(activeCount, lifetime) >= 3;
}

const TEAM_LIFETIME_PREFIX = "sig_team_lifetime_members_count_";
const TEAM_GLOBAL_FALLBACK_KEY = "sig_team_lifetime_members_count";

/**
 * Retrieves the lifetime team member creation count for a team/user.
 * This count tracks total members created and NEVER decreases when members are deleted.
 * Scoped strictly to teamId / userId to prevent cross-account pollution.
 */
export function getTeamLifetimeMemberCount(teamId?: string, userId?: string): number {
  if (typeof window === "undefined") return 0;

  const tid = teamId && teamId !== "default" ? teamId : null;
  const currentStored = getStoredUser();
  const uid = userId || currentStored?.id;

  try {
    const rawTeam = tid ? localStorage.getItem(`${TEAM_LIFETIME_PREFIX}${tid}`) : null;
    const rawUser = uid ? localStorage.getItem(`${TEAM_LIFETIME_PREFIX}${uid}`) : null;

    const teamVal = rawTeam ? Number.parseInt(rawTeam, 10) : 0;
    const userVal = rawUser ? Number.parseInt(rawUser, 10) : 0;

    return Math.max(
      Number.isFinite(teamVal) && teamVal >= 0 ? teamVal : 0,
      Number.isFinite(userVal) && userVal >= 0 ? userVal : 0
    );
  } catch {
    return 0;
  }
}

/**
 * Synchronizes the lifetime member count with active team members length and/or backend metadata.
 * Ensures the lifetime count never drops below the current active count or previous lifetime count.
 */
export function syncTeamLifetimeMemberCount(
  activeMembersCount: number,
  teamId?: string,
  userId?: string,
  backendLifetime?: number
): number {
  if (typeof window === "undefined") return activeMembersCount;

  const tid = teamId && teamId !== "default" ? teamId : null;
  const currentStored = getStoredUser();
  const uid = userId || currentStored?.id;
  const currentLifetime = getTeamLifetimeMemberCount(tid || undefined, uid || undefined);
  const next = Math.max(currentLifetime, activeMembersCount, backendLifetime || 0);

  try {
    if (tid) localStorage.setItem(`${TEAM_LIFETIME_PREFIX}${tid}`, String(next));
    if (uid) localStorage.setItem(`${TEAM_LIFETIME_PREFIX}${uid}`, String(next));
  } catch {
    // Ignore storage quota or disabled storage errors
  }

  return next;
}

/**
 * Records that a new team member was created, incrementing the lifetime count.
 */
export function recordTeamMemberCreated(teamId?: string, userId?: string): number {
  if (typeof window === "undefined") return 1;

  const tid = teamId && teamId !== "default" ? teamId : null;
  const currentStored = getStoredUser();
  const uid = userId || currentStored?.id;
  const current = getTeamLifetimeMemberCount(tid || undefined, uid || undefined);
  const next = current + 1;

  try {
    if (tid) localStorage.setItem(`${TEAM_LIFETIME_PREFIX}${tid}`, String(next));
    if (uid) localStorage.setItem(`${TEAM_LIFETIME_PREFIX}${uid}`, String(next));
  } catch {
    // Ignore storage quota or disabled storage errors
  }

  return next;
}

/**
 * Checks if the team has reached the strict 3-member lifetime limit.
 */
export function isTeamMemberLimitReached(
  activeCount: number = 0,
  teamId?: string,
  userId?: string,
  memberLimit: number = 3
): boolean {
  const lifetime = getTeamLifetimeMemberCount(teamId, userId);
  return Math.max(activeCount, lifetime) >= memberLimit;
}
