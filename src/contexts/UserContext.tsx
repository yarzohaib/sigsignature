"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { UserProfile, getCurrentUser, logoutUser } from "@/app/lib/api";
import {
  getStoredUser,
  setStoredUser,
  getStoredAvatarUrl,
  clearAuthSession,
  getStoredRefreshToken,
} from "@/app/lib/auth";

interface UserContextValue {
  user: UserProfile | null;
  isLoadingUser: boolean;
  avatarUrl: string | null;
  displayName: string;
  displayEmail: string;
  refreshUser: () => Promise<UserProfile | null>;
  setUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  logout: () => Promise<void>;
  isLoggingOut: boolean;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

let memoryCachedUser: UserProfile | null = null;

function getInitialUser(): UserProfile | null {
  if (memoryCachedUser) return memoryCachedUser;
  if (typeof window === "undefined") return null;

  try {
    const sessionItem = sessionStorage.getItem("sig_cached_user");
    if (sessionItem) {
      const parsed = JSON.parse(sessionItem) as UserProfile;
      memoryCachedUser = parsed;
      return parsed;
    }
  } catch {
    // Ignore JSON parse errors
  }

  const stored = getStoredUser();
  if (stored) {
    memoryCachedUser = stored;
    try {
      sessionStorage.setItem("sig_cached_user", JSON.stringify(stored));
    } catch {
      // Ignore sessionStorage quota
    }
    return stored;
  }

  return null;
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<UserProfile | null>(getInitialUser);
  const [isLoadingUser, setIsLoadingUser] = useState(!user);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return getStoredAvatarUrl();
  });

  // Sync avatar events
  useEffect(() => {
    function handleAvatarUpdate(e: Event) {
      const customEvent = e as CustomEvent<string | null>;
      setAvatarUrl(customEvent.detail ?? getStoredAvatarUrl());
    }
    window.addEventListener("sig_avatar_update", handleAvatarUpdate);
    return () => window.removeEventListener("sig_avatar_update", handleAvatarUpdate);
  }, []);

  const refreshUser = useCallback(async (): Promise<UserProfile | null> => {
    try {
      const freshUser = await getCurrentUser();
      memoryCachedUser = freshUser;
      setUser(freshUser);
      setStoredUser(freshUser);
      try {
        sessionStorage.setItem("sig_cached_user", JSON.stringify(freshUser));
      } catch {
        // Ignore
      }
      if (freshUser.avatarUrl) {
        setAvatarUrl(freshUser.avatarUrl);
      }
      return freshUser;
    } catch (err) {
      console.warn("Session expired or user verification failed:", err);
      // If 401 or session invalid, redirect to login
      clearAuthSession();
      memoryCachedUser = null;
      try {
        sessionStorage.removeItem("sig_cached_user");
      } catch {
        // Ignore
      }
      router.replace(`/login?redirect=${encodeURIComponent(pathname || "/dashboard")}`);
      return null;
    } finally {
      setIsLoadingUser(false);
    }
  }, [router, pathname]);

  // Initial user fetch on mount
  useEffect(() => {
    let isCancelled = false;

    async function init() {
      try {
        const freshUser = await getCurrentUser();
        if (!isCancelled) {
          memoryCachedUser = freshUser;
          setUser(freshUser);
          setStoredUser(freshUser);
          try {
            sessionStorage.setItem("sig_cached_user", JSON.stringify(freshUser));
          } catch {
            // Ignore
          }
          if (freshUser.avatarUrl) {
            setAvatarUrl(freshUser.avatarUrl);
          }
        }
      } catch (err) {
        if (!isCancelled) {
          console.warn("Failed to verify user session:", err);
          clearAuthSession();
          memoryCachedUser = null;
          try {
            sessionStorage.removeItem("sig_cached_user");
          } catch {
            // Ignore
          }
          router.replace(`/login?redirect=${encodeURIComponent(pathname || "/dashboard")}`);
        }
      } finally {
        if (!isCancelled) {
          setIsLoadingUser(false);
        }
      }
    }

    init();

    return () => {
      isCancelled = true;
    };
  }, [router, pathname]);

  const logout = useCallback(async () => {
    setIsLoggingOut(true);
    try {
      const refreshToken = getStoredRefreshToken();
      await logoutUser(refreshToken || undefined);
    } catch (err) {
      console.warn("Logout error:", err);
    } finally {
      memoryCachedUser = null;
      try {
        sessionStorage.removeItem("sig_cached_user");
      } catch {
        // Ignore
      }
      clearAuthSession();
      setIsLoggingOut(false);
      router.replace("/login");
      router.refresh();
    }
  }, [router]);

  const displayName = useMemo(() => {
    if (user?.firstName) {
      return [user.firstName, user.lastName].filter(Boolean).join(" ");
    }
    if (user?.email) {
      return user.email.split("@")[0];
    }
    return "Member";
  }, [user]);

  const displayEmail = user?.email || "";

  const contextValue = useMemo<UserContextValue>(
    () => ({
      user,
      isLoadingUser,
      avatarUrl: avatarUrl || user?.avatarUrl || null,
      displayName,
      displayEmail,
      refreshUser,
      setUser,
      logout,
      isLoggingOut,
    }),
    [
      user,
      isLoadingUser,
      avatarUrl,
      displayName,
      displayEmail,
      refreshUser,
      logout,
      isLoggingOut,
    ]
  );

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
}

export function useUser(): UserContextValue {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

export function useOptionalUser(): UserContextValue | null {
  return useContext(UserContext) ?? null;
}
