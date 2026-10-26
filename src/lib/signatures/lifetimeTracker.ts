import { getStoredUser } from "@/app/lib/auth";

const LIFETIME_KEY_PREFIX = "sig_lifetime_created_count_";
const GLOBAL_FALLBACK_KEY = "sig_lifetime_signatures_count";
const CACHED_COUNT_KEY = "sig_cached_signatures_count";

/**
 * Retrieves the lifetime signature creation count for a user.
 * This count tracks total signatures created and NEVER decreases when signatures are deleted.
 */
export function getLifetimeSignatureCount(userId?: string): number {
  if (typeof window === "undefined") return 0;

  const uid = userId || getStoredUser()?.id || "guest";
  try {
    const rawUser = localStorage.getItem(`${LIFETIME_KEY_PREFIX}${uid}`);
    const rawGlobal = localStorage.getItem(GLOBAL_FALLBACK_KEY);
    const rawCached = localStorage.getItem(CACHED_COUNT_KEY);

    const userVal = rawUser ? Number.parseInt(rawUser, 10) : 0;
    const globalVal = rawGlobal ? Number.parseInt(rawGlobal, 10) : 0;
    const cachedVal = rawCached ? Number.parseInt(rawCached, 10) : 0;

    return Math.max(
      Number.isFinite(userVal) ? userVal : 0,
      Number.isFinite(globalVal) ? globalVal : 0,
      Number.isFinite(cachedVal) ? cachedVal : 0
    );
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

  const uid = userId || getStoredUser()?.id || "guest";
  const currentLifetime = getLifetimeSignatureCount(uid);
  const next = Math.max(currentLifetime, activeSignaturesCount, backendLifetime || 0);

  try {
    localStorage.setItem(`${LIFETIME_KEY_PREFIX}${uid}`, String(next));
    localStorage.setItem(GLOBAL_FALLBACK_KEY, String(next));
  } catch {
    // Ignore storage quota or disabled storage errors
  }

  return next;
}

/**
 * Records that a new signature was created, incrementing the lifetime count.
 */
export function recordSignatureCreated(userId?: string): number {
  if (typeof window === "undefined") return 1;

  const uid = userId || getStoredUser()?.id || "guest";
  const current = getLifetimeSignatureCount(uid);
  const next = current + 1;

  try {
    localStorage.setItem(`${LIFETIME_KEY_PREFIX}${uid}`, String(next));
    localStorage.setItem(GLOBAL_FALLBACK_KEY, String(next));
  } catch {
    // Ignore storage quota or disabled storage errors
  }

  return next;
}

/**
 * Checks if the user has reached the strict 3-signature lifetime limit.
 */
export function isSignatureLimitReached(activeCount: number = 0, userId?: string): boolean {
  const lifetime = getLifetimeSignatureCount(userId);
  return Math.max(activeCount, lifetime) >= 3;
}

const TEAM_LIFETIME_PREFIX = "sig_team_lifetime_members_count_";
const TEAM_GLOBAL_FALLBACK_KEY = "sig_team_lifetime_members_count";

/**
 * Retrieves the lifetime team member creation count for a team/user.
 * This count tracks total members created and NEVER decreases when members are deleted.
 */
export function getTeamLifetimeMemberCount(teamId?: string, userId?: string): number {
  if (typeof window === "undefined") return 0;

  const tid = teamId || "default";
  const uid = userId || getStoredUser()?.id || "guest";
  try {
    const rawTeam = localStorage.getItem(`${TEAM_LIFETIME_PREFIX}${tid}`);
    const rawUser = localStorage.getItem(`${TEAM_LIFETIME_PREFIX}${uid}`);
    const rawGlobal = localStorage.getItem(TEAM_GLOBAL_FALLBACK_KEY);

    const teamVal = rawTeam ? Number.parseInt(rawTeam, 10) : 0;
    const userVal = rawUser ? Number.parseInt(rawUser, 10) : 0;
    const globalVal = rawGlobal ? Number.parseInt(rawGlobal, 10) : 0;

    return Math.max(
      Number.isFinite(teamVal) ? teamVal : 0,
      Number.isFinite(userVal) ? userVal : 0,
      Number.isFinite(globalVal) ? globalVal : 0
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

  const tid = teamId || "default";
  const uid = userId || getStoredUser()?.id || "guest";
  const currentLifetime = getTeamLifetimeMemberCount(tid, uid);
  const next = Math.max(currentLifetime, activeMembersCount, backendLifetime || 0);

  try {
    localStorage.setItem(`${TEAM_LIFETIME_PREFIX}${tid}`, String(next));
    localStorage.setItem(`${TEAM_LIFETIME_PREFIX}${uid}`, String(next));
    localStorage.setItem(TEAM_GLOBAL_FALLBACK_KEY, String(next));
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

  const tid = teamId || "default";
  const uid = userId || getStoredUser()?.id || "guest";
  const current = getTeamLifetimeMemberCount(tid, uid);
  const next = current + 1;

  try {
    localStorage.setItem(`${TEAM_LIFETIME_PREFIX}${tid}`, String(next));
    localStorage.setItem(`${TEAM_LIFETIME_PREFIX}${uid}`, String(next));
    localStorage.setItem(TEAM_GLOBAL_FALLBACK_KEY, String(next));
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
