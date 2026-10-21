import { AccountSettings, AuthTokens, UserProfile } from "./api";

export const AUTH_TOKEN_KEY = "sig_access_token";
export const REFRESH_TOKEN_KEY = "sig_refresh_token";
export const AUTH_USER_KEY = "sig_user";
export const AUTH_COOKIE_NAME = "sig_token";

export const AUTH_SETTINGS_KEY = "sig_user_settings";
export const AUTH_AVATAR_PREVIEW_KEY = "sig_user_avatar_preview";

/**
 * Stores tokens and user profile into localStorage and cookies.
 */
export function setAuthSession(tokens: AuthTokens, user: UserProfile) {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(AUTH_TOKEN_KEY, tokens.accessToken);
    if (tokens.refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
    }
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));

    // Restore or update user avatar preview
    const resolvedAvatar =
      user.avatarUrl ||
      (user.id ? localStorage.getItem(`sig_avatar_${user.id}`) : null) ||
      null;

    if (resolvedAvatar) {
      localStorage.setItem(AUTH_AVATAR_PREVIEW_KEY, resolvedAvatar);
      if (user.id) {
        localStorage.setItem(`sig_avatar_${user.id}`, resolvedAvatar);
      }
      window.dispatchEvent(new CustomEvent("sig_avatar_update", { detail: resolvedAvatar }));
    } else {
      localStorage.removeItem(AUTH_AVATAR_PREVIEW_KEY);
      window.dispatchEvent(new CustomEvent("sig_avatar_update", { detail: null }));
    }

    // Also persist in cookie for Next.js middleware and SSR
    const maxAge = 7 * 24 * 60 * 60; // 7 days
    document.cookie = `${AUTH_COOKIE_NAME}=${encodeURIComponent(
      tokens.accessToken
    )}; path=/; max-age=${maxAge}; SameSite=Lax`;
  } catch (err) {
    console.error("Failed to store auth session:", err);
  }
}

/**
 * Clears stored authentication session and cookies.
 */
export function clearAuthSession() {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    localStorage.removeItem(AUTH_SETTINGS_KEY);
    localStorage.removeItem(AUTH_AVATAR_PREVIEW_KEY);
    window.dispatchEvent(new CustomEvent("sig_avatar_update", { detail: null }));

    // Clear cookie
    document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
  } catch (err) {
    console.error("Failed to clear auth session:", err);
  }
}

/**
 * Retrieves stored user avatar preview URL from localStorage.
 */
export function getStoredAvatarUrl(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const preview = localStorage.getItem(AUTH_AVATAR_PREVIEW_KEY);
    if (preview) return preview;
    const user = getStoredUser();
    if (user?.avatarUrl) return user.avatarUrl;
    if (user?.id) {
      const userCached = localStorage.getItem(`sig_avatar_${user.id}`);
      if (userCached) return userCached;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Stores user avatar URL into localStorage and notifies listeners.
 */
export function setStoredAvatarUrl(url: string | null): void {
  if (typeof window === "undefined") return;
  try {
    const user = getStoredUser();
    if (url) {
      localStorage.setItem(AUTH_AVATAR_PREVIEW_KEY, url);
      if (user?.id) {
        localStorage.setItem(`sig_avatar_${user.id}`, url);
      }
    } else {
      localStorage.removeItem(AUTH_AVATAR_PREVIEW_KEY);
      if (user?.id) {
        localStorage.removeItem(`sig_avatar_${user.id}`);
      }
    }
    window.dispatchEvent(new CustomEvent("sig_avatar_update", { detail: url }));
  } catch (err) {
    console.error("Failed to store avatar url:", err);
  }
}

/**
 * Retrieves stored access token from localStorage or cookie.
 */
export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;

  try {
    const local = localStorage.getItem(AUTH_TOKEN_KEY);
    if (local) return local;

    // Fallback: parse from document.cookie
    const match = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${AUTH_COOKIE_NAME}=`));
    if (match) {
      return decodeURIComponent(match.split("=")[1]);
    }
  } catch {
    return null;
  }

  return null;
}

/**
 * Retrieves stored refresh token from localStorage.
 */
export function getStoredRefreshToken(): string | null {
  if (typeof window === "undefined") return null;

  try {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  } catch {
    return null;
  }
}

/**
 * Retrieves parsed user profile from localStorage.
 */
export function getStoredUser(): UserProfile | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as UserProfile;
  } catch {
    return null;
  }
}

/**
 * Updates stored user profile in localStorage and notifies listeners.
 */
export function setStoredUser(user: UserProfile): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));

    if (user.avatarUrl !== undefined) {
      if (user.avatarUrl) {
        localStorage.setItem(AUTH_AVATAR_PREVIEW_KEY, user.avatarUrl);
        if (user.id) {
          localStorage.setItem(`sig_avatar_${user.id}`, user.avatarUrl);
        }
        window.dispatchEvent(new CustomEvent("sig_avatar_update", { detail: user.avatarUrl }));
      } else {
        localStorage.removeItem(AUTH_AVATAR_PREVIEW_KEY);
        if (user.id) {
          localStorage.removeItem(`sig_avatar_${user.id}`);
        }
        window.dispatchEvent(new CustomEvent("sig_avatar_update", { detail: null }));
      }
    }

    window.dispatchEvent(new CustomEvent("sig_user_update", { detail: user }));
  } catch (err) {
    console.error("Failed to update stored user:", err);
  }
}

/**
 * Retrieves cached user settings from localStorage.
 */
export function getStoredSettings(): AccountSettings | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(AUTH_SETTINGS_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AccountSettings;
  } catch {
    return null;
  }
}

/**
 * Stores user settings in localStorage and notifies listeners.
 */
export function setStoredSettings(settings: AccountSettings): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(AUTH_SETTINGS_KEY, JSON.stringify(settings));
    window.dispatchEvent(new CustomEvent("sig_settings_update", { detail: settings }));
  } catch (err) {
    console.error("Failed to store settings in localStorage:", err);
  }
}

/**
 * Returns whether an authenticated user session is active.
 */
export function isAuthenticated(): boolean {
  return Boolean(getStoredToken());
}
